<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-4 md:p-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Notifications
          </h1>
          <p class="text-[var(--medium-gray)] mt-2 max-w-xl">
            Stay updated on agent activity, property approvals, customer requests and inspections.
          </p>
          <p class="mt-2 text-sm font-medium text-[var(--royal-blue)]">
            {{ unreadCount }} unread notification{{ unreadCount === 1 ? '' : 's' }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            v-if="unreadCount > 0"
            type="button"
            :disabled="markingAll"
            @click="markAllAsRead"
            class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {{ markingAll ? 'Marking...' : 'Mark all as read' }}
          </button>

          <button
            type="button"
            :disabled="loading"
            @click="refresh"
            class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] transition disabled:opacity-50"
          >
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-[var(--light-blue)] flex items-center justify-center text-[var(--royal-blue)]">
              <Bell class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm text-[var(--medium-gray)]">Total</p>
              <p class="text-2xl md:text-3xl font-bold text-[var(--dark-gray)]">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <BellRing class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm text-[var(--medium-gray)]">Unread</p>
              <p class="text-2xl md:text-3xl font-bold text-blue-600">{{ stats.unread }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm text-[var(--medium-gray)]">Today</p>
              <p class="text-2xl md:text-3xl font-bold text-amber-600">{{ stats.today }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm text-[var(--medium-gray)]">Action Required</p>
              <p class="text-2xl md:text-3xl font-bold text-red-600">{{ stats.actionRequired }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-3xl p-5 md:p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search notifications..."
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
            />
          </div>

          <select
            v-model="typeFilter"
            class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Types</option>
            <option value="agent_verification">Agent Verification</option>
            <option value="agent_verification_resubmitted">Verification Resubmitted</option>
            <option value="property_approval">Property Approval</option>
            <option value="property_request">Property Request</option>
            <option value="request_accepted">Request Accepted</option>
            <option value="inspection_scheduled">Inspection Scheduled</option>
            <option value="inspection_completed">Inspection Completed</option>
            <option value="inspection_cancelled">Inspection Cancelled</option>
          </select>

          <select
            v-model="readFilter"
            class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          <select
            v-model="dateFilter"
            class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div v-if="hasActiveFilters" class="mt-4">
          <button
            type="button"
            @click="clearFilters"
            class="text-sm font-medium text-[var(--royal-blue)] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-white rounded-3xl p-10 text-center shadow-sm mb-8"
      >
        <div class="text-5xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-[var(--dark-gray)]">Unable to load notifications</h3>
        <p class="text-[var(--medium-gray)] mt-2">Something went wrong while loading your notifications.</p>
        <button
          type="button"
          @click="refresh"
          class="mt-6 px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl"
        >
          Try Again
        </button>
      </div>

      <!-- Loading skeletons -->
      <div v-else-if="loading && notifications.length === 0" class="space-y-4">
        <div
          v-for="n in 5"
          :key="n"
          class="bg-white rounded-3xl p-5 shadow-sm animate-pulse"
        >
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-200" />
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-1/3" />
              <div class="h-3 bg-gray-100 rounded w-2/3" />
              <div class="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!loading && filteredNotifications.length === 0"
        class="bg-white rounded-3xl p-16 text-center shadow-sm"
      >
        <div class="flex justify-center mb-4 text-[var(--royal-blue)]">
          <Bell class="w-14 h-14 opacity-60" />
        </div>
        <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">
          {{ hasActiveFilters ? 'No notifications match your filters' : 'No notifications yet' }}
        </h3>
        <p class="text-[var(--medium-gray)] mt-2 max-w-md mx-auto">
          {{
            hasActiveFilters
              ? 'Try adjusting or clearing your filters.'
              : "You're all caught up. New agent requests, property approvals and inspection updates will appear here."
          }}
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          @click="clearFilters"
          class="mt-6 px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl"
        >
          Clear Filters
        </button>
      </div>

      <!-- Notification list -->
      <div v-else class="space-y-3">
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="bg-white rounded-3xl shadow-sm border transition hover:shadow-md cursor-pointer"
          :class="item.is_read ? 'border-transparent' : 'border-blue-100 bg-blue-50/40'"
          @click="handleNotificationClick(item)"
        >
          <div class="p-4 md:p-5 flex gap-4">
            <!-- Icon -->
            <div
              class="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              :class="typeIconBg(item.type)"
            >
              <component :is="typeIcon(item.type)" class="w-5 h-5" :class="typeIconColor(item.type)" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h3
                      class="font-semibold text-[var(--dark-gray)] truncate"
                      :class="{ 'font-bold': !item.is_read }"
                    >
                      {{ item.title }}
                    </h3>
                    <span
                      v-if="!item.is_read"
                      class="shrink-0 w-2 h-2 rounded-full bg-[var(--royal-blue)]"
                    />
                  </div>

                  <p
                    class="text-sm mt-1 text-[var(--medium-gray)] line-clamp-2"
                    :class="{ 'text-[var(--dark-gray)] font-medium': !item.is_read }"
                  >
                    {{ item.message }}
                  </p>

                  <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--medium-gray)]">
                    <span class="capitalize">{{ formatType(item.type) }}</span>
                    <span>·</span>
                    <span>{{ formatRelativeTime(item.created_at) }}</span>
                    <span
                      v-if="!item.is_read"
                      class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"
                    >
                      Unread
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="relative shrink-0" @click.stop>
                  <button
                    type="button"
                    class="p-2 rounded-xl hover:bg-gray-100 text-[var(--medium-gray)]"
                    @click="toggleMenu(item.id)"
                  >
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <div
                    v-if="openMenuId === item.id"
                    class="absolute right-0 top-10 z-20 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2"
                  >
                    <button
                      v-if="!item.is_read"
                      type="button"
                      class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      @click="markAsRead(item)"
                    >
                      Mark as read
                    </button>
                    <button
                      v-else
                      type="button"
                      class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      @click="markAsUnread(item)"
                    >
                      Mark as unread
                    </button>
                    <button
                      type="button"
                      class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      @click="viewDetails(item)"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load more -->
        <div v-if="hasMore" class="pt-4 text-center">
          <button
            type="button"
            :disabled="loadingMore"
            @click="loadMore"
            class="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {{ loadingMore ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import {
  Bell,
  BellRing,
  Calendar,
  AlertCircle,
  Shield,
  RefreshCw,
  Home,
  ClipboardList,
  CheckCircle,
  CalendarCheck,
  BadgeCheck,
  CalendarX,
  MoreVertical
} from 'lucide-vue-next'

