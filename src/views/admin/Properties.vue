<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight">
              Properties Management
            </h1>
            <p class="text-sm sm:text-base text-medium-gray mt-1 sm:mt-2">
              Managing properties in 
              <span class="font-semibold text-[var(--royal-blue)]">
                {{ adminProfile.city }}, {{ adminProfile.state }}
              </span>
            </p>
          </div>

          <!-- Action Buttons - responsive -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              @click="exportCSV"
              class="flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 
                     bg-white border border-[var(--royal-blue)] text-[var(--royal-blue)]
                     rounded-xl sm:rounded-2xl 
                     hover:bg-[var(--royal-blue)] hover:text-white
                     flex items-center justify-center gap-1.5 sm:gap-2 
                     text-xs sm:text-sm font-medium
                     transition-colors duration-200
                     min-h-[44px]">
              <span class="text-base">📥</span>
              <span>CSV</span>
            </button>

            <button 
              @click="exportPDF"
              class="flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 
                     bg-white border border-[var(--royal-blue)] text-[var(--royal-blue)]
                     rounded-xl sm:rounded-2xl 
                     hover:bg-[var(--royal-blue)] hover:text-white
                     flex items-center justify-center gap-1.5 sm:gap-2 
                     text-xs sm:text-sm font-medium
                     transition-colors duration-200
                     min-h-[44px]">
              <span class="text-base">📄</span>
              <span>PDF</span>
            </button>

            <button 
              @click="refreshAll"
              class="flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 
                     bg-[var(--royal-blue)] text-white 
                     rounded-xl sm:rounded-2xl 
                     hover:opacity-90 active:opacity-80
                     flex items-center justify-center gap-1.5 sm:gap-2 
                     text-xs sm:text-sm font-medium
                     transition-opacity duration-200
                     min-h-[44px] shadow-sm">
              <span class="hidden xs:inline">Refresh All</span>
              <span class="xs:hidden">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
        <StatsCard title="Total Properties" :value="stats.total" :icon="Building2" color="royal-blue" />
        <StatsCard title="Pending Review" :value="stats.pending" :icon="Clock" color="periwinkle" />
        <StatsCard title="Approved Listings" :value="stats.approved" :icon="CheckCircle" color="bright-green" />
        <StatsCard title="Rejected Listings" :value="stats.rejected" :icon="XCircle" color="red" />
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="sm:col-span-2">
            <label class="block text-xs sm:text-sm font-medium text-medium-gray mb-1.5 sm:mb-2">
              Search Properties
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, address, or area..."
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 
                     rounded-xl sm:rounded-2xl 
                     border border-[var(--royal-blue)]/40 
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-sm sm:text-base
                     transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-medium-gray mb-1.5 sm:mb-2">
              Status
            </label>
            <select 
              v-model="statusFilter" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 
                     rounded-xl sm:rounded-2xl 
                     border border-[var(--royal-blue)]/40 
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-sm sm:text-base
                     bg-white">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-medium text-medium-gray mb-1.5 sm:mb-2">
              Property Type
            </label>
            <select 
              v-model="typeFilter" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 
                     rounded-xl sm:rounded-2xl 
                     border border-[var(--royal-blue)]/40 
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-sm sm:text-base
                     bg-white">
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Duplex">Duplex</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Properties Table -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <PropertiesTable 
            :properties="filteredProperties"
            @view="viewProperty"
            @approve="approveProperty"
            @reject="rejectProperty"
          />
        </div>
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
const viewProperty = (property) => {
  console.log('Viewing property:', property)
  selectedProperty.value = property
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