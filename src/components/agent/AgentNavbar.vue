<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between relative">
    
    <!-- Left Side: Hamburger + Search -->
    <div class="flex items-center gap-4">
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="relative hidden sm:block w-80 lg:w-96">
        <input 
          type="text"
          placeholder="Search properties, tenants, or requests..."
          class="w-full bg-gray-100 border border-transparent focus:border-[var(--royal-blue)] rounded-2xl py-3 pl-12 text-sm focus:outline-none transition-all"
        />
        <span class="absolute left-4 top-3.5 text-gray-400">🔍</span>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-4 md:gap-6">
      
      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <!-- Notifications -->
      <div class="relative" ref="notifWrapper">
        <button
          @click.stop="toggleNotifDropdown"
          class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div
          v-if="showNotifDropdown"
          class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
        >
          <div class="px-4 py-3 border-b flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-[var(--royal-blue)] hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div class="max-h-96 overflow-y-auto">
            <div v-if="loadingNotifications" class="p-6 text-center text-sm text-gray-500">
              Loading...
            </div>

            <div v-else-if="recentNotifications.length === 0" class="p-8 text-center">
              <p class="text-2xl mb-2">🔔</p>
              <p class="text-sm text-gray-500">No notifications yet</p>
            </div>

            <button
              v-for="item in recentNotifications"
              :key="item.id"
              @click="openNotification(item)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition"
              :class="!item.is_read ? 'bg-[#f0f7ff]' : ''"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  :class="!item.is_read ? 'bg-[var(--royal-blue)] text-white' : 'bg-gray-100'"
                >
                  {{ typeIcon(item.type) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">{{ item.message }}</p>
                  <p class="text-[10px] text-gray-400 mt-1">{{ formatTime(item.created_at) }}</p>
                </div>
                <span
                  v-if="!item.is_read"
                  class="w-2 h-2 rounded-full bg-[var(--royal-blue)] mt-1.5 flex-shrink-0"
                />
              </div>
            </button>
          </div>

          <div class="p-2 border-t">
            <router-link
              to="/agent/notifications"
              @click="showNotifDropdown = false"
              class="block text-center text-sm font-medium text-[var(--royal-blue)] py-2 rounded-xl hover:bg-gray-50"
            >
              View all notifications
            </router-link>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="relative" ref="profileWrapper">
        <div 
          @click.stop="toggleDropdown"
          class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all"
        >
          <div class="text-right hidden sm:block">
            <p class="font-semibold text-dark-gray text-sm">{{ userProfile.full_name || 'Agent' }}</p>
            <p class="text-xs text-medium-gray">
              {{ userProfile.role === 'agent' ? 'Property Agent' : '' }}
            </p>
          </div>
          
          <div class="relative">
            <img 
              :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Agent')}&background=0025cc&color=fff`"
              alt="Profile"
              class="w-9 h-9 rounded-2xl object-cover border-2 border-[var(--royal-blue)] shadow-sm"
            />
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--bright-green)] border-2 border-white rounded-full"></div>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div 
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
        >
          <div class="px-4 py-2 border-b">
            <div class="flex items-center gap-3">
              <img 
                :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Agent')}&background=0025cc&color=fff`"
                class="w-11 h-11 rounded-2xl object-cover border-2 border-[var(--royal-blue)] shadow-sm"
              />
              <div>
                <p class="font-semibold text-xs md:text-sm text-[var(--royal-blue)]">{{ userProfile.full_name }}</p>
                <p class="text-xs text-[var(--royal-blue)]">
                  {{ userProfile.role === 'agent' ? 'Property Agent' : '' }}
                </p>
              </div>
            </div>
          </div>

          <div class="py-2">
            <router-link
              to="/agent/profile-settings"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              👤 Profile Settings
            </router-link>
            <router-link
              to="/agent/notifications"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              🔔 Notifications
            </router-link>
            <router-link
              to="/agent/properties"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              🏢 My Properties
            </router-link>
            <router-link
              to="/agent/requests"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              📋 Requests
            </router-link>
            <router-link
              to="/agent/inspections"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              🏠 Inspections
            </router-link>
            <router-link
              to="/agent/help-support"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 text-xs md:text-sm text-[var(--royal-blue)]"
            >
              ❓ Help & Support
            </router-link>
          </div>

          <div class="border-t pt-2">
            <button 
              @click="logout"
              class="w-full flex items-center gap-3 px-4 py-1 text-red-600 hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== NOTIFICATION POPUP (expires in 10 seconds) ========== -->
    <Transition name="notif-pop">
      <div
        v-if="popupNotification"
        class="fixed top-20 right-4 sm:right-6 z-[80] w-[calc(100%-2rem)] max-w-sm
               bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div class="p-4 sm:p-5">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-[var(--royal-blue)] text-white
                     flex items-center justify-center flex-shrink-0 text-lg"
            >
              {{ typeIcon(popupNotification.type) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-[var(--royal-blue)]">
                {{ popupNotification.title }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-1 leading-relaxed">
                {{ popupNotification.message }}
              </p>

              <div class="mt-3 rounded-xl bg-[var(--light-blue)] px-3 py-2.5">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-[var(--royal-blue)] mb-1">
                  What to do next
                </p>
                <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
                  {{ nextStepText(popupNotification) }}
                </p>
              </div>
            </div>

            <button
              @click="closePopup"
              class="text-[var(--steel-blue)] hover:text-[var(--royal-blue)] text-xl leading-none"
            >
              ×
            </button>
          </div>

          <!-- Progress bar: 10 seconds -->
          <div class="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-[var(--royal-blue)] popup-progress" />
          </div>

          <div class="mt-4 flex gap-2">
            <button
              @click="handlePopupAction"
              class="flex-1 py-2.5 rounded-xl bg-[var(--royal-blue)] text-white text-sm font-medium
                     hover:opacity-90 transition-opacity"
            >
              {{ actionLabel(popupNotification) }}
            </button>
            <button
              @click="closePopup"
              class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[var(--steel-blue)]
                     hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useRouter } from 'vue-router'
import { useAgentNotifications } from '@/composables/useAgentNotifications'

const router = useRouter()
const emit = defineEmits(['toggle-sidebar'])

const userProfile = ref({
  full_name: '',
  role: '',
  avatar_url: ''
})

const showDropdown = ref(false)
const showNotifDropdown = ref(false)
const loadingNotifications = ref(false)
const recentNotifications = ref([])
const popupNotification = ref(null)

const notifWrapper = ref(null)
const profileWrapper = ref(null)

let popupTimer = null
let notifChannel = null

const POPUP_DURATION_MS = 10000 // 10 seconds

const {
  unreadCount,
  startNotificationListener,
  stopNotificationListener,
  refreshUnreadCount,
} = useAgentNotifications()

const typeIcon = (type) => {
  const map = {
    inspection_update: '🏠',
    request_update: '📋',
    property_update: '🏢',
    review: '⭐',
    payment: '💳',
    system: 'ℹ️',
    general: '🔔',
  }
  return map[type] || '🔔'
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const nextStepText = (item) => {
  if (!item) return 'Open your notifications for more details.'

  const type = item.type || item.related_type

  if (type === 'inspection_update' || item.related_type === 'inspection') {
    return 'Go to Inspections to review the update, confirm timing, or update the inspection status.'
  }
  if (type === 'request_update' || item.related_type === 'property_request') {
    return 'Open Requests to review this customer request and respond if action is needed.'
  }
  if (type === 'property_update' || item.related_type === 'property') {
    return 'Open My Properties to review the listing update or approval status.'
  }
  if (type === 'review' || item.related_type === 'review') {
    return 'Open Reviews to see the latest feedback from a customer.'
  }
  if (type === 'payment' || item.related_type === 'payment') {
    return 'Check your payments or related request for the latest payment update.'
  }
  return 'Open Notifications for full details, then follow the related page.'
}

const actionLabel = (item) => {
  if (!item) return 'View'
  const type = item.type || item.related_type
  if (type === 'inspection_update' || item.related_type === 'inspection') return 'View Inspection'
  if (type === 'request_update' || item.related_type === 'property_request') return 'View Request'
  if (type === 'property_update' || item.related_type === 'property') return 'View Property'
  if (type === 'review' || item.related_type === 'review') return 'View Review'
  if (type === 'payment' || item.related_type === 'payment') return 'View Payment'
  return 'View Details'
}

const getNotificationRoute = (item) => {
  if (item.related_type === 'inspection') return '/agent/inspections'
  if (item.related_type === 'property_request') return '/agent/requests'
  if (item.related_type === 'property') return '/agent/properties'
  if (item.related_type === 'review') return '/agent/reviews'
  if (item.related_type === 'payment') return '/agent/requests'
  return '/agent/notifications'
}

const showNotificationPopup = (notification) => {
  popupNotification.value = notification

  if (popupTimer) clearTimeout(popupTimer)
  popupTimer = setTimeout(() => {
    popupNotification.value = null
  }, POPUP_DURATION_MS)
}

const closePopup = () => {
  popupNotification.value = null
  if (popupTimer) clearTimeout(popupTimer)
}

const handlePopupAction = async () => {
  const item = popupNotification.value
  if (!item) return

  if (!item.is_read) {
    await markAsRead(item.id)
  }

  const route = getNotificationRoute(item)
  closePopup()
  showNotifDropdown.value = false
  router.push(route)
}

const fetchUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, role, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) userProfile.value = data
    }
  } catch (error) {
    console.error(error)
  }
}