const router = useRouter()

const PAGE_SIZE = 30

const notifications = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const markingAll = ref(false)
const openMenuId = ref(null)
const hasMore = ref(true)
const currentUserId = ref(null)

const searchQuery = ref('')
const typeFilter = ref('')
const readFilter = ref('')
const dateFilter = ref('')

let channel = null

/* ---------------------------------
   COMPUTED
---------------------------------- */

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.is_read).length
)

const stats = computed(() => {
  const list = notifications.value
  const now = new Date()

  return {
    total: list.length,
    unread: list.filter(n => !n.is_read).length,
    today: list.filter(n => isSameDay(n.created_at, now)).length,
    actionRequired: list.filter(n =>
      !n.is_read &&
      ['agent_verification', 'agent_verification_resubmitted', 'property_approval', 'property_request'].includes(n.type)
    ).length
  }
})

const hasActiveFilters = computed(() =>
  !!(searchQuery.value || typeFilter.value || readFilter.value || dateFilter.value)
)

const filteredNotifications = computed(() => {
  let result = [...notifications.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(n =>
      n.title?.toLowerCase().includes(term) ||
      n.message?.toLowerCase().includes(term) ||
      n.type?.toLowerCase().includes(term)
    )
  }

  if (typeFilter.value) {
    result = result.filter(n => n.type === typeFilter.value)
  }

  if (readFilter.value === 'unread') {
    result = result.filter(n => !n.is_read)
  } else if (readFilter.value === 'read') {
    result = result.filter(n => n.is_read)
  }

  if (dateFilter.value) {
    const now = new Date()
    result = result.filter(n => {
      const d = new Date(n.created_at)
      if (dateFilter.value === 'today') return isSameDay(d, now)
      if (dateFilter.value === 'yesterday') {
        const y = new Date(now)
        y.setDate(y.getDate() - 1)
        return isSameDay(d, y)
      }
      if (dateFilter.value === 'week') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      }
      if (dateFilter.value === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return true
    })
  }

  return result
})

/* ---------------------------------
   HELPERS
---------------------------------- */

const isSameDay = (a, b) => {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return d1.toDateString() === d2.toDateString()
}

const formatRelativeTime = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatType = (type) => {
  if (!type) return 'Notification'
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const typeIcon = (type) => {
  const map = {
    agent_verification: Shield,
    agent_verification_resubmitted: RefreshCw,
    property_approval: Home,
    property_request: ClipboardList,
    request_accepted: CheckCircle,
    inspection_scheduled: CalendarCheck,
    inspection_completed: BadgeCheck,
    inspection_cancelled: CalendarX
  }
  return map[type] || Bell
}

const typeIconBg = (type) => {
  const map = {
    agent_verification: 'bg-blue-50',
    agent_verification_resubmitted: 'bg-purple-50',
    property_approval: 'bg-orange-50',
    property_request: 'bg-indigo-50',
    request_accepted: 'bg-green-50',
    inspection_scheduled: 'bg-blue-50',
    inspection_completed: 'bg-emerald-50',
    inspection_cancelled: 'bg-red-50'
  }
  return map[type] || 'bg-gray-100'
}

const typeIconColor = (type) => {
  const map = {
    agent_verification: 'text-blue-600',
    agent_verification_resubmitted: 'text-purple-600',
    property_approval: 'text-orange-600',
    property_request: 'text-indigo-600',
    request_accepted: 'text-green-600',
    inspection_scheduled: 'text-blue-600',
    inspection_completed: 'text-emerald-600',
    inspection_cancelled: 'text-red-600'
  }
  return map[type] || 'text-gray-500'
}

/* ---------------------------------
   DATA
---------------------------------- */

const fetchNotifications = async (append = false) => {
  if (!append) {
    loading.value = true
    error.value = null
  } else {
    loadingMore.value = true
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    currentUserId.value = user.id

    const from = append ? notifications.value.length : 0
    const to = from + PAGE_SIZE - 1

    const { data, error: fetchError } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('admin_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (fetchError) throw fetchError

    if (append) {
      const existingIds = new Set(notifications.value.map(n => n.id))
      const newOnes = (data || []).filter(n => !existingIds.has(n.id))
      notifications.value = [...notifications.value, ...newOnes]
    } else {
      notifications.value = data || []
    }

    hasMore.value = (data || []).length === PAGE_SIZE
  } catch (err) {
    console.error('Failed to load notifications:', err)
    error.value = true
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const refresh = () => fetchNotifications(false)
const loadMore = () => fetchNotifications(true)

const clearFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  readFilter.value = ''
  dateFilter.value = ''
}

/* ---------------------------------
   ACTIONS
---------------------------------- */

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const markAsRead = async (item) => {
  if (item.is_read || !currentUserId.value) return
  openMenuId.value = null

  try {
    const { error: updateError } = await supabase
      .from('admin_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', item.id)
      .eq('admin_id', currentUserId.value)

    if (updateError) throw updateError

    item.is_read = true
    item.read_at = new Date().toISOString()
  } catch (err) {
    console.error(err)
    alert('Unable to mark as read')
  }
}

const markAsUnread = async (item) => {
  if (!item.is_read || !currentUserId.value) return
  openMenuId.value = null

  try {
    const { error: updateError } = await supabase
      .from('admin_notifications')
      .update({
        is_read: false,
        read_at: null
      })
      .eq('id', item.id)
      .eq('admin_id', currentUserId.value)

    if (updateError) throw updateError

    item.is_read = false
    item.read_at = null
  } catch (err) {
    console.error(err)
    alert('Unable to mark as unread')
  }
}

const markAllAsRead = async () => {
  if (unreadCount.value === 0 || !currentUserId.value) return

  const confirmed = window.confirm('Mark all notifications as read?')
  if (!confirmed) return

  markingAll.value = true
  try {
    const { error: updateError } = await supabase
      .from('admin_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('admin_id', currentUserId.value)
      .eq('is_read', false)

    if (updateError) throw updateError

    notifications.value = notifications.value.map(n => ({
      ...n,
      is_read: true,
      read_at: n.read_at || new Date().toISOString()
    }))
  } catch (err) {
    console.error(err)
    alert('Unable to mark all as read')
  } finally {
    markingAll.value = false
  }
}

/**
 * Routes match your actual router:
 * - verifications
 * - properties
 * - requests
 * - Inspections (capital I)
 *
 * Detail views are drawers, so we pass ?id=...
 * and the list page should open the matching drawer.
 */
const getRouteForNotification = (item) => {
  switch (item.type) {
    case 'agent_verification':
    case 'agent_verification_resubmitted':
      return {
        path: '/admin/dashboard/verifications',
        query: item.agent_id ? { id: item.agent_id } : {}
      }

    case 'property_approval':
      return {
        path: '/admin/dashboard/properties',
        query: item.property_id ? { id: item.property_id } : {}
      }

    case 'property_request':
    case 'request_accepted':
      return {
        path: '/admin/dashboard/requests',
        query: item.request_id ? { id: item.request_id } : {}
      }

    case 'inspection_scheduled':
    case 'inspection_completed':
    case 'inspection_cancelled':
      return {
        path: '/admin/dashboard/Inspections',
        query: item.inspection_id ? { id: item.inspection_id } : {}
      }

    default:
      return { path: '/admin/dashboard/notifications' }
  }
}

const viewDetails = (item) => {
  openMenuId.value = null
  const route = getRouteForNotification(item)
  if (route) router.push(route)
}

const handleNotificationClick = async (item) => {
  openMenuId.value = null
  if (!item.is_read) await markAsRead(item)
  viewDetails(item)
}

/* ---------------------------------
   REALTIME
---------------------------------- */

const setupRealtime = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  currentUserId.value = user.id

  if (channel) await supabase.removeChannel(channel)

  channel = supabase
    .channel(`admin-notifications-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_notifications',
        filter: `admin_id=eq.${user.id}`
      },
      (payload) => {
        const row = payload.new
        if (!row || row.admin_id !== user.id) return

        const exists = notifications.value.some(n => n.id === row.id)
        if (exists) return

        notifications.value = [row, ...notifications.value]
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'admin_notifications',
        filter: `admin_id=eq.${user.id}`
      },
      (payload) => {
        const row = payload.new
        if (!row) return

        const idx = notifications.value.findIndex(n => n.id === row.id)
        if (idx !== -1) {
          notifications.value[idx] = { ...notifications.value[idx], ...row }
        }
      }
    )
    .subscribe()
}

/* ---------------------------------
   LIFECYCLE
---------------------------------- */

const closeMenuOnOutside = (e) => {
  if (!e.target.closest('.relative')) {
    openMenuId.value = null
  }
}

onMounted(async () => {
  await fetchNotifications()
  await setupRealtime()
  document.addEventListener('click', closeMenuOnOutside)
})

onUnmounted(async () => {
  document.removeEventListener('click', closeMenuOnOutside)
  if (channel) await supabase.removeChannel(channel)
})
</script>