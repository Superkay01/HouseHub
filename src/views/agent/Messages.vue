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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Messages</h1>
          <p class="text-[var(--medium-gray)] mt-1">
            Chat with your State Admin about assigned requests
          </p>
        </div>
        <button
          @click="fetchChats"
          :disabled="loading"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] disabled:opacity-60"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <!-- CHAT LIST (full width) -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div class="p-4 border-b border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by property or request..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none text-sm"
          />
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="loading && chats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
            Loading chats...
          </div>

          <div v-else-if="filteredChats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
            No conversations yet.<br />
            Open a request and click “Message Admin”.
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
                  {{ chat.property_title || 'Property Request' }}
                </p>
                <p class="text-sm text-[var(--medium-gray)] truncate mt-0.5">
                  Request: {{ chat.request_code || chat.request_id?.slice(0, 8) }}
                </p>
                <p class="text-xs text-[var(--medium-gray)] mt-1 line-clamp-1">
                  {{ chat.last_message || 'No messages yet' }}
                </p>
              </div>

              <div class="flex flex-col items-end gap-1 shrink-0">
                <span
                  v-if="chat.unread"
                  class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  New
                </span>
                <span class="text-[10px] text-[var(--medium-gray)]">
                  {{ formatTime(chat.updated_at) }}
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

const chats = ref([])
const searchQuery = ref('')
const loading = ref(false)
const currentUserId = ref(null)
const isRealtimeConnected = ref(false)

let chatsChannel = null

// ===================== COMPUTED =====================
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const q = searchQuery.value.toLowerCase()
  return chats.value.filter(
    (c) =>
      c.property_title?.toLowerCase().includes(q) ||
      c.request_code?.toLowerCase().includes(q) ||
      c.last_message?.toLowerCase().includes(q)
  )
})

// ===================== HELPERS =====================
const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
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
      tag: chatId || 'agent-chat'
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

// ===================== DATA =====================
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  currentUserId.value = user?.id || null
}

const fetchChats = async () => {
  if (!currentUserId.value) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('property_chats')
      .select(`
        id,
        request_id,
        property_id,
        property_state,
        status,
        ai_enabled,
        created_at,
        updated_at,
        properties:properties (id, title),
        property_requests:property_requests (id, request_code)
      `)
      .eq('user_id', currentUserId.value)
      .not('request_id', 'is', null)
      .order('updated_at', { ascending: false })

    if (error) throw error

    const chatsWithPreview = await Promise.all(
      (data || []).map(async (chat) => {
        const { data: lastMsg } = await supabase
          .from('property_chat_messages')
          .select('content, created_at, sender_type')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        return {
          ...chat,
          property_title: chat.properties?.title || 'Property',
          request_code: chat.property_requests?.request_code,
          last_message: lastMsg?.content || '',
          updated_at: lastMsg?.created_at || chat.updated_at,
          unread: lastMsg?.sender_type === 'admin' || lastMsg?.sender_type === 'ai'
        }
      })
    )

    chats.value = chatsWithPreview
  } catch (err) {
    console.error('Failed to fetch chats:', err)
  } finally {
    loading.value = false
  }
}

// Navigate to detail page
const openChat = (chat) => {
  router.push({
    name: 'AgentChatDetail',
    params: { id: chat.id }
  })
}

// ===================== REALTIME =====================
const setupRealtime = () => {
  if (chatsChannel) supabase.removeChannel(chatsChannel)

  chatsChannel = supabase
    .channel('agent-chats-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'property_chat_messages' },
      async (payload) => {
        const newMsg = payload.new
        if (newMsg.sender_id === currentUserId.value) return

        await fetchChats()

        const chat = chats.value.find(c => c.id === newMsg.chat_id)
        if (!chat) return

        const title = newMsg.sender_type === 'admin' ? 'New message from Admin' : 'New message from AI'
        showNotification(
          title,
          `${chat.property_title}: ${newMsg.content.substring(0, 60)}...`,
          newMsg.chat_id
        )
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
  await getCurrentUser()
  await fetchChats()
  await requestNotificationPermission()
  setupRealtime()
})

onUnmounted(() => {
  if (chatsChannel) supabase.removeChannel(chatsChannel)
})
</script>