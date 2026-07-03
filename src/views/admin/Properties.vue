<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Properties Management</h1>
          <p class="text-[var(--steel-blue)] mt-2">
            Managing properties in <span class="font-semibold">{{ adminProfile.city }}, {{ adminProfile.state }}</span>
          </p>
        </div>
        <button 
          @click="exportData"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] flex items-center gap-2">
          Export Data
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Properties" :value="stats.total" :icon="Building2" color="royal-blue" />
        <StatsCard title="Pending Review" :value="stats.pending" :icon="Clock" color="periwinkle" />
        <StatsCard title="Approved Listings" :value="stats.approved" :icon="CheckCircle" color="bright-green" />
        <StatsCard title="Rejected Listings" :value="stats.rejected" :icon="XCircle" color="red" />
      </div>

      <!-- Filters -->
      <div class="bg-[var(--white)] rounded-3xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Search Properties</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, address, or area..."
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Status</label>
            <select v-model="statusFilter" class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] text-[var(--royal-blue)]">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Property Type</label>
            <select v-model="typeFilter" class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] text-[var(--royal-blue)]">
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Duplex">Duplex</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Mini Flat">Mini Flat</option>
              <option value="Self Contain">Self Contain</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Properties Table -->
      <div class="bg-[var(--white)] rounded-3xl shadow-sm overflow-hidden">
        <PropertiesTable 
          :properties="filteredProperties"
          @view="viewProperty"
          @approve="approveProperty"
          @reject="rejectProperty"
          @refresh="fetchProperties"
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
  city: '',
  state: ''
})

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

const properties = ref([])           // Raw data from database
const selectedProperty = ref(null)

// Fetch Properties
const fetchProperties = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get admin profile
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('state, city')
      .eq('id', user.id)
      .single()

    if (profile) {
      adminProfile.value = profile
    }

    // Simplified query - removed join temporarily
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id, title, property_type, purpose, price, area, city, state, 
        status, created_at, cover_image
      `)
      .eq('state', profile?.state)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      alert('Error: ' + error.message)   // Temporary alert to see exact error
    } else {
      console.log('Properties loaded:', data?.length)
      properties.value = data || []
      calculateStats()
    }
  } catch (err) {
    console.error('Failed to fetch properties:', err)
  }
}    // Fetch properties
    

const calculateStats = () => {
  stats.value.total = properties.value.length
  stats.value.pending = properties.value.filter(p => p.status === 'pending').length
  stats.value.approved = properties.value.filter(p => p.status === 'approved').length
  stats.value.rejected = properties.value.filter(p => p.status === 'rejected').length
}

// Filtered Properties (connected to search + filters)
const filteredProperties = computed(() => {
  let result = [...properties.value]

  // Search Filter
  if (searchQuery.value?.trim()) {
    const term = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      (p.address && p.address.toLowerCase().includes(term)) ||
      p.area?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term)
    )
  }

  // Status Filter
  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value)
  }

  // Property Type Filter
  if (typeFilter.value) {
    result = result.filter(p => 
      p.property_type?.toLowerCase() === typeFilter.value.toLowerCase()
    )
  }

  return result
})

const viewProperty = (property) => {
  selectedProperty.value = property
}

const approveProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved' })
    .eq('id', id)

  if (!error) {
    fetchProperties()
  } else {
    console.error('Approve failed:', error)
  }
}

const rejectProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (!error) {
    fetchProperties()
  } else {
    console.error('Reject failed:', error)
  }
}

const exportData = () => {
  alert(`Exporting ${filteredProperties.value.length} properties for ${adminProfile.value.state}...`)
  // TODO: Implement actual CSV export
}

onMounted(() => {
  fetchProperties()
})
</script>