<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Customer Chats</h1>
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <!-- CHAT LIST -->
        <div class="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div class="p-4 border-b border-gray-100">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search chats..."
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] focus:outline-none text-sm"
            />
          </div>

          <div class="flex-1 overflow-y-auto">
            <div v-if="loading && chats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
              Loading chats...
            </div>

            <div v-else-if="filteredChats.length === 0" class="p-8 text-center text-[var(--medium-gray)]">
              No chats found for your state
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
                    {{ chat.customer_name || 'Customer' }}
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

        <!-- CHAT WINDOW -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div
            v-if="!selectedChat"
            class="flex-1 flex items-center justify-center text-[var(--medium-gray)]"
          >
            <div class="text-center">
              <div class="text-5xl mb-3">💬</div>
              <p class="text-lg font-medium">Select a chat to start</p>
              <p class="text-sm mt-1">Only chats from your state are shown</p>
            </div>
          </div>

          <template v-else>
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <h2 class="font-bold text-[var(--dark-gray)] truncate">
                  {{ selectedChat.customer_name || 'Customer' }}
                </h2>
                <p class="text-sm text-[var(--royal-blue)] truncate">
                  {{ selectedChat.property_title }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span
                  class="text-xs font-medium px-3 py-1 rounded-full"
                  :class="statusBadge(selectedChat.status)"
                >
                  {{ formatStatus(selectedChat.status) }}
                </span>

                <button
                  v-if="selectedChat.status !== 'admin_handling'"
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
                v-if="selectedChat.status === 'ai_handling' || !selectedChat.status"
                class="mb-3 text-xs text-center text-[var(--medium-gray)] bg-[var(--light-blue)] rounded-xl py-2"
              >
                AI is handling this chat. Click <strong>Take Over</strong> to reply as Admin.
              </div>

              <div class="flex gap-3">
                <input
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Type your reply as Admin..."
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { supabase } from '@/supabaseClient'

const chats = ref([])
const selectedChat = ref(null)
const messages = ref([])
const newMessage = ref('')
const searchQuery = ref('')
const loading = ref(false)
const loadingMessages = ref(false)
const sending = ref(false)
const messagesContainer = ref(null)

const currentAdminId = ref(null)
const adminState = ref(null)          // ← very important

let chatsChannel = null
let messagesChannel = null

// ===================== COMPUTED =====================
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const q = searchQuery.value.toLowerCase()
  return chats.value.filter(
    (c) =>
      c.customer_name?.toLowerCase().includes(q) ||
      c.property_title?.toLowerCase().includes(q) ||
      c.last_message?.toLowerCase().includes(q)
  )
})

// ===================== HELPERS =====================
const formatStatus = (status) => {
  if (status === 'admin_handling') return 'Admin'
  if (status === 'ai_handling') return 'AI'
  if (status === 'closed') return 'Closed'
  return 'AI'
}

const statusBadge = (status) => {
  if (status === 'admin_handling') return 'bg-blue-100 text-blue-700'
  if (status === 'closed') return 'bg-gray-100 text-gray-600'
  return 'bg-green-100 text-green-700'
}

const senderLabel = (type) => {
  if (type === 'admin' || type === 'agent') return 'Admin'
  if (type === 'ai') return 'AI'
  if (type === 'system') return 'System'
  return 'Customer'
}

const messageAlignment = (type) => {
  return type === 'user' || type === 'customer' ? 'justify-start' : 'justify-end'
}

const messageBubble = (type) => {
  if (type === 'user' || type === 'customer') return 'bg-gray-100 text-[var(--dark-gray)]'
  if (type === 'ai' || type === 'system') return 'bg-[var(--light-blue)] text-[var(--royal-blue)]'
  return 'bg-[var(--royal-blue)] text-white'
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

// ===================== CORE LOGIC =====================
const getCurrentAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  currentAdminId.value = user.id

  // Get the admin's state from admin_profiles
  const { data: profile, error } = await supabase
    .from('admin_profiles')
    .select('state, full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to load admin profile:', error)
    return
  }

  adminState.value = profile?.state || null
  console.log('Admin state:', adminState.value)
}

