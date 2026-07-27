<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Properties Management</h1>
          <p class="text-medium-gray mt-2">
            Managing properties in <span class="font-semibold">{{ adminProfile.city }}, {{ adminProfile.state }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="exportCSV"
            class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50 flex items-center gap-2 text-sm">
            📥 CSV
          </button>
          <button 
            @click="exportPDF"
            class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50 flex items-center gap-2 text-sm">
            📄 PDF
          </button>
          <button 
            @click="refreshAll"
            class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] flex items-center gap-2">
            Refresh All
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Properties" :value="stats.total" :icon="Building2" color="royal-blue" />
        <StatsCard title="Pending Review" :value="stats.pending" :icon="Clock" color="periwinkle" />
        <StatsCard title="Approved Listings" :value="stats.approved" :icon="CheckCircle" color="bright-green" />
        <StatsCard title="Rejected Listings" :value="stats.rejected" :icon="XCircle" color="red" />
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-medium-gray mb-2">Search Properties</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, address, or area..."
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-medium-gray mb-2">Status</label>
            <select v-model="statusFilter" class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)]">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-medium-gray mb-2">Property Type</label>
            <select v-model="typeFilter" class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)]">
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Duplex">Duplex</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Properties Table -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <PropertiesTable 
          :properties="filteredProperties"
          @view="viewProperty"
          @approve="approveProperty"
          @reject="rejectProperty"
        />
      </div>
    </div>

    <!-- Property Details Drawer -->
    <PropertyDetailsDrawer 
      v-if="selectedProperty"
      :property="selectedProperty"
      @close="selectedProperty = null"
      @approve="approveProperty"
      @reject="rejectProperty"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Building2, Clock, CheckCircle, XCircle } from 'lucide-vue-next'

import StatsCard from '@/components/admin/StatsCard.vue'
import PropertiesTable from '@/components/admin/properties/PropertiesTable.vue'
import PropertyDetailsDrawer from '@/components/admin/properties/PropertyDetailsDrawer.vue'

const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

const adminProfile = ref({
  full_name: 'Admin',
  city: '',
  state: ''
})

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

const properties = ref([])
const selectedProperty = ref(null)

// ==================== FETCH LIKE DASHBOARD ====================

const fetchAdminProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('admin_profiles')
      .select('full_name, city, state')
      .eq('id', user.id)
      .single()

    if (data) adminProfile.value = data
  } catch (err) {
    console.error(err)
  }
}

const fetchStats = async () => {
  try {
    // Total Properties
    const { count: total } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })

    // Pending
    const { count: pending } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Approved
    const { count: approved } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Rejected
    const { count: rejected } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    stats.value = { total: total || 0, pending: pending || 0, approved: approved || 0, rejected: rejected || 0 }
  } catch (err) {
    console.error('Stats error:', err)
  }
}

const fetchProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        agent:profiles!agent_id (full_name, agency_name, phone)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    properties.value = data || []
  } catch (err) {
    console.error('Failed to fetch properties:', err)
  }
}

// Filters
const filteredProperties = computed(() => {
  let result = [...properties.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      p.address?.toLowerCase().includes(term) ||
      p.area?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter(p => p.property_type === typeFilter.value)
  }

  return result
})

const approveProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved' })
    .eq('id', id)

  if (!error) {
    alert('✅ Property Approved')
    fetchProperties()
    fetchStats()
  }
}

const rejectProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (!error) {
    alert('✅ Property Rejected')
    fetchProperties()
    fetchStats()
  }
}

const refreshAll = () => {
  fetchProperties()
  fetchStats()
}

onMounted(() => {
  fetchAdminProfile()
  fetchProperties()
  fetchStats()
})
</script>