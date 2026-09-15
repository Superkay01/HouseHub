<template>
  <!-- Floating Button -->
  <button
    v-if="!isOpen"
    @click="openChat"
    class="fixed bottom-6 right-6 z-[300] w-14 h-14 rounded-full bg-[var(--royal-blue)] text-white shadow-lg hover:scale-110 transition-all flex items-center justify-center"
  >
    <span class="text-2xl">💬</span>
    <span
      v-if="unreadCount > 0"
      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
    >
      {{ unreadCount }}
    </span>
  </button>

  <!-- Chat Panel -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[300] flex justify-end"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="closeChat"></div>

      <!-- Panel -->
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b bg-[var(--royal-blue)] text-white">
          <div>
            <h3 class="font-semibold text-lg">HouseHub Assistant</h3>
            <p class="text-sm opacity-90">
              {{ headerSubtitle }}
            </p>
          </div>
          <button @click="closeChat" class="text-2xl leading-none hover:opacity-80">×</button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-if="loading" class="text-center py-10 text-gray-500">
            Loading conversation...
          </div>

          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender_type === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
              :class="{
                'bg-[var(--royal-blue)] text-white': msg.sender_type === 'user',
                'bg-white border shadow-sm': msg.sender_type === 'ai' || msg.sender_type === 'system',
                'bg-green-100 text-green-800 border border-green-200': msg.sender_type === 'admin'
              }"
            >
              <p v-if="msg.sender_type === 'ai'" class="text-xs font-medium text-[var(--royal-blue)] mb-1">
                AI Assistant
              </p>
              <p v-else-if="msg.sender_type === 'admin'" class="text-xs font-medium text-green-700 mb-1">
                Support Admin
              </p>
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
              <p class="text-[10px] mt-1 opacity-70">
                {{ formatTime(msg.created_at) }}
              </p>
            </div>
          </div>

          <div v-if="aiTyping" class="flex justify-start">
            <div class="bg-white border shadow-sm rounded-2xl px-4 py-3 text-sm text-gray-500">
              <span class="animate-pulse">AI is typing...</span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t bg-white">
          <div v-if="!user" class="text-center text-sm text-gray-500 mb-3">
            Please
            <button @click="goToLogin" class="text-[var(--royal-blue)] font-medium underline">
              login
            </button>
            to chat with support
          </div>

          <div class="flex gap-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              :placeholder="user ? 'Ask anything about Lodgenext...' : 'Login to send messages'"
              class="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)]"
              :disabled="!user || sending || aiTyping"
            />
            <button
              @click="sendMessage"
              :disabled="!user || !newMessage.trim() || sending || aiTyping"
              class="px-5 py-3 bg-[var(--royal-blue)] text-white rounded-xl font-medium disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router = useRouter()

