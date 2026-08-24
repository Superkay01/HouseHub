<template>
  <div class="min-h-screen bg-gray-50 pb-12 md:pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          Dashboard Analytics
        </h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">
          Overview of platform activity and performance
        </p>

        <div class="flex flex-wrap items-center gap-3 mt-2">
          <span class="inline-flex items-center gap-2 text-xs sm:text-sm text-green-600">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live updates
          </span>
          <span v-if="lastUpdated" class="text-xs text-gray-400">
            Updated {{ lastUpdated }}
          </span>
          <span v-if="refreshing" class="text-xs text-gray-400">
            Refreshing...
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <div v-else class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="card in kpiCards"
            :key="card.label"
            class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 shadow-sm"
          >
            <p class="text-xs sm:text-sm text-gray-500">{{ card.label }}</p>
            <p class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)] mt-1">
              {{ card.value }}
            </p>
            <p class="text-xs text-gray-400 mt-1">{{ card.hint }}</p>
          </div>
        </div>

        <!-- Secondary stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <!-- Properties -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Properties
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Approved</span>
                <strong>{{ stats.properties.approved }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pending</span>
                <strong>{{ stats.properties.pending }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Draft</span>
                <strong>{{ stats.properties.draft }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rejected</span>
                <strong>{{ stats.properties.rejected }}</strong>
              </div>
            </div>
          </div>

          <!-- Requests -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Inspection Requests
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Pending</span>
                <strong>{{ stats.requests.pending }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Accepted</span>
                <strong>{{ stats.requests.accepted }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Cancelled</span>
                <strong>{{ stats.requests.cancelled }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total</span>
                <strong>{{ stats.requests.total }}</strong>
              </div>
            </div>
          </div>

          <!-- Inspections -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Inspections
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Scheduled</span>
                <strong>{{ stats.inspections.scheduled }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Completed</span>
                <strong>{{ stats.inspections.completed }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Cancelled</span>
                <strong>{{ stats.inspections.cancelled }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total</span>
                <strong>{{ stats.inspections.total }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments + Users -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Payments
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Successful</span>
                <strong>{{ stats.payments.successful }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pending</span>
                <strong>{{ stats.payments.pending }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Failed</span>
                <strong>{{ stats.payments.failed }}</strong>
              </div>
              <div class="flex justify-between pt-2 border-t">
                <span class="text-gray-600">Total Revenue</span>
                <strong class="text-green-600">
                  ₦{{ Number(stats.payments.revenue || 0).toLocaleString() }}
                </strong>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Users
            </h2>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Customers</span>
                <strong>{{ stats.users.customers }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Agents</span>
                <strong>{{ stats.users.agents }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Verified Agents</span>
                <strong>{{ stats.users.verifiedAgents }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Support Tickets (Open)</span>
                <strong>{{ stats.support.openTickets }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent activity -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
            Recent Requests
          </h2>

          <div v-if="recentRequests.length === 0" class="text-sm text-gray-500 py-6 text-center">
            No recent requests
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in recentRequests"
              :key="item.id"
              class="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.properties?.title || 'Property request' }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ item.request_code || 'No code' }} · {{ formatDate(item.created_at) }}
                </p>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-lg capitalize bg-white border">
                {{ item.status || 'pending' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()
const loading = ref(true)
const refreshing = ref(false)
const recentRequests = ref([])
const lastUpdated = ref('')

let channel = null
let refreshTimer = null

const stats = ref({
  properties: { approved: 0, pending: 0, draft: 0, rejected: 0, total: 0 },
  requests: { pending: 0, accepted: 0, cancelled: 0, total: 0 },
  inspections: { scheduled: 0, completed: 0, cancelled: 0, total: 0 },
  payments: { successful: 0, pending: 0, failed: 0, revenue: 0 },
  users: { customers: 0, agents: 0, verifiedAgents: 0 },
  support: { openTickets: 0 },
})

const kpiCards = computed(() => [
  {
    label: 'Total Properties',
    value: stats.value.properties.total,
    hint: `${stats.value.properties.approved} approved`,
  },
  {
    label: 'Total Requests',
    value: stats.value.requests.total,
    hint: `${stats.value.requests.pending} pending`,
  },
  {
    label: 'Inspections',
    value: stats.value.inspections.total,
    hint: `${stats.value.inspections.completed} completed`,
  },
  {
    label: 'Revenue',
    value: `₦${Number(stats.value.payments.revenue || 0).toLocaleString()}`,
    hint: `${stats.value.payments.successful} successful payments`,
  },
])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const countBy = (rows, field, value) =>
  rows.filter((r) => (r[field] || '').toLowerCase() === value.toLowerCase()).length

const loadDashboard = async (isRefresh = false) => {
  if (isRefresh) refreshing.value = true
  else loading.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const [
      propertiesRes,
      requestsRes,
      inspectionsRes,
      paymentsRes,
      profilesRes,
      ticketsRes,
    ] = await Promise.all([
      supabase.from('properties').select('id, status'),
      supabase
        .from('property_requests')
        .select('id, status, request_code, created_at, properties(title)')
        .order('created_at', { ascending: false }),
      supabase.from('inspections').select('id, status'),
      supabase.from('payments').select('id, status, amount'),
      supabase.from('profiles').select('id, role, verified'),
      supabase.from('support_tickets').select('id, status'),
    ])

    const properties = propertiesRes.data || []
    const requests = requestsRes.data || []
    const inspections = inspectionsRes.data || []
    const payments = paymentsRes.data || []
    const profiles = profilesRes.data || []
    const tickets = ticketsRes.data || []

    stats.value.properties = {
      total: properties.length,
      approved: countBy(properties, 'status', 'approved'),
      pending: countBy(properties, 'status', 'pending'),
      draft: countBy(properties, 'status', 'draft'),
      rejected: countBy(properties, 'status', 'rejected'),
    }

    stats.value.requests = {
      total: requests.length,
      pending: countBy(requests, 'status', 'pending'),
      accepted: countBy(requests, 'status', 'accepted'),
      cancelled: countBy(requests, 'status', 'cancelled'),
    }

    stats.value.inspections = {
      total: inspections.length,
      scheduled:
        countBy(inspections, 'status', 'scheduled') +
        countBy(inspections, 'status', 'confirmed'),
      completed: countBy(inspections, 'status', 'completed'),
      cancelled: countBy(inspections, 'status', 'cancelled'),
    }

    const successfulPayments = payments.filter((p) =>
      ['success', 'successful', 'paid'].includes((p.status || '').toLowerCase())
    )

    stats.value.payments = {
      successful: successfulPayments.length,
      pending: countBy(payments, 'status', 'pending'),
      failed: countBy(payments, 'status', 'failed'),
      revenue: successfulPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    }

    stats.value.users = {
      customers: profiles.filter((p) => p.role === 'customer').length,
      agents: profiles.filter((p) => p.role === 'agent').length,
      verifiedAgents: profiles.filter((p) => p.role === 'agent' && p.verified).length,
    }

    stats.value.support = {
      openTickets: tickets.filter((t) => (t.status || '') === 'open').length,
    }

    recentRequests.value = requests.slice(0, 8)

    lastUpdated.value = new Date().toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (err) {
    console.error('Dashboard load error:', err)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const queueRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    loadDashboard(true)
  }, 400)
}

const setupRealtime = () => {
  channel = supabase
    .channel('admin-dashboard-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'property_requests' },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'inspections' },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'payments' },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'support_tickets' },
      () => queueRefresh()
    )
    .subscribe((status) => {
      console.log('Admin dashboard realtime:', status)
    })
}

onMounted(async () => {
  await loadDashboard(false)
  setupRealtime()
})

onBeforeUnmount(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
  if (channel) supabase.removeChannel(channel)
})
</script>