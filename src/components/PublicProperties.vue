<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    

    <!-- Hero + search -->
    <div class="relative py-10 sm:py-14 px-4 bg-gradient-to-br from-[#0025cc] via-[#2e4cd5] to-[#546cdd]">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">Find Your Next Home</h1>
        <p class="text-white/90 mb-6 text-sm sm:text-base">
          Browse verified houses and apartments — no account needed to explore
        </p>
        <div class="bg-white rounded-2xl shadow-xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
          <div class="flex-1 relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="Search area, city, address..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-[#0025cc] text-sm sm:text-base"
            />
          </div>
          <button
            type="button"
            @click="fetchProperties"
            class="bg-[#0025cc] hover:bg-[#001fa3] text-white px-6 py-3 rounded-xl font-semibold text-sm sm:text-base"
          >
            Find Homes
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <p class="text-sm font-medium text-gray-700 bg-white rounded-xl px-4 py-2 border">
          <span class="font-bold text-[var(--royal-blue)]">{{ properties.length }}</span>
          properties found
        </p>
        <select
          v-model="sortBy"
          @change="fetchProperties"
          class="border rounded-xl px-4 py-2 bg-white text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Lowest price</option>
          <option value="price-high">Highest price</option>
        </select>
      </div>

      <PropertyGrid
        :properties="properties"
        :loading="loading"
        detail-route-name="PublicPropertyDetail"
        @view-details="viewPropertyDetails"
      />

      <EmptyProperties
        v-if="!loading && properties.length === 0"
        @clear-filters="clearSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Search } from 'lucide-vue-next'
import PropertyGrid from '@/components/customer/properties/PropertyGrid.vue'
import EmptyProperties from '@/components/customer/properties/EmptyProperties.vue'

const router = useRouter()
const searchQuery = ref('')
const sortBy = ref('newest')
const loading = ref(false)
const properties = ref<any[]>([])

let timeout: ReturnType<typeof setTimeout>
let subscription: any = null

const fetchProperties = async () => {
  loading.value = true
  try {
    let q = supabase
      .from('properties')
      .select(`
        *,
        profiles:agent_id (
          id,
          full_name,
          avatar_url,
          agency_name,
          verified
        )
      `)
      .eq('status', 'approved')

    if (searchQuery.value?.trim()) {
      const term = searchQuery.value.trim()
      q = q.or(
        `title.ilike.%${term}%,area.ilike.%${term}%,address.ilike.%${term}%,city.ilike.%${term}%`
      )
    }

    if (sortBy.value === 'newest') q = q.order('created_at', { ascending: false })
    else if (sortBy.value === 'price-low') q = q.order('price', { ascending: true })
    else if (sortBy.value === 'price-high') q = q.order('price', { ascending: false })

    const { data, error } = await q
    if (error) throw error
    properties.value = data || []
  } catch (err) {
    console.error(err)
    properties.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(fetchProperties, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  fetchProperties()
}

const viewPropertyDetails = (id: string) => {
  router.push({ name: 'PublicPropertyDetail', params: { id } })
}

onMounted(() => {
  fetchProperties()
  subscription = supabase
    .channel('public-properties')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => fetchProperties()
    )
    .subscribe()
})

onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
  if (subscription) supabase.removeChannel(subscription)
})
</script>