const fetchChats = async () => {
  if (!adminState.value) {
    console.warn('Admin state not loaded yet')
    return
  }

  loading.value = true
  try {
    // Only fetch chats that belong to this admin's state
    const { data, error } = await supabase
      .from('property_chats')
      .select(`
        id,
        status,
        assigned_to,
        user_id,
        property_id,
        property_state,
        created_at,
        updated_at,
        properties (
          id,
          title,
          state
        )
      `)
      .eq('property_state', adminState.value)   // ← KEY FILTER
      .order('updated_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const chatsWithPreview = await Promise.all(
      (data || []).map(async (chat) => {
        // Last message
        const { data: lastMsg } = await supabase
          .from('property_chat_messages')
          .select('content, created_at, sender_type')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        // Customer name
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
          updated_at: lastMsg?.created_at || chat.updated_at || chat.created_at,
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
    console.error('Failed to fetch messages:', err)
  } finally {
    loadingMessages.value = false
  }
}

const selectChat = async (chat) => {
  selectedChat.value = chat
  newMessage.value = ''
  await fetchMessages(chat.id)
  subscribeToMessages(chat.id)
}

// ===================== ACTIONS =====================
const takeOver = async () => {
  if (!selectedChat.value || !currentAdminId.value) return

  try {
    const { data, error } = await supabase
      .from('property_chats')
      .update({
        status: 'admin_handling',
        assigned_to: currentAdminId.value,
        ai_enabled: false,
        last_agent_reply_at: new Date().toISOString()
      })
      .eq('id', selectedChat.value.id)
      .select()
      .single()

    if (error) throw error

    // Update local state
    selectedChat.value.status = 'admin_handling'
    selectedChat.value.assigned_to = currentAdminId.value
    selectedChat.value.ai_enabled = false

    // Also update in the list
    const idx = chats.value.findIndex(c => c.id === selectedChat.value.id)
    if (idx !== -1) {
      chats.value[idx].status = 'admin_handling'
    }

    console.log('Take over successful')
  } catch (err) {
    console.error('Take over failed:', err)
    alert('Failed to take over the chat. Check console for details.')
  }
}

const releaseToAI = async () => {
  if (!selectedChat.value) return

  const { error } = await supabase
    .from('property_chats')
    .update({
      status: 'ai_handling',
      assigned_to: null,
      ai_enabled: true,
    })
    .eq('id', selectedChat.value.id)

  if (!error) {
    selectedChat.value.status = 'ai_handling'
    selectedChat.value.assigned_to = null
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value || sending.value) return

  sending.value = true
  const content = newMessage.value.trim()

  try {
    // Auto take-over
    if (selectedChat.value.status !== 'admin_handling') {
      await takeOver()
    }

    const { error } = await supabase.from('property_chat_messages').insert({
      chat_id: selectedChat.value.id,
      sender_id: currentAdminId.value,
      sender_type: 'admin',
      content,
    })

    if (error) throw error

    newMessage.value = ''
    await fetchMessages(selectedChat.value.id)
  } catch (err) {
    console.error('Failed to send message:', err)
    alert('Failed to send message')
  } finally {
    sending.value = false
  }
}

const refreshChats = async () => {
  await fetchChats()
  if (selectedChat.value) await fetchMessages(selectedChat.value.id)
}

// ===================== REALTIME =====================
const subscribeToMessages = (chatId) => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
  }

  messagesChannel = supabase
    .channel(`admin-chat-${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'property_chat_messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        messages.value.push(payload.new)
        scrollToBottom()
      }
    )
    .subscribe()
}

onMounted(async () => {
  await getCurrentAdmin()
  if (adminState.value) {
    await fetchChats()
  }

  chatsChannel = supabase
    .channel('admin-chats-list')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'property_chats' },
      () => {
        if (adminState.value) fetchChats()
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (chatsChannel) supabase.removeChannel(chatsChannel)
  if (messagesChannel) supabase.removeChannel(messagesChannel)
})
</script>