<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Sliding Background Images -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="(image, index) in heroImages"
        :key="index"
        :class="[
          'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out',
          currentSlide === index ? 'opacity-100' : 'opacity-0'
        ]"
        :style="{ backgroundImage: `url(${image.url})` }"
      >
        <div class="absolute inset-0 bg-black/55 md:bg-black/50"></div>
      </div>
    </div>

    

    <!-- Content -->
    <div class="relative z-10 w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-14 sm:pb-16">
      <!-- Heading - normal readable sizes -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug tracking-tight text-white mb-4 sm:mb-5">
        Find Your Perfect Home<br class="hidden sm:block" />
        Within Ilorin and Ijebu Ode
      </h1>

      <p class="text-sm sm:text-base md:text-lg text-[#ebf8ff] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
        Find verified homes and apartments across Ilorin and Ijebu Ode.
        <br class="hidden md:block" />
        Browse trusted listings, connect with agents, and rent with confidence.
      </p>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-2 shadow-2xl">
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)] pointer-events-none">
              <MapPin class="w-5 h-5" />
            </span>
            <input
              type="text"
              v-model="searchLocation"
              placeholder="Enter city or state (e.g. Ilorin, Ijebu Ode)"
              class="w-full pl-12 pr-4 py-3 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0025cc] text-sm sm:text-base text-[#424242] placeholder:text-gray-400"
            />
          </div>

          <button
            @click="handleSearch"
            class="bg-[#0025cc] hover:bg-[#001fa3] active:scale-95 text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <Search class="w-4 h-4 sm:w-5 sm:h-5" />
            Search Homes
          </button>
        </div>
      </div>

      <!-- Quick Stats (real data) -->
      <div class="flex justify-center gap-8 sm:gap-12 md:gap-16 mt-10 sm:mt-12 text-white">
        <div class="text-center min-w-[80px]">
          <div class="text-2xl sm:text-3xl font-bold tabular-nums">
            {{ statsLoading ? '…' : formatNumber(stats.properties) }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Properties</div>
        </div>

        <div class="text-center min-w-[80px]">
          <div class="text-2xl sm:text-3xl font-bold tabular-nums">
            {{ statsLoading ? '…' : stats.states }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">States</div>
        </div>

        <div class="text-center min-w-[80px]">
          <div class="text-2xl sm:text-3xl font-bold tabular-nums">
            {{ statsLoading ? '…' : formatNumber(stats.tenants) }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Happy Tenants</div>
        </div>
      </div>
      <div class="">
      <router-link
        to="/login"
        class="  gap-2 bg-[var(--royal-blue)] hover:bg-[var(--steel-blue)] backdrop-blur-md text-white text-sm font-medium px-4 py-2 sm:px-5 sm:py-2 rounded-full border border-white/30 transition-all"
      >
        Sign In
      </router-link>
    </div>
    </div>

    <!-- Slide Indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
      <button
        v-for="(image, index) in heroImages"
        :key="index"
        @click="currentSlide = index"
        :class="[
          'w-2.5 h-2.5 rounded-full transition-all duration-300',
          currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, Search } from 'lucide-vue-next'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()
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

// ---------- Stats from Supabase ----------
const stats = ref({
  properties: 0,
  states: 0,
  tenants: 0
})
const statsLoading = ref(true)

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K+'
  }
  return num.toString()
}

const fetchStats = async () => {
  try {
    statsLoading.value = true

    // 1. Total properties
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })

    // 2. Distinct states from profiles
    const { data: profilesWithState } = await supabase
      .from('profiles')
      .select('state')
      .not('state', 'is', null)

    const uniqueStates = new Set(
      (profilesWithState || [])
        .map(p => p.state?.trim().toLowerCase())
        .filter(Boolean)
    )

    // 3. Happy tenants (role = customer)
    const { count: tenantsCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')

    stats.value = {
      properties: propertiesCount || 0,
      states: uniqueStates.size || 0,
      tenants: tenantsCount || 0
    }
  } catch (err) {
    console.error('Failed to load hero stats:', err)
  } finally {
    statsLoading.value = false
  }
}

// ---------- Lifecycle ----------
onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
  fetchStats()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

// ---------- Search ----------
const handleSearch = () => {
  const query = searchLocation.value.trim()
  if (query) {
    router.push(`/properties?search=${encodeURIComponent(query)}`)
  } else {
    alert('Please enter a location to search')
  }
}
</script>