<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-auto p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header -->
          <div class="mb-8 md:mb-10">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-gray">
              Welcome back, {{ userProfile.full_name || 'Customer' }} 👋
            </h1>
            <p class="text-medium-gray mt-2 text-sm sm:text-base md:text-lg">
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

          <!-- Stats Cards (clickable) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 md:mb-12">
            <button
              type="button"
              class="text-left"
              @click="router.push('/customer/saved/SavedProperties')"
            >
              <StatsCard
                title="Saved Properties"
                :value="stats.savedProperties"
                :icon="House"
                trend="View saved homes"
                color="royal-blue"
              />
            </button>

            <button
              type="button"
              class="text-left"
              @click="router.push('/customer/request')"
            >
              <StatsCard
                title="Active Requests"
                :value="stats.activeRequests"
                :icon="Notebook"
                trend="View requests"
                color="periwinkle"
              />
            </button>

            <button
              type="button"
              class="text-left"
              @click="router.push('/customer/inspections')"
            >
              <StatsCard
                title="Scheduled Inspections"
                :value="stats.inspections"
                :icon="Calendar"
                trend="View inspections"
                color="bright-green"
              />
            </button>

            <button
              type="button"
              class="text-left"
              @click="router.push('/customer/notifications')"
            >
              <StatsCard
                title="Notifications"
                :value="stats.notifications"
                :icon="Bell"
                :trend="`${stats.unreadNotifications} unread`"
                color="medium-blue"
              />
            </button>
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

    // Saved properties
    const { count: savedCount } = await supabase
      .from('saved_properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Active requests (pending / accepted / scheduled)
    const { count: requestCount } = await supabase
      .from('property_requests')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .in('status', ['pending', 'accepted', 'scheduled'])

    // Scheduled inspections
    const { count: inspectionCount } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .in('status', ['scheduled', 'confirmed', 'accepted', 'pending'])

    // Notifications
    const { count: notifCount } = await supabase
      .from('customer_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)

    const { count: unreadCount } = await supabase
      .from('customer_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', user.id)
      .eq('is_read', false)

    stats.value.savedProperties = savedCount || 0
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