<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-6xl mx-auto px-4 pt-8">
      
      <!-- Back Button -->
      <button 
        @click="$router.back()" 
        class="flex items-center gap-2 text-[var(--royal-blue)] hover:text-[var(--meduim-blue)] mb-8 font-medium"
      >
        ← Back to My Properties
      </button>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-xl mb-4">{{ error }}</p>
        <button 
          @click="fetchProperty"
          class="px-6 py-3 bg-[var(--royal-blue)] text-[var(--white)] rounded-2xl hover:bg-[var(--steel-blue)]"
        >
          Try Again
        </button>
      </div>

      <!-- Success Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Images Section -->
        <div class="lg:col-span-7 space-y-6">
          <div v-if="property.cover_image" class="rounded-3xl overflow-hidden shadow-2xl bg-[var(--white)]">
            <img 
              :src="property.cover_image" 
              class="w-full h-[520px] object-cover"
              alt="Cover Image"
            />
          </div>

          <div v-if="allImages.length > 1" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="rounded-3xl overflow-hidden border border-[var(--periwinkle)] aspect-video bg-[var(--white)]"
            >
              <img 
                :src="url" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div v-if="property.video_url" class="rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video :src="property.video_url" controls class="w-full aspect-video"></video>
          </div>
        </div>

        <!-- Details Section -->
        <div class="lg:col-span-5">
          <div class="bg-[var(--white)] rounded-3xl shadow-2xl p-8 sticky top-8">
            
            <div class="flex justify-between items-start mb-6">
              <span class="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-2xl capitalize">
                {{ property.status || 'pending' }}
              </span>
              <div class="text-right">
                <p class="text-4xl font-bold text-[var(--royal-blue)]">
                  ₦{{ property.price?.toLocaleString() || '0' }}
                </p>
                <p class="text-sm text-[var(--royal-blue)]">{{ property.purpose }}</p>
              </div>
            </div>

            <h1 class="text-3xl font-bold leading-tight mb-2 text-[var(--royal-blue)]">{{ property.title }}</h1>
            
            <p class="text-[var(--royal-blue)] flex items-center gap-2 mb-8">
              <i class="fas fa-map-marker-alt"></i>
              {{ property.area }}, {{ property.city }}, {{ property.state }}
            </p>

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
                <div class="text-2xl font-semibold [var(--royal-blue)]">{{ property.parking_spaces || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">PARKING</div>
              </div>
            </div>

            <div class="space-y-4 text-sm">
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Property Type</span>
                <strong>{{ property.property_type }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Condition</span>
                <strong>{{ property.condition }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Availability</span>
                <strong>{{ property.availability }}</strong>
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

            <div v-if="property.description" class="mt-10 pt-8 border-t text-[var(--royal-blue)]">
              <h4 class="font-semibold mb-3">Description</h4>
              <p class="leading-relaxed text-[var(--royal-blue)] whitespace-pre-wrap">
                {{ property.description }}
              </p>
            </div>

            <div class="mt-10 pt-8 border-t">
              <button class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-[var(--white)] py-4 rounded-2xl font-semibold text-lg transition">
                Contact Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const property = ref<any>({})
const loading = ref(true)
const error = ref<string>('')

const fetchProperty = async () => {
  const id = route.params.id as string

  if (!id) {
    error.value = "No Property ID found in URL"
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
    error.value = "Property not found or access denied"
  } else {
    property.value = data || {}
  }

  loading.value = false
}

// Watch for changes in route params
watch(() => route.params.id, (newId) => {
  if (newId) fetchProperty()
}, { immediate: true })

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
</script>