<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between relative">
    
    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <!-- Hamburger -->
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Search -->
      <!-- <div class="relative hidden md:block w-96">
        <input 
          type="text"
          placeholder="Search properties, agents, or customers..."
          class="w-full bg-gray-100 border border-transparent focus:border-[var(--royal-blue)] rounded-2xl py-3 pl-12 text-sm focus:outline-none transition-all"
        />
        <Search class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
      </div> -->
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-4 sm:gap-6">
      
      <!-- ================= NOTIFICATIONS ================= -->
      <div class="relative" ref="notificationRef">
        <button 
          @click="toggleNotifications"
          class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Bell class="w-6 h-6 text-gray-600" />
          <span 
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-medium"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>

        <!-- Dropdown -->
        <div 
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-semibold text-[var(--royal-blue)] text-sm">
              Notifications
            </h3>
            <button 
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-[var(--royal-blue)] hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <!-- List -->
          <div class="max-h-80 overflow-y-auto">
            <div v-if="loadingNotifications" class="py-10 text-center text-sm text-[var(--steel-blue)]">
              Loading...
            </div>

            <div v-else-if="notifications.length === 0" class="py-10 text-center text-sm text-[var(--steel-blue)]">
              No new notifications
            </div>

            <button
              v-for="item in notifications"
              :key="item.id"
              @click="handleNotificationClick(item)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              :class="{ 'bg-[var(--royal-blue)]/5': !item.is_read }"
            >
              <div class="flex gap-3">
                <div 
                  class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                  :class="item.iconBg"
                >
                  {{ item.icon }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-[var(--royal-blue)] line-clamp-1">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-[var(--steel-blue)] mt-0.5 line-clamp-2">
                    {{ item.message }}
                  </p>
                  <p class="text-[10px] text-[var(--steel-blue)] mt-1">
                    {{ formatRelativeTime(item.created_at) }}
                  </p>
                </div>
                <div 
                  v-if="!item.is_read"
                  class="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"
                ></div>
              </div>
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-3 border-t border-gray-100 text-center">
            <router-link 
              to="/admin/support"
              @click="showNotifications = false"
              class="text-sm font-medium text-[var(--royal-blue)] hover:underline"
            >
              View all support tickets
            </router-link>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <MessageCircle class="w-6 h-6 text-gray-600" />
      </button>

      <!-- Admin Profile -->
      <div class="flex items-center gap-3 cursor-pointer" @click="toggleDropdown">
        <div class="text-right hidden sm:block">
          <p class="font-semibold text-dark-gray text-sm">{{ adminProfile.full_name }}</p>
          <p class="text-xs text-medium-gray">
            {{ adminProfile.role === 'head_admin' ? 'Head Admin' : 'State Admin' }}
          </p>
        </div>
        
        <div class="relative">
          <img 
            :src="adminProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile.full_name || 'Admin')}&background=0025cc&color=fff`"
            alt="Profile"
            class="w-9 h-9 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--bright-green)] border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Bell, MessageCircle, Search } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()

const adminProfile = ref({
  full_name: 'Loading...',
  role: '',
  avatar_url: ''
})

const showDropdown = ref(false)
const showNotifications = ref(false)
const loadingNotifications = ref(false)
const notifications = ref([])
const notificationRef = ref(null)

// Store which tickets the admin has already "seen"
const seenTicketIds = ref(new Set())

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

const fetchAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('admin_profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  if (data) adminProfile.value = data
}

const fetchNotifications = async () => {
  loadingNotifications.value = true
  try {
    // Get recent open / in_progress support tickets
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        id,
        subject,
        message,
        role,
        category,
        status,
        created_at,
        user_id
      `)
      .in('status', ['open', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(15)

    if (error) throw error

    // Load seen ids from localStorage
    const saved = localStorage.getItem('admin_seen_tickets')
    if (saved) {
      seenTicketIds.value = new Set(JSON.parse(saved))
    }

    notifications.value = (data || []).map(ticket => ({
      id: ticket.id,
      title: ticket.role === 'agent' ? 'New Agent Ticket' : 'New Customer Ticket',
      message: ticket.subject,
      created_at: ticket.created_at,
      is_read: seenTicketIds.value.has(ticket.id),
      icon: ticket.role === 'agent' ? '🧑‍💼' : '👤',
      iconBg: ticket.role === 'agent' 
        ? 'bg-blue-50 text-[var(--royal-blue)]' 
        : 'bg-purple-50 text-purple-600',
      type: 'support_ticket',
      raw: ticket
    }))
  } catch (err) {
    console.error('Failed to load notifications:', err)
  } finally {
    loadingNotifications.value = false
  }
}

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value
  showDropdown.value = false

  if (showNotifications.value) {
    await fetchNotifications()
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.is_read = true
    seenTicketIds.value.add(n.id)
  })
  localStorage.setItem(
    'admin_seen_tickets',
    JSON.stringify([...seenTicketIds.value])
  )
}

const handleNotificationClick = (item) => {
  // Mark as read
  item.is_read = true
  seenTicketIds.value.add(item.id)
  localStorage.setItem(
    'admin_seen_tickets',
    JSON.stringify([...seenTicketIds.value])
  )

  showNotifications.value = false

  // Go to support tickets page
  router.push('/admin/support-tickets')
}

const formatRelativeTime = (date) => {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (notificationRef.value && !notificationRef.value.contains(e.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  fetchAdminProfile()
  fetchNotifications() // load badge count on mount
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>