const fetchRecentNotifications = async () => {
  loadingNotifications.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('agent_notifications')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error
    recentNotifications.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingNotifications.value = false
  }
}

const toggleNotifDropdown = async () => {
  showDropdown.value = false
  showNotifDropdown.value = !showNotifDropdown.value
  if (showNotifDropdown.value) {
    await fetchRecentNotifications()
  }
}

const toggleDropdown = () => {
  showNotifDropdown.value = false
  showDropdown.value = !showDropdown.value
}

const markAsRead = async (id) => {
  await supabase
    .from('agent_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)

  const item = recentNotifications.value.find(n => n.id === id)
  if (item) item.is_read = true

  const { data: { user } } = await supabase.auth.getUser()
  if (user) await refreshUnreadCount(user.id)
}

const markAllAsRead = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('agent_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('agent_id', user.id)
    .eq('is_read', false)

  recentNotifications.value = recentNotifications.value.map(n => ({
    ...n,
    is_read: true,
  }))

  await refreshUnreadCount(user.id)
}

const openNotification = async (item) => {
  showNotifDropdown.value = false

  if (!item.is_read) {
    await markAsRead(item.id)
  }

  // Show popup with next-step guidance (expires in 10s)
  showNotificationPopup(item)
}

const listenForNewNotifications = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  notifChannel = supabase
    .channel(`agent-notif-popup-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_notifications',
        filter: `agent_id=eq.${user.id}`,
      },
      async (payload) => {
        const row = payload.new
        recentNotifications.value = [row, ...recentNotifications.value].slice(0, 8)
        showNotificationPopup(row)
        await refreshUnreadCount(user.id)
      }
    )
    .subscribe()
}

const logout = async () => {
  stopNotificationListener()
  if (notifChannel) supabase.removeChannel(notifChannel)
  await supabase.auth.signOut()
  router.push('/login')
}

const handleClickOutside = (e) => {
  if (notifWrapper.value && !notifWrapper.value.contains(e.target)) {
    showNotifDropdown.value = false
  }
  if (profileWrapper.value && !profileWrapper.value.contains(e.target)) {
    showDropdown.value = false
  }
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

onMounted(async () => {
  await fetchUserProfile()
  await startNotificationListener()
  await listenForNewNotifications()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopNotificationListener()
  if (notifChannel) supabase.removeChannel(notifChannel)
  document.removeEventListener('click', handleClickOutside)
  if (popupTimer) clearTimeout(popupTimer)
})
</script>

<style scoped>
.notif-pop-enter-active,
.notif-pop-leave-active {
  transition: all 0.3s ease;
}
.notif-pop-enter-from,
.notif-pop-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}

/* 10-second progress bar */
.popup-progress {
  width: 100%;
  animation: popupShrink 10s linear forwards;
}

@keyframes popupShrink {
  from { width: 100%; }
  to { width: 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .popup-progress {
    animation: none;
    width: 100%;
  }
}
</style>