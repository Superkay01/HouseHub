<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <!-- ===================== CHAT LIST ===================== -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
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
              @click="selectChat(chat)"
              class="p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'bg-[var(--light-blue)]': selectedChat?.id === chat.id }"
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

        <!-- ===================== CHAT WINDOW ===================== -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <!-- Empty state -->
          <div
            v-if="!selectedChat"
            class="flex-1 flex items-center justify-center text-[var(--medium-gray)]"
          >
            <div class="text-center">
              <div class="text-5xl mb-3">💬</div>
              <p class="text-lg font-medium">Select a conversation</p>
              <p class="text-sm mt-1">Choose a request chat from the left</p>
            </div>
          </div>

          <!-- Active chat -->
          <template v-else>
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <h2 class="font-bold text-[var(--dark-gray)] truncate">
                  {{ selectedChat.property_title }}
                </h2>
                <p class="text-sm text-[var(--medium-gray)] truncate">
                  Request {{ selectedChat.request_code || selectedChat.request_id?.slice(0, 8) }}
                  • {{ selectedChat.property_state }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-medium px-3 py-1 rounded-full"
                  :class="selectedChat.ai_enabled ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ selectedChat.ai_enabled ? 'AI Active' : 'Admin Handling' }}
                </span>
              </div>
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
              <div v-if="loadingMessages" class="text-center text-[var(--medium-gray)] py-8">
                Loading messages...
              </div>

              <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex"
                :class="msg.sender_type === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[75%] rounded-2xl px-4 py-3 text-sm"
                  :class="messageBubble(msg.sender_type)"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                      {{ senderLabel(msg.sender_type) }}
                    </span>
                    <span class="text-[10px] opacity-50">
                      {{ formatTime(msg.created_at) }}
                    </span>
                  </div>
                  <p class="whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
                </div>
              </div>

              <div v-if="aiTyping" class="flex justify-start">
                <div class="bg-white border shadow-sm rounded-2xl px-4 py-3 text-sm text-gray-500">
                  <span class="animate-pulse">AI is typing...</span>
                </div>
              </div>
            </div>

            <!-- Input -->
            <div class="p-4 border-t border-gray-100">
              <div class="flex gap-3">
                <input
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Type your message to Admin / AI..."
                  class="flex-1 px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none"
                  :disabled="sending || aiTyping"
                />
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim() || sending || aiTyping"
                  class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] disabled:opacity-50"
                >
                  {{ sending ? '...' : 'Send' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const router = useRouter()

const chats = ref([])
const selectedChat = ref(null)
const messages = ref([])
const newMessage = ref('')
const searchQuery = ref('')
const loading = ref(false)
const loadingMessages = ref(false)
const sending = ref(false)
const aiTyping = ref(false)
const messagesContainer = ref(null)
const currentUserId = ref(null)
const isRealtimeConnected = ref(false)

let chatsChannel = null
let messagesChannel = null

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
const senderLabel = (type) => {
  if (type === 'admin') return 'Admin'
  if (type === 'ai') return 'AI Assistant'
  if (type === 'system') return 'System'
  return 'You'
}

const messageBubble = (type) => {
  if (type === 'user') return 'bg-[var(--royal-blue)] text-white'
  if (type === 'ai' || type === 'system') return 'bg-[var(--light-blue)] text-[var(--royal-blue)]'
  return 'bg-green-100 text-green-800 border border-green-200'
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

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
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

    const chatIdFromUrl = route.query.chat
    if (chatIdFromUrl) {
      const found = chatsWithPreview.find(c => c.id === chatIdFromUrl)
      if (found) selectChat(found)
    }
  } catch (err) {
    console.error('Failed to fetch chats:', err)
  } finally {
    loading.value = false
  }
}

const fetchMessages = async (chatId) => {
  loadingMessages.value = true
  try {
    const { data, error } = await supabase
      .from('property_chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) throw error
    messages.value = data || []
    await scrollToBottom()
  } catch (err) {
    console.error(err)
  } finally {
    loadingMessages.value = false
  }
}

const selectChat = async (chat) => {
  selectedChat.value = chat
  newMessage.value = ''
  await fetchMessages(chat.id)
  subscribeToMessages(chat.id)
  router.replace({ query: { chat: chat.id } })
}

// ===================== SEND + AI =====================
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value || sending.value) return

  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''

  messages.value.push({
    id: crypto.randomUUID(),
    content,
    sender_type: 'user',
    created_at: new Date().toISOString()
  })
  await scrollToBottom()

  try {
    const { error } = await supabase.from('property_chat_messages').insert({
      chat_id: selectedChat.value.id,
      sender_id: currentUserId.value,
      sender_type: 'user',
      content
    })
    if (error) throw error

    if (selectedChat.value.ai_enabled) {
      await generateAIReply(content)
    }
  } catch (err) {
    console.error(err)
    alert('Failed to send message')
  } finally {
    sending.value = false
  }
}

const generateAIReply = async (userQuestion) => {
  if (!selectedChat.value?.ai_enabled) return

  aiTyping.value = true
  await scrollToBottom()

  try {
    const { error } = await supabase.functions.invoke('generate-property-chat-reply', {
      body: {
        chat_id: selectedChat.value.id,
        property: { title: selectedChat.value.property_title },
        user_question: userQuestion,
        is_agent_request_chat: true
      }
    })
    if (error) throw error
    await fetchMessages(selectedChat.value.id)
  } catch (err) {
    console.error('AI error:', err)
    await supabase.from('property_chat_messages').insert({
      chat_id: selectedChat.value.id,
      sender_type: 'ai',
      content: "I'm here to help. The State Admin will also see this conversation and can join anytime."
    })
    await fetchMessages(selectedChat.value.id)
  } finally {
    aiTyping.value = false
  }
}

// ===================== REALTIME =====================
const subscribeToMessages = (chatId) => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
    messagesChannel = null
  }

  messagesChannel = supabase
    .channel(`agent-messages-${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'property_chat_messages',
        filter: `chat_id=eq.${chatId}`
      },
      (payload) => {
        const newMsg = payload.new
        if (messages.value.some(m => m.id === newMsg.id)) return

        messages.value.push(newMsg)
        scrollToBottom()

        if (newMsg.sender_type === 'admin' || newMsg.sender_type === 'ai') {
          showNotification(
            newMsg.sender_type === 'admin' ? 'New message from Admin' : 'New message from AI',
            newMsg.content.substring(0, 90),
            chatId
          )
        }
      }
    )
    .subscribe()
}

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

        if (selectedChat.value?.id === newMsg.chat_id) return

        const chat = chats.value.find(c => c.id === newMsg.chat_id)
        if (!chat) return

        const title = newMsg.sender_type === 'admin' ? 'New message from Admin' : 'New message from AI'
        showNotification(title, `${chat.property_title}: ${newMsg.content.substring(0, 60)}...`, newMsg.chat_id)
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
  if (messagesChannel) supabase.removeChannel(messagesChannel)
})
</script>