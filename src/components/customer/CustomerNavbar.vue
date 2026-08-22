<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between">
    
    <!-- Left Side: Hamburger + Search -->
    <div class="flex items-center gap-4">
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu class="w-7 h-7 text-gray-700" />
      </button>

      <div class="relative hidden sm:block w-80 lg:w-96">
        <input 
          type="text"
          placeholder="Search homes in Ilorin & Ijebu Ode..."
          class="w-full bg-gray-100 border border-transparent focus:border-[var(--royal-blue)] rounded-2xl py-3 pl-12 text-sm focus:outline-none transition-all"
        />
        <Search class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-4 md:gap-6">
      
      <!-- Notifications -->
      <div class="relative" ref="notifWrapper">
        <button
          @click.stop="toggleNotifDropdown"
          class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Bell class="w-6 h-6 text-gray-600" />
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
              to="/customer/notifications"
              @click="showNotifDropdown = false"
              class="block text-center text-sm font-medium text-[var(--royal-blue)] py-2 rounded-xl hover:bg-gray-50"
            >
              View all notifications
            </router-link>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <MessageCircle class="w-6 h-6 text-gray-600" />
      </button>

      <!-- User Profile with Dropdown -->
      <div class="relative" ref="profileWrapper">
        <div 
          @click.stop="toggleDropdown"
          class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all"
        >
          <div class="text-right hidden sm:block">
            <p class="font-semibold text-dark-gray text-sm">{{ userProfile.full_name || 'Customer' }}</p>
            <p class="text-xs text-medium-gray">Renter</p>
          </div>
          
          <div class="relative">
            <img 
              :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Customer')}&background=0025cc&color=fff`"
              alt="Profile"
              class="w-9 h-9 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--bright-green)] border-2 border-white rounded-full"></div>
          </div>
        </div>

        <div 
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
        >
          <div class="px-4 py-3 border-b">
            <div class="flex items-center gap-3">
              <img 
                :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Customer')}&background=0025cc&color=fff`"
                class="w-11 h-11 rounded-2xl"
              />
              <div>
                <p class="font-semibold">{{ userProfile.full_name }}</p>
                <p class="text-xs text-medium-gray">Renter</p>
              </div>
            </div>
          </div>

          <div class="py-2">
            <router-link
              to="/customer/settings"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              ⚙️ Settings
            </router-link>
            <router-link
              to="/customer/saved/SavedProperties"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              ❤️ Saved Properties
            </router-link>
            <router-link
              to="/customer/request"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              📋 My Requests
            </router-link>
            <router-link
              to="/customer/inspections"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              🏠 My Inspections
            </router-link>
            <router-link
              to="/customer/notifications"
              @click="showDropdown = false"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              🔔 Notifications
            </router-link>
          </div>

          <div class="border-t pt-2">
            <button 
              @click="logout"
              class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
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
import { Menu, Bell, MessageCircle, Search } from 'lucide-vue-next'
import { useCustomerNotifications } from '@/composables/useCustomerNotifications'
import { playNotificationSound } from '@/utils/notificationSound'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()

const userProfile = ref({
  full_name: '',
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
} = useCustomerNotifications()

const typeIcon = (type) => {
  const map = {
    inspection_update: '🏠',
    request_update: '📋',
    report_ready: '📄',
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
        .select('full_name, avatar_url')
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
      .from('customer_notifications')
      .select('*')
      .eq('customer_id', user.id)
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

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const markAsRead = async (id) => {
  await supabase
    .from('customer_notifications')
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
    .from('customer_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('customer_id', user.id)
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

  // Route to the related section
  if (item.related_type === 'inspection' && item.related_id) {
    router.push('/customer/inspections')
    // If you later have detail page:
    // router.push(`/customer/inspections/${item.related_id}`)
  } else if (item.related_type === 'property_request' && item.related_id) {
    router.push(`/customer/requests/${item.related_id}`)
  } else if (item.related_type === 'payment') {
    router.push('/customer/request')
  } else if (item.related_type === 'report') {
    router.push('/customer/inspections')
  } else if (item.property_id) {
    router.push(`/customer/properties/${item.property_id}`)
  } else {
    router.push('/customer/notifications')
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