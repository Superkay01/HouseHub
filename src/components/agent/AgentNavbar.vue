<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between">
    
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

const notifWrapper = ref(null)
const profileWrapper = ref(null)

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

  if (item.related_type === 'inspection') {
    router.push('/agent/inspections')
  } else if (item.related_type === 'property_request') {
    router.push('/agent/requests')
  } else if (item.related_type === 'property') {
    router.push('/agent/properties')
  } else if (item.related_type === 'review') {
    router.push('/agent/reviews')
  } else {
    router.push('/agent/notifications')
  }
}

const logout = async () => {
  stopNotificationListener()
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
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopNotificationListener()
  document.removeEventListener('click', handleClickOutside)
})
</script>