<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    
    <!-- Sliding Background Images -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="(image, index) in heroImages"
        :key="index"
        :class="['absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out', 
                 currentSlide === index ? 'opacity-100' : 'opacity-0']"
        :style="{ backgroundImage: `url(${image.url})` }"
      >
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/55 md:bg-black/50"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-5xl mx-auto text-center px-5 sm:px-6 lg:px-8 pt-20 pb-16">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter text-white mb-6 px-2">
        Find Your Perfect Home<br class="hidden sm:block">Across Nigeria
      </h1>
      
      <p class="text-lg sm:text-xl md:text-2xl text-[#ebf8ff] max-w-3xl mx-auto mb-10 px-4">
        Discover verified houses and apartments in all 36 states.<br class="hidden md:block">
        From Lagos to Kano — Rent smarter and faster.
      </p>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto bg-white rounded-3xl p-2 shadow-2xl mx-4">
        <div class="flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <span class="absolute left-5 top-1/2 -translate-y-1/2 text-2xl"><MapPin class="w-5 h-5" /></span>
            <input
              type="text"
              v-model="searchLocation"
              placeholder="Enter city or state (e.g. Lekki, Abuja, Port Harcourt)"
              class="w-full pl-14 pr-6 py-4 md:py-5 rounded-3xl focus:outline-none text-[#424242] placeholder:text-medium-gray text-base"
            />
          </div>
          
          <button 
            @click="handleSearch"
            class="bg-royal-blue hover:bg-medium-blue active:bg-medium-blue text-white px-8 md:px-12 py-4 md:py-5 rounded-3xl font-semibold flex items-center justify-center gap-2 transition-all text-base whitespace-nowrap">
            <span><Search class="w-5 h-5"/> </span>
            Search Homes
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16 mt-12 text-white">
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold">50K+</div>
          <div class="text-sm sm:text-base opacity-80">Properties</div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold">36</div>
          <div class="text-sm sm:text-base opacity-80">States</div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold">12K+</div>
          <div class="text-sm sm:text-base opacity-80">Happy Tenants</div>
        </div>
      </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
      <button
        v-for="(image, index) in heroImages"
        :key="index"
        @click="currentSlide = index"
        :class="['w-3 h-3 rounded-full transition-all duration-300', 
                 currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80']"
      />
    </div>

    <!-- Scroll Down Indicator -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-2xl animate-bounce hidden sm:block">
      ↓
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin, Home, Search } from 'lucide-vue-next'

const searchLocation = ref('')

const heroImages = ref([
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80' },
  { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80' }
])

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroImages.value.length
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

const handleSearch = () => {
  if (searchLocation.value.trim()) {
    console.log('Searching for:', searchLocation.value)
    router.push(`/properties?search=${encodeURIComponent(searchLocation.value)}`)
  } else {
    alert("Please enter a location to search")
  }
}
</script>