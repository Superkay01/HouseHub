
<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-10" />
          <h1 class="text-2xl font-bold text-[var(--royal-blue)]">LodgeNext</h1>
        </div>
        <div class="flex items-center gap-6">
          <a href="/properties" class="font-medium text-[var(--royal-blue)]">Browse Properties</a>
          <a href="/saved" class="font-medium text-medium-gray hover:text-[var(--royal-blue)]">Saved</a>
          <a href="/my-requests" class="font-medium text-medium-gray hover:text-[var(--royal-blue)]">My Requests</a>
          <button class="px-6 py-2 bg-[var(--royal-blue)] text-white rounded-2xl">Post a Property</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative h-[520px] bg-gradient-to-br from-[var(--royal-blue)] to-[var(--mediumBlue)] flex items-center">
      <div class="max-w-4xl mx-auto text-center px-6 text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Find Your Next Home
        </h1>
        <p class="text-xl text-white/90 mb-8 max-w-md mx-auto">
          Discover verified properties in Ilorin and Ijebu Ode.
        </p>

        <!-- Search Bar -->
        <div class="bg-white rounded-3xl p-2 shadow-2xl max-w-2xl mx-auto">
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by area, property name, or address..."
                class="w-full px-6 py-4 text-lg focus:outline-none rounded-3xl text-[var(--royal-blue)]"
              />
            </div>
            <button 
              @click="searchProperties"
              class="bg-[var(--royal-blue)] text-white px-10 py-4 rounded-3xl font-medium hover:bg-[var(--mediumBlue)] transition">
              Search
            </button>
          </div>
        </div>

        <!-- Quick Chips -->
        <div class="flex justify-center gap-3 mt-8 flex-wrap">
          <button v-for="area in quickAreas" 
                  :key="area"
                  @click="quickSearch(area)"
                  class="px-5 py-2 bg-white/20 backdrop-blur-md text-white rounded-3xl text-sm hover:bg-white/30 transition">
            {{ area }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b sticky top-[85px] z-40">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex flex-wrap gap-4">
          <select v-model="filters.state" class="px-5 py-3 rounded-2xl border border-[var(--light-blue)]">
            <option value="">All States</option>
            <option value="Kwara">Kwara</option>
            <option value="Ogun">Ogun</option>
          </select>
          <select v-model="filters.city" class="px-5 py-3 rounded-2xl border border-[var(--light-blue)]">
            <option value="">All Cities</option>
            <option value="Ilorin">Ilorin</option>
            <option value="Ijebu Ode">Ijebu Ode</option>
          </select>
          <select v-model="filters.type" class="px-5 py-3 rounded-2xl border border-[var(--light-blue)]">
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Duplex">Duplex</option>
            <option value="Mini Flat">Mini Flat</option>
            <option value="Self Contain">Self Contain</option>
          </select>
          <select v-model="sortBy" class="px-5 py-3 rounded-2xl border border-[var(--light-blue)]">
            <option value="newest">Newest</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PropertyCard 
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          @save="saveProperty"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredProperties.length === 0" class="text-center py-20">
        <div class="text-6xl ">
            <img
          src="/Lodgenext_logo__2_-removebg-preview.png"
          alt="Lodgenext logo"
          class="h-50 w-85 object-contain m-auto"
        />
        </div>
        <p class="text-2xl font-medium text-[var(--royal-blue)]">No properties found</p>
        <button @click="clearFilters" class="mt-6 px-8 py-3 bg-[var(--royal-blue)] text-white rounded-2xl">
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

import PropertyCard from '@/components/customer/properties/PropertyCard.vue'

const searchQuery = ref('')
const filters = ref({
  state: '',
  city: '',
  type: ''
})
const sortBy = ref('newest')
const properties = ref([])

const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      profiles!properties_agent_id_fkey(full_name, avatar_url, is_verified, agency_name)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (!error) properties.value = data || []
}

const filteredProperties = computed(() => {
  let result = [...properties.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      p.address?.toLowerCase().includes(term) ||
      p.area?.toLowerCase().includes(term)
    )
  }

  if (filters.value.state) {
    result = result.filter(p => p.state === filters.value.state)
  }

  if (filters.value.city) {
    result = result.filter(p => p.city === filters.value.city)
  }

  if (filters.value.type) {
    result = result.filter(p => p.property_type === filters.value.type)
  }

  // Sort
  if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

const quickAreas = ['Tanke', 'Fate', 'GRA', 'Oke-Ose', 'Oke-Aje', 'Molipa']

const quickSearch = (area) => {
  searchQuery.value = area
}

const saveProperty = (id) => {
  alert(`Property ${id} saved!`)
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = { state: '', city: '', type: '' }
}

onMounted(() => {
  fetchProperties()
})
</script>