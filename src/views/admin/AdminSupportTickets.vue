<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Support Tickets
          </h1>
          <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-1">
            Manage all agent and customer support requests
          </p>
        </div>

        <button
          @click="refreshData"
          class="px-5 py-2.5 sm:py-3 bg-[var(--royal-blue)] text-white rounded-xl sm:rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50"
        >
          <p class="text-xs sm:text-sm text-[var(--steel-blue)]">{{ stat.label }}</p>
          <p class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)] mt-1">
            {{ stat.value }}
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-6 shadow-sm">
        <div class="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by subject, message or user..."
              class="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 text-sm
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-[var(--royal-blue)]"
            />
          </div>

          <!-- Role Filter -->
          <select
            v-model="roleFilter"
            class="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                   focus:border-[var(--royal-blue)] focus:outline-none text-[var(--royal-blue)]"
          >
            <option value="">All Roles</option>
            <option value="agent">Agents</option>
            <option value="customer">Customers</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                   focus:border-[var(--royal-blue)] focus:outline-none text-[var(--royal-blue)]"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <!-- Category Filter -->
          <select
            v-model="categoryFilter"
            class="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                   focus:border-[var(--royal-blue)] focus:outline-none text-[var(--royal-blue)]"
          >
            <option value="">All Categories</option>
            <option value="account">Account</option>
            <option value="payment">Payment</option>
            <option value="technical">Technical</option>
            <option value="verification">Verification</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <!-- Table / Cards -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <SupportTicketsTable
          :tickets="filteredTickets"
          :loading="loading"
          @view="openTicketDrawer"
        />
      </div>
    </div>

    <!-- Ticket Details Drawer -->
    <SupportTicketDrawer
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="selectedTicket = null"
      @updated="onTicketUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import SupportTicketsTable from '@/components/admin/support/SupportTicketsTable.vue'
import SupportTicketDrawer from '@/components/admin/support/SupportTicketDrawer.vue'

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

const tickets = ref([])
const selectedTicket = ref(null)
const loading = ref(true)

const stats = ref([
  { label: 'Total Tickets', value: 0 },
  { label: 'Open', value: 0 },
  { label: 'In Progress', value: 0 },
  { label: 'Resolved', value: 0 }
])

const fetchTickets = async () => {
  loading.value = true
  try {
    // 1. Get tickets first (no join)
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (ticketsError) throw ticketsError

    if (!ticketsData || ticketsData.length === 0) {
      tickets.value = []
      return
    }

    // 2. Get related users
    const userIds = [...new Set(ticketsData.map(t => t.user_id).filter(Boolean))]

    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, avatar_url, role')
      .in('id', userIds)

    if (usersError) throw usersError

    // 3. Merge the data
    const usersMap = {}
    usersData?.forEach(u => {
      usersMap[u.id] = u
    })

    tickets.value = ticketsData.map(ticket => ({
      ...ticket,
      user: usersMap[ticket.user_id] || null
    }))

    // Stats
    stats.value = [
      { label: 'Total Tickets', value: tickets.value.length },
      { label: 'Open', value: tickets.value.filter(t => t.status === 'open').length },
      { label: 'In Progress', value: tickets.value.filter(t => t.status === 'in_progress').length },
      { label: 'Resolved', value: tickets.value.filter(t => t.status === 'resolved').length }
    ]

  } catch (err) {
    console.error('Error fetching tickets:', err)
  } finally {
    loading.value = false
  }
}

const filteredTickets = computed(() => {
  let result = [...tickets.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.subject?.toLowerCase().includes(term) ||
      t.message?.toLowerCase().includes(term) ||
      t.user?.full_name?.toLowerCase().includes(term) ||
      t.user?.email?.toLowerCase().includes(term)
    )
  }

  if (roleFilter.value) {
    result = result.filter(t => t.role === roleFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(t => t.status === statusFilter.value)
  }

  if (categoryFilter.value) {
    result = result.filter(t => t.category === categoryFilter.value)
  }

  return result
})

const openTicketDrawer = (ticket) => {
  selectedTicket.value = ticket
}

const onTicketUpdated = () => {
  selectedTicket.value = null
  fetchTickets()
}

const refreshData = () => fetchTickets()

onMounted(fetchTickets)
</script>