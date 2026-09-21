<template>
  <!-- Floating Button (draggable) -->
  <button
    v-if="!isOpen"
    ref="fabRef"
    type="button"
    class="fixed z-[300] w-14 h-14 rounded-full bg-[var(--royal-blue)] text-white shadow-lg
           hover:scale-105 transition-transform flex items-center justify-center select-none touch-none"
    :style="fabStyle"
    @pointerdown="onFabPointerDown"
    @click="onFabClick"
  >
    <span class="text-2xl pointer-events-none">💬</span>
    <span
      v-if="unreadCount > 0"
      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center pointer-events-none"
    >
      {{ unreadCount }}
    </span>
  </button>

  <!-- Movable Chat Window -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-[300] pointer-events-none"
      :style="panelWrapperStyle"
    >
      <div
        ref="panelRef"
        class="pointer-events-auto w-[min(100vw-1.5rem,24rem)] h-[min(70vh,560px)] max-h-[calc(100vh-2rem)]
               bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        :style="panelStyle"
      >
        <!-- Header (drag handle) -->
        <div
          class="flex items-center justify-between p-4 border-b bg-[var(--royal-blue)] text-white cursor-move select-none touch-none"
          @pointerdown="onPanelPointerDown"
        >
          <div class="min-w-0">
            <h3 class="font-semibold text-lg truncate">Lodgenext Assistant</h3>
            <p class="text-sm opacity-90 truncate">
              {{ headerSubtitle }}
            </p>
          </div>
          <button
            type="button"
            class="text-2xl leading-none hover:opacity-80 ml-3 flex-shrink-0 cursor-pointer"
            @click.stop="closeChat"
            @pointerdown.stop
          >
            ×
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div v-if="loading" class="text-center py-10 text-[var(--steel-blue)]">
            Loading conversation...
          </div>

          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender_type === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm text-[var(--royal-blue)]"
              :class="{
                'bg-[var(--royal-blue)] text-white': msg.sender_type === 'user',
                'bg-white border shadow-sm': msg.sender_type === 'ai' || msg.sender_type === 'system',
                'bg-green-100 text-green-800 border border-green-200': msg.sender_type === 'admin'
              }"
            >
              <p v-if="msg.sender_type === 'ai'" class="text-xs font-medium text-[var(--royal-blue)] mb-1">
                AI Assistant
              </p>
              <p v-else-if="msg.sender_type === 'admin'" class="text-xs font-medium text-[var(--bright-green)] mb-1">
                Support Admin
              </p>
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
              <p class="text-[10px] mt-1 opacity-70">
                {{ formatTime(msg.created_at) }}
              </p>
            </div>
          </div>

          <div v-if="aiTyping" class="flex justify-start">
            <div class="bg-white border shadow-sm rounded-2xl px-4 py-3 text-sm text-[var(--bright-green)]">
              <span class="animate-pulse">AI is typing...</span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t bg-white">
          <div v-if="!user" class="text-center text-sm text-[var(--steel-blue)] mb-3">
            Please
            <button type="button" @click="goToLogin" class="text-[var(--royal-blue)] font-medium underline">
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
              class="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)] text-base"
              :disabled="!user || sending || aiTyping"
            />
            <button
              type="button"
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

const FAB_POS_KEY = 'lodgenext_chat_fab_pos'
const PANEL_POS_KEY = 'lodgenext_chat_panel_pos'
const FAB_SIZE = 56
const DRAG_THRESHOLD = 6

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
const fabRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

let messagesChannel: any = null

// Positions
const fabPos = ref({ x: 0, y: 0 })
const panelPos = ref({ x: 0, y: 0 })

const fabStyle = computed(() => ({
  left: `${fabPos.value.x}px`,
  top: `${fabPos.value.y}px`,
  right: 'auto',
  bottom: 'auto',
}))

const panelWrapperStyle = computed(() => ({
  left: `${panelPos.value.x}px`,
  top: `${panelPos.value.y}px`,
}))

const panelStyle = computed(() => ({}))

const headerSubtitle = computed(() => {
  if (!user.value) return 'Login required'
  if (userRole.value === 'admin') return 'Admin Support Channel'
  if (userRole.value === 'agent') return 'Agent Support'
  return 'Customer Support'
})

// ---------- Drag helpers ----------
type DragKind = 'fab' | 'panel' | null
let dragKind: DragKind = null
let dragStartX = 0
let dragStartY = 0
let originX = 0
let originY = 0
let moved = false
let activePointerId: number | null = null

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getFabBounds = () => {
  const maxX = Math.max(0, window.innerWidth - FAB_SIZE - 8)
  const maxY = Math.max(0, window.innerHeight - FAB_SIZE - 8)
  return { minX: 8, minY: 8, maxX, maxY }
}

const getPanelBounds = () => {
  const el = panelRef.value
  const w = el?.offsetWidth || 384
  const h = el?.offsetHeight || 560
  const maxX = Math.max(0, window.innerWidth - w - 8)
  const maxY = Math.max(0, window.innerHeight - h - 8)
  return { minX: 8, minY: 8, maxX, maxY }
}

