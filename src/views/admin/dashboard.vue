<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navbar -->
      <div class="bg-[var(--white)] border-b px-8 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Dashboard</h1>
        </div>
        <button 
          @click="refreshAll"
          class="px-6 py-3 bg-[var(--royal-blue)] text-[var(--white)] rounded-2xl hover:bg-[var(--medium-blue)] transition-all flex items-center gap-2">
          Refresh All
        </button>
      </div>

      <!-- Dashboard Content -->
      <div class="flex-1 overflow-auto p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header -->
          <div class="mb-10">
            <h1 class="md:text-4xl text-2xl font-bold text-[var(--royal-blue)]">
              Welcome back, {{ adminProfile.full_name }} 👋
            </h1>
            <p class="text-[var(--royal-blue)] mt-2">
              Managing {{ adminProfile.city }}, {{ adminProfile.state }} State
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard 
              title="Total Properties" 
              :value="stats.totalProperties" 
              :icon="Building2" 
              :trend="getTrend(stats.totalProperties, 1243)"
              color="royal-blue"
            />
            <StatsCard 
              title="Active Agents" 
              :value="stats.activeAgents" 
              :icon="Users" 
              :trend="getTrend(stats.activeAgents, 87)"
              color="bright-green"
            />
            <StatsCard 
              title="Pending Verifications" 
              :value="stats.pendingVerifications" 
              :icon="ShieldCheck" 
              :trend="getTrend(stats.pendingVerifications, 12)"
              color="periwinkle"
            />
            <StatsCard 
              title="Customers" 
              :value="stats.customers" 
              :icon="UserRound" 
              :trend="getTrend(stats.customers)"
              color="medium-blue"
            />
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-7 bg-[var(--white)] rounded-3xl p-6 shadow-sm">
              <RecentRequestsTable />
            </div>

            <div class="lg:col-span-5 bg-[var(--white)] rounded-3xl p-6 shadow-sm">
              <PendingVerifications />
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

// Lucide Icons
import { Building2, Users, ShieldCheck, UserRound } from 'lucide-vue-next'

// Components
import StatsCard from '@/components/admin/StatsCard.vue'
import RecentRequestsTable from '@/components/admin/RecentRequestsTable.vue'
import PendingVerifications from '@/components/admin/PendingVerifications.vue'

const adminProfile = ref({
  full_name: 'Loading...',
  city: '',
  state: ''
})

const stats = ref({
  totalProperties: 0,
  activeAgents: 0,
  pendingVerifications: 0,
  customers: 0
})

const fetchAdminProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('admin_profiles')
      .select('full_name, city, state')
      .eq('id', user.id)
      .single()

    if (data) adminProfile.value = data
  } catch (err) {
    console.error('Profile fetch error:', err)
  }
}

const fetchAllStats = async () => {
  try {
    // Total Properties
    const { count: propCount } = await supabase
      .from('properties').select('*', { count: 'exact', head: true })

    // Active Agents
    const { count: agentCount } = await supabase
      .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agent')

    // Pending Verifications
    const { count: pendingCount } = await supabase
      .from('agent_verifications').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')

    // Customers
    const { count: custCount } = await supabase
      .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer')

    stats.value = {
      totalProperties: propCount || 0,
      activeAgents: agentCount || 0,
      pendingVerifications: pendingCount || 0,
      customers: custCount || 0
    }
  } catch (err) {
    console.error('Stats fetch error:', err)
  }
}

const getTrend = (current, base) => {
  if (!current || !base) return '+0'
  const diff = current - base
  return diff >= 0 ? `+${diff}` : `${diff}`
}

const refreshAll = () => {
  fetchAllStats()
}

onMounted(() => {
  fetchAdminProfile()
  fetchAllStats()
})
</script>