<template>
  <section class="py-12 sm:py-16 bg-light-blue">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-10 sm:mb-12">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--royal-blue)] tracking-tight mb-3">
          Browse Homes in Ilorin and Ijebu Ode
        </h2>
        <p class="text-sm sm:text-base text-[var(--royal-blue)] max-w-2xl mx-auto">
          Explore verified rental properties across Nigeria's most popular cities.
        </p>
      </div>

      <!-- States / Cities Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <router-link
          v-for="city in cities"
          :key="city.slug"
          :to="city.path"
          class="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
        >
          <div class="relative h-52 sm:h-60 md:h-64 overflow-hidden">
            <!-- City Image -->
            <img
              :src="city.image"
              :alt="city.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>
            
            <!-- Content on Image -->
            <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-base sm:text-lg">📍</span>
                <span class="font-semibold text-lg sm:text-xl tracking-tight">
                  {{ city.name }}
                </span>
              </div>
              <p class="text-xs sm:text-sm opacity-90">
                <span v-if="loading">Loading...</span>
                <span v-else>
                  {{ city.listings.toLocaleString() }} verified listing{{ city.listings === 1 ? '' : 's' }}
                </span>
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Explore Button -->
      <div class="text-center mt-10 sm:mt-12">
        <router-link
          to="/properties"
          class="inline-flex items-center gap-2 sm:gap-3 bg-mediumBlue hover:bg-steel-blue text-royal-blue px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all active:scale-95 shadow-lg hover:shadow-xl"
        >
          Explore Properties
          <span class="text-lg sm:text-xl">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const loading = ref(true)

// Base city data (images stay static)
const cities = ref([
  {
    name: 'Ilorin',
    slug: 'ilorin',
    path: '/ilorin',          // ← direct link
    listings: 0,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
  },
  {
    name: 'Ijebu Ode',
    slug: 'ijebu-ode',
    path: '/ijebu-ode',       // ← direct link
    listings: 0,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80'
  }
])

const fetchCityListings = async () => {
  try {
    loading.value = true

    // Fetch counts for both cities in parallel
    const [ilorinRes, ijebuRes] = await Promise.all([
      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .ilike('city', 'Ilorin'),

      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .ilike('city', 'Ijebu Ode')
    ])

    // Update the counts
    cities.value = cities.value.map(city => {
      if (city.name === 'Ilorin') {
        return { ...city, listings: ilorinRes.count || 0 }
      }
      if (city.name === 'Ijebu Ode') {
        return { ...city, listings: ijebuRes.count || 0 }
      }
      return city
    })
  } catch (err) {
    console.error('Failed to fetch city listings:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCityListings()
})
</script>