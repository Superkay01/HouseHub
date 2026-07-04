<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-10" />
          <h1 class="text-2xl font-bold text-[var(--royal-blue)]">LodgeNext</h1>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <button @click="$router.back()" class="mb-8 flex items-center gap-2 text-medium-gray hover:text-[var(--royal-blue)]">
        ← Back to Browse
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Left: Gallery -->
        <div class="lg:col-span-7">
          <!-- Main Image -->
          <div class="relative rounded-3xl overflow-hidden mb-6 bg-black aspect-[16/10] cursor-pointer" 
               @click="showLightbox = true">
            <img 
              :src="mainImage" 
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-6 left-6 bg-black/70 text-white px-6 py-3 rounded-2xl font-semibold">
              ₦{{ Number(property?.price).toLocaleString() }} / year
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div class="grid grid-cols-5 gap-4">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="aspect-video rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105"
              :class="{ 'border-[var(--royal-blue)] ring-2 ring-offset-2 ring-[var(--royal-blue)]': mainImage === url }"
              @click="switchToImage(url)"
            >
              <img :src="url" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Right: Info -->
        <div class="lg:col-span-5">
          <!-- Your right side content goes here -->
        </div>
      </div>

      <!-- Description -->
      <div class="mt-16 max-w-3xl">
        <h3 class="text-2xl font-semibold mb-6">Property Description</h3>
        <p class="leading-relaxed text-medium-gray whitespace-pre-wrap text-lg">
          {{ property?.description }}
        </p>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" @click.self="showLightbox = false">
      <div class="relative max-w-5xl w-full p-4">
        <img :src="mainImage" class="max-h-[90vh] mx-auto rounded-3xl" />
        <button @click="showLightbox = false" class="absolute -top-4 -right-4 text-white text-5xl hover:text-gray-300">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const route = useRoute()
const property = ref(null)
const mainImage = ref('')
const showLightbox = ref(false)

const fetchProperty = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        is_verified,
        agency_name
      )
    `)
    .eq('id', route.params.id)
    .single()

  if (error) console.error(error)
  else property.value = data
}

const allImages = computed(() => {
  if (!property.value) return []
  return [
    property.value.cover_image,
    property.value.image_1,
    property.value.image_2,
    property.value.image_3,
    property.value.image_4,
    property.value.image_5
  ].filter(url => url)
})

const switchToImage = (url) => {
  if (url) mainImage.value = url
}

onMounted(async () => {
  await fetchProperty()
  
  // Set initial image
  if (property.value?.cover_image) {
    mainImage.value = property.value.cover_image
  }
})
</script>