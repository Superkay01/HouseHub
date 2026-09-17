<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-4xl mx-auto p-4 md:p-6 h-screen flex flex-col">
      <!-- Back button -->
      <div class="mb-4">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-[var(--royal-blue)] font-medium hover:underline"
        >
          ← Back to messages
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col flex-1">
        <!-- Loading -->
        <div v-if="loadingChat" class="flex-1 flex items-center justify-center text-[var(--medium-gray)]">
          Loading chat...
        </div>

        <div v-else-if="!chat" class="flex-1 flex items-center justify-center text-[var(--medium-gray)]">
          Chat not found
        </div>

        <template v-else>
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-bold text-[var(--dark-gray)] truncate">
                {{ chat.property_title }}
              </h2>
              <p class="text-sm text-[var(--medium-gray)] truncate">
                Request {{ chat.request_code || chat.request_id?.slice(0, 8) }}
                • {{ chat.property_state }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="text-xs font-medium px-3 py-1 rounded-full"
                :class="chat.ai_enabled ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ chat.ai_enabled ? 'AI Active' : 'Admin Handling' }}
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
                placeholder="Type your message to Admin..."
                class="flex-1 px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] placeholder-[var(--steel-blue)] text-[var(--royal-blue)] focus:outline-none"
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const router = useRouter()

const chat = ref(null)
const messages = ref([])
const newMessage = ref('')
const loadingChat = ref(true)
const loadingMessages = ref(false)
const sending = ref(false)
const aiTyping = ref(false)
const messagesContainer = ref(null)
const currentUserId = ref(null)

let messagesChannel = null

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

// ===================== DATA =====================
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  currentUserId.value = user?.id || null
}

const fetchChat = async (chatId) => {
  loadingChat.value = true
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
      .eq('id', chatId)
      .single()

    if (error) throw error

    chat.value = {
      ...data,
      property_title: data.properties?.title || 'Property',
      request_code: data.property_requests?.request_code
    }
  } catch (err) {
    console.error(err)
    chat.value = null
  } finally {
    loadingChat.value = false
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

// ===================== SEND + AI =====================
const sendMessage = async () => {
  if (!newMessage.value.trim() || !chat.value || sending.value) return

  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''

  // Optimistic UI
  messages.value.push({
    id: crypto.randomUUID(),
    content,
    sender_type: 'user',
    created_at: new Date().toISOString()
  })
  await scrollToBottom()

  try {
    const { error } = await supabase.from('property_chat_messages').insert({
      chat_id: chat.value.id,
      sender_id: currentUserId.value,
      sender_type: 'user',
      content
    })
    if (error) throw error

    if (chat.value.ai_enabled) {
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
  if (!chat.value?.ai_enabled) return

  aiTyping.value = true
  await scrollToBottom()

  try {
    const { error } = await supabase.functions.invoke('generate-property-chat-reply', {
      body: {
        chat_id: chat.value.id,
        property: { title: chat.value.property_title },
        user_question: userQuestion,
        is_agent_request_chat: true
      }
    })
    if (error) throw error
    await fetchMessages(chat.value.id)
  } catch (err) {
    console.error('AI error:', err)
    await supabase.from('property_chat_messages').insert({
      chat_id: chat.value.id,
      sender_type: 'ai',
      content: "I'm here to help. The State Admin will also see this conversation and can join anytime."
    })
    await fetchMessages(chat.value.id)
  } finally {
    aiTyping.value = false
  }
}

const goBack = () => {
  router.push({ name: 'AgentMessages' }) // adjust name to match your router
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

// ===================== LIFECYCLE =====================
watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return
    await fetchChat(newId)
    await fetchMessages(newId)
    subscribeToMessages(newId)
  },
  { immediate: true }
)

onMounted(async () => {
  await getCurrentUser()
})

onUnmounted(() => {
  if (messagesChannel) supabase.removeChannel(messagesChannel)
})
</script>