<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Reports & Analytics
          </h1>
          <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-1">
            Overview of platform performance in 
            <span class="font-semibold text-[var(--royal-blue)]">
              {{ adminProfile.city }}, {{ adminProfile.state }}
            </span>
          </p>
        </div>

        <div class="flex flex-wrap gap-2 sm:gap-3">
          <button
            @click="exportReport"
            class="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3
                   bg-white border border-[var(--royal-blue)] text-[var(--royal-blue)]
                   rounded-xl sm:rounded-2xl text-sm font-medium
                   hover:bg-[var(--royal-blue)] hover:text-white transition-colors"
          >
            <Download class="w-4 h-4" />
            Export
          </button>

          <button
            @click="refreshData"
            class="px-4 py-2.5 sm:px-5 sm:py-3 bg-[var(--royal-blue)] text-white
                   rounded-xl sm:rounded-2xl text-sm font-medium
                   hover:opacity-90 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Date Filter -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <span class="text-sm font-medium text-[var(--royal-blue)] whitespace-nowrap">
            Date Range:
          </span>

          <div class="flex flex-wrap gap-2 sm:gap-3 w-full">
            <button
              v-for="range in dateRanges"
              :key="range.value"
              @click="selectedRange = range.value"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                selectedRange === range.value
                  ? 'bg-[var(--royal-blue)] text-white'
                  : 'bg-gray-100 text-[var(--steel-blue)] hover:bg-gray-200'
              ]"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div
          v-for="stat in overviewStats"
          :key="stat.label"
          class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-50"
        >
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] mb-1">{{ stat.label }}</p>
          <p class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
            {{ stat.value }}
          </p>
          <p
            class="text-xs sm:text-sm mt-2"
            :class="stat.change >= 0 ? 'text-green-600' : 'text-red-500'"
          >
            {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}% from last period
          </p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
        <!-- Requests Overview -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
              Requests Overview
            </h3>
            <span class="text-xs text-[var(--steel-blue)]">Last 30 days</span>
          </div>

          <div class="space-y-4">
            <div v-for="item in requestBreakdown" :key="item.label">
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-[var(--steel-blue)]">{{ item.label }}</span>
                <span class="font-medium text-[var(--royal-blue)]">{{ item.count }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full bg-[var(--royal-blue)] transition-all"
                  :style="{ width: item.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inspection Status -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
              Inspection Status
            </h3>
          </div>

          <div class="space-y-4">
            <div v-for="item in inspectionStats" :key="item.label">
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-[var(--steel-blue)]">{{ item.label }}</span>
                <span class="font-medium text-[var(--royal-blue)]">{{ item.count }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all"
                  :class="item.color"
                  :style="{ width: item.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Tables -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">

        <!-- Top Performing Agents -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          <div class="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h3 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
              Top Performing Agents
            </h3>
          </div>

          <div class="divide-y divide-gray-50">
            <div
              v-for="(agent, index) in topAgents"
              :key="agent.id"
              class="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-[var(--royal-blue)]/10 flex items-center justify-center text-sm font-bold text-[var(--royal-blue)]">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-[var(--royal-blue)] truncate">
                  {{ agent.full_name }}
                </p>
                <p class="text-xs text-[var(--steel-blue)] truncate">
                  {{ agent.agency_name || 'Independent' }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-sm text-[var(--royal-blue)]">
                  {{ agent.inspections_count }}
                </p>
                <p class="text-xs text-[var(--steel-blue)]">inspections</p>
              </div>
            </div>

            <div v-if="topAgents.length === 0" class="px-6 py-10 text-center text-sm text-[var(--steel-blue)]">
              No agent data available
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          <div class="px-5 sm:px-6 py-4 border-b border-gray-100">
            <h3 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
              Recent Activity
            </h3>
          </div>

          <div class="divide-y divide-gray-50">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="px-5 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex justify-between items-start gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-[var(--royal-blue)] truncate">
                    {{ activity.title }}
                  </p>
                  <p class="text-xs text-[var(--steel-blue)] mt-0.5">
                    {{ activity.description }}
                  </p>
                </div>
                <span class="text-xs text-[var(--steel-blue)] whitespace-nowrap">
                  {{ activity.time }}
                </span>
              </div>
            </div>

            <div v-if="recentActivity.length === 0" class="px-6 py-10 text-center text-sm text-[var(--steel-blue)]">
              No recent activity
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Table -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div class="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
            Monthly Summary
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-left">
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)]">Month</th>
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)]">New Customers</th>
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)]">Requests</th>
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)]">Inspections</th>
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)]">Completed</th>
                <th class="py-3.5 px-5 font-medium text-[var(--steel-blue)] text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in monthlySummary"
                :key="row.month"
                class="border-t border-gray-50 hover:bg-gray-50/50"
              >
                <td class="py-3.5 px-5 font-medium text-[var(--royal-blue)]">{{ row.month }}</td>
                <td class="py-3.5 px-5 text-[var(--steel-blue)]">{{ row.customers }}</td>
                <td class="py-3.5 px-5 text-[var(--steel-blue)]">{{ row.requests }}</td>
                <td class="py-3.5 px-5 text-[var(--steel-blue)]">{{ row.inspections }}</td>
                <td class="py-3.5 px-5 text-[var(--steel-blue)]">{{ row.completed }}</td>
                <td class="py-3.5 px-5 text-right font-medium text-[var(--royal-blue)]">
                  {{ row.conversion }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Download } from 'lucide-vue-next'

const adminProfile = ref({ city: '', state: '' })
const selectedRange = ref('30d')
const loading = ref(true)

const dateRanges = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This Year', value: 'year' }
]

const overviewStats = ref([
  { label: 'Total Customers', value: '0', change: 0 },
  { label: 'Total Requests', value: '0', change: 0 },
  { label: 'Total Inspections', value: '0', change: 0 },
  { label: 'Completed Rate', value: '0%', change: 0 }
])

const requestBreakdown = ref([])
const inspectionStats = ref([])
const topAgents = ref([])
const recentActivity = ref([])
const monthlySummary = ref([])

// Helper: get start date based on selected range
const getStartDate = () => {
  const now = new Date()
  if (selectedRange.value === '7d') {
    now.setDate(now.getDate() - 7)
  } else if (selectedRange.value === '30d') {
    now.setDate(now.getDate() - 30)
  } else if (selectedRange.value === '90d') {
    now.setDate(now.getDate() - 90)
  } else if (selectedRange.value === 'year') {
    now.setMonth(0, 1) // January 1st of current year
    now.setHours(0, 0, 0, 0)
  }
  return now.toISOString()
}

const fetchData = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Get Admin Profile
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('city, state')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError
    if (profile) adminProfile.value = profile

    const state = profile?.state
    const startDate = getStartDate()

    // ========================
    // 2. OVERVIEW STATS
    // ========================

    // Total Customers in this state
    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')
      .eq('state', state)

    // Total Requests (assuming table name is "property_requests")
    const { count: totalRequests } = await supabase
      .from('property_requests')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .gte('created_at', startDate)

    // Total Inspections
    const { count: totalInspections } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .gte('created_at', startDate)

    // Completed Inspections
    const { count: completedInspections } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .eq('status', 'completed')
      .gte('created_at', startDate)

    const completedRate = totalInspections
      ? Math.round((completedInspections / totalInspections) * 100)
      : 0

    overviewStats.value = [
      { label: 'Total Customers', value: (totalCustomers || 0).toLocaleString(), change: 0 },
      { label: 'Total Requests', value: (totalRequests || 0).toLocaleString(), change: 0 },
      { label: 'Total Inspections', value: (totalInspections || 0).toLocaleString(), change: 0 },
      { label: 'Completed Rate', value: `${completedRate}%`, change: 0 }
    ]

    // ========================
    // 3. REQUEST BREAKDOWN
    // ========================
    const { data: requests } = await supabase
      .from('property_requests')
      .select('status')
      .eq('state', state)
      .gte('created_at', startDate)

    const requestCounts = {
      pending: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0
    }

    requests?.forEach(r => {
      const status = r.status?.toLowerCase()
      if (requestCounts[status] !== undefined) {
        requestCounts[status]++
      }
    })

    const totalReq = Object.values(requestCounts).reduce((a, b) => a + b, 0) || 1

    requestBreakdown.value = [
      { label: 'Pending', count: requestCounts.pending, percentage: Math.round((requestCounts.pending / totalReq) * 100) },
      { label: 'In Review', count: requestCounts.reviewing, percentage: Math.round((requestCounts.reviewing / totalReq) * 100) },
      { label: 'Approved', count: requestCounts.approved, percentage: Math.round((requestCounts.approved / totalReq) * 100) },
      { label: 'Rejected', count: requestCounts.rejected, percentage: Math.round((requestCounts.rejected / totalReq) * 100) }
    ]

    // ========================
    // 4. INSPECTION STATUS
    // ========================
    const { data: inspections } = await supabase
      .from('inspections')
      .select('status')
      .eq('state', state)
      .gte('created_at', startDate)

    const inspectionCounts = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      'no-show': 0
    }

    inspections?.forEach(i => {
      const status = i.status?.toLowerCase()
      if (inspectionCounts[status] !== undefined) {
        inspectionCounts[status]++
      }
    })

    const totalIns = Object.values(inspectionCounts).reduce((a, b) => a + b, 0) || 1

    inspectionStats.value = [
      { label: 'Scheduled', count: inspectionCounts.scheduled, percentage: Math.round((inspectionCounts.scheduled / totalIns) * 100), color: 'bg-blue-500' },
      { label: 'Completed', count: inspectionCounts.completed, percentage: Math.round((inspectionCounts.completed / totalIns) * 100), color: 'bg-green-500' },
      { label: 'Cancelled', count: inspectionCounts.cancelled, percentage: Math.round((inspectionCounts.cancelled / totalIns) * 100), color: 'bg-red-400' },
      { label: 'No-show', count: inspectionCounts['no-show'], percentage: Math.round((inspectionCounts['no-show'] / totalIns) * 100), color: 'bg-orange-400' }
    ]

    // ========================
    // 5. TOP PERFORMING AGENTS
    // ========================
    const { data: agentData } = await supabase
      .from('inspections')
      .select(`
        agent_id,
        agent:profiles!inspections_agent_id_fkey (
          id,
          full_name,
          agency_name
        )
      `)
      .eq('state', state)
      .eq('status', 'completed')
      .gte('created_at', startDate)

    // Count inspections per agent
    const agentMap = {}
    agentData?.forEach(item => {
      if (!item.agent_id || !item.agent) return
      if (!agentMap[item.agent_id]) {
        agentMap[item.agent_id] = {
          id: item.agent_id,
          full_name: item.agent.full_name,
          agency_name: item.agent.agency_name,
          inspections_count: 0
        }
      }
      agentMap[item.agent_id].inspections_count++
    })

    topAgents.value = Object.values(agentMap)
      .sort((a, b) => b.inspections_count - a.inspections_count)
      .slice(0, 5)

    // ========================
    // 6. RECENT ACTIVITY
    // ========================
    const { data: recentRequests } = await supabase
      .from('property_requests')
      .select('id, request_code, status, created_at, customer:profiles!property_requests_customer_id_fkey(full_name)')
      .eq('state', state)
      .order('created_at', { ascending: false })
      .limit(5)

    recentActivity.value = (recentRequests || []).map(r => ({
      id: r.id,
      title: `Request ${r.status}`,
      description: `${r.customer?.full_name || 'Customer'} • ${r.request_code || r.id.slice(0, 8)}`,
      time: formatRelativeTime(r.created_at)
    }))

    // ========================
    // 7. MONTHLY SUMMARY (simplified)
    // ========================
    // For a real production app you would use a database function or RPC.
    // Here's a simple client-side version for the last 4 months.

    const months = []
    const now = new Date()

    for (let i = 0; i < 4; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString()

      const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' })

      const { count: customers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
        .eq('state', state)
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd)

      const { count: requestsCount } = await supabase
        .from('property_requests')
        .select('*', { count: 'exact', head: true })
        .eq('state', state)
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd)

      const { count: inspectionsCount } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .eq('state', state)
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd)

      const { count: completedCount } = await supabase
        .from('inspections')
        .select('*', { count: 'exact', head: true })
        .eq('state', state)
        .eq('status', 'completed')
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd)

      const conversion = inspectionsCount
        ? Math.round((completedCount / inspectionsCount) * 100)
        : 0

      months.push({
        month: monthName,
        customers: customers || 0,
        requests: requestsCount || 0,
        inspections: inspectionsCount || 0,
        completed: completedCount || 0,
        conversion
      })
    }

    monthlySummary.value = months

  } catch (err) {
    console.error('Failed to load reports:', err)
  } finally {
    loading.value = false
  }
}

// Helper for relative time
const formatRelativeTime = (date) => {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

const exportReport = () => {
  alert('Export functionality coming soon')
}

const refreshData = () => {
  fetchData()
}

// Re-fetch when date range changes
watch(selectedRange, () => {
  fetchData()
})

onMounted(fetchData)
</script>