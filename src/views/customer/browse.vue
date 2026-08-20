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

    <!-- Hero Section -->
    <div class="relative h-[520px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#0025cc] via-[#2e4cd5] to-[#546cdd]">
        <div class="absolute inset-0 bg-[radial-gradient(at_center,#ffffff15_0%,transparent_70%)]"></div>
      </div>

      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Find Your Next Home
        </h1>
        <p class="text-xl text-white/90 mb-10">
          Discover verified houses and apartments in Ilorin and Ijebu Ode
        </p>

        <!-- Search Bar -->
        <div class="bg-white rounded-3xl shadow-2xl p-3 max-w-3xl mx-auto">
          <div class="flex items-center gap-3">
            <div class="flex-1 relative">
              <Search class="absolute left-6 top-4 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Search by area, property name, city, or address..."
                class="w-full pl-14 pr-6 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-[#0025cc] text-lg placeholder:text-gray-400"
              />
            </div>
            <button
              @click="fetchProperties"
              class="bg-[#0025cc] hover:bg-[#001fa3] text-white px-10 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Search class="w-5 h-5" /> Find Homes
            </button>
          </div>
        </div>

        <!-- Quick Chips -->
        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <button
            v-for="area in quickAreas"
            :key="`${area.city}-${area.name}`"
            @click="selectQuickArea(area)"
            class="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm backdrop-blur-md transition-all"
          >
            {{ area.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <div class="flex gap-8">
        <!-- Filters Sidebar -->
        <!-- <div class="w-60 hidden lg:block">
          <PropertyFilters
            v-model="filters"
            @change="fetchProperties"
          />
        </div> -->

        <!-- Main Content -->
        <div class="">
          <div class="flex items-center justify-between mb-8">
            <p class="text-2xl font-semibold text-gray-900 border border-[var(--steel-blue)] rounded-2xl px-6 py-3 focus:outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20 bg-white text-sm font-medium">
              <span class="font-bold text-[var(--royal-blue)]">
                {{ properties.length }}
              </span>
              properties found
            </p>

            <select
              v-model="sortBy"
              @change="fetchProperties"
              class="border border-gray-300 rounded-2xl px-6 py-3 focus:outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20 bg-white text-sm font-medium"
            >
              <option value="newest">Newest Listings</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>

          <PropertyGrid
            :properties="properties"
            :loading="loading"
            @view-details="viewPropertyDetails"
          />

          <EmptyProperties
            v-if="!loading && properties.length === 0"
            @clear-filters="clearFilters"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Filter Button -->
    <MobileFiltersButton
      :filters="filters"
      @open="showMobileFilters = true"
    />

    <!-- Mobile Filter Modal -->
    <MobilePropertyFilter
      v-if="showMobileFilters"
      @close="showMobileFilters = false"
      @apply="applyMobileFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Search } from 'lucide-vue-next'

// import PropertyFilters from '@/components/customer/properties/PropertyFilters.vue'
import PropertyGrid from '@/components/customer/properties/PropertyGrid.vue'
import EmptyProperties from '@/components/customer/properties/EmptyProperties.vue'
// import MobileFiltersButton from '@/components/customer/properties/MobileFiltersButton.vue'
// import MobilePropertyFilter from '@/components/customer/properties/MobilePropertyFilter.vue'

const router = useRouter()

const searchQuery = ref('')
const sortBy = ref('newest')
const loading = ref(false)
const properties = ref<any[]>([])
const showMobileFilters = ref(false)

const quickAreas = [
  // Ilorin
  { name: 'Tanke', city: 'Ilorin' },
  { name: 'Fate', city: 'Ilorin' },
  { name: 'GRA', city: 'Ilorin' },
  { name: 'Oke-Ose', city: 'Ilorin' },
  { name: 'Adewole', city: 'Ilorin' },
  { name: 'Basin', city: 'Ilorin' },
  { name: 'Gambari', city: 'Ilorin' },
  { name: 'Oko-Erin', city: 'Ilorin' },
  { name: 'Pakata', city: 'Ilorin' },
  { name: 'Sabo-Oke', city: 'Ilorin' },
  { name: 'Surulere', city: 'Ilorin' },
  { name: 'Taiwo', city: 'Ilorin' },
  { name: 'Unity', city: 'Ilorin' },
  { name: 'Challenge', city: 'Ilorin' },
  { name: 'Agbo-Oba', city: 'Ilorin' },
  { name: 'Post Office', city: 'Ilorin' },
  { name: 'Maraba', city: 'Ilorin' },
  { name: 'Kulende', city: 'Ilorin' },
  { name: 'Oyun', city: 'Ilorin' },
  { name: 'Apata Yakuba', city: 'Ilorin' },
  { name: 'Mubo', city: 'Ilorin' },

  // Ijebu Ode
  { name: 'Molipa', city: 'Ijebu Ode' },
  { name: 'Oke-Aje', city: 'Ijebu Ode' },
  { name: 'Porogun', city: 'Ijebu Ode' },
  { name: 'Obalende', city: 'Ijebu Ode' },
  { name: 'Imagbon', city: 'Ijebu Ode' },
  { name: 'Ita-Aladan', city: 'Ijebu Ode' },
  { name: 'Ita-Merin', city: 'Ijebu Ode' },
  { name: 'Ita-Osun', city: 'Ijebu Ode' },
  { name: 'Ijasi', city: 'Ijebu Ode' },
  { name: 'Odo-Nla', city: 'Ijebu Ode' },
  { name: 'Isoku', city: 'Ijebu Ode' },
  { name: 'Oke-Sopen', city: 'Ijebu Ode' },
  { name: 'Ayetoro', city: 'Ijebu Ode' },
  { name: 'Folagbade', city: 'Ijebu Ode' },
  { name: 'Degun', city: 'Ijebu Ode' },
  { name: 'Ososa', city: 'Ijebu Ode' },
  { name: 'Imowo', city: 'Ijebu Ode' },
]

const filters = ref({
  state: '',
  city: '',
  area: '',
  property_type: '',
  purpose: 'For Rent',
  minPrice: null as number | null,
  maxPrice: null as number | null,
  bedrooms: null as number | null,
  amenities: [] as string[],
})

let timeout: ReturnType<typeof setTimeout>
let subscription: any = null

const fetchProperties = async () => {
  loading.value = true

  try {
    let q = supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')

    // Flexible filters (same style as the search input)
    if (filters.value.state) {
      q = q.ilike('state', `%${filters.value.state}%`)
    }
    if (filters.value.city) {
      q = q.ilike('city', `%${filters.value.city}%`)
    }
    if (filters.value.area) {
      q = q.ilike('area', `%${filters.value.area}%`)
    }

    if (filters.value.property_type) q = q.eq('property_type', filters.value.property_type)
    if (filters.value.purpose) q = q.eq('purpose', filters.value.purpose)

    if (filters.value.minPrice) q = q.gte('price', Number(filters.value.minPrice))
    if (filters.value.maxPrice) q = q.lte('price', Number(filters.value.maxPrice))
    if (filters.value.bedrooms) q = q.eq('bedrooms', Number(filters.value.bedrooms))

    // Free text search (flexible)
    if (searchQuery.value?.trim()) {
      const term = searchQuery.value.trim()
      q = q.or(
        `title.ilike.%${term}%,area.ilike.%${term}%,address.ilike.%${term}%,city.ilike.%${term}%`
      )
    }

    // Sorting
    if (sortBy.value === 'newest') {
      q = q.order('created_at', { ascending: false })
    } else if (sortBy.value === 'price-low') {
      q = q.order('price', { ascending: true })
    } else if (sortBy.value === 'price-high') {
      q = q.order('price', { ascending: false })
    }

    const { data, error } = await q

    if (error) {
      console.error('Supabase Error:', error)
      alert('Error fetching properties: ' + error.message)
    } else {
      console.log('✅ Fetched approved properties:', data?.length || 0)
      properties.value = data || []
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchProperties()
  }, 600)
}

const selectQuickArea = (area: { name: string; city: string }) => {
  // Works exactly like typing in the search input
  searchQuery.value = area.name

  // Also keep the sidebar filters in sync
  filters.value.area = area.name
  filters.value.city = area.city

  if (area.city === 'Ilorin') {
    filters.value.state = 'Kwara'
  } else if (area.city === 'Ijebu Ode') {
    filters.value.state = 'Ogun'
  }

  fetchProperties()
}

const clearFilters = () => {
  filters.value = {
    state: '',
    city: '',
    area: '',
    property_type: '',
    purpose: 'For Rent',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    amenities: [],
  }
  searchQuery.value = ''
  fetchProperties()
}

const applyMobileFilters = (newFilters: typeof filters.value) => {
  filters.value = { ...newFilters }
  fetchProperties()
  showMobileFilters.value = false
}

const viewPropertyDetails = (id: string) => {
  router.push(`/customer/properties/${id}`)
}

// Real-time subscription
const setupRealtime = () => {
  subscription = supabase
    .channel('properties-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => {
        console.log('🔄 Real-time update received')
        fetchProperties()
      }
    )
    .subscribe()
}

onMounted(() => {
  fetchProperties()
  setupRealtime()
})

onBeforeUnmount(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})
</script>