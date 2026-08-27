<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navbar -->
      <div class="bg-[var(--white)] border-b px-8 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Dashboard</h1>
        </div>
        <button
          type="button"
          @click="refreshAll"
          class="px-6 py-3 bg-[var(--royal-blue)] text-[var(--white)] rounded-2xl hover:bg-[var(--medium-blue)] transition-all flex items-center gap-2"
        >
          Refresh All
        </button>
      </div>

      <div class="flex-1 overflow-auto p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Welcome -->
          <div class="mb-10">
            <h1 class="md:text-4xl text-2xl font-bold text-[var(--royal-blue)]">
              Welcome back, {{ adminProfile.full_name }} 👋
            </h1>
            <p class="text-[var(--royal-blue)] mt-2">
              Managing {{ adminProfile.city }}, {{ adminProfile.state }} State
            </p>
          </div>

          <!-- Clickable Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 text-[var(--royal-blue)] text-sm">
            <button
              type="button"
              class="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)]"
              @click="goTo('/admin/properties')"
            >
              <StatsCard
                title="Total Properties"
                :value="stats.totalProperties"
                :icon="Building2"
                :trend="getTrend(stats.totalProperties, 1243)"
                color="royal-blue"
              />
            </button>

            <button
              type="button"
              class="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)]"
              @click="goTo('/admin/agents')"
            >
              <StatsCard
                title="Active Agents"
                :value="stats.activeAgents"
                :icon="Users"
                :trend="getTrend(stats.activeAgents, 87)"
                color="bright-green"
              />
            </button>

            <button
              type="button"
              class="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)]"
              @click="goTo('/admin/verifications')"
            >
              <StatsCard
                title="Pending Verifications"
                :value="stats.pendingVerifications"
                :icon="ShieldCheck"
                :trend="getTrend(stats.pendingVerifications, 12)"
                color="periwinkle"
              />
            </button>

            <button
              type="button"
              class="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)]"
              @click="goTo('/admin/customers')"
            >
              <StatsCard
                title="Customers"
                :value="stats.customers"
                :icon="UserRound"
                :trend="getTrend(stats.customers)"
                color="medium-blue"
              />
            </button>

            <button
              type="button"
              class="text-left rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)]"
              @click="goTo('/admin/payments')"
            >
              <StatsCard
                title="Inspection Payments"
                :value="stats.inspectionPayments"
                :icon="ClipboardCheck"
                :trend="getTrend(stats.inspectionPayments)"
                color="steel-blue"
              />
            </button>
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-7 bg-[var(--white)] rounded-3xl p-6 shadow-sm">
              <RecentRequestsTable
                ref="recentRequestsRef"
                :key="requestsRefreshKey"
                :admin-state="adminProfile.state"
              />
            </div>

            <div class="lg:col-span-5 bg-[var(--white)] rounded-3xl p-6 shadow-sm">
              <PendingVerifications :key="verificationsRefreshKey" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Building2, Users, ShieldCheck, UserRound, ClipboardCheck } from 'lucide-vue-next'
import StatsCard from '@/components/admin/StatsCard.vue'
import RecentRequestsTable from '@/components/admin/RecentRequestsTable.vue'
import PendingVerifications from '@/components/admin/PendingVerifications.vue'

const router = useRouter()

const adminProfile = ref({
  full_name: 'Loading...',
  city: '',
  state: ''
})

const stats = ref({
  totalProperties: 0,
  activeAgents: 0,
  pendingVerifications: 0,
  customers: 0,
  inspectionPayments: 0
})

const recentRequestsRef = ref(null)
const requestsRefreshKey = ref(0)
const verificationsRefreshKey = ref(0)

const goTo = (path) => {
  router.push(path)
}

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
    const { count: propCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })

    const { count: agentCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent')

    const { count: pendingCount } = await supabase
      .from('agent_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending')

    const { count: custCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')

    const { count: inspectionCount } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('payment_type', 'inspection_fee')
      .eq('status', 'success')

    stats.value = {
      totalProperties: propCount || 0,
      activeAgents: agentCount || 0,
      pendingVerifications: pendingCount || 0,
      customers: custCount || 0,
      inspectionPayments: inspectionCount || 0
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

const refreshAll = async () => {
  await fetchAdminProfile()
  await fetchAllStats()
  // Force child remount / refetch
  requestsRefreshKey.value += 1
  verificationsRefreshKey.value += 1
  // If child exposes refresh()
  recentRequestsRef.value?.refresh?.()
}

onMounted(async () => {
  await fetchAdminProfile()
  await fetchAllStats()
})
</script>