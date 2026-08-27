<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header -->
          <div class="mb-6 md:mb-10">
            <h1 class="text-xl sm:text-2xl md:text-4xl font-bold text-[var(--royal-blue)]">
              Welcome back, {{ userProfile.full_name || 'Customer' }} 👋
            </h1>
            <p class="text-[var(--steel-blue)] mt-1.5 text-sm sm:text-base md:text-lg">
              Find your next home and manage your property requests
            </p>
            <div class="flex items-center gap-3 mt-2">
              <span class="inline-flex items-center gap-2 text-xs text-green-600">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
              <span v-if="lastUpdated" class="text-xs text-gray-400">
                Updated {{ lastUpdated }}
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mb-6 md:mb-8">
            <h2 class="text-sm font-semibold text-[var(--steel-blue)] mb-3 uppercase tracking-wide">
              What would you like to do?
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-100 shadow-sm px-3 py-3.5 text-sm font-medium text-dark-gray active:scale-[0.98] transition hover:bg-gray-50"
                @click="router.push('/customer/request')"
              >
                <Notebook class="w-4 h-4 text-[var(--periwinkle)] shrink-0" />
                <span class="truncate md:text-sm text-xs">New request</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-100 shadow-sm px-3 py-3.5 text-sm font-medium text-dark-gray active:scale-[0.98] transition hover:bg-gray-50"
                @click="router.push('/customer/saved/SavedProperties')"
              >
                <House class="w-4 h-4 text-[var(--royal-blue)] shrink-0" />
                <span class="truncate md:text-sm text-xs">Saved homes</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-100 shadow-sm px-3 py-3.5 text-sm font-medium text-dark-gray active:scale-[0.98] transition hover:bg-gray-50"
                @click="router.push('/customer/browse')"
              >
                <House class="w-4 h-4 text-[var(--royal-blue)] shrink-0" />
                <span class="truncate md:text-sm text-xs">Browse Properties</span>
              </button>
            </div>
          </div>

          <!-- Stats / Your activity -->
          <div class="mb-8 md:mb-12">
            <h2 class="text-sm font-semibold text-[var(--steel-blue)] mb-3 uppercase tracking-wide">
              Your activity
            </h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              <button
                type="button"
                class="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-royal-blue rounded-xl"
                @click="router.push('/customer/saved/SavedProperties')"
              >
                <StatsCard
                  title="Saved"
                  :value="stats.savedProperties"
                  :icon="House"
                  trend="View saved"
                  color="royal-blue"
                  compact
                />
              </button>

              <button
                type="button"
                class="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-royal-blue rounded-xl"
                @click="router.push('/customer/browse')"
              >
                <StatsCard
                  title="Properties"
                  :value="stats.approvedProperties"
                  :icon="House"
                  trend="View properties"
                  color="royal-blue"
                  compact
                />
              </button>

              <button
                type="button"
                class="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-periwinkle rounded-xl"
                @click="router.push('/customer/request')"
              >
                <StatsCard
                  title="Requests"
                  :value="stats.activeRequests"
                  :icon="Notebook"
                  trend="View all"
                  color="periwinkle"
                  compact
                />
              </button>

              <button
                type="button"
                class="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bright-green rounded-xl"
                @click="router.push('/customer/inspections')"
              >
                <StatsCard
                  title="Inspections"
                  :value="stats.inspections"
                  :icon="Calendar"
                  trend="View schedule"
                  color="bright-green"
                  compact
                />
              </button>

              <button
                type="button"
                class="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-medium-blue rounded-xl"
                @click="router.push('/customer/notifications')"
              >
                <StatsCard
                  title="Alerts"
                  :value="stats.notifications"
                  :icon="Bell"
                  :trend="stats.unreadNotifications ? `${stats.unreadNotifications} unread` : 'View all'"
                  color="medium-blue"
                  compact
                />
              </button>
            </div>
          </div>

          <!-- Recommended Properties section stays here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import StatsCard from '@/components/customer/StatsCard.vue'
import { Bell, Calendar, Notebook, House } from 'lucide-vue-next'

const router = useRouter()

const userProfile = ref({ full_name: 'Loading...' })
const lastUpdated = ref('')
const customerId = ref(null)

const stats = ref({
  savedProperties: 0,
  approvedProperties: 0,
  activeRequests: 0,
  inspections: 0,
  notifications: 0,
  unreadNotifications: 0
})

let channel = null
let refreshTimer = null

const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    customerId.value = user.id

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (profile) userProfile.value = profile

    const { count: savedCount } = await supabase
      .from('saved_properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { count: requestCount } = await supabase
      .from('property_requests')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .in('status', ['pending', 'accepted', 'scheduled'])

    const { count: inspectionCount } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .in('status', ['scheduled', 'confirmed', 'accepted', 'pending'])

    const { count: notifCount } = await supabase
      .from('customer_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)

    const { count: unreadCount } = await supabase
      .from('customer_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .eq('is_read', false)

    // Total approved / published listings (for browse)
    // Change 'approved' if your DB uses 'active', 'published', etc.
    const { count: approvedCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    stats.value.savedProperties = savedCount || 0
    stats.value.approvedProperties = approvedCount || 0
    stats.value.activeRequests = requestCount || 0
    stats.value.inspections = inspectionCount || 0
    stats.value.notifications = notifCount || 0
    stats.value.unreadNotifications = unreadCount || 0

    lastUpdated.value = new Date().toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    console.error('Error fetching customer dashboard:', error)
  }
}

const queueRefresh = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    fetchDashboardData()
  }, 400)
}

const setupRealtime = (userId) => {
  channel = supabase
    .channel(`customer-dashboard-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'saved_properties', filter: `user_id=eq.${userId}` },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'property_requests', filter: `customer_id=eq.${userId}` },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'inspections', filter: `customer_id=eq.${userId}` },
      () => queueRefresh()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'customer_notifications', filter: `customer_id=eq.${userId}` },
      () => queueRefresh()
    )
    // No customer_id filter — listings are global
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => queueRefresh()
    )
    .subscribe((status) => {
      console.log('Customer dashboard realtime:', status)
    })
}

onMounted(async () => {
  await fetchDashboardData()
  if (customerId.value) setupRealtime(customerId.value)
})

onBeforeUnmount(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
  if (channel) supabase.removeChannel(channel)
})
</script>