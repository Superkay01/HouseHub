<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-15 w-30 object-cover" />
          <!-- <h1 class="text-2xl font-bold text-[var(--royal-blue)]">LodgeNext</h1> -->
        </div>
        <button 
          @click="$router.back()"
          class="flex items-center gap-2 text-[var(--steel-blue)] hover:text-[var(--royal-blue)] transition-colors"
        >
          ← Back to My Requests
        </button>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 py-12">
      <div v-if="request" class="space-y-10">
        <!-- Status Header -->
        <div class="flex justify-between items-center">
          <div :class="statusClasses[request.status]" 
               class="px-6 py-3 rounded-3xl text-sm font-semibold inline-flex items-center gap-2">
            <component :is="statusIcons[request.status]" class="w-5 h-5" />
            {{ formatStatus(request.status) }}
          </div>
          <p class="text-sm text-[var(--royal-blue)]">
            Requested on {{ new Date(request.created_at).toLocaleDateString('en-NG', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            }) }}
          </p>
        </div>

        <!-- Image & Video Gallery -->
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
          <!-- Main Display -->
          <div class="relative h-[480px] bg-black">
            <img 
              v-if="!showVideo"
              :src="mainImage" 
              class="w-full h-full object-cover"
            />
            <video 
              v-else
              :src="request.properties?.video_url" 
              controls 
              autoplay
              class="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Video Play Button -->
            <button
              v-if="hasVideo && !showVideo"
              @click="showVideo = true"
              class="absolute bottom-6 right-6 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 transition-all"
            >
              <span class="text-xl">▶️</span>
              <span>Watch Property Video</span>
            </button>
          </div>

          <!-- All Images Thumbnails -->
          <div v-if="allImages.length > 1" class="p-6 grid grid-cols-6 gap-3">
            <div 
              v-for="(img, index) in allImages" 
              :key="index"
              @click="switchImage(img)"
              class="aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-105"
              :class="{ 
                'border-[var(--royal-blue)] ring-2 ring-[var(--royal-blue)]' : mainImage === img 
              }"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Property Details -->
        <div class="bg-white rounded-3xl p-8 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ request.properties?.title }}</h1>
              <p class="mt-2 text-lg text-[var(--royal-blue)]">
                📍 {{ request.properties?.area }}, {{ request.properties?.city }}, {{ request.properties?.state }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-4xl font-bold text-[var(--royal-blue)]">
                ₦{{ Number(request.properties?.price).toLocaleString() }}
              </p>
              <p class="text-sm text-[var(--royal-blue)]">per year</p>
            </div>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
            <div class="text-center">
              <div class="text-4xl">🛏️</div>
              <p class="mt-2 font-semibold text-[var(--royal-blue)]">{{ request.properties?.bedrooms || 0 }} Bedrooms</p>
            </div>
            <div class="text-center">
              <div class="text-4xl">🚿</div>
              <p class="mt-2 font-semibold text-[var(--royal-blue)]">{{ request.properties?.bathrooms || 0 }} Bathrooms</p>
            </div>
            <div class="text-center">
              <div class="text-4xl">🚽</div>
              <p class="mt-2 font-semibold text-[var(--royal-blue)]">{{ request.properties?.toilets || 0 }} Toilets</p>
            </div>
            <div class="text-center">
              <div class="text-4xl">🚗</div>
              <p class="mt-2 font-semibold text-[var(--royal-blue)]">{{ request.properties?.parking_spaces || 0 }} Parking</p>
            </div>
          </div>

          <!-- Description -->
          <div v-if="request.properties?.description" class="mt-12">
            <h3 class="font-semibold mb-4 text-lg">Property Description</h3>
            <p class="text-[var(--royal-blue)] leading-relaxed whitespace-pre-line">
              {{ request.properties.description }}
            </p>
          </div>

          <!-- Amenities -->
          <div v-if="request.properties?.amenities?.length" class="mt-12">
            <h3 class="font-semibold mb-4 text-lg">Amenities</h3>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="(amenity, i) in request.properties.amenities" 
                :key="i"
                class="bg-gray-100 px-5 py-2.5 rounded-2xl text-sm text-[var(--royal-blue)]"
              >
                {{ amenity }}
              </span>
            </div>
          </div>
        </div>

        <!-- Request Information -->
        <div class="bg-white rounded-3xl p-8 shadow-sm">
          <h2 class="text-xl font-semibold mb-6">Request Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p class="text-medium-gray text-sm">Request Type</p>
              <p class="font-medium text-lg capitalize mt-1 text-[var(--royal-blue)]">{{ request.request_type.replace('_', ' ') }}</p>
            </div>
            
            <div v-if="request.inspection_date">
              <p class="text-medium-gray text-sm">Preferred Inspection Date</p>
              <p class="font-medium text-lg mt-1 text-[var(--royal-blue)]">
                {{ new Date(request.inspection_date).toLocaleDateString('en-NG') }}
                <span v-if="request.inspection_time" class="text-[var(--royal-blue)]"> • {{ request.inspection_time }}</span>
              </p>
            </div>

            <div>
              <p class="text-medium-gray text-sm">Current Status</p>
              <p class="font-medium text-lg capitalize mt-1 text-[var(--royal-blue)]">{{ formatStatus(request.status) }}</p>
            </div>
          </div>

          <div v-if="request.message" class="mt-10 pt-8 border-t">
            <p class="text-medium-gray mb-3">Your Message</p>
            <p class="text-[var(--royal-blue)] italic leading-relaxed">"{{ request.message }}"</p>
          </div>
        </div>

        <!-- Admin Note -->
        <div v-if="request.admin_note" class="bg-amber-50 border border-amber-200 rounded-3xl p-8">
          <h3 class="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <MessageSquare class="w-5 h-5" /> Note from Management
          </h3>
          <p class="text-amber-800 leading-relaxed">{{ request.admin_note }}</p>
        </div>
      </div>

      <!-- Loading / Error States -->
      <div v-else-if="loading" class="text-center py-24">
        <p class="text-xl text-medium-gray">Loading request details...</p>
      </div>
      <div v-else class="text-center py-24">
        <p class="text-xl text-medium-gray">Request not found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Clock, CheckCircle, XCircle, Send, MessageSquare } from 'lucide-vue-next'

const route = useRoute()

const request = ref(null)
const loading = ref(true)
const mainImage = ref('')
const showVideo = ref(false)

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-emerald-100 text-emerald-700',
  inspection_scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

const statusIcons = {
  pending: Clock,
  under_review: Send,
  approved: CheckCircle,
  inspection_scheduled: Clock,
  completed: CheckCircle,
  rejected: XCircle,
  cancelled: XCircle
}

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const allImages = computed(() => {
  const imgs = []
  const prop = request.value?.properties

  if (prop?.cover_image) imgs.push(prop.cover_image)
  if (prop?.image_1) imgs.push(prop.image_1)
  if (prop?.image_2) imgs.push(prop.image_2)
  if (prop?.image_3) imgs.push(prop.image_3)
  if (prop?.image_4) imgs.push(prop.image_4)
  if (prop?.image_5) imgs.push(prop.image_5)
  if (prop?.images?.length) imgs.push(...prop.images)

  return [...new Set(imgs.filter(Boolean))]
})

const hasVideo = computed(() => !!request.value?.properties?.video_url)

const fetchRequest = async () => {
  try {
    const { data, error } = await supabase
      .from('property_requests')
      .select(`
        *,
        properties (*)
      `)
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    request.value = data
    if (allImages.value.length > 0) {
      mainImage.value = allImages.value[0]
    }
  } catch (error) {
    console.error('Failed to fetch request:', error)
  } finally {
    loading.value = false
  }
}

const switchImage = (img) => {
  showVideo.value = false
  mainImage.value = img
}

onMounted(fetchRequest)
</script>