const loadPositions = () => {
  try {
    const fabRaw = localStorage.getItem(FAB_POS_KEY)
    if (fabRaw) {
      const p = JSON.parse(fabRaw)
      if (typeof p.x === 'number' && typeof p.y === 'number') fabPos.value = p
    } else {
      fabPos.value = {
        x: window.innerWidth - FAB_SIZE - 24,
        y: window.innerHeight - FAB_SIZE - 24,
      }
    }

    const panelRaw = localStorage.getItem(PANEL_POS_KEY)
    if (panelRaw) {
      const p = JSON.parse(panelRaw)
      if (typeof p.x === 'number' && typeof p.y === 'number') panelPos.value = p
    } else {
      panelPos.value = {
        x: Math.max(8, window.innerWidth - 400),
        y: Math.max(8, window.innerHeight - 600),
      }
    }
  } catch {
    fabPos.value = {
      x: window.innerWidth - FAB_SIZE - 24,
      y: window.innerHeight - FAB_SIZE - 24,
    }
    panelPos.value = {
      x: Math.max(8, window.innerWidth - 400),
      y: Math.max(8, window.innerHeight - 600),
    }
  }

  // Keep on-screen after load
  const fb = getFabBounds()
  fabPos.value = {
    x: clamp(fabPos.value.x, fb.minX, fb.maxX),
    y: clamp(fabPos.value.y, fb.minY, fb.maxY),
  }
}

const saveFabPos = () => {
  localStorage.setItem(FAB_POS_KEY, JSON.stringify(fabPos.value))
}

const savePanelPos = () => {
  localStorage.setItem(PANEL_POS_KEY, JSON.stringify(panelPos.value))
}

const onFabPointerDown = (e: PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  dragKind = 'fab'
  moved = false
  activePointerId = e.pointerId
  dragStartX = e.clientX
  dragStartY = e.clientY
  originX = fabPos.value.x
  originY = fabPos.value.y
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  e.preventDefault()
}

const onPanelPointerDown = (e: PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  dragKind = 'panel'
  moved = false
  activePointerId = e.pointerId
  dragStartX = e.clientX
  dragStartY = e.clientY
  originX = panelPos.value.x
  originY = panelPos.value.y
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  e.preventDefault()
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragKind || activePointerId !== e.pointerId) return

  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
    moved = true
  }

  if (dragKind === 'fab') {
    const b = getFabBounds()
    fabPos.value = {
      x: clamp(originX + dx, b.minX, b.maxX),
      y: clamp(originY + dy, b.minY, b.maxY),
    }
  } else if (dragKind === 'panel') {
    const b = getPanelBounds()
    panelPos.value = {
      x: clamp(originX + dx, b.minX, b.maxX),
      y: clamp(originY + dy, b.minY, b.maxY),
    }
  }
}

const onPointerUp = (e: PointerEvent) => {
  if (activePointerId !== e.pointerId) return

  if (dragKind === 'fab') saveFabPos()
  if (dragKind === 'panel') savePanelPos()

  dragKind = null
  activePointerId = null
}

const onFabClick = () => {
  // Ignore click if this was a drag
  if (moved) return
  openChat()
}

const onResize = () => {
  const fb = getFabBounds()
  fabPos.value = {
    x: clamp(fabPos.value.x, fb.minX, fb.maxX),
    y: clamp(fabPos.value.y, fb.minY, fb.maxY),
  }
  if (isOpen.value) {
    const pb = getPanelBounds()
    panelPos.value = {
      x: clamp(panelPos.value.x, pb.minX, pb.maxX),
      y: clamp(panelPos.value.y, pb.minY, pb.maxY),
    }
  }
}

// ---------- Chat logic (unchanged behavior) ----------
const openChat = async () => {
  isOpen.value = true
  await nextTick()
  // Place panel near FAB if no saved panel pos yet is fine; still clamp
  onResize()
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

  const { data: admin } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', currentUser.id)
    .maybeSingle()

  if (admin) {
    userRole.value = 'admin'
    return
  }

  userRole.value = 'customer'
}

const initChat = async () => {
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
    let { data: existing, error: findError } = await supabase
      .from('property_chats')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('chat_type', 'global')
      .maybeSingle()

    if (findError) throw findError

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
  if (!user.value || !newMessage.value.trim() || !chatId.value || sending.value || aiTyping.value) {
    return
  }

  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''

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

    await generateGlobalAIReply(content)
  } catch (err) {
    console.error('Error sending message:', err)
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
        property: null,
        user_question: question,
        is_global: true
      }
    })

    if (error) throw error
    await loadMessages()
  } catch (err) {
    console.error('AI reply error:', err)
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

watch(user, async () => {
  if (isOpen.value) {
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
  loadPositions()
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('resize', onResize)

  await getCurrentUser()

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
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
  window.removeEventListener('resize', onResize)
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
  }
})
</script>