const isOpen = ref(false)
const user = ref<any>(null)
const userRole = ref<'customer' | 'agent' | 'admin' | null>(null)
const chatId = ref<string | null>(null)
const messages = ref<any[]>([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const aiTyping = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref<HTMLElement | null>(null)

let messagesChannel: any = null

const headerSubtitle = computed(() => {
  if (!user.value) return 'Login required'
  if (userRole.value === 'admin') return 'Admin Support Channel'
  if (userRole.value === 'agent') return 'Agent Support'
  return 'Customer Support'
})

const openChat = async () => {
  isOpen.value = true
  await initChat()
}

const closeChat = () => {
  isOpen.value = false
}

const goToLogin = () => {
  closeChat()
  router.push('/login')
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const getCurrentUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser

  if (!currentUser) {
    userRole.value = null
    return
  }

  // Check if admin
  const { data: admin } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', currentUser.id)
    .maybeSingle()

  if (admin) {
    userRole.value = 'admin'
    return
  }

  // You can add agent check here later
  userRole.value = 'customer'
}

const initChat = async () => {
  // Guests can only see a static welcome message
  if (!user.value) {
    messages.value = [{
      id: 'welcome',
      sender_type: 'system',
      content: 'Welcome to Lodgenext!\n\nI can help you with:\n• How to request inspection\n• How to save properties\n• General questions about the platform\n\nPlease login for personalized support and to chat with the AI assistant.',
      created_at: new Date().toISOString()
    }]
    return
  }

  loading.value = true
  try {
    // Find existing global chat for this user
    let { data: existing, error: findError } = await supabase
      .from('property_chats')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('chat_type', 'global')
      .maybeSingle()

    if (findError) throw findError

    // Create one if it doesn't exist
    if (!existing) {
      const { data: newChat, error: createError } = await supabase
        .from('property_chats')
        .insert({
          user_id: user.value.id,
          chat_type: 'global',
          status: 'ai_handling',
          ai_enabled: true,
          property_id: null,
          property_state: null
        })
        .select('id')
        .single()

      if (createError) throw createError
      existing = newChat

      // Welcome message
      await supabase.from('property_chat_messages').insert({
        chat_id: existing.id,
        sender_type: 'system',
        content: `Hello! I'm your Lodgenext Assistant.\n\nI can help you with:\n• Navigating the platform\n• Requesting inspections\n• Understanding fees\n• General support\n\nHow can I assist you today?`
      })
    }

    chatId.value = existing.id
    await loadMessages()
    subscribeToMessages(existing.id)
  } catch (err) {
    console.error('Error initializing global chat:', err)
  } finally {
    loading.value = false
  }
}

const loadMessages = async () => {
  if (!chatId.value) return

  const { data, error } = await supabase
    .from('property_chat_messages')
    .select('*')
    .eq('chat_id', chatId.value)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error loading messages:', error)
    return
  }

  messages.value = data || []
  await scrollToBottom()
}

const sendMessage = async () => {
  // Only authenticated users can send
  if (!user.value || !newMessage.value.trim() || !chatId.value || sending.value || aiTyping.value) {
    return
  }

  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''

  // Optimistic UI
  const optimisticId = crypto.randomUUID()
  messages.value.push({
    id: optimisticId,
    content,
    sender_type: 'user',
    created_at: new Date().toISOString()
  })
  await scrollToBottom()

  try {
    const { error } = await supabase.from('property_chat_messages').insert({
      chat_id: chatId.value,
      sender_id: user.value.id,
      sender_type: 'user',
      content
    })

    if (error) throw error

    // Trigger AI
    await generateGlobalAIReply(content)
  } catch (err) {
    console.error('Error sending message:', err)
    // Remove optimistic message on failure
    messages.value = messages.value.filter(m => m.id !== optimisticId)
  } finally {
    sending.value = false
  }
}

const generateGlobalAIReply = async (question: string) => {
  if (!chatId.value) return

  aiTyping.value = true
  await scrollToBottom()

  try {
    const { error } = await supabase.functions.invoke('generate-property-chat-reply', {
      body: {
        chat_id: chatId.value,
        property: null,          // global chat → no property
        user_question: question,
        is_global: true
      }
    })

    if (error) throw error

    // The edge function saves the AI message.
    // Realtime subscription will pick it up, but we also reload as fallback.
    await loadMessages()
  } catch (err) {
    console.error('AI reply error:', err)

    // Fallback message if the edge function fails
    await supabase.from('property_chat_messages').insert({
      chat_id: chatId.value,
      sender_type: 'ai',
      content: "I'm here to help! For property-specific questions, please open the chat on the property page. For urgent issues, our support team will respond shortly."
    })
    await loadMessages()
  } finally {
    aiTyping.value = false
  }
}

const subscribeToMessages = (id: string) => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
  }

  messagesChannel = supabase
    .channel(`global-chat-${id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'property_chat_messages',
        filter: `chat_id=eq.${id}`
      },
      (payload) => {
        const exists = messages.value.some(m => m.id === payload.new.id)
        if (!exists) {
          messages.value.push(payload.new)
          scrollToBottom()
        }
      }
    )
    .subscribe()
}

// Re-initialize when user logs in/out
watch(user, async (newUser) => {
  if (isOpen.value) {
    // Clear previous state
    chatId.value = null
    messages.value = []
    if (messagesChannel) {
      supabase.removeChannel(messagesChannel)
      messagesChannel = null
    }
    await initChat()
  }
})

onMounted(async () => {
  await getCurrentUser()

  // Keep user in sync with auth changes
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null
    if (session?.user) {
      await getCurrentUser()
    } else {
      userRole.value = null
    }
  })
})

onUnmounted(() => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
  }
})
</script>

<style scoped>
@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in {
  animation: slide-in 0.25s ease-out;
}
</style>