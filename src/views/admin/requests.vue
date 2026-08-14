<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Customer Requests
          </h1>
          <p class="text-medium-gray mt-2">
            View and manage property and inspection requests in your location.
          </p>
          <p class="mt-1 text-sm text-[var(--royal-blue)] font-medium">
            📍 {{ adminProfile.city }}, {{ adminProfile.state }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            @click="exportCSV"
            class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50 text-sm"
          >
            📥 CSV
          </button>
          <button
            @click="refreshAll"
            class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)]"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats -->
      <RequestStats :stats="stats" class="mb-8" />

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search customer, property, request ID..."
              class="w-full px-5 py-3.5 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            />
          </div>

          <select
            v-model="statusFilter"
            class="px-4 py-3.5 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            v-model="typeFilter"
            class="px-4 py-3.5 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)]"
          >
            <option value="">All Types</option>
            <option value="property">Property Request</option>
            <option value="inspection">Inspection Request</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <RequestTable
          :requests="filteredRequests"
          :loading="loading"
          @view="openDrawer"
          @assign="openAssignModal"
          @schedule="openScheduleModal"
        />
      </div>
    </div>

    <!-- Details Drawer -->
    <RequestDetailsDrawer
      v-if="selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
      @assign="openAssignModal"
      @schedule="openScheduleModal"
      @status-updated="refreshAll"
    />

    <!-- Assign Agent Modal -->
    <AssignAgentModal
      v-if="showAssignModal"
      :request="selectedRequest"
      @close="showAssignModal = false"
      @assigned="onAgentAssigned"
    />

    <!-- Schedule Modal -->
    <ScheduleInspectionModal
      v-if="showScheduleModal"
      :request="selectedRequest"
      @close="showScheduleModal = false"
      @scheduled="onInspectionScheduled"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient'

import RequestStats from '@/components/admin/requests/RequestStats.vue'
import RequestTable from '@/components/admin/requests/RequestTable.vue'
import RequestDetailsDrawer from '@/components/admin/requests/RequestDetailsDrawer.vue'
import AssignAgentModal from '@/components/admin/requests/AssignAgentModal.vue'
import ScheduleInspectionModal from '@/components/admin/requests/ScheduleInspectionModal.vue'

const adminProfile = ref({ city: '', state: '' })
const requests = ref([])
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  scheduled: 0,
  completed: 0,
  cancelled: 0
})

const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const loading = ref(true)

const selectedRequest = ref(null)
const showAssignModal = ref(false)
const showScheduleModal = ref(false)

let realtimeChannel = null

const fetchAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('admin_profiles')
    .select('full_name, city, state')
    .eq('id', user.id)
    .single()

  if (data) adminProfile.value = data
}

const fetchRequests = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No authenticated user')
      return
    }

    // 1. Get admin state
    const { data: admin, error: adminError } = await supabase
      .from('admin_profiles')
      .select('state, city')
      .eq('id', user.id)
      .single()

    if (adminError) {
      console.error('Admin profile error:', adminError)
      return
    }

    if (!admin?.state) {
      console.error('Admin has no assigned state')
      return
    }

    adminProfile.value = {
      ...adminProfile.value,
      state: admin.state,
      city: admin.city || ''
    }

    // 2. Fetch requests (simpler select first)
    const { data, error } = await supabase
      .from('property_requests')
      .select(`
        *,
        properties (
          id,
          title,
          property_type,
          price,
          city,
          state,
          cover_image,
          bedrooms,
          bathrooms,
          status
        )
      `)
      .eq('state', admin.state)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Requests fetch error:', error)
      throw error
    }

    // 3. Optionally enrich with customer/agent profiles
    const enriched = await Promise.all(
      (data || []).map(async (req) => {
        let customer = null
        let agent = null

        if (req.customer_id) {
          const { data: c } = await supabase
            .from('profiles')
            .select('id, full_name, phone, city, avatar_url, created_at')
            .eq('id', req.customer_id)
            .maybeSingle()
          customer = c
        }

        if (req.agent_id) {
          const { data: a } = await supabase
            .from('profiles')
            .select('id, full_name, agency_name, phone, avatar_url, verified')
            .eq('id', req.agent_id)
            .maybeSingle()
          agent = a
        }

        return {
          ...req,
          customer,
          property: req.properties,
          agent
        }
      })
    )

    requests.value = enriched
    calculateStats()
    console.log('✅ Requests loaded:', enriched.length)
  } catch (err) {
    console.error('Failed to fetch requests:', err)
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const list = requests.value
  stats.value = {
    total: list.length,
    pending: list.filter(r => r.status === 'pending').length,
    approved: list.filter(r => r.status === 'approved').length,
    scheduled: list.filter(r => r.status === 'scheduled').length,
    completed: list.filter(r => r.status === 'completed').length,
    cancelled: list.filter(r => r.status === 'cancelled').length
  }
}

const filteredRequests = computed(() => {
  let result = [...requests.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      r.customer?.full_name?.toLowerCase().includes(term) ||
      r.customer?.email?.toLowerCase().includes(term) ||
      r.customer?.phone?.includes(term) ||
      r.property?.title?.toLowerCase().includes(term) ||
      r.request_code?.toLowerCase().includes(term) ||
      r.city?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) {
    result = result.filter(r => r.status === statusFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter(r => r.request_type === typeFilter.value)
  }

  return result
})

const openDrawer = (request) => {
  selectedRequest.value = request
}

const openAssignModal = (request) => {
  selectedRequest.value = request
  showAssignModal.value = true
}

const openScheduleModal = (request) => {
  selectedRequest.value = request
  showScheduleModal.value = true
}

const onAgentAssigned = () => {
  showAssignModal.value = false
  fetchRequests()
}

const onInspectionScheduled = () => {
  showScheduleModal.value = false
  fetchRequests()
}

const refreshAll = () => {
  fetchRequests()
}

const exportCSV = () => {
  // Simple CSV export
  const headers = ['Request ID', 'Customer', 'Property', 'Type', 'Status', 'City', 'Date']
  const rows = filteredRequests.value.map(r => [
    r.request_code || r.id,
    r.customer?.full_name || '',
    r.property?.title || '',
    r.request_type || '',
    r.status || '',
    r.city || '',
    new Date(r.created_at).toLocaleDateString()
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `requests-${adminProfile.value.state}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
}

const setupRealtime = () => {
  realtimeChannel = supabase
    .channel('admin-requests')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'property_requests' },
      () => {
        fetchRequests()
      }
    )
    .subscribe()
}

onMounted(async () => {
  await fetchAdminProfile()
  await fetchRequests()
  setupRealtime()
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>