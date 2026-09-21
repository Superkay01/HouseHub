<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-6xl mx-auto px-4 pt-8">
      
      <!-- Back Button -->
      <button 
        type="button"
        @click="$router.back()" 
        class="flex items-center gap-2 text-[var(--royal-blue)] hover:text-[var(--medium-blue)] mb-8 font-medium"
      >
        ← Back
      </button>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-xl mb-4">{{ error }}</p>
        <button 
          type="button"
          @click="fetchProperty"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl"
        >
          Try Again
        </button>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Images -->
        <div class="lg:col-span-7 space-y-6">
          <div
            class="relative rounded-3xl overflow-hidden shadow-2xl bg-white cursor-pointer" 
            @click="showLightbox = true"
          >
            <img 
              :src="mainImage" 
              class="w-full h-[520px] object-cover"
              alt="Main Image"
            />

            <!-- Share + Heart -->
            <div class="absolute top-5 right-5 flex items-center gap-2 z-10">
              <!-- Share -->
              <div class="relative" @click.stop>
                <button
                  type="button"
                  @click="toggleShareMenu"
                  class="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
                  title="Share property"
                >
                  <span class="text-xl text-[var(--bright-green)]"><Share2/></span>
                </button>

                <div
                  v-if="showShareMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                >
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm text-[var(--royal-blue)] hover:bg-gray-50"
                    @click="copyPropertyLink"
                  >
                    Copy link
                  </button>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm text-[var(--bright-green)] hover:bg-gray-50"
                    @click="shareToWhatsApp"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm text-[var(--royal-blue)] hover:bg-gray-50"
                    @click="shareToFacebook"
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 text-sm text-[var(--royal-blue)] hover:bg-gray-50"
                    @click="shareNative"
                  >
                    More…
                  </button>
                </div>
              </div>

              <!-- Heart -->
              <button
                type="button"
                @click.stop="toggleSave"
                class="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
                :title="isSaved ? 'Unsave property' : 'Save property'"
              >
                <span class="text-2xl">
                  {{ isSaved ? '❤️' : '🤍' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="rounded-3xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105"
              :class="{ 'border-[var(--royal-blue)] ring-2 ring-offset-2 ring-[var(--royal-blue)]': mainImage === url }"
              @click="mainImage = url"
            >
              <img :src="url" class="w-full h-28 object-cover" alt="" />
            </div>
          </div>

          <div v-if="property.video_url" class="rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video :src="property.video_url" controls class="w-full aspect-video"></video>
          </div>
        </div>

        <!-- Details -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
            
            <div class="flex justify-between items-start mb-6">
              <span class="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-2xl capitalize">
                {{ property.status || 'pending' }}
              </span>
              <div class="text-right">
                <p class="text-4xl font-bold text-[var(--royal-blue)]">
                  ₦{{ Number(property.price || 0).toLocaleString() }}
                </p>
                <p class="text-sm text-[var(--royal-blue)]">{{ property.purpose }}</p>
              </div>
            </div>

            <h1 class="text-3xl font-bold leading-tight mb-2 text-[var(--royal-blue)]">
              {{ property.title }}
            </h1>
            
            <p class="text-[var(--royal-blue)] mb-4">
              📍 {{ property.area }}, {{ property.city }}, {{ property.state }}
            </p>

            <p class="text-[var(--royal-blue)] mb-6">
              {{
                property.inspection_fee
                  ? `Inspection Fee: ₦${Number(property.inspection_fee).toLocaleString()}`
                  : 'No Inspection Fee'
              }}
            </p>

            <div class="flex items-center gap-2 text-medium-gray text-sm mb-6">
              <span>👁️</span>
              <span>
                {{ uniqueViewCount }}
                {{ uniqueViewCount === 1 ? 'person' : 'people' }} viewed this property
              </span>
            </div>

            <!-- Share row -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                @click="copyPropertyLink"
                class="py-3 rounded-2xl border border-gray-200 text-sm font-medium text-[var(--royal-blue)] hover:bg-gray-50"
              >
                Copy link
              </button>
              <button
                type="button"
                @click="shareToWhatsApp"
                class="py-3 rounded-2xl border border-gray-200 text-sm font-medium text-[var(--royal-blue)] hover:bg-gray-50"
              >
                WhatsApp
              </button>
              <button
                type="button"
                @click="shareToFacebook"
                class="py-3 rounded-2xl border border-gray-200 text-sm font-medium text-[var(--royal-blue)] hover:bg-gray-50"
              >
                Facebook
              </button>
            </div>

            <!-- PRIMARY CTA -->
            <button
              type="button"
              @click="requestInspection"
              class="w-full mb-3 py-4 rounded-2xl font-semibold text-lg text-white bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] transition shadow-md"
            >
              Request Inspection
            </button>

            <p class="text-xs text-center text-gray-500 mb-4">
              Choose a date & time{{ property.inspection_fee ? ', pay the inspection fee,' : '' }} then submit your request
            </p>

            <!-- Chat Button -->
            <button
              type="button"
              @click="openPropertyChat"
              class="w-full mb-6 py-3.5 rounded-2xl font-medium border-2 border-[var(--royal-blue)] text-[var(--royal-blue)] hover:bg-[var(--light-blue)] transition flex items-center justify-center gap-2"
            >
              💬 Chat about this property
            </button>

            <!-- Save Button -->
            <button
              type="button"
              @click="toggleSave"
              class="w-full mb-6 py-3.5 rounded-2xl font-medium transition flex items-center justify-center gap-2"
              :class="isSaved 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-[var(--light-blue)] text-[var(--royal-blue)] border border-[var(--light-blue)]'"
            >
              <span>{{ isSaved ? '❤️ Saved' : '🤍 Save Property' }}</span>
            </button>

            <div class="border-t border-b py-6 my-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-semibold">{{ property.bedrooms || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">BEDROOMS</div>
              </div>
              <div>
                <div class="text-2xl font-semibold">{{ property.bathrooms || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">BATHROOMS</div>
              </div>
              <div>
                <div class="text-2xl font-semibold">{{ property.parking_spaces || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">PARKING</div>
              </div>
            </div>

            <div class="space-y-4 text-sm">
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Property Type</span>
                <strong>{{ property.property_type || '—' }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Condition</span>
                <strong>{{ property.condition || '—' }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Availability</span>
                <strong>{{ property.availability || '—' }}</strong>
              </div>
            </div>

            <div v-if="property.amenities?.length" class="mt-8">
              <h4 class="font-semibold mb-4">Amenities</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="amenity in property.amenities" 
                  :key="amenity"
                  class="bg-[var(--hover-blue)] px-4 py-2 rounded-2xl text-sm"
                >
                  {{ amenity }}
                </span>
              </div>
            </div>

            <div v-if="property.description" class="mt-10 pt-8 border-t">
              <h4 class="font-semibold mb-3">Description</h4>
              <p class="leading-relaxed text-[var(--royal-blue)] whitespace-pre-wrap">
                {{ property.description }}
              </p>
            </div>

            <div class="mt-10 pt-8 border-t space-y-3">
              <button
                type="button"
                @click="requestInspection"
                class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white py-4 rounded-2xl font-semibold text-lg transition"
              >
                Request Inspection
              </button>

              <button
                type="button"
                @click="goToHelp"
                class="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[var(--royal-blue)] py-3.5 rounded-2xl font-medium transition"
              >
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="showLightbox" 
      class="fixed inset-0 z-[100] bg-black flex items-center justify-center" 
      @click.self="showLightbox = false"
    >
      <div class="relative max-w-6xl w-full p-8">
        <img :src="mainImage" class="max-h-[90vh] mx-auto rounded-3xl shadow-2xl" alt="" />
        <button type="button" @click="showLightbox = false" class="absolute top-8 right-8 text-white text-5xl">
          ×
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[210] px-5 py-3 rounded-2xl shadow-lg text-sm font-medium text-white bg-gray-900"
    >
      {{ toast }}
    </div>

    <!-- PROPERTY CHAT SLIDE-OVER -->
    <Teleport to="body">
      <div
        v-if="showChat"
        class="fixed inset-0 z-[200] flex justify-end"
      >
        <div 
          class="absolute inset-0 bg-black/40"
          @click="showChat = false"
        ></div>

        <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
          <div class="flex items-center justify-between p-4 border-b bg-[var(--royal-blue)] text-white">
            <div>
              <h3 class="font-semibold text-lg">Chat about this property</h3>
              <p class="text-sm opacity-90 truncate max-w-[240px]">
                {{ property.title }}
              </p>
            </div>
            <button type="button" @click="showChat = false" class="text-2xl leading-none hover:opacity-80">×</button>
          </div>

          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div v-if="chatLoading" class="text-center py-10 text-gray-500">
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
                  'bg-green-100 text-green-800 border border-green-200': msg.sender_type === 'admin' || msg.sender_type === 'agent'
                }"
              >
                <p v-if="msg.sender_type === 'ai'" class="text-xs font-medium text-[var(--royal-blue)] mb-1">
                  AI Assistant
                </p>
                <p v-else-if="msg.sender_type === 'admin' || msg.sender_type === 'agent'" class="text-xs font-medium text-[var(--bright-green)] mb-1">
                  Admin
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

          <div class="p-4 border-t bg-white">
            <div class="flex gap-2">
              <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Ask anything about this property..."
                class="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)]"
                :disabled="sending || aiTyping"
              />
              <button
                type="button"
                @click="sendMessage"
                :disabled="!newMessage.trim() || sending || aiTyping"
                class="px-5 py-3 bg-[var(--royal-blue)] text-white rounded-xl font-medium disabled:opacity-50 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { Share2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const property = ref<any>({})
const loading = ref(true)
const error = ref('')
const mainImage = ref('')
const showLightbox = ref(false)
const showShareMenu = ref(false)
const toast = ref('')

const uniqueViewCount = ref(0)
const isSaved = ref(false)
const saving = ref(false)

let toastTimer: ReturnType<typeof setTimeout> | null = null

// ==================== SHARE ====================
const showToast = (message: string) => {
  toast.value = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2500)
}

const getPropertyUrl = () => {
  const id = property.value?.id || (route.params.id as string)
  return `${window.location.origin}/customer/properties/${id}`
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const copyPropertyLink = async () => {
  const url = getPropertyUrl()
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  showShareMenu.value = false
  showToast('Property link copied')
}

const shareToWhatsApp = () => {
  const url = getPropertyUrl()
  const text = `Check out this property on LodgeNext: ${property.value?.title || 'Property'}\n${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  showShareMenu.value = false
}

const shareToFacebook = () => {
  const url = getPropertyUrl()
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer'
  )
  showShareMenu.value = false
}

const shareNative = async () => {
  const url = getPropertyUrl()
  if (navigator.share) {
    try {
      await navigator.share({
        title: property.value?.title || 'LodgeNext Property',
        text: 'Check out this property on LodgeNext',
        url,
      })
    } catch {
      // cancelled
    }
    showShareMenu.value = false
    return
  }
  await copyPropertyLink()
}

const closeShareOnOutside = () => {
  showShareMenu.value = false
}

// ==================== CHAT STATE ====================
const showChat = ref(false)
const chatId = ref<string | null>(null)
const messages = ref<any[]>([])
const newMessage = ref('')
const chatLoading = ref(false)
const sending = ref(false)
const aiTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// ==================== PROPERTY FUNCTIONS ====================
const fetchProperty = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'No Property ID found in URL'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  const { data, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error(fetchError)
    error.value = 'Property not found or access denied'
  } else {
    property.value = data || {}
  }

  loading.value = false
}

const recordUniqueView = async () => {
  if (!property.value?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('property_views')
    .upsert(
      { property_id: property.value.id, user_id: user.id },
      { onConflict: 'property_id,user_id', ignoreDuplicates: true }
    )

  const { count } = await supabase
    .from('property_views')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', property.value.id)

  uniqueViewCount.value = count || 0
}

const checkIfSaved = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !property.value?.id) {
    isSaved.value = false
    return
  }

  const { data } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', property.value.id)
    .maybeSingle()

  isSaved.value = !!data
}

const toggleSave = async () => {
  if (saving.value) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to save properties')
    router.push('/login')
    return
  }

  if (!property.value?.id) return

  saving.value = true
  try {
    if (isSaved.value) {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', property.value.id)
      isSaved.value = false
    } else {
      await supabase
        .from('saved_properties')
        .insert({ user_id: user.id, property_id: property.value.id })
      isSaved.value = true
    }
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to save property')
  } finally {
    saving.value = false
  }
}

const requestInspection = async () => {
  if (!property.value?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to request an inspection')
    router.push('/login')
    return
  }

  router.push(`/customer/request-inspection/${property.value.id}`)
}

const goToHelp = () => {
  router.push('/customer/help-support')
}

const allImages = computed(() => {
  const imgs: string[] = []
  if (property.value.cover_image) imgs.push(property.value.cover_image)
  if (property.value.image_1) imgs.push(property.value.image_1)
  if (property.value.image_2) imgs.push(property.value.image_2)
  if (property.value.image_3) imgs.push(property.value.image_3)
  if (property.value.image_4) imgs.push(property.value.image_4)
  if (property.value.image_5) imgs.push(property.value.image_5)
  return imgs
})

// ==================== CHAT FUNCTIONS ====================
const openPropertyChat = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to chat about this property')
    router.push('/login')
    return
  }

  if (!property.value?.id) return

  showChat.value = true
  await initOrLoadChat(user.id)
}

const initOrLoadChat = async (userId: string) => {
  chatLoading.value = true
  try {
    let { data: existing, error: findError } = await supabase
      .from('property_chats')
      .select('id, assigned_to, ai_enabled, property_state, status')
      .eq('property_id', property.value.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (findError) throw findError

    if (!existing) {
      const { data: newChat, error: insertError } = await supabase
        .from('property_chats')
        .insert({
          property_id: property.value.id,
          user_id: userId,
          property_state: property.value.state,
          status: 'ai_handling',
          ai_enabled: true
        })
        .select('id, assigned_to, ai_enabled, property_state, status')
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          const { data: retry } = await supabase
            .from('property_chats')
            .select('id, assigned_to, ai_enabled, property_state, status')
            .eq('property_id', property.value.id)
            .eq('user_id', userId)
            .maybeSingle()

          existing = retry
        } else {
          throw insertError
        }
      } else {
        existing = newChat

        await supabase.from('property_chat_messages').insert({
          chat_id: existing.id,
          sender_type: 'system',
          content: `You're chatting about:\n• ${property.value.title}\n• ${property.value.area}, ${property.value.city}, ${property.value.state}\n• ₦${Number(property.value.price || 0).toLocaleString()} (${property.value.purpose})\n\nAsk me anything about this property!`
        })
      }
    }

    if (!existing) {
      throw new Error('Could not load or create chat')
    }

    chatId.value = existing.id
    await loadMessages()
    subscribeToMessages(existing.id)
  } catch (err: any) {
    console.error('initOrLoadChat error:', err)
    alert(err.message || 'Could not open chat')
    showChat.value = false
  } finally {
    chatLoading.value = false
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
    console.error(error)
    return
  }
  messages.value = data || []
  await scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !chatId.value || sending.value || aiTyping.value) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''

  const tempId = crypto.randomUUID()
  messages.value.push({
    id: tempId,
    content,
    sender_type: 'user',
    sender_id: user.id,
    created_at: new Date().toISOString()
  })
  await scrollToBottom()

  try {
    const { error } = await supabase
      .from('property_chat_messages')
      .insert({
        chat_id: chatId.value,
        sender_id: user.id,
        sender_type: 'user',
        content
      })

    if (error) throw error

    await generateAIReply(content)
  } catch (err: any) {
    console.error(err)
    alert('Failed to send message')
    messages.value = messages.value.filter(m => m.id !== tempId)
  } finally {
    sending.value = false
  }
}

let messagesChannel: any = null

const subscribeToMessages = (id: string) => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel)
  }

  messagesChannel = supabase
    .channel(`customer-chat-${id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'property_chat_messages',
        filter: `chat_id=eq.${id}`,
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

const generateAIReply = async (userQuestion: string) => {
  if (!chatId.value) return

  const { data: chat } = await supabase
    .from('property_chats')
    .select('ai_enabled, assigned_to, last_agent_reply_at')
    .eq('id', chatId.value)
    .single()

  if (chat?.assigned_to || chat?.ai_enabled === false) {
    return
  }

  if (chat?.last_agent_reply_at) {
    const lastReply = new Date(chat.last_agent_reply_at).getTime()
    if (Date.now() - lastReply < 30 * 60 * 1000) {
      return
    }
  }

  aiTyping.value = true
  await scrollToBottom()

  try {
    const propertyContext = {
      id: property.value.id,
      title: property.value.title,
      price: property.value.price,
      purpose: property.value.purpose,
      location: `${property.value.area}, ${property.value.city}, ${property.value.state}`,
      bedrooms: property.value.bedrooms,
      bathrooms: property.value.bathrooms,
      parking: property.value.parking_spaces,
      property_type: property.value.property_type,
      condition: property.value.condition,
      availability: property.value.availability,
      inspection_fee: property.value.inspection_fee,
      amenities: property.value.amenities || [],
      description: property.value.description || ''
    }

    const { error } = await supabase.functions.invoke('generate-property-chat-reply', {
      body: {
        chat_id: chatId.value,
        property: propertyContext,
        user_question: userQuestion,
        recent_messages: messages.value.slice(-6).map(m => ({
          role: m.sender_type === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      }
    })

    if (error) throw error
    await loadMessages()
  } catch (err) {
    console.error('AI reply error:', err)
    await supabase.from('property_chat_messages').insert({
      chat_id: chatId.value,
      sender_type: 'ai',
      content: "Sorry, I'm having trouble right now. An Admin will assist you shortly."
    })
    await loadMessages()
  } finally {
    aiTyping.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(property, (newProp) => {
  if (newProp?.cover_image) mainImage.value = newProp.cover_image
}, { immediate: true })

onMounted(async () => {
  document.addEventListener('click', closeShareOnOutside)
  await fetchProperty()
  if (property.value?.id) {
    await Promise.all([recordUniqueView(), checkIfSaved()])
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeShareOnOutside)
  if (toastTimer) clearTimeout(toastTimer)
  if (messagesChannel) supabase.removeChannel(messagesChannel)
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