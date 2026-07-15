<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100]">
    <div class="bg-white max-w-4xl w-full max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="px-8 py-6 border-b flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Inspection Request</h2>
          <p class="text-sm text-medium-gray">REQ-{{ request?.id?.slice(0,8) }}</p>
        </div>
        <button @click="close" class="text-4xl leading-none text-medium-gray hover:text-black">×</button>
      </div>

      <div class="flex-1 overflow-auto">
        <!-- Property Gallery -->
        <div class="relative bg-black h-96">
          <img 
            :src="mainImage" 
            class="w-full h-full object-cover"
          />
          <div class="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 cursor-pointer"
              :class="{ 'border-[var(--royal-blue)]': mainImage === url }"
              @click="mainImage = url"
            >
              <img :src="url" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div class="p-8 space-y-10">
          <!-- Customer Info -->
          <div>
            <h3 class="font-semibold mb-3">Customer</h3>
            <div class="flex items-center gap-4 bg-gray-50 rounded-3xl p-6">
              <img 
                :src="request?.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${request?.profiles?.full_name}`" 
                class="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <div class="font-semibold text-xl">{{ request?.profiles?.full_name }}</div>
                <div class="text-medium-gray">{{ request?.profiles?.phone }}</div>
              </div>
            </div>
          </div>

          <!-- Property Info -->
          <div>
            <h3 class="font-semibold mb-4">Property Details</h3>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <p class="text-medium-gray">Title</p>
                <p class="font-semibold">{{ request?.properties?.title }}</p>
              </div>
              <div>
                <p class="text-medium-gray">Location</p>
                <p class="font-semibold">{{ request?.properties?.area }}, {{ request?.properties?.city }}</p>
              </div>
            </div>
          </div>

          <!-- Inspection Details -->
          <div>
            <h3 class="font-semibold mb-4">Inspection Schedule</h3>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <p class="text-medium-gray">Date</p>
                <p class="font-semibold">{{ formatDate(request?.inspection_date) }}</p>
              </div>
              <div>
                <p class="text-medium-gray">Time</p>
                <p class="font-semibold">{{ request?.inspection_time }}</p>
              </div>
            </div>
          </div>

          <!-- Admin Note -->
          <div v-if="request?.admin_note">
            <h3 class="font-semibold mb-3">Admin Note</h3>
            <div class="bg-gray-50 p-6 rounded-3xl">
              {{ request.admin_note }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t bg-gray-50 flex gap-4">
        <button @click="close" class="flex-1 py-4 border border-gray-300 rounded-3xl font-medium">
          Close
        </button>
        <button 
          v-if="request?.status === 'pending'"
          @click="approve"
          class="flex-1 py-4 bg-green-600 text-white rounded-3xl font-semibold">
          Approve
        </button>
        <button 
          v-if="request?.status === 'pending'"
          @click="reject"
          class="flex-1 py-4 bg-red-600 text-white rounded-3xl font-semibold">
          Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  request: Object
})

const emit = defineEmits(['close', 'approve', 'reject'])

const mainImage = ref('')

const allImages = computed(() => {
  const images = []
  if (props.request?.properties?.cover_image) images.push(props.request.properties.cover_image)
  if (props.request?.properties?.image_1) images.push(props.request.properties.image_1)
  if (props.request?.properties?.image_2) images.push(props.request.properties.image_2)
  if (props.request?.properties?.image_3) images.push(props.request.properties.image_3)
  if (props.request?.properties?.image_4) images.push(props.request.properties.image_4)
  if (props.request?.properties?.image_5) images.push(props.request.properties.image_5)
  if (props.request?.properties?.video_url) images.push(props.request.properties.video_url)
  return images
})

const formatDate = (dateString) => {
  if (!dateString) return 'Not Set'
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const close = () => emit('close')
const approve = () => emit('approve', props.request)
const reject = () => emit('reject', props.request)

// Set main image
watch(() => props.request, (newReq) => {
  if (newReq?.properties?.cover_image) mainImage.value = newReq.properties.cover_image
}, { immediate: true })
</script>