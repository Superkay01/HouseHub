<template>
  <div class="space-y-10">
    <h2 class="text-2xl font-semibold text-[#0025cc]">Review Your Property Listing</h2>

    <div class="bg-gray-50 rounded-3xl p-8">
      <div class="flex flex-col lg:flex-row gap-10">
        
        <!-- Media Section -->
        <div class="lg:w-5/12 space-y-6">
          
          <!-- Cover Image -->
          <div v-if="form.cover_image" class="relative">
            <img 
              :src="form.cover_image" 
              class="w-full aspect-video object-cover rounded-3xl shadow-md border border-gray-100"
            />
            <div class="absolute top-4 left-4 bg-black/70 text-white text-xs px-4 py-1.5 rounded-2xl font-medium">
              Cover Image
            </div>
          </div>

          <!-- Other Images & Video -->
          <div v-if="hasOtherMedia" class="space-y-4">
            <h4 class="font-semibold text-gray-700">Other Photos & Video</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <!-- Show image_1 to image_5 (excluding cover) -->
              <div v-for="(url, index) in otherImages" :key="index" 
                   class="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video group">
                <img :src="url" class="w-full h-full object-cover" />
              </div>

              <!-- Video -->
              <div v-if="form.video_url" class="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-black">
                <video :src="form.video_url" class="w-full h-full object-cover" muted></video>
                <div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl">VIDEO</div>
              </div>
            </div>
          </div>

          <div v-if="!form.cover_image && !hasOtherMedia" class="text-center py-12 text-gray-400">
            No media uploaded yet
          </div>
        </div>

        <!-- Property Details -->
        <div class="lg:w-7/12 space-y-8">
          <div>
            <h3 class="text-3xl font-bold leading-tight">{{ form.title || 'Untitled Property' }}</h3>
            <p class="text-[#546cdd] mt-2 text-lg">
              {{ form.property_type }} • {{ form.purpose }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-y-6 text-sm">
            <div>
              <span class="text-gray-500">Location</span><br>
              <strong class="text-base">{{ form.area }}, {{ form.city }}, {{ form.state }}</strong>
            </div>
            <div>
              <span class="text-gray-500">Full Address</span><br>
              <strong class="text-base">{{ form.address || 'Not provided' }}</strong>
            </div>
            <div>
              <span class="text-gray-500">Price</span><br>
              <strong class="text-3xl text-green-600">₦{{ form.price?.toLocaleString() || '0' }}</strong>
              <span class="text-sm text-gray-500">/ year</span>
            </div>
            <div>
              <span class="text-gray-500">Service Charge</span><br>
              <strong class="text-xl">₦{{ form.service_charge?.toLocaleString() || '0' }}</strong>
            </div>
          </div>

          <div>
            <span class="text-gray-500 block mb-3">Key Features</span>
            <div class="flex flex-wrap gap-3">
              <span v-if="form.bedrooms" class="bg-white px-5 py-2.5 rounded-2xl text-sm shadow-sm">
                🛏️ {{ form.bedrooms }} Bedroom{{ form.bedrooms > 1 ? 's' : '' }}
              </span>
              <span v-if="form.bathrooms" class="bg-white px-5 py-2.5 rounded-2xl text-sm shadow-sm">
                🛁 {{ form.bathrooms }} Bathroom{{ form.bathrooms > 1 ? 's' : '' }}
              </span>
              <span v-if="form.toilets" class="bg-white px-5 py-2.5 rounded-2xl text-sm shadow-sm">
                🚽 {{ form.toilets }} Toilet{{ form.toilets > 1 ? 's' : '' }}
              </span>
              <span v-if="form.parking_spaces" class="bg-white px-5 py-2.5 rounded-2xl text-sm shadow-sm">
                🅿️ {{ form.parking_spaces }} Parking
              </span>
            </div>
          </div>

          <div v-if="form.amenities?.length" class="pt-6 border-t">
            <h4 class="font-semibold mb-3">Amenities</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="amenity in form.amenities" :key="amenity" 
                    class="bg-white px-5 py-2 rounded-2xl text-sm border">
                ✅ {{ amenity }}
              </span>
            </div>
          </div>

          <div v-if="form.description" class="pt-6 border-t">
            <h4 class="font-semibold mb-3">Description</h4>
            <p class="leading-relaxed text-gray-700 whitespace-pre-wrap">
              {{ form.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Note -->
    <div class="bg-blue-50 border border-blue-100 rounded-3xl p-6">
      <div class="flex items-start gap-4">
        <div class="text-3xl">ℹ️</div>
        <div>
          <p class="font-medium text-[#0025cc]">Your property will be reviewed by our admin team.</p>
          <p class="text-sm text-gray-600 mt-1">
            Once approved, it will be visible to potential tenants. This usually takes 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  form: any
}>()

// Collect all uploaded images from image_1 to image_5
const allImages = computed(() => {
  const imgs: string[] = []
  if (props.form.image_1) imgs.push(props.form.image_1)
  if (props.form.image_2) imgs.push(props.form.image_2)
  if (props.form.image_3) imgs.push(props.form.image_3)
  if (props.form.image_4) imgs.push(props.form.image_4)
  if (props.form.image_5) imgs.push(props.form.image_5)
  return imgs
})

// Other images (excluding cover)
const otherImages = computed(() => {
  return allImages.value.filter(url => url !== props.form.cover_image)
})

const hasOtherMedia = computed(() => {
  return otherImages.value.length > 0 || !!props.form.video_url
})
</script>