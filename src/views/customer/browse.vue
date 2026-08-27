<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Hero Section -->
    <div class="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#0025cc] via-[#2e4cd5] to-[#546cdd]">
        <div class="absolute inset-0 bg-[radial-gradient(at_center,#ffffff15_0%,transparent_70%)]"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-10 pb-16 sm:pt-12 sm:pb-20">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
          Find Your Next Home
        </h1>
        <p class="text-sm sm:text-base md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
          Discover verified houses and apartments in Ilorin and Ijebu Ode
        </p>

        <!-- Search Bar -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-2.5 max-w-3xl mx-auto">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <!-- Input -->
            <div class="flex-1 relative">
              <Search class="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[var(--royal-blue)] w-5 h-5 pointer-events-none" />
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Search by area, property name, city, or address..."
                class="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border-0 focus:ring-2 focus:ring-[#0025cc] text-base sm:text-lg placeholder:text-[var(--steel-blue)] bg-transparent"
              />
            </div>

            <!-- Button -->
            <button
              @click="fetchProperties"
              class="bg-[#0025cc] hover:bg-[#001fa3] text-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            >
              <Search class="w-4 h-4" />
              Find Homes
            </button>
          </div>
        </div>

        <!-- Quick Chips -->
        <div class="mt-6 sm:mt-8 max-w-4xl mx-auto">
          <!-- Mobile: horizontal scroll -->
          <div
            class="flex sm:hidden gap-2.5 overflow-x-auto pb-2 px-1 snap-x snap-mandatory
                   [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              v-for="area in quickAreas"
              :key="`m-${area.city}-${area.name}`"
              type="button"
              @click="selectQuickArea(area)"
              class="snap-start shrink-0 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md transition-all whitespace-nowrap"
            >
              {{ area.name }}
            </button>
          </div>

          <!-- Tablet / Desktop: wrap + view more / less -->
          <div class="hidden sm:block">
            <div
              class="flex flex-wrap justify-center gap-2.5 sm:gap-3 overflow-hidden transition-all duration-300"
              :class="areasExpanded ? 'max-h-[600px]' : 'max-h-[88px]'"
            >
              <button
                v-for="area in visibleQuickAreas"
                :key="`d-${area.city}-${area.name}`"
                type="button"
                @click="selectQuickArea(area)"
                class="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-5 py-2 rounded-full text-sm backdrop-blur-md transition-all"
              >
                {{ area.name }}
              </button>
            </div>

            <div v-if="quickAreas.length > collapsedCount" class="flex justify-center mt-4">
              <button
                type="button"
                @click="areasExpanded = !areasExpanded"
                class="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition"
              >
                <span>{{ areasExpanded ? 'View less' : 'View more' }}</span>
                <svg
                  class="w-4 h-4 transition-transform duration-300"
                  :class="areasExpanded ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 pb-10">
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <!-- Filters Sidebar (commented out) -->
        <!--
        <div class="w-full lg:w-60 shrink-0 hidden lg:block">
          <PropertyFilters
            v-model="filters"
            @change="fetchProperties"
          />
        </div>
        -->

        <!-- Results -->
        <div class="flex-1 min-w-0">
          <!-- Results Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <!-- Count -->
            <p class="inline-flex items-center bg-white border border-[var(--steel-blue)] rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-gray-900 shadow-sm">
              <span class="font-bold text-[var(--royal-blue)] mr-1.5">
                {{ properties.length }}
              </span>
              properties found
            </p>

            <!-- Sort -->
            <select
              v-model="sortBy"
              @change="fetchProperties"
              class="w-full sm:w-auto border border-gray-300 rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 focus:outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20 bg-white text-sm font-medium shadow-sm"
            >
              <option value="newest">Newest Listings</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>

          <!-- Grid -->
          <PropertyGrid
            :properties="properties"
            :loading="loading"
            @view-details="viewPropertyDetails"
          />

          <!-- Empty State -->
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
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
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

const areasExpanded = ref(false)
const collapsedCount = 8 // chips shown when collapsed (~2 rows)

const visibleQuickAreas = computed(() => {
  if (areasExpanded.value) return quickAreas
  return quickAreas.slice(0, collapsedCount)
})

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

    // Flexible filters
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

    if (searchQuery.value?.trim()) {
      const term = searchQuery.value.trim()
      q = q.or(
        `title.ilike.%${term}%,area.ilike.%${term}%,address.ilike.%${term}%,city.ilike.%${term}%`
      )
    }

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