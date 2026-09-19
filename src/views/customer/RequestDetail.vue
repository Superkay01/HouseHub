<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img 
            src="/Lodgenext_logo__2_-removebg-preview.png" 
            alt="LodgeNext" 
            class="h-10 sm:h-12 object-contain" 
          />
        </div>
        <button 
          @click="$router.back()"
          class="flex items-center gap-1.5 text-sm text-[var(--steel-blue)] hover:text-[var(--royal-blue)] transition-colors"
        >
          ← Back
        </button>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div v-if="request" class="space-y-6 sm:space-y-8">

        <!-- Status Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div 
            :class="statusClasses[request.status]" 
            class="px-4 py-2 rounded-2xl text-sm font-medium inline-flex items-center gap-2 w-fit"
          >
            <component :is="statusIcons[request.status]" class="w-4 h-4" />
            {{ formatStatus(request.status) }}
          </div>
          <p class="text-sm text-gray-500">
            Requested on {{ formatDate(request.created_at) }}
          </p>
        </div>

        <!-- Scheduled Inspection Alert -->
        <div 
          v-if="isInspectionScheduled"
          class="bg-purple-50 border border-purple-200 rounded-2xl p-5 sm:p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="font-semibold text-purple-800 text-base sm:text-lg">
                Inspection Scheduled
              </h3>
              <p class="text-sm text-purple-700 mt-1">
                Your inspection has been scheduled. Please go to the Inspection page for full details.
              </p>
            </div>
            <button
              @click="goToInspections"
              class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
            >
              Go to Inspections
            </button>
          </div>
        </div>

        <!-- Image & Video Gallery -->
        <div class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          <!-- Main Display -->
          <div class="relative aspect-[4/3] sm:aspect-[16/9] bg-black">
            <img 
              v-if="!showVideo"
              :src="mainImage" 
              class="w-full h-full object-cover"
              alt="Property"
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
              class="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all"
            >
              <span>▶️</span>
              <span class="hidden sm:inline">Watch Video</span>
            </button>
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="p-3 sm:p-4 grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
            <div 
              v-for="(img, index) in allImages" 
              :key="index"
              @click="switchImage(img)"
              class="aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all"
              :class="mainImage === img 
                ? 'border-[var(--royal-blue)]' 
                : 'border-transparent hover:border-gray-300'"
            >
              <img :src="img" class="w-full h-full object-cover" alt="" />
            </div>
          </div>
        </div>

        <!-- Property Details -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {{ request.properties?.title }}
              </h1>
              <p class="mt-1.5 text-sm sm:text-base text-gray-600">
                📍 {{ request.properties?.area }}, {{ request.properties?.city }}, {{ request.properties?.state }}
              </p>
            </div>
            <div class="sm:text-right">
              <p class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
                ₦{{ Number(request.properties?.price || 0).toLocaleString() }}
              </p>
              <p class="text-sm text-gray-500">per year</p>
            </div>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
            <div class="text-center p-3 bg-gray-50 rounded-2xl">
              <div class="text-2xl sm:text-3xl">🛏️</div>
              <p class="mt-1.5 text-sm font-medium text-gray-800">
                {{ request.properties?.bedrooms || 0 }} Beds
              </p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-2xl">
              <div class="text-2xl sm:text-3xl">🚿</div>
              <p class="mt-1.5 text-sm font-medium text-gray-800">
                {{ request.properties?.bathrooms || 0 }} Baths
              </p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-2xl">
              <div class="text-2xl sm:text-3xl">🚽</div>
              <p class="mt-1.5 text-sm font-medium text-gray-800">
                {{ request.properties?.toilets || 0 }} Toilets
              </p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-2xl">
              <div class="text-2xl sm:text-3xl">🚗</div>
              <p class="mt-1.5 text-sm font-medium text-gray-800">
                {{ request.properties?.parking_spaces || 0 }} Parking
              </p>
            </div>
          </div>

          <!-- Description -->
          <div v-if="request.properties?.description" class="mt-8 sm:mt-10">
            <h3 class="font-semibold text-base sm:text-lg mb-3">Description</h3>
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {{ request.properties.description }}
            </p>
          </div>

          <!-- Amenities -->
          <div v-if="request.properties?.amenities?.length" class="mt-8 sm:mt-10">
            <h3 class="font-semibold text-base sm:text-lg mb-3">Amenities</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(amenity, i) in request.properties.amenities" 
                :key="i"
                class="bg-gray-100 px-3.5 py-1.5 rounded-xl text-sm text-gray-700"
              >
                {{ amenity }}
              </span>
            </div>
          </div>
        </div>

        <!-- Request Information -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <h2 class="text-lg sm:text-xl font-semibold mb-5">Request Information</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <p class="text-sm text-gray-500">Request Type</p>
              <p class="font-medium mt-1 capitalize text-gray-800">
                {{ request.request_type?.replace('_', ' ') }}
              </p>
            </div>
            
            <div v-if="request.inspection_date">
              <p class="text-sm text-gray-500">Preferred Inspection Date</p>
              <p class="font-medium mt-1 text-gray-800">
                {{ formatDate(request.inspection_date) }}
                <span v-if="request.inspection_time" class="text-gray-600">
                  • {{ request.inspection_time }}
                </span>
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Current Status</p>
              <p class="font-medium mt-1 capitalize text-gray-800">
                {{ formatStatus(request.status) }}
              </p>
            </div>
          </div>

          <div v-if="request.message" class="mt-6 pt-6 border-t">
            <p class="text-sm text-gray-500 mb-2">Your Message</p>
            <p class="text-gray-700 italic leading-relaxed text-sm sm:text-base">
              "{{ request.message }}"
            </p>
          </div>
        </div>

        <!-- Admin Note -->
        <div 
          v-if="request.admin_note" 
          class="bg-amber-50 border border-amber-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6"
        >
          <h3 class="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <MessageSquare class="w-4 h-4" /> Note from Management
          </h3>
          <p class="text-amber-800 text-sm sm:text-base leading-relaxed">
            {{ request.admin_note }}
          </p>
        </div>
      </div>

      <!-- Loading / Error States -->
      <div v-else-if="loading" class="text-center py-20">
        <p class="text-gray-500">Loading request details...</p>
      </div>
      <div v-else class="text-center py-20">
        <p class="text-gray-500">Request not found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Clock, CheckCircle, XCircle, Send, MessageSquare } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const request = ref(null)
const loading = ref(true)
const mainImage = ref('')
const showVideo = ref(false)

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-emerald-100 text-emerald-700',
  inspection_scheduled: 'bg-purple-100 text-purple-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600'
}

const statusIcons = {
  pending: Clock,
  under_review: Send,
  approved: CheckCircle,
  inspection_scheduled: Clock,
  scheduled: Clock,
  completed: CheckCircle,
  rejected: XCircle,
  cancelled: XCircle
}

const formatStatus = (status) => {
  if (!status) return ''
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isInspectionScheduled = computed(() => {
  const status = request.value?.status?.toLowerCase()
  return status === 'inspection_scheduled' || status === 'scheduled'
})

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

const goToInspections = () => {
  router.push('/customer/inspections')
}

onMounted(fetchRequest)
</script>