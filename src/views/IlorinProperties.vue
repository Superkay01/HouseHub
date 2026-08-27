<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Hero / Header --><Navbar/>
    <div class="relative bg-gradient-to-br from-[#0025cc] via-[#2e4cd5] to-[#546cdd] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(at_center,#ffffff12_0%,transparent_70%)]"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Properties in Ilorin
        </h1>
        <p class="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
          Browse verified houses and apartments available for rent in Ilorin, Kwara State.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 pb-12">
      <!-- Results Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <p class="inline-flex items-center bg-white border border-gray-200 rounded-2xl px-4 sm:px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm">
          <span class="font-bold text-[#0025cc] mr-1.5">
            {{ loading ? '…' : properties.length }}
          </span>
          {{ properties.length === 1 ? 'property' : 'properties' }} found in Ilorin
        </p>

        <select
          v-model="sortBy"
          @change="sortProperties"
          class="w-full sm:w-auto border border-gray-300 rounded-2xl px-4 sm:px-5 py-2.5 focus:outline-none focus:border-[#0025cc] focus:ring-2 focus:ring-[#0025cc]/20 bg-white text-sm font-medium shadow-sm"
        >
          <option value="newest">Newest Listings</option>
          <option value="price-low">Lowest Price</option>
          <option value="price-high">Highest Price</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse"
        >
          <div class="h-48 bg-gray-200"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="properties.length === 0"
        class="bg-white rounded-2xl shadow-md p-10 text-center"
      >
        <p class="text-lg font-medium text-gray-700 mb-2">No properties found in Ilorin</p>
        <p class="text-sm text-gray-500 mb-6">Check back later or explore other cities.</p>
        <router-link
          to="/properties"
          class="inline-flex items-center gap-2 bg-[#0025cc] hover:bg-[#001fa3] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          View All Properties
        </router-link>
      </div>

      <!-- Properties Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        <router-link
          v-for="property in properties"
          :key="property.id"
          :to="`/properties/${property.id}`"
          class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Cover Image -->
          <div class="relative h-48 sm:h-52 overflow-hidden">
            <img
              :src="property.cover_image || 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'"
              :alt="property.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute top-3 left-3">
              <span class="bg-[#0025cc] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                {{ property.purpose }}
              </span>
            </div>
            <div class="absolute top-3 right-3">
              <span class="bg-white/90 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {{ property.property_type }}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 sm:p-5">
            <h3 class="font-semibold text-gray-900 text-base sm:text-lg line-clamp-1 mb-1 group-hover:text-[#0025cc] transition">
              {{ property.title }}
            </h3>
            
            <p class="text-sm text-gray-500 flex items-center gap-1 mb-3">
              <span>📍</span>
              <span class="line-clamp-1">{{ property.area || property.city }}, {{ property.state }}</span>
            </p>

            <div class="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <span v-if="property.bedrooms">🛏 {{ property.bedrooms }} bed</span>
              <span v-if="property.bathrooms">🛁 {{ property.bathrooms }} bath</span>
              <span v-if="property.toilets">🚽 {{ property.toilets }} toilet</span>
            </div>

            <div class="flex items-center justify-between">
              <p class="font-bold text-[#0025cc] text-lg">
                ₦{{ Number(property.price).toLocaleString() }}
                <span class="text-xs font-normal text-gray-500">/year</span>
              </p>
              <span class="text-xs text-gray-400">
                {{ formatDate(property.created_at) }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const properties = ref([])
const loading = ref(true)
const sortBy = ref('newest')

const fetchIlorinProperties = async () => {
  try {
    loading.value = true

    let query = supabase
      .from('properties')
      .select('*')
      .ilike('city', 'Ilorin')
      .eq('status', 'approved')   // only show approved listings

    // Apply sorting
    if (sortBy.value === 'price-low') {
      query = query.order('price', { ascending: true })
    } else if (sortBy.value === 'price-high') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error
    properties.value = data || []
  } catch (err) {
    console.error('Failed to fetch Ilorin properties:', err)
    properties.value = []
  } finally {
    loading.value = false
  }
}

const sortProperties = () => {
  fetchIlorinProperties()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchIlorinProperties()
})
</script>