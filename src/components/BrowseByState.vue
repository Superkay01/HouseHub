<template>
  <section class="py-8 sm:py-12 md:py-16 bg-light-blue">
    <div class="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-6 sm:mb-10 md:mb-12">
        <h2 class="text-lg xs:text-xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] tracking-tight mb-2 sm:mb-3">
          Browse Homes in Ilorin and Ijebu Ode
        </h2>
        <p class="text-xs xs:text-sm sm:text-base md:text-lg text-[var(--royal-blue)] max-w-2xl mx-auto px-1">
          Explore verified rental properties across Nigeria's most popular cities.
        </p>
      </div>

      <!-- States / Cities Grid — 2 columns on all devices -->
      <div class="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-5 md:gap-6 lg:gap-8">
        <router-link
          v-for="city in cities"
          :key="city.slug"
          :to="city.path"
          class="group bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
        >
          <div class="relative h-32 xs:h-40 sm:h-52 md:h-60 lg:h-64 overflow-hidden">
            <!-- City Image -->
            <img
              :src="city.image"
              :alt="city.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>

            <!-- Content on Image -->
            <div class="absolute bottom-0 left-0 right-0 p-2.5 xs:p-3 sm:p-5 md:p-6 text-white">
              <div class="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <span class="text-xs xs:text-sm sm:text-lg">📍</span>
                <span class="font-semibold text-sm xs:text-base sm:text-lg md:text-xl tracking-tight leading-tight">
                  {{ city.name }}
                </span>
              </div>
              <p class="text-[10px] xs:text-xs sm:text-sm opacity-90 leading-tight">
                <span v-if="loading">Loading...</span>
                <span v-else>
                  {{ city.listings.toLocaleString() }} listing{{ city.listings === 1 ? '' : 's' }}
                </span>
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Explore Button -->
      <div class="text-center mt-6 sm:mt-10 md:mt-12">
        <router-link
          to="/property"
          class="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-3 bg-[var(--medium-blue)] hover:bg-[var(--steel-blue)] text-[var(--white)] px-4 xs:px-5 sm:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-lg xs:rounded-xl sm:rounded-2xl font-semibold text-xs xs:text-sm sm:text-base transition-all active:scale-95 shadow-lg hover:shadow-xl"
        >
          Explore Properties
          <span class="text-base xs:text-lg sm:text-xl">→</span>
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
    path: '/ilorin',
    listings: 0,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
  },
  {
    name: 'Ijebu Ode',
    slug: 'ijebu-ode',
    path: '/ijebu-ode',
    listings: 0,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80'
  }
])

const fetchCityListings = async () => {
  try {
    loading.value = true

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