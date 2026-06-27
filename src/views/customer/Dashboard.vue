<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    
    <!-- Sidebar -->
    <CustomerSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      
      <!-- Top Navbar -->
      <CustomerNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Dashboard Content -->
      <div class="flex-1 overflow-auto p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header -->
          <div class="mb-10">
            <h1 class="text-4xl font-bold text-dark-gray">
              Welcome back, {{ userProfile.full_name || 'Ade' }} 👋
            </h1>
            <p class="text-medium-gray mt-2 text-lg">
              Find your next home and manage your property requests
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                        <StatsCard
                        title="Saved Properties"
                        :value="12"
                        :icon="House"
                        trend="+2 this week"
                        color="royal-blue"
                        />
                        <StatsCard
                        title="Active Requests"
                        :value="5"
                        :icon="Notebook"
                        trend="2 Pending"
                        color="periwinkle"
                        />
                        <StatsCard
                        title="Scheduled Inspections"
                        :value="2"
                        :icon="Calendar"
                        trend="Tomorrow"
                        color="bright-green"
                        />
                       <StatsCard 
                        title="Notifications" 
                        :value="8" 
                        :icon="Bell" 
                        trend="3 unread"
                        color="medium-blue"
                        />
                        </div>
          </div>

          <!-- Recommended Properties -->
          <div class="mb-12">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-dark-gray">Recommended for You</h2>
              <button class="text-[var(--royal-blue)] font-medium hover:underline">Browse All →</button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <!-- Add PropertyCard components here -->
            </div>
          </div>

          <!-- My Requests -->
          <div>
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-2xl font-semibold text-dark-gray">My Requests</h2>
              <button class="text-[var(--royal-blue)] font-medium">View All →</button>
            </div>
            <RequestsTable />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

// Components
import CustomerSidebar from '@/components/customer/CustomerSidebar.vue'
import CustomerNavbar from '@/components/customer/CustomerNavbar.vue'
import StatsCard from '@/components/customer/StatsCard.vue'
import RequestsTable from '@/components/customer/RequestsTable.vue'

const sidebarRef = ref(null)

const userProfile = ref({
  full_name: 'Loading...'
})

const stats = ref({
  savedProperties: 12,
  activeRequests: 5,
  inspections: 2,
  notifications: 8
})

const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (profile) userProfile.value = profile

  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const toggleSidebar = () => {
  sidebarRef.value?.toggleSidebar()
}

onMounted(() => {
  fetchDashboardData()
})
</script>