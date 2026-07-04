<template>
  <div class="min-h-screen bg-gray-50">
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
            :key="area"
            @click="selectQuickArea(area)"
            class="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm backdrop-blur-md transition-all"
          >
            {{ area }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
      <div class="flex gap-8">
        <!-- Filters Sidebar -->
        <div class="w-60 hidden lg:block">
          <PropertyFilters
            v-model="filters"
            @change="fetchProperties"
          />
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-gray-600">
              <span class="font-semibold text-gray-900">{{ properties.length }}</span> properties found
            </p>

            <select
              v-model="sortBy"
              @change="fetchProperties"
              class="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:border-[#0025cc]"
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

    <MobileFiltersButton @open="showMobileFilters = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabaseClient.js';
import { Search } from 'lucide-vue-next';

import PropertyFilters from '@/components/customer/properties/PropertyFilters.vue';
import PropertyGrid from '@/components/customer/properties/PropertyGrid.vue';
import EmptyProperties from '@/components/customer/properties/EmptyProperties.vue';
import MobileFiltersButton from '@/components/customer/properties/MobileFiltersButton.vue';

const router = useRouter();

const searchQuery = ref('');
const sortBy = ref('newest');
const loading = ref(false);
const properties = ref<any[]>([]);
const showMobileFilters = ref(false);

const quickAreas = ['Tanke', 'Fate', 'GRA', 'Oke-Ose', 'Oke-Aje', 'Molipa'];

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
});

let timeout: ReturnType<typeof setTimeout>;
let subscription: any = null;

// ==================== NEW FETCH FUNCTION ====================
const fetchProperties = async () => {
  loading.value = true;

  try {
    let q = supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')           // ← Only Approved
      .order('created_at', { ascending: false });

    // Filters
    if (filters.value.state) q = q.eq('state', filters.value.state);
    if (filters.value.city) q = q.eq('city', filters.value.city);
    if (filters.value.area) q = q.eq('area', filters.value.area);
    if (filters.value.property_type) q = q.eq('property_type', filters.value.property_type);
    if (filters.value.purpose) q = q.eq('purpose', filters.value.purpose);
    
    if (filters.value.minPrice) q = q.gte('price', Number(filters.value.minPrice));
    if (filters.value.maxPrice) q = q.lte('price', Number(filters.value.maxPrice));
    if (filters.value.bedrooms) q = q.eq('bedrooms', Number(filters.value.bedrooms));

    if (searchQuery.value?.trim()) {
      const term = searchQuery.value.trim();
      q = q.or(`title.ilike.%${term}%,area.ilike.%${term}%,address.ilike.%${term}%`);
    }

    const { data, error } = await q;

    if (error) {
      console.error('Supabase Error:', error);
      alert('Error fetching properties: ' + error.message);
    } else {
      console.log('✅ Fetched approved properties:', data?.length || 0);
      properties.value = data || [];
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    loading.value = false;
  }
};
// ===========================================================

const debouncedSearch = () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetchProperties();
  }, 600);
};

const selectQuickArea = (area: string) => {
  filters.value.area = area;
  fetchProperties();
};

const clearFilters = () => {
  filters.value = {
    state: '', city: '', area: '', property_type: '', purpose: 'For Rent',
    minPrice: null, maxPrice: null, bedrooms: null, amenities: []
  };
  searchQuery.value = '';
  fetchProperties();
};

const viewPropertyDetails = (id: string) => {
  router.push(`/properties/${id}`);
};

// Real-time subscription
const setupRealtime = () => {
  subscription = supabase
    .channel('properties-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'properties' },
      () => {
        console.log('🔄 Real-time update received');
        fetchProperties();
      }
    )
    .subscribe();
};

onMounted(() => {
  fetchProperties();
  setupRealtime();
});

onBeforeUnmount(() => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
});
</script>