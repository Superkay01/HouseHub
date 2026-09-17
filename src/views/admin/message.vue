<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Realtime Status -->
      <div class="flex items-center gap-2 mb-4 text-sm">
        <span
          class="w-2.5 h-2.5 rounded-full"
          :class="isRealtimeConnected ? 'bg-green-500' : 'bg-red-400'"
        ></span>
        <span class="text-[var(--medium-gray)]">
          {{ isRealtimeConnected ? 'Realtime connected' : 'Connecting...' }}
        </span>
      </div>

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Chats</h1>
          <p class="text-[var(--medium-gray)] mt-1">
            {{ adminState ? `Showing chats for ${adminState}` : 'Loading your state...' }}
          </p>
        </div>

        <button
          @click="refreshChats"
          :disabled="loading"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] disabled:opacity-60"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <!-- TABS -->
      <div class="flex gap-2 mb-6">
        <button
          @click="activeTab = 'customers'"
          class="px-6 py-2.5 rounded-2xl font-medium transition"
          :class="activeTab === 'customers'
            ? 'bg-[var(--royal-blue)] text-white'
            : 'bg-white text-[var(--royal-blue)] border'"
        >
          Customers
          <span
            v-if="customerUnread > 0"
            class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ customerUnread }}
          </span>
        </button>

        <button
          @click="activeTab = 'agents'"
          class="px-6 py-2.5 rounded-2xl font-medium transition"
          :class="activeTab === 'agents'
            ? 'bg-[var(--royal-blue)] text-white'
            : 'bg-white text-[var(--royal-blue)] border'"
        >
          Agents
          <span
            v-if="agentUnread > 0"
            class="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ agentUnread }}
          </span>
        </button>
      </div>

      <!-- CHAT LIST (full width) -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-260px)]">
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="activeTab === 'customers' ? 'Search customer chats...' : 'Search agent chats...'"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none text-sm"
          />
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="loading && currentChats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
            Loading chats...
          </div>

          <div v-else-if="filteredChats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
            No {{ activeTab }} chats found
          </div>

          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            @click="openChat(chat)"
            class="p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-[var(--dark-gray)] truncate">
                  {{ activeTab === 'customers' ? (chat.customer_name || 'Customer') : (chat.agent_name || 'Agent') }}
                </p>
                <p class="text-sm text-[var(--royal-blue)] truncate mt-0.5">
                  {{ chat.property_title || 'Property' }}
                </p>
                <p class="text-xs text-[var(--medium-gray)] mt-1 line-clamp-1">
                  {{ chat.last_message || 'No messages yet' }}
                </p>
              </div>

              <div class="flex flex-col items-end gap-1 shrink-0">
                <span
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  :class="statusBadge(chat.status)"
                >
                  {{ formatStatus(chat.status) }}
                </span>
                <span class="text-[10px] text-[var(--medium-gray)]">
                  {{ formatTime(chat.updated_at || chat.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router = useRouter()

const activeTab = ref('customers')
const chats = ref([])
const agentChats = ref([])
const searchQuery = ref('')
const loading = ref(false)
const adminState = ref(null)
const currentAdminId = ref(null)
const isRealtimeConnected = ref(false)

let chatsChannel = null

// ===================== COMPUTED =====================
const currentChats = computed(() =>
  activeTab.value === 'customers' ? chats.value : agentChats.value
)

const filteredChats = computed(() => {
  if (!searchQuery.value) return currentChats.value
  const q = searchQuery.value.toLowerCase()
  return currentChats.value.filter(c =>
    (c.customer_name || c.agent_name || '').toLowerCase().includes(q) ||
    (c.property_title || '').toLowerCase().includes(q) ||
    (c.last_message || '').toLowerCase().includes(q)
  )
})

const customerUnread = computed(() => chats.value.filter(c => c.has_unread).length)
const agentUnread = computed(() => agentChats.value.filter(c => c.has_unread).length)

// ===================== HELPERS =====================
const formatStatus = (status) => {
  if (status === 'admin_handling') return 'Admin'
  return 'AI'
}

const statusBadge = (status) => {
  if (status === 'admin_handling') return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

// ===================== NOTIFICATIONS =====================
const showNotification = (title, body, chatId = null) => {
  if (document.visibilityState === 'visible') return
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: chatId || 'househub-chat'
    })
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

// ===================== CORE =====================
const getCurrentAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  currentAdminId.value = user.id

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('state')
    .eq('id', user.id)
    .maybeSingle()

  adminState.value = profile?.state || null
}

const fetchCustomerChats = async () => {
  if (!adminState.value) return

  const { data, error } = await supabase
    .from('property_chats')
    .select(`
      id, status, assigned_to, user_id, property_id, property_state,
      created_at, updated_at,
      properties (id, title)
    `)
    .eq('property_state', adminState.value)
    .is('request_id', null)
    .order('updated_at', { ascending: false })

  if (error) throw error

  chats.value = await Promise.all((data || []).map(async (chat) => {
    const { data: lastMsg } = await supabase
      .from('property_chat_messages')
      .select('content, created_at, sender_type')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let customerName = 'Customer'
    if (chat.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', chat.user_id)
        .maybeSingle()
      customerName = profile?.full_name || profile?.email || 'Customer'
    }

    return {
      ...chat,
      customer_name: customerName,
      property_title: chat.properties?.title || 'Property',
      last_message: lastMsg?.content || '',
      updated_at: lastMsg?.created_at || chat.updated_at,
      has_unread: lastMsg?.sender_type === 'user'
    }
  }))
}

const fetchAgentChats = async () => {
  if (!adminState.value) return

  const { data, error } = await supabase
    .from('property_chats')
    .select(`
      id, status, assigned_to, user_id, property_id, property_state, request_id,
      created_at, updated_at,
      properties (id, title),
      property_requests (id, request_code)
    `)
    .eq('property_state', adminState.value)
    .not('request_id', 'is', null)
    .order('updated_at', { ascending: false })

  if (error) throw error

  agentChats.value = await Promise.all((data || []).map(async (chat) => {
    const { data: lastMsg } = await supabase
      .from('property_chat_messages')
      .select('content, created_at, sender_type')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let agentName = 'Agent'
    if (chat.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', chat.user_id)
        .maybeSingle()
      agentName = profile?.full_name || profile?.email || 'Agent'
    }

    return {
      ...chat,
      agent_name: agentName,
      property_title: chat.properties?.title || 'Property',
      request_code: chat.property_requests?.request_code,
      last_message: lastMsg?.content || '',
      updated_at: lastMsg?.created_at || chat.updated_at,
      has_unread: lastMsg?.sender_type === 'user'
    }
  }))
}

const fetchChats = async () => {
  loading.value = true
  try {
    await Promise.all([fetchCustomerChats(), fetchAgentChats()])
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const refreshChats = () => fetchChats()

// Navigate to the detail page
const openChat = (chat) => {
  router.push({
    name: 'ChatDetail',
    params: { id: chat.id },
    query: { type: activeTab.value } // 'customers' or 'agents'
  })
}

// ===================== REALTIME =====================
const setupRealtime = () => {
  if (chatsChannel) supabase.removeChannel(chatsChannel)

  chatsChannel = supabase
    .channel('admin-chats-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'property_chat_messages' },
      async (payload) => {
        const newMsg = payload.new
        if (newMsg.sender_id === currentAdminId.value) return

        await fetchChats()

        const allChats = [...chats.value, ...agentChats.value]
        const chat = allChats.find(c => c.id === newMsg.chat_id)
        if (!chat) return

        const isAgentChat = !!chat.request_id
        const title = isAgentChat ? 'New message from Agent' : 'New message from Customer'
        const name = isAgentChat ? (chat.agent_name || 'Agent') : (chat.customer_name || 'Customer')

        showNotification(title, `${name}: ${newMsg.content.substring(0, 70)}...`, newMsg.chat_id)
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'property_chats' },
      () => fetchChats()
    )
    .subscribe((status) => {
      isRealtimeConnected.value = status === 'SUBSCRIBED'
    })
}

onMounted(async () => {
  await getCurrentAdmin()
  if (adminState.value) await fetchChats()
  await requestNotificationPermission()
  setupRealtime()
})

onUnmounted(() => {
  if (chatsChannel) supabase.removeChannel(chatsChannel)
})
</script>