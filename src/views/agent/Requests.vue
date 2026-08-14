<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">

      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
      >
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">
            Customer Requests
          </h1>

          <p class="text-medium-gray mt-2">
            View and manage property requests assigned to you by the State Admin.
          </p>

          <p class="mt-2 text-sm font-medium text-[var(--royal-blue)]">
            📍 {{ agentProfile.city || '—' }},
            {{ agentProfile.state || '—' }}
          </p>
        </div>

        <button
          @click="fetchRequests"
          :disabled="loading"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] transition disabled:opacity-50"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <p class="text-sm text-medium-gray">Total Requests</p>
          <p class="text-4xl font-bold mt-2">
            {{ stats.total }}
          </p>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <p class="text-sm text-medium-gray">Assigned</p>
          <p class="text-4xl font-bold text-blue-600 mt-2">
            {{ stats.assigned }}
          </p>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <p class="text-sm text-medium-gray">Accepted</p>
          <p class="text-4xl font-bold text-purple-600 mt-2">
            {{ stats.accepted }}
          </p>
        </div>

        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <p class="text-sm text-medium-gray">Completed</p>
          <p class="text-4xl font-bold text-green-600 mt-2">
            {{ stats.completed }}
          </p>
        </div>

      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search property, request ID or location..."
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          />

          <select
            v-model="statusFilter"
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            v-model="dateFilter"
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

        </div>
      </div>

      <!-- Requests -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden">

        <!-- Loading -->
        <div
          v-if="loading"
          class="p-16 text-center text-medium-gray"
        >
          Loading requests...
        </div>

        <!-- Empty -->
        <div
          v-else-if="filteredRequests.length === 0"
          class="p-16 text-center"
        >
          <div class="text-6xl mb-4">📋</div>

          <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">
            No Requests Found
          </h3>

          <p class="text-medium-gray mt-2 max-w-md mx-auto">
            You currently have no property requests assigned to you.
            New requests assigned by the State Admin will appear here
            automatically.
          </p>
        </div>

        <div v-else>

          <!-- Desktop -->
          <div class="hidden md:block overflow-x-auto">

            <table class="w-full">

              <thead>
                <tr class="border-b text-left text-sm text-medium-gray">
                  <th class="py-4 px-6">Request ID</th>
                  <th class="py-4 px-6">Property</th>
                  <th class="py-4 px-6">Location</th>
                  <th class="py-4 px-6">Request Type</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6">Created</th>
                  <th class="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>

              <tbody class="divide-y">

                <tr
                  v-for="request in filteredRequests"
                  :key="request.id"
                  class="hover:bg-gray-50 transition"
                >

                  <td class="py-5 px-6 font-medium">
                    {{ request.request_code || request.id.slice(0, 8) }}
                  </td>

                  <td class="py-5 px-6">
                    <div class="flex items-center gap-3">
                      <img
                        :src="request.properties?.cover_image || 'https://via.placeholder.com/60'"
                        class="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p class="font-medium">
                          {{ request.properties?.title || 'Property' }}
                        </p>
                        <p class="text-xs text-medium-gray">
                          {{ request.properties?.property_type || '—' }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="py-5 px-6 text-sm text-medium-gray">
                    {{ request.properties?.area || request.area || '—' }},
                    {{ request.properties?.city || request.city || '—' }}
                  </td>

                  <td class="py-5 px-6 text-sm capitalize">
                    {{ request.request_type || 'Property Request' }}
                  </td>

                  <td class="py-5 px-6">
                    <span
                      class="text-xs px-3 py-1.5 rounded-2xl font-medium capitalize"
                      :class="statusClass(request.status)"
                    >
                      {{ formatStatus(request.status) }}
                    </span>
                  </td>

                  <td class="py-5 px-6 text-sm text-medium-gray">
                    {{ formatDate(request.created_at) }}
                  </td>

                  <td class="py-5 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">

                      <!-- Accept -->
                      <button
                        v-if="isAssigned(request.status)"
                        @click="acceptRequestFromTable(request)"
                        :disabled="actionLoading"
                        class="px-4 py-2 bg-green-600 text-white rounded-2xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                      >
                        ✓ Accept
                      </button>

                      <!-- Decline -->
                      <button
                        v-if="isAssigned(request.status)"
                        @click="declineRequestFromTable(request)"
                        :disabled="actionLoading"
                        class="px-4 py-2 bg-red-50 text-red-700 rounded-2xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Decline
                      </button>

                      <!-- View -->
                      <button
                        @click="openDrawer(request)"
                        class="px-5 py-2 bg-[var(--royal-blue)] text-white rounded-2xl text-sm hover:bg-[var(--medium-blue)]"
                      >
                        View
                      </button>

                    </div>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <!-- Mobile -->
          <div class="md:hidden divide-y">

            <div
              v-for="request in filteredRequests"
              :key="request.id"
              class="p-5"
            >

              <div class="flex justify-between items-start gap-3">
                <div>
                  <p class="font-semibold">
                    {{ request.properties?.title }}
                  </p>
                  <p class="text-sm text-medium-gray mt-1">
                    {{ request.request_code || request.id.slice(0, 8) }}
                  </p>
                  <p class="text-sm text-medium-gray mt-1">
                    📍
                    {{ request.properties?.area || request.area || '—' }},
                    {{ request.properties?.city || request.city || '—' }}
                  </p>
                </div>

                <span
                  class="text-xs px-3 py-1 rounded-2xl font-medium capitalize"
                  :class="statusClass(request.status)"
                >
                  {{ formatStatus(request.status) }}
                </span>
              </div>

              <div class="mt-4 space-y-2">
                <button
                  v-if="isAssigned(request.status)"
                  @click="acceptRequestFromTable(request)"
                  :disabled="actionLoading"
                  class="w-full py-3 bg-green-600 text-white rounded-2xl text-sm font-medium disabled:opacity-50"
                >
                  ✓ Accept Request
                </button>

                <button
                  v-if="isAssigned(request.status)"
                  @click="declineRequestFromTable(request)"
                  :disabled="actionLoading"
                  class="w-full py-3 bg-red-50 text-red-700 rounded-2xl text-sm font-medium disabled:opacity-50"
                >
                  Decline
                </button>

                <button
                  @click="openDrawer(request)"
                  class="w-full py-3 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl text-sm font-medium"
                >
                  View Request
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- Request Details Drawer -->
    <div
      v-if="selected"
      class="fixed inset-0 z-50 bg-black/50 flex justify-end"
      @click.self="closeDrawer"
    >

      <div class="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">

        <!-- Drawer Header -->
        <div
          class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10"
        >
          <div>
            <h2 class="text-xl font-bold text-[var(--royal-blue)]">
              Request Details
            </h2>
            <p class="text-sm text-medium-gray">
              {{ selected.request_code || selected.id.slice(0, 8) }}
            </p>
          </div>

          <button
            @click="closeDrawer"
            class="text-3xl text-gray-400 hover:text-black"
          >
            ×
          </button>
        </div>

        <div class="p-6 space-y-8">

          <!-- Property -->
          <div>
            <img
              :src="selected.properties?.cover_image || 'https://via.placeholder.com/600x300'"
              class="w-full h-52 object-cover rounded-3xl mb-5"
            />

            <h3 class="text-2xl font-semibold">
              {{ selected.properties?.title }}
            </h3>

            <p class="text-medium-gray mt-1">
              📍
              {{ selected.properties?.area || selected.area || '—' }},
              {{ selected.properties?.city || selected.city || '—' }},
              {{ selected.properties?.state || selected.state || '—' }}
            </p>

            <p class="text-2xl font-bold text-green-600 mt-3">
              ₦{{ Number(selected.properties?.price || 0).toLocaleString() }}
              <span class="text-sm font-normal text-medium-gray">
                / year
              </span>
            </p>
          </div>

          <!-- Request Information -->
          <div class="bg-gray-50 rounded-3xl p-5 space-y-4">
            <h4 class="font-semibold text-[var(--royal-blue)]">
              Request Information
            </h4>

            <div class="flex justify-between">
              <span class="text-medium-gray">Status</span>
              <span class="font-medium capitalize">
                {{ formatStatus(selected.status) }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-medium-gray">Request Type</span>
              <span class="font-medium capitalize">
                {{ selected.request_type || 'Property Request' }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-medium-gray">Submitted</span>
              <span class="font-medium">
                {{ formatDate(selected.created_at) }}
              </span>
            </div>

            <div v-if="selected.message" class="pt-3 border-t">
              <p class="text-medium-gray mb-1">Customer Note</p>
              <p>{{ selected.message }}</p>
            </div>
          </div>

          <!-- Customer -->
          <div class="border rounded-3xl p-5">
            <p class="text-sm text-medium-gray">Customer</p>
            <p class="font-semibold mt-1">
              {{ maskCustomerName(selected.customer?.full_name) }}
            </p>
            <p class="text-sm text-medium-gray mt-2">
              Customer communication is managed by the State Admin.
            </p>
          </div>

          <!-- State Admin -->
          <div class="border rounded-3xl p-5">
            <p class="text-sm text-medium-gray">Assigned State Admin</p>
            <p class="font-semibold mt-1">
              {{ selected.state || agentProfile.state }} Admin
            </p>
            <p class="text-sm text-green-600 mt-1">✓ Verified coordinator</p>

            <button
              @click="messageAdmin"
              class="mt-4 w-full py-3 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl text-sm font-medium"
            >
              Message Admin
            </button>
          </div>

          <!-- Workflow -->
          <div class="border rounded-3xl p-5">
            <h4 class="font-semibold text-[var(--royal-blue)] mb-5">
              Request Progress
            </h4>

            <div class="space-y-5">
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                  ✓
                </div>
                <div>
                  <p class="font-medium">Customer submitted request</p>
                  <p class="text-sm text-medium-gray">
                    {{ formatDate(selected.created_at) }}
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="hasReachedStatus('assigned') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
                >
                  {{ hasReachedStatus('assigned') ? '✓' : '2' }}
                </div>
                <div>
                  <p class="font-medium">Assigned to you</p>
                  <p class="text-sm text-medium-gray">
                    State Admin assigned this request
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="hasReachedStatus('accepted') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
                >
                  {{ hasReachedStatus('accepted') ? '✓' : '3' }}
                </div>
                <div>
                  <p class="font-medium">Agent response</p>
                  <p class="text-sm text-medium-gray">
                    Accept or decline the request
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="hasReachedStatus('scheduled') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
                >
                  {{ hasReachedStatus('scheduled') ? '✓' : '4' }}
                </div>
                <div>
                  <p class="font-medium">Inspection scheduled</p>
                  <p class="text-sm text-medium-gray">
                    State Admin schedules the inspection
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pt-2">

            <!-- Accept -->
            <button
              v-if="isAssigned(selected?.status)"
              @click="acceptRequest"
              :disabled="actionLoading"
              class="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ actionLoading ? 'Accepting...' : '✓ Accept Request' }}
            </button>

            <!-- Decline -->
            <button
              v-if="isAssigned(selected?.status)"
              @click="declineRequest"
              :disabled="actionLoading"
              class="w-full py-4 bg-red-50 text-red-700 rounded-2xl font-semibold hover:bg-red-100 transition disabled:opacity-50"
            >
              {{ actionLoading ? 'Processing...' : 'Decline Request' }}
            </button>

            <!-- Accepted -->
            <div
              v-if="normalizeStatus(selected?.status) === 'accepted'"
              class="bg-purple-50 text-purple-700 p-4 rounded-2xl text-center"
            >
              ✓ Request accepted.
              <p class="text-sm mt-1">
                The State Admin will schedule the inspection.
              </p>
            </div>

            <!-- Scheduled -->
            <div
              v-if="['scheduled', 'confirmed'].includes(normalizeStatus(selected?.status))"
              class="bg-blue-50 text-blue-700 p-4 rounded-2xl text-center"
            >
              Inspection scheduled.
              <p class="text-sm mt-1">
                View the inspection from your Inspections page.
              </p>
              <button
                @click="goToInspections"
                class="mt-3 px-5 py-2 bg-[var(--royal-blue)] text-white rounded-xl text-sm"
              >
                View Inspections
              </button>
            </div>

            <!-- Completed -->
            <div
              v-if="normalizeStatus(selected?.status) === 'completed'"
              class="bg-green-50 text-green-700 p-4 rounded-2xl text-center"
            >
              ✓ This request has been completed.
            </div>

            <!-- Property -->
            <button
              @click="openProperty"
              class="w-full py-4 border rounded-2xl font-medium hover:bg-gray-50"
            >
              Open Property
            </button>

          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue'

import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()

/* ---------------------------------
   STATE
---------------------------------- */

const agentProfile = ref({
  city: '',
  state: ''
})

const requests = ref([])
const selected = ref(null)

const loading = ref(true)
const actionLoading = ref(false)   // ← THIS WAS MISSING

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

let channel = null

/* ---------------------------------
   STATUS HELPERS
---------------------------------- */

const statusOrder = [
  'pending',
  'assigned',
  'accepted',
  'scheduled',
  'confirmed',
  'completed'
]

const normalizeStatus = (status) => {
  if (!status) return ''
  return String(status).toLowerCase().trim()
}

const isAssigned = (status) => {
  return normalizeStatus(status) === 'assigned'
}

/* ---------------------------------
   STATISTICS
---------------------------------- */

const stats = computed(() => {
  const list = requests.value

  return {
    total: list.length,
    assigned: list.filter(r => isAssigned(r.status)).length,
    accepted: list.filter(r => normalizeStatus(r.status) === 'accepted').length,
    completed: list.filter(r => normalizeStatus(r.status) === 'completed').length
  }
})

/* ---------------------------------
   FILTER
---------------------------------- */

const filteredRequests = computed(() => {
  let result = [...requests.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()

    result = result.filter(request => {
      return (
        request.properties?.title?.toLowerCase().includes(term) ||
        request.request_code?.toLowerCase().includes(term) ||
        request.city?.toLowerCase().includes(term) ||
        request.properties?.area?.toLowerCase().includes(term)
      )
    })
  }

  if (statusFilter.value) {
    result = result.filter(
      request => normalizeStatus(request.status) === statusFilter.value
    )
  }

  if (dateFilter.value) {
    const now = new Date()

    result = result.filter(request => {
      const created = new Date(request.created_at)

      if (dateFilter.value === 'today') {
        return created.toDateString() === now.toDateString()
      }

      if (dateFilter.value === 'week') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return created >= weekAgo && created <= now
      }

      if (dateFilter.value === 'month') {
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        )
      }

      if (dateFilter.value === 'upcoming') {
        return created >= now
      }

      if (dateFilter.value === 'past') {
        return created < now
      }

      return true
    })
  }

  return result
})

/* ---------------------------------
   STATUS UI
---------------------------------- */

const statusClass = (status) => {
  const key = normalizeStatus(status)

  const map = {
    pending: 'bg-amber-100 text-amber-700',
    assigned: 'bg-blue-100 text-blue-700',
    accepted: 'bg-purple-100 text-purple-700',
    scheduled: 'bg-indigo-100 text-indigo-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    declined: 'bg-gray-100 text-gray-600'
  }

  return map[key] || 'bg-gray-100 text-gray-600'
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'

  return String(status)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/* ---------------------------------
   DATE
---------------------------------- */

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/* ---------------------------------
   CUSTOMER PRIVACY
---------------------------------- */

const maskCustomerName = (name) => {
  if (!name?.trim()) return 'Customer'

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Customer'

  const first = parts[0] || ''
  if (parts.length === 1) {
    return `${first.charAt(0)}.`
  }

  const last = parts[parts.length - 1] || ''
  return `${first} ${last.charAt(0)}.`
}

/* ---------------------------------
   FETCH PROFILE
---------------------------------- */

const fetchAgentProfile = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, city, state, role')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Profile error:', error)
  }

  if (data) {
    agentProfile.value = data
  }

  return user
}

/* ---------------------------------
   FETCH REQUESTS
---------------------------------- */

const fetchRequests = async () => {
  loading.value = true

  try {
    const user = await fetchAgentProfile()
    if (!user) return

    const { data, error } = await supabase
      .from('property_requests')
      .select(`
        *,
        properties (
          id,
          title,
          cover_image,
          area,
          city,
          state,
          price,
          bedrooms,
          bathrooms,
          property_type,
          status
        )
      `)
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const enriched = await Promise.all(
      (data || []).map(async (request) => {
        let customer = null

        if (request.customer_id) {
          const { data: customerData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', request.customer_id)
            .maybeSingle()

          customer = customerData
        }

        return {
          ...request,
          customer
        }
      })
    )

    requests.value = enriched
  } catch (error) {
    console.error('Failed to fetch requests:', error)
  } finally {
    loading.value = false
  }
}

/* ---------------------------------
   DRAWER
---------------------------------- */

const openDrawer = (request) => {
  selected.value = request
}

const closeDrawer = () => {
  selected.value = null
}

/* ---------------------------------
   ACCEPT / DECLINE FROM TABLE
---------------------------------- */

const acceptRequestFromTable = async (request) => {
  selected.value = request
  await acceptRequest()
}

const declineRequestFromTable = async (request) => {
  selected.value = request
  await declineRequest()
}

/* ---------------------------------
   ACCEPT REQUEST
---------------------------------- */

const acceptRequest = async () => {
  if (!selected.value) return

  const confirmed = window.confirm(
    'Accept this request? An inspection record will be created and the State Admin will be notified.'
  )

  if (!confirmed) return

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('You are not logged in.')
      return
    }

    const { data: inspectionId, error } = await supabase.rpc(
      'accept_property_request',
      {
        p_request_id: selected.value.id,
      }
    )

    if (error) {
      console.error('Accept request error:', error)
      throw error
    }

    if (!inspectionId) {
      throw new Error(
        'The request was accepted, but no inspection was created.'
      )
    }

    alert(
      '✓ Request accepted successfully. The inspection has been created and the State Admin can now schedule it.'
    )

    selected.value = null

    await fetchRequests()
  } catch (error) {
    console.error('Failed to accept request:', error)

    alert(
      error?.message ||
        'Unable to accept this request. Please try again.'
    )
  }
}
/* ---------------------------------
   DECLINE REQUEST
---------------------------------- */

const declineRequest = async () => {
  if (!selected.value) return

  const reason = window.prompt('Why are you declining this request?')

  if (!reason) return

  actionLoading.value = true

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('property_requests')
      .update({
        status: 'declined',
        admin_notes: `Agent declined: ${reason}`,
        agent_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', selected.value.id)
      .eq('agent_id', user.id)
      .eq('status', 'assigned')

    if (error) throw error

    alert('Request declined and returned to the State Admin.')

    selected.value = null
    await fetchRequests()
  } catch (error) {
    console.error(error)
    alert(error.message || 'Unable to decline request.')
  } finally {
    actionLoading.value = false
  }
}

/* ---------------------------------
   PROGRESS
---------------------------------- */

const hasReachedStatus = (status) => {
  if (!selected.value?.status) return false

  const current = statusOrder.indexOf(normalizeStatus(selected.value.status))
  const target = statusOrder.indexOf(status)

  return current >= target
}

/* ---------------------------------
   PROPERTY
---------------------------------- */

const openProperty = () => {
  const propertyId =
    selected.value?.property_id ||
    selected.value?.properties?.id

  if (!propertyId) return

  router.push(`/agent/properties/${propertyId}`)
}

/* ---------------------------------
   INSPECTIONS
---------------------------------- */

const goToInspections = () => {
  router.push('/agent/inspections')
}

/* ---------------------------------
   ADMIN MESSAGE
---------------------------------- */

const messageAdmin = () => {
  router.push('/agent/messages')
}

/* ---------------------------------
   REALTIME
---------------------------------- */

const setupRealtime = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  if (channel) {
    await supabase.removeChannel(channel)
  }

  channel = supabase
    .channel(`agent-requests-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'property_requests'
      },
      (payload) => {
        const newRow = payload.new
        const oldRow = payload.old

        if (
          newRow?.agent_id === user.id ||
          oldRow?.agent_id === user.id
        ) {
          fetchRequests()
        }
      }
    )
    .subscribe((status, error) => {
      console.log('Agent request realtime:', status, error)
    })
}

/* ---------------------------------
   LIFECYCLE
---------------------------------- */

onMounted(async () => {
  await fetchRequests()
  await setupRealtime()
})

onUnmounted(async () => {
  if (channel) {
    await supabase.removeChannel(channel)
  }
})
</script>