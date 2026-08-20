<template>
  <div class="fixed inset-0 z-50 flex items-center justify-end bg-black/70">
    <div class="bg-white w-[75%] max-w-6xl h-full overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-8 py-5 flex items-center justify-between z-10">
        <div>
          <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Property Details</h2>
          <p class="text-sm text-medium-gray">{{ property.title }}</p>
        </div>
        <button 
          @click="close"
          class="text-4xl leading-none text-medium-gray hover:text-black transition-colors">
          ×
        </button>
      </div>

      <div class="p-8 space-y-10">
        <!-- Main Image -->
        <div class="rounded-3xl overflow-hidden shadow-2xl bg-black">
          <img 
            :src="mainImage" 
            class="w-full h-[520px] object-cover cursor-pointer"
            @click="showFullScreen(mainImage)"
          />
        </div>

        <!-- Gallery -->
        <div v-if="allImages.length > 1" class="space-y-4">
          <h3 class="font-semibold text-[var(--royal-blue)]">Property Gallery</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="rounded-3xl overflow-hidden shadow-md aspect-video bg-gray-100 cursor-pointer hover:ring-2 hover:ring-[var(--royal-blue)] transition-all"
              :class="{ 'ring-2 ring-[var(--royal-blue)]': url === mainImage }"
              @click="setMainImage(url)"
            >
              <img :src="url" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Video -->
        <div v-if="property.video_url" class="space-y-4">
          <h3 class="font-semibold text-[var(--royal-blue)]">Property Video</h3>
          <div class="rounded-3xl overflow-hidden shadow-xl bg-black">
            <video :src="property.video_url" controls class="w-full aspect-video"></video>
          </div>
        </div>

        <!-- Property Info + Price -->
        <div class="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div>
            <h1 class="text-3xl font-bold text-[var(--royal-blue)]">{{ property.title }}</h1>
            <p class="text-xl text-[var(--royal-blue)] mt-1">
              {{ property.property_type }} • {{ property.purpose }}
            </p>
          </div>

          <!-- Pricing Summary Card -->
          <div class="bg-[#f0f7ff] border border-[var(--hover-blue)] rounded-3xl p-6 min-w-[280px] space-y-3">
            <div>
              <p class="text-sm text-[var(--steel-blue)]">Listed / Transaction Price</p>
              <p class="text-3xl font-bold text-[var(--royal-blue)]">
                ₦{{ formatNaira(property.price) }}
              </p>
              <p class="text-xs text-gray-500">{{ property.rent_duration || 'per year' }}</p>
            </div>

            <div class="border-t border-[var(--hover-blue)] pt-3 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-[var(--steel-blue)]">System Charge Rate</span>
                <span class="font-semibold text-[var(--royal-blue)]">5%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-[var(--steel-blue)]">Platform System Charge</span>
                <span class="font-bold text-green-600 text-lg">
                  ₦{{ formatNaira(systemChargeAmount) }}
                </span>
              </div>
            </div>

            <p class="text-xs text-gray-500 leading-relaxed pt-1">
              Calculated automatically as 5% of the listed transaction price. 
              This is a platform charge and is <strong>not</strong> added to the customer’s inspection payment.
            </p>
          </div>
        </div>

        <!-- Status -->
        <div>
          <PropertyStatusBadge :status="property.status" />
        </div>

        <!-- Location -->
        <div>
          <h3 class="font-semibold mb-2 text-[var(--royal-blue)]">Location</h3>
          <p class="text-lg text-[var(--royal-blue)]">
            📍 {{ property.address || property.area }}, {{ property.city }}, {{ property.state }}
          </p>
        </div>

        <!-- Specs -->
        <div class="grid grid-cols-3 gap-6 py-6 border-t border-b">
          <div class="text-center">
            <div class="text-3xl font-semibold text-[var(--royal-blue)]">{{ property.bedrooms || 0 }}</div>
            <div class="text-xs text-[var(--royal-blue)]">BEDROOMS</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold text-[var(--royal-blue)]">{{ property.bathrooms || 0 }}</div>
            <div class="text-xs text-[var(--royal-blue)]">BATHROOMS</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-semibold text-[var(--royal-blue)]">{{ property.toilets || 0 }}</div>
            <div class="text-xs text-[var(--royal-blue)]">TOILETS</div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="font-semibold mb-3 text-[var(--royal-blue)]">Description</h3>
          <p class="text-[var(--royal-blue)] leading-relaxed whitespace-pre-wrap">
            {{ property.description || 'No description provided.' }}
          </p>
        </div>

        <!-- Amenities -->
        <div v-if="property.amenities && property.amenities.length">
          <h3 class="font-semibold mb-4 text-[var(--royal-blue)]">Amenities</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(amenity, i) in property.amenities" 
              :key="i"
              class="bg-[var(--hover-blue)] text-[var(--royal-blue)] px-4 py-2 rounded-2xl text-sm"
            >
              {{ amenity }}
            </span>
          </div>
        </div>

        <!-- Agent -->
        <div v-if="property.profiles" class="bg-gray-50 rounded-3xl p-6">
          <h3 class="font-semibold mb-4 text-[var(--royal-blue)]">Listed by Agent</h3>
          <div class="flex items-center gap-4">
            <img 
              :src="property.profiles.avatar_url || `https://ui-avatars.com/api/?name=${property.profiles.full_name}`" 
              class="w-16 h-16 rounded-2xl object-cover"
            />
            <div>
              <div class="font-semibold text-[var(--royal-blue)]">{{ property.profiles.full_name }}</div>
              <div v-if="property.profiles.is_verified" class="text-green-600 text-sm">✓ Verified Agent</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 bg-white border-t p-6 flex gap-4">
        <button 
          @click="close"
          class="flex-1 py-4 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition">
          Close
        </button>
        <button 
          v-if="property.status !== 'approved'"
          @click="handleApprove"
          class="flex-1 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition">
          Approve Property
        </button>
        <button 
          v-if="property.status !== 'rejected'"
          @click="handleReject"
          class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition">
          Reject Property
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import PropertyStatusBadge from './PropertyStatusBadge.vue'
import { calculateSystemCharge, formatNaira } from '@/utils/systemCharge'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'approve', 'reject'])

const mainImage = ref(props.property.cover_image)

// Always calculate from the listed price (never trust a stored value from the agent)
const systemChargeAmount = computed(() => {
  return calculateSystemCharge(props.property.price)
})

const allImages = computed(() => {
  const images = []
  if (props.property.cover_image) images.push(props.property.cover_image)
  if (props.property.image_1) images.push(props.property.image_1)
  if (props.property.image_2) images.push(props.property.image_2)
  if (props.property.image_3) images.push(props.property.image_3)
  if (props.property.image_4) images.push(props.property.image_4)
  if (props.property.image_5) images.push(props.property.image_5)
  return images
})

const setMainImage = (url) => {
  mainImage.value = url
}

const showFullScreen = (url) => {
  const win = window.open(url, '_blank')
  if (win) win.focus()
}

const close = () => emit('close')

const handleApprove = () => {
  if (confirm('Approve this property?')) {
    emit('approve', props.property.id)
  }
}

const handleReject = () => {
  if (confirm('Reject this property?')) {
    emit('reject', props.property.id)
  }
}
</script>