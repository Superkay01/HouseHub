<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex">
    <!-- Sidebar (kept as is) -->
   
    <div class="flex-1 min-w-0">
      <!-- Top Navigation (kept as is) -->
     
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight">
              Property Agents
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-[var(--steel-blue)] mt-1 sm:mt-2">
              Manage, verify and monitor all property agents in your state
            </p>
          </div>

          <button
            @click="openAddAgentModal"
            class="w-full sm:w-auto 
                   bg-[var(--royal-blue)] hover:bg-[var(--medium-Blue)] 
                   text-white 
                   px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 
                   rounded-xl sm:rounded-2xl 
                   flex items-center justify-center gap-2 sm:gap-3 
                   font-medium text-sm sm:text-base
                   transition-all duration-200
                   min-h-[44px] shadow-sm"
          >
            <Plus class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Add New Agent</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <StatsCard
            v-for="stat in stats"
            :key="stat.label"
            :icon="stat.icon"
            :value="stat.value"
            :label="stat.label"
            :color="stat.color"
          />
        </div>

        <!-- Search & Filters -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <div class="flex flex-col lg:flex-row flex-wrap gap-3 sm:gap-4 items-stretch lg:items-center">
            
            <!-- Search -->
            <div class="flex-1 min-w-0 lg:min-w-[280px]">
              <div class="relative">
                <Search class="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by agent name, agency, phone or email..."
                  class="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 
                         rounded-xl sm:rounded-2xl 
                         border border-gray-200 
                         focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                         focus:outline-none text-sm sm:text-base
                         transition-colors"
                />
              </div>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:flex gap-3 sm:gap-4 w-full lg:w-auto">
              <select 
                v-model="cityFilter" 
                class="w-full lg:w-auto border border-gray-200 rounded-xl sm:rounded-2xl 
                       px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                       focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                       focus:outline-none text-sm sm:text-base bg-white min-h-[44px]"
              >
                <option value="">All Cities</option>
                <option value="Ilorin">Ilorin</option>
                <option value="Ijebu Ode">Ijebu Ode</option>
              </select>

              <select 
                v-model="statusFilter" 
                class="w-full lg:w-auto border border-gray-200 rounded-xl sm:rounded-2xl 
                       px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                       focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                       focus:outline-none text-sm sm:text-base bg-white min-h-[44px]"
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>

              <select 
                v-model="sortBy" 
                class="w-full lg:w-auto border border-gray-200 rounded-xl sm:rounded-2xl 
                       px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                       focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                       focus:outline-none text-sm sm:text-base bg-white min-h-[44px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="listings">Most Listings</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            <!-- Export Button -->
            <button 
              @click="exportData" 
              class="w-full sm:w-auto lg:w-auto
                     px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                     border border-[var(--royal-blue)] text-[var(--royal-blue)]
                     rounded-xl sm:rounded-2xl 
                     hover:bg-[var(--royal-blue)] hover:text-white
                     flex items-center justify-center gap-2 
                     text-sm sm:text-base font-medium
                     transition-colors duration-200
                     min-h-[44px]"
            >
              <Download class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <!-- Bulk Actions -->
        <BulkActionToolbar
          v-if="selectedAgents.length > 0"
          :count="selectedAgents.length"
          @approve="bulkApprove"
          @suspend="bulkSuspend"
          @delete="bulkDelete"
        />

        <!-- Agents Table -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <AgentTable
              :agents="filteredAgents"
              :loading="loading"
              @view="openAgentDrawer"
              @edit="editAgent"
              v-model:selected="selectedAgents"
            />
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 sm:mt-8">
          <Pagination
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="changePage"
          />
        </div>
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