<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-4xl mx-auto p-4 md:p-6 h-screen flex flex-col">
      <!-- Back button -->
      <div class="mb-4">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-[var(--royal-blue)] font-medium hover:underline"
        >
          ← Back to chats
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col flex-1">
        <!-- Loading / Error -->
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
                {{ isAgentChat ? (chat.agent_name || 'Agent') : (chat.customer_name || 'Customer') }}
              </h2>
              <p class="text-sm text-[var(--royal-blue)] truncate">
                {{ chat.property_title }}
                <span v-if="chat.request_code"> • {{ chat.request_code }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span
                class="text-xs font-medium px-3 py-1 rounded-full"
                :class="statusBadge(chat.status)"
              >
                {{ formatStatus(chat.status) }}
              </span>

              <button
                v-if="chat.status !== 'admin_handling'"
                @click="takeOver"
                class="px-4 py-2 bg-[var(--royal-blue)] text-white text-sm rounded-xl hover:bg-[var(--medium-blue)]"
              >
                Take Over
              </button>

              <button
                v-else
                @click="releaseToAI"
                class="px-4 py-2 bg-gray-100 text-[var(--dark-gray)] text-sm rounded-xl hover:bg-gray-200"
              >
                Release to AI
              </button>
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
              :class="messageAlignment(msg.sender_type)"
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
          </div>

          <!-- Input -->
          <div class="p-4 border-t border-gray-100">
            <div
              v-if="chat.status === 'ai_handling' || !chat.status"
              class="mb-3 text-xs text-center text-[var(--medium-gray)] bg-[var(--light-blue)] rounded-xl py-2"
            >
              AI is handling this chat. Click <strong>Take Over</strong> to reply as Admin.
            </div>

            <div class="flex gap-3">
              <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                :placeholder="isAgentChat ? 'Reply to agent...' : 'Reply to customer...'"
                class="flex-1 px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none"
              />
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || sending"
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
const messagesContainer = ref(null)
const currentAdminId = ref(null)

let messagesChannel = null

const isAgentChat = computed(() => !!chat.value?.request_id)

// ===================== HELPERS =====================
const formatStatus = (status) => {
  if (status === 'admin_handling') return 'Admin'
  return 'AI'
}

const statusBadge = (status) => {
  if (status === 'admin_handling') return 'bg-blue-100 text-blue-700'
  return 'bg-green-100 text-green-700'
}

const senderLabel = (type) => {
  if (type === 'admin') return 'You'
  if (type === 'ai') return 'AI'
  if (type === 'system') return 'System'
  if (type === 'user' && isAgentChat.value) return 'Agent'
  return 'Customer'
}

const messageAlignment = (type) => {
  return (type === 'user' || type === 'customer') ? 'justify-start' : 'justify-end'
}

const messageBubble = (type) => {
  if (type === 'user' || type === 'customer') return 'bg-gray-100 text-[var(--dark-gray)]'
  if (type === 'ai' || type === 'system') return 'bg-[var(--light-blue)] text-[var(--royal-blue)]'
  return 'bg-[var(--royal-blue)] text-white'
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ===================== CORE =====================
const getCurrentAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) currentAdminId.value = user.id
}

const fetchChat = async (chatId) => {
  loadingChat.value = true
  try {
    const { data, error } = await supabase
      .from('property_chats')
      .select(`
        id, status, assigned_to, user_id, property_id, property_state, request_id,
        created_at, updated_at,
        properties (id, title),
        property_requests (id, request_code)
      `)
      .eq('id', chatId)
      .single()

    if (error) throw error

    // Get name
    let name = data.request_id ? 'Agent' : 'Customer'
    if (data.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', data.user_id)
        .maybeSingle()
      name = profile?.full_name || profile?.email || name
    }

    chat.value = {
      ...data,
      customer_name: data.request_id ? undefined : name,
      agent_name: data.request_id ? name : undefined,
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
  } finally {
    loadingMessages.value = false
  }
}

// ===================== ACTIONS =====================
const takeOver = async () => {
  if (!chat.value || !currentAdminId.value) return

  const { error } = await supabase
    .from('property_chats')
    .update({
      status: 'admin_handling',
      assigned_to: currentAdminId.value,
      ai_enabled: false,
      last_agent_reply_at: new Date().toISOString()
    })
    .eq('id', chat.value.id)

  if (!error) {
    chat.value.status = 'admin_handling'
    chat.value.ai_enabled = false
  }
}

const releaseToAI = async () => {
  if (!chat.value) return

  const { error } = await supabase
    .from('property_chats')
    .update({
      status: 'ai_handling',
      assigned_to: null,
      ai_enabled: true
    })
    .eq('id', chat.value.id)

  if (!error) {
    chat.value.status = 'ai_handling'
    chat.value.ai_enabled = true
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !chat.value || sending.value) return

  sending.value = true
  const content = newMessage.value.trim()

  try {
    if (chat.value.status !== 'admin_handling') {
      await takeOver()
    }

    const { error } = await supabase.from('property_chat_messages').insert({
      chat_id: chat.value.id,
      sender_id: currentAdminId.value,
      sender_type: 'admin',
      content
    })
    if (error) throw error

    newMessage.value = ''
    // Realtime will add the message, but we can also refresh
    await fetchMessages(chat.value.id)
  } catch (err) {
    console.error(err)
    alert('Failed to send message')
  } finally {
    sending.value = false
  }
}

const goBack = () => {
  router.push({ name: 'Chats' }) // or whatever your list route is named
}

// ===================== REALTIME =====================
const subscribeToMessages = (chatId) => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
    messagesChannel = null
  }

  messagesChannel = supabase
    .channel(`admin-messages-${chatId}`)
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
  await getCurrentAdmin()
})

onUnmounted(() => {
  if (messagesChannel) supabase.removeChannel(messagesChannel)
})
</script>