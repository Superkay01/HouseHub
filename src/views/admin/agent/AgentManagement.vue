<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex">
    <!-- Sidebar -->
   
    <div class="flex-1">
      <!-- Top Navigation -->
     
      <div class="p-8">
        <!-- Header -->
        <div class="flex justify-between items-end mb-10">
          <div>
            <h1 class="text-4xl font-bold text-dark-gray">Property Agents</h1>
            <p class="text-medium-gray mt-2 text-lg">
              Manage, verify and monitor all property agents in your state
            </p>
          </div>
          <button
            @click="openAddAgentModal"
            class="bg-[var(--royal-blue)] hover:bg-[var(--mediumBlue)] text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 font-medium transition-all"
          >
            <Plus class="w-5 h-5" />
            Add New Agent
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          <StatsCard
            v-for="stat in stats"
            :key="stat.label"
            :icon="stat.icon"
            :value="stat.value"
            :label="stat.label"
            :color="stat.color"
          />
        </div>

        <!-- Search & Filters + Rest of template remains the same -->
        <div class="bg-white rounded-3xl p-6 mb-8 shadow-sm">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[320px]">
              <div class="relative">
                <Search class="absolute left-5 top-4 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by agent name, agency, phone or email..."
                  class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none"
                />
              </div>
            </div>
            <select v-model="cityFilter" class="border border-gray-200 rounded-2xl px-6 py-4 focus:border-[var(--royal-blue)]">
              <option value="">All Cities</option>
              <option value="Ilorin">Ilorin</option>
              <option value="Ijebu Ode">Ijebu Ode</option>
            </select>
            <select v-model="statusFilter" class="border border-gray-200 rounded-2xl px-6 py-4 focus:border-[var(--royal-blue)]">
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
            <select v-model="sortBy" class="border border-gray-200 rounded-2xl px-6 py-4 focus:border-[var(--royal-blue)]">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="listings">Most Listings</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
            <button @click="exportData" class="px-6 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center gap-2">
              <Download class="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <BulkActionToolbar
          v-if="selectedAgents.length > 0"
          :count="selectedAgents.length"
          @approve="bulkApprove"
          @suspend="bulkSuspend"
          @delete="bulkDelete"
        />

        <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
          <AgentTable
            :agents="filteredAgents"
            :loading="loading"
            @view="openAgentDrawer"
            @edit="editAgent"
            v-model:selected="selectedAgents"
          />
        </div>

        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>

    <AgentProfileDrawer
      v-if="selectedAgent"
      :agent="selectedAgent"
      :visible="showDrawer"
      @close="showDrawer = false"
      @refresh="fetchAgents"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Search, Plus, Download } from 'lucide-vue-next'

import StatsCard from '@/components/admin/agents/StatsCard.vue'
import AgentTable from '@/components/admin/agents/AgentTable.vue'
import BulkActionToolbar from '@/components/admin/agents/BulkActionToolbar.vue'
import AgentProfileDrawer from '@/components/admin/agents/AgentProfileDrawer.vue'
import Pagination from '@/components/admin/Pagination.vue'

const searchQuery = ref('')
const cityFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')
const selectedAgents = ref([])
const showDrawer = ref(false)
const selectedAgent = ref(null)
const loading = ref(true)
const agents = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

let subscription = null

const stats = ref([
  { label: 'Total Agents', value: 0, icon: 'Users', color: 'blue' },
  { label: 'Verified', value: 0, icon: 'CheckCircle', color: 'green' },
  { label: 'Pending', value: 0, icon: 'Clock', color: 'amber' },
  { label: 'Suspended', value: 0, icon: 'Ban', color: 'red' },
  { label: 'Active Listings', value: 0, icon: 'Home', color: 'royal' },
  { label: 'Joined This Month', value: 0, icon: 'Calendar', color: 'purple' }
])

const fetchStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: admin } = await supabase
      .from('admin_profiles')
      .select('state')
      .eq('id', user.id)
      .single()

    const state = admin?.state
    if (!state) {
      console.warn('No state found for admin')
      return
    }

    // Total Agents
    const { count: total } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent')
      .eq('state', state)

    // Verified
    const { count: verified } = await supabase
      .from('agent_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .eq('verification_status', 'approved')

    // Pending
    const { count: pending } = await supabase
      .from('agent_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .eq('verification_status', 'pending')

    // Suspended (using verified = false as example)
    const { count: suspended } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true })
  .eq('role', 'agent')
  .eq('state', state)
  .eq('status', 'suspended')

    // Active Listings
    const { count: listings } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('state', state)
      .eq('status', 'approved')

    // Joined This Month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: joinedThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent')
      .eq('state', state)
      .gte('created_at', startOfMonth.toISOString())

    stats.value = [
      { label: 'Total Agents', value: total || 0, icon: 'Users', color: 'blue' },
      { label: 'Verified', value: verified || 0, icon: 'CheckCircle', color: 'green' },
      { label: 'Pending', value: pending || 0, icon: 'Clock', color: 'amber' },
      { label: 'Suspended', value: suspended || 0, icon: 'Ban', color: 'red' },
      { label: 'Active Listings', value: listings || 0, icon: 'Home', color: 'royal' },
      { label: 'Joined This Month', value: joinedThisMonth || 0, icon: 'Calendar', color: 'purple' }
    ]
  } catch (err) {
    console.error('Stats error:', err)
  }
}

const fetchAgents = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No user logged in')
      return
    }

    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('state, full_name')
      .eq('id', user.id)
      .single()

    console.log('Logged in Admin:', adminProfile)

    if (!adminProfile?.state) {
      console.warn('No state assigned to this admin')
      return
    }

    console.log(`Searching for agents in state: ${adminProfile.state}`)

    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent')
      .eq('state', adminProfile.state)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Query Error:', error)
    }

    agents.value = profilesData || []
    console.log(`Agents found: ${agents.value.length}`)
  } catch (err) {
    console.error('Catch Error:', err)
  } finally {
    loading.value = false
  }
}

const setupRealtime = () => {
  if (subscription) supabase.removeChannel(subscription)

  subscription = supabase
    .channel('agents-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
      fetchAgents()
      fetchStats()
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_verifications' }, () => {
      fetchAgents()
      fetchStats()
    })
    .subscribe()
}

const filteredAgents = computed(() => {
  let result = [...agents.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(agent =>
      agent.full_name?.toLowerCase().includes(term) ||
      agent.agency_name?.toLowerCase().includes(term) ||
      agent.phone?.includes(term)
    )
  }

  if (cityFilter.value) {
    result = result.filter(a => a.city === cityFilter.value)
  }

  if (statusFilter.value) {
    // Adjust this depending on how you store status
    result = result.filter(a => {
      const status = a.verified ? 'verified' : 'pending'
      return status === statusFilter.value
    })
  }

  return result
})

const openAgentDrawer = (agent) => {
  selectedAgent.value = agent
  showDrawer.value = true
}

const openAddAgentModal = () => alert('Add New Agent Modal - To be implemented')
const bulkApprove = () => alert('Bulk Approve')
const bulkSuspend = () => alert('Bulk Suspend')
const bulkDelete = () => alert('Bulk Delete')
const exportData = () => alert('Export Menu')
const editAgent = () => alert('Edit Agent')
const changePage = (page) => {
  currentPage.value = page
}

onUnmounted(() => {
  if (subscription) supabase.removeChannel(subscription)
})

onMounted(() => {
  fetchAgents()
  fetchStats()
  setupRealtime()
})
</script>