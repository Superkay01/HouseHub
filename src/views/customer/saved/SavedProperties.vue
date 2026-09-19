<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <img 
            src="/Lodgenext_logo__2_-removebg-preview.png" 
            alt="LodgeNext" 
            class="h-10 sm:h-11 object-contain" 
          />
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Saved Properties</h1>
          <p class="text-sm text-gray-600 mt-1">Quickly access all the homes you've saved</p>
        </div>
        <div class="bg-white rounded-2xl px-5 py-3 shadow-sm self-start">
          <p class="text-2xl font-semibold text-[var(--royal-blue)]">{{ savedProperties.length }}</p>
          <p class="text-xs text-gray-500">Properties Saved</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-8">
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-2xl">❤️</div>
            <div>
              <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ savedProperties.length }}</p>
              <p class="text-xs sm:text-sm text-gray-500">Saved</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏠</div>
            <div>
              <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ availableSaved }}</p>
              <p class="text-xs sm:text-sm text-gray-500">Available</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📅</div>
            <div>
              <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ recentSaved }}</p>
              <p class="text-xs sm:text-sm text-gray-500">Recently Saved</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search saved properties..."
              class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>
          <select 
            v-model="sortBy" 
            class="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[var(--royal-blue)]"
          >
            <option value="recent">Recently Saved</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
          </select>
        </div>
      </div>

      <!-- Saved Properties Grid -->
      <div v-if="filteredSaved.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <div class="mt-10">
        <RecentlyViewed
          :recentlyViewed="recentlyViewedProperties"
          @view="viewProperty"
          @view-all="goToBrowse"
        />
      </div>

      <!-- Recommendations -->
      <div class="mt-10">
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