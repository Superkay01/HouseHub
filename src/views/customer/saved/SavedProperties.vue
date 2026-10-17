<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    

    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Saved Properties</h1>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">Quickly access all the homes you've saved</p>
        </div>
        <div class="bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 shadow-sm self-start">
          <p class="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--royal-blue)]">{{ savedProperties.length }}</p>
          <p class="text-[10px] sm:text-xs text-gray-500">Properties Saved</p>
        </div>
      </div>

      <!-- Stats (3 in a row on all sizes) -->
      <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-5 sm:mb-6 md:mb-8">
        <div class="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">❤️</div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ savedProperties.length }}</p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Saved</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">🏠</div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ availableSaved }}</p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Available</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">📅</div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ recentSaved }}</p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Recently Saved</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div class="flex-1 relative">
            <Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search saved properties..."
              class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>
          <select 
            v-model="sortBy" 
            class="border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[var(--royal-blue)]"
          >
            <option value="recent">Recently Saved</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
          </select>
        </div>
      </div>

      <!-- Saved Properties Grid -->
      <div v-if="filteredSaved.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <SavedPropertyCard
          v-for="item in filteredSaved"
          :key="item.id"
          :property="item.properties"
          @remove="removeSaved(item.id)"
          @view="viewProperty(item.properties.id)"
        />
      </div>

      <!-- Empty State -->
      <EmptySavedState v-else @browse="goToBrowse" />

      <!-- Recently Viewed -->
      <div class="mt-6 sm:mt-8 md:mt-10">
        <RecentlyViewed
          :recentlyViewed="recentlyViewedProperties"
          @view="viewProperty"
          @view-all="goToBrowse"
        />
      </div>

      <!-- Recommendations -->
      <div class="mt-6 sm:mt-8 md:mt-10">
        <Recommendations
          :recommendations="recommendedProperties"
          @view="viewProperty"
          @browse="goToBrowse"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Search } from 'lucide-vue-next'
import SavedPropertyCard from '@/components/customer/saved/SavedPropertyCard.vue'
import EmptySavedState from '@/components/customer/saved/EmptySavedState.vue'
import RecentlyViewed from '@/components/customer/saved/RecentlyViewed.vue'
import Recommendations from '@/components/customer/saved/Recommendations.vue'

const router = useRouter()
const savedProperties = ref([])
const recentlyViewedProperties = ref([])
const recommendedProperties = ref([])
const searchQuery = ref('')
const sortBy = ref('recent')

const fetchSavedProperties = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('saved_properties')
    .select(`
      id,
      created_at,
      property_id,
      properties (
        id,
        title,
        property_type,
        purpose,
        price,
        area,
        city,
        state,
        bedrooms,
        bathrooms,
        toilets,
        amenities,
        cover_image,
        image_1,
        status,
        profiles (
          full_name,
          avatar_url,
          agency_name,
          verified
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved properties:', error)
  } else {
    savedProperties.value = data || []
  }
}

const loadRecentlyViewed = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('property_views')
    .select(`
      property_id,
      viewed_at,
      properties (*)
    `)
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(4)

  recentlyViewedProperties.value = data?.map(item => item.properties) || []
}

const loadRecommendations = async () => {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'approved')
    .limit(8)

  recommendedProperties.value = data || []
}

const filteredSaved = computed(() => {
  let result = [...savedProperties.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.properties?.title?.toLowerCase().includes(term) ||
      item.properties?.area?.toLowerCase().includes(term) ||
      item.properties?.city?.toLowerCase().includes(term)
    )
  }

  if (sortBy.value === 'price-low') {
    result.sort((a, b) => (a.properties?.price || 0) - (b.properties?.price || 0))
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => (b.properties?.price || 0) - (a.properties?.price || 0))
  }

  return result
})

const availableSaved = computed(() => {
  return savedProperties.value.filter(item => item.properties?.status === 'approved').length
})

const recentSaved = computed(() => {
  return savedProperties.value.slice(0, 4).length
})

const removeSaved = async (id) => {
  if (confirm('Remove from saved properties?')) {
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Failed to remove property')
    } else {
      fetchSavedProperties()
    }
  }
}

const viewProperty = (id) => {
  router.push({
    name: 'CustomerPropertyDetail',
    params: { id }
  })
}

const goToBrowse = () => {
  router.push('/customer/browse')
}

onMounted(() => {
  fetchSavedProperties()
  loadRecentlyViewed()
  loadRecommendations()
})
</script>