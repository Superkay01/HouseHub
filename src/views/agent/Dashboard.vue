<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    
    <!-- Responsive Sidebar -->
    <AgentSidebar ref="sidebarRef" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      
      <!-- Top Navbar -->
      <AgentNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Dashboard Content -->
      <div class="flex-1 overflow-auto p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-dark-gray">
              Welcome back, {{ userProfile.full_name || 'Agent' }} 👋
            </h1>
            <p class="text-medium-gray mt-1 text-lg">
              Here's what's happening with your properties today
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard 
              title="Total Properties" 
              :value="stats.totalProperties" 
              icon="🏠" 
              trend="+3 this month"
              color="royal-blue"
            />
            <StatsCard 
              title="Active Listings" 
              :value="stats.activeListings" 
              icon="📌" 
              trend="+2"
              color="bright-green"
            />
            <StatsCard 
              title="New Requests" 
              :value="stats.newRequests" 
              icon="👥" 
              trend="+12"
              color="periwinkle"
            />
            <StatsCard 
              title="Scheduled Inspections" 
              :value="stats.inspections" 
              icon="📅" 
              trend="4 today"
              color="medium-blue"
            />
          </div>

          <!-- Property Performance Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Chart -->
            <div class="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-dark-gray">Property Performance</h2>
                <div class="flex gap-2 text-sm">
                  <button class="px-4 py-1.5 rounded-xl bg-[var(--royal-blue)] text-white">This Month</button>
                  <button class="px-4 py-1.5 rounded-xl hover:bg-gray-100">This Year</button>
                </div>
              </div>
              <AnalyticsChart />
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <h2 class="text-xl font-semibold mb-6">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-4">
                <button class="p-6 rounded-2xl border border-dashed border-[var(--royal-blue)] hover:bg-[var(--light-blue)] transition-all text-center">
                  <Plus class="w-10 h-10 mx-auto mb-3 text-[var(--royal-blue)]" />
                  <div class="font-medium text-[var(--royal-blue)]">Add Property</div>
                </button>
                <button class="p-6 rounded-2xl border border-dashed border-[var(--royal-blue)] hover:bg-[var(--light-blue)] transition-all text-center">
                  <Camera class="w-10 h-10 mx-auto mb-3 text-[var(--royal-blue)]" />
                  <div class="font-medium text-[var(--royal-blue)]">Upload Photos</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Camera, Plus } from 'lucide-vue-next'

// Components
import AgentSidebar from '@/components/agent/AgentSidebar.vue'
import AgentNavbar from '@/components/agent/AgentNavbar.vue'
import StatsCard from '@/components/agent/StatsCard.vue'
import AnalyticsChart from '@/components/agent/AnalyticsChart.vue'

const sidebarRef = ref(null)

const userProfile = ref({
  full_name: 'Loading...'
})

const stats = ref({
  totalProperties: 0,
  activeListings: 0,
  newRequests: 0,
  inspections: 0
})

const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (profile) userProfile.value = profile

    // Fetch Stats (You can expand this later)
    const { count: totalProps } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('listed_by', user.id)

    const { count: activeProps } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('listed_by', user.id)
      .eq('status', 'approved')

    stats.value.totalProperties = totalProps || 0
    stats.value.activeListings = activeProps || 0

  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}

const toggleSidebar = () => {
  sidebarRef.value?.toggleSidebar()
}

onMounted(() => {
  fetchDashboardData()
})
</script>