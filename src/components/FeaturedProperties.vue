<template>
  <section class="py-10 sm:py-14 md:py-20 bg-[var(--steel-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 md:mb-14">
        <div class="inline-flex items-center gap-1.5 sm:gap-2 bg-[var(--light-blue)] text-[var(--royal-blue)] px-3 sm:px-6 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium mb-2.5 sm:mb-4">
          <i class="fas fa-star text-[9px] sm:text-sm"></i>
          <span>PREMIUM SELECTION</span>
        </div>
        <h2 class="text-xl sm:text-3xl md:text-4xl font-bold text-[var(--white)] tracking-tight mb-2 sm:mb-4 heading-font">
          Featured Properties
        </h2>
        <p class="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-[var(--white)] px-2 leading-snug sm:leading-normal">
          Explore featured rentals, properties for sale, and land opportunities in Ilorin and Ijebu Ode.
          Discover approved listings and connect with trusted property professionals.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10 sm:py-16 text-white/80 text-xs sm:text-base">
        Loading featured properties...
      </div>

      <!-- Empty -->
      <div v-else-if="properties.length === 0" class="text-center py-10 sm:py-16 text-white/80 text-xs sm:text-base">
        No featured properties available at the moment.
      </div>

      <!-- Properties Grid — 1 col mobile, 2 col sm, 3 col lg -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        <div
          v-for="property in visibleProperties"
          :key="property.id"
          class="property-card bg-white rounded-2xl sm:rounded-2xl lg:rounded-3xl overflow-hidden border border-gray-100 group"
        >
          <!-- Image -->
          <div class="relative h-44 xs:h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
            <img
              :src="property.cover_image || placeholderImg"
              class="property-image w-full h-full object-cover"
              :alt="property.title || 'Featured property'"
              loading="lazy"
            />

            <!-- Price -->
            <div class="price-tag absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 text-white px-2.5 sm:px-3.5 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold shadow-lg">
              <span class="text-xs sm:text-lg lg:text-2xl">₦{{ formatPrice(property.price) }}</span>
              <span v-if="isRental(property)" class="text-[9px] sm:text-xs lg:text-sm opacity-75">
                {{ property.purpose === 'For Lease' ? '/lease' : '/year' }}
              </span>
              <span v-else class="block text-[8px] sm:text-[10px] lg:text-xs font-medium opacity-90">
                {{ isLandListing(property) ? 'Land asking price' : 'Asking price' }}
              </span>
            </div>

            <!-- Verified Badge -->
            <div
              v-if="property.profiles?.verified"
              class="verification-badge absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 bg-[#00a83b] text-white text-[8px] sm:text-[10px] lg:text-xs font-bold px-1.5 sm:px-2.5 lg:px-3.5 py-0.5 sm:py-1 lg:py-1.5 rounded-md sm:rounded-lg lg:rounded-2xl flex items-center gap-0.5 sm:gap-1 shadow-md"
            >
              <i class="fas fa-shield-alt text-[8px] sm:text-[10px] lg:text-xs"></i>
              <span>VERIFIED</span>
            </div>

            <!-- Listing type -->
            <div class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 bg-white/95 text-[#0025cc] text-[9px] sm:text-[11px] lg:text-xs font-semibold px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-md sm:rounded-lg lg:rounded-xl shadow-md max-w-[70%] truncate">
              {{ listingLabel(property) }}
            </div>

            <!-- Favorite → login -->
            <button
              type="button"
              @click.stop="requireAuth(`/properties/${property.id}`)"
              :aria-label="`Sign in to save ${property.title || 'this property'}`"
              class="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-5 lg:right-5 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md transition-all hover:scale-110"
            >
              <i class="fas fa-heart text-sm sm:text-base lg:text-xl text-gray-400 group-hover:text-red-500 transition-colors"></i>
            </button>

            <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-5 lg:p-7">
            <div class="flex justify-between items-start gap-2 mb-2 sm:mb-2.5 lg:mb-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-base sm:text-lg lg:text-2xl font-semibold text-[var(--royal-blue)] line-clamp-2 leading-snug">
                  {{ property.title }}
                </h3>
                <div class="flex items-center gap-1 sm:gap-1.5 text-[var(--royal-blue)] mt-1 sm:mt-1.5 lg:mt-2 text-xs sm:text-sm lg:text-base">
                  <i class="fas fa-map-marker-alt text-[var(--royal-blue)] text-[10px] sm:text-xs"></i>
                  <span class="truncate">{{ property.area ? `${property.area}, ` : '' }}{{ property.city }}</span>
                </div>
              </div>
              <span class="shrink-0 inline-block bg-[#ebf8ff] text-[var(--royal-blue)] text-[9px] sm:text-[10px] lg:text-xs font-medium px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-0.5 lg:py-1 rounded-md sm:rounded-lg lg:rounded-2xl">
                {{ property.property_type || (isLandListing(property) ? 'Land' : 'Property') }}
              </span>
            </div>

            <!-- Land details -->
            <div
              v-if="isLandListing(property)"
              class="grid grid-cols-2 gap-2 sm:gap-3 border-t border-b border-gray-100 py-3 sm:py-4 my-3 sm:my-4"
            >
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] uppercase truncate">Land Size</p>
                <p class="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  {{ property.land_size ? `${property.land_size} ${property.land_size_unit || ''}`.trim() : 'Not specified' }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] uppercase truncate">Land Use</p>
                <p class="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  {{ property.land_use || 'Not specified' }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] uppercase truncate">Road Access</p>
                <p class="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  {{ property.access_road || 'Not specified' }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] uppercase truncate">Title Documents</p>
                <p class="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 truncate">
                  {{ property.title_document_status || 'Not specified' }}
                </p>
              </div>
            </div>

            <!-- Residential features -->
            <div
              v-else
              class="flex justify-between gap-2 border-t border-b border-gray-100 py-3 sm:py-4 my-3 sm:my-4"
            >
              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div class="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-[#ebf8ff] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-[#0025cc] shrink-0">
                  <Bed class="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </div>
                <div class="min-w-0">
                  <div class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] leading-none">BEDS</div>
                  <div class="font-semibold text-sm sm:text-base lg:text-lg leading-tight">{{ property.bedrooms ?? '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div class="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-[#ebf8ff] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-[#0025cc] shrink-0">
                  <Bath class="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </div>
                <div class="min-w-0">
                  <div class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] leading-none">BATHS</div>
                  <div class="font-semibold text-sm sm:text-base lg:text-lg leading-tight">{{ property.bathrooms ?? '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div class="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-[#ebf8ff] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-[#0025cc] shrink-0">
                  <Car class="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </div>
                <div class="min-w-0">
                  <div class="text-[9px] sm:text-[10px] lg:text-xs text-[var(--medium-blue)] leading-none">PARK</div>
                  <div class="font-semibold text-sm sm:text-base lg:text-lg leading-tight">{{ property.parking_spaces ?? '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Inspection fee -->
            <p class="mb-3 sm:mb-3.5 lg:mb-4 text-[11px] sm:text-xs lg:text-sm font-medium text-gray-700">
              {{ property.inspection_fee ? `Inspection Fee: ₦${formatPrice(property.inspection_fee)}` : 'Inspection fee not specified' }}
            </p>

            <!-- Buttons -->
            <div class="grid grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
              <button
                type="button"
                @click="requireAuth(`/properties/${property.id}`)"
                class="py-2 sm:py-2.5 lg:py-3.5 border border-[#0025cc] text-[#0025cc] hover:bg-[#0025cc] hover:text-white font-medium text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl transition-all whitespace-nowrap"
              >
                View Details
              </button>
              <button
                type="button"
                @click="requireAuth(`/properties/${property.id}?action=contact`)"
                class="py-2 sm:py-2.5 lg:py-3.5 bg-[#0025cc] hover:bg-[#546cdd] text-white font-medium text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl lg:rounded-2xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 whitespace-nowrap"
              >
                <Phone class="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                <span>Contact Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View More / Browse All -->
      <div v-if="!loading && properties.length > 0" class="mt-8 sm:mt-12 md:mt-16 text-center space-y-3 sm:space-y-4 md:space-y-5">
        <button
          v-if="!showAll && properties.length > 3"
          type="button"
          @click="showAll = true"
          class="inline-flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white font-medium text-xs sm:text-sm md:text-base underline underline-offset-4 transition"
        >
          View more properties
          <i class="fas fa-chevron-down text-[9px] sm:text-xs"></i>
        </button>

        <div>
          <button
            type="button"
            @click="goToProperty"
            class="group inline-flex items-center gap-1.5 sm:gap-2.5 md:gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-xs sm:text-sm md:text-lg px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 md:py-5 rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30"
          >
            Browse All Properties
            <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Bath, Bed, Car, Phone } from 'lucide-vue-next'
import { supabase } from '@/supabaseClient.js'

interface FeaturedProperty {
  id: string
  title: string | null
  property_type: string | null
  purpose: string | null
  listing_category?: string | null
  state?: string | null
  city: string | null
  area: string | null
  price: number | string | null
  bedrooms: number | null
  bathrooms: number | null
  parking_spaces: number | null
  cover_image: string | null
  status: string | null
  availability?: string | null
  created_at?: string | null
  inspection_fee?: string | number | null
  land_size?: number | string | null
  land_size_unit?: string | null
  land_use?: string | null
  access_road?: string | null
  title_document_status?: string | null
  profiles?: {
    id?: string
    full_name?: string | null
    avatar_url?: string | null
    agency_name?: string | null
    verified?: boolean | null
  } | null
}

const router = useRouter()
const properties = ref<FeaturedProperty[]>([])
const loading = ref(true)
const showAll = ref(false)
const placeholderImg = 'https://via.placeholder.com/600x400?text=Property'

const visibleProperties = computed(() =>
  showAll.value ? properties.value.slice(0, 6) : properties.value.slice(0, 3)
)

const isLandListing = (property: FeaturedProperty): boolean => {
  const category = property.listing_category?.toLowerCase()
  const purpose = property.purpose?.toLowerCase()
  const type = property.property_type?.toLowerCase()

  return (
    category === 'land_sale' ||
    purpose === 'land for sale' ||
    type === 'land'
  )
}

const isRental = (property: FeaturedProperty): boolean => {
  const purpose = property.purpose?.toLowerCase()
  return purpose === 'for rent' || purpose === 'for lease'
}

const listingLabel = (property: FeaturedProperty): string => {
  if (isLandListing(property)) return 'Land for Sale'
  if (property.purpose) return property.purpose
  if (property.listing_category === 'property_sale') return 'For Sale'
  if (property.listing_category === 'rental') return 'For Rent'
  return 'Property'
}

const formatPrice = (
  price: number | string | null | undefined
): string => {
  if (price === null || price === undefined || price === '') return '—'

  const num = Number(price)
  if (!Number.isFinite(num)) return '—'

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M'
  }

  if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K'
  }

  return num.toLocaleString()
}

const requireAuth = (redirectTo = '/properties'): void => {
  void router.push({
    path: '/login',
    query: { redirect: redirectTo },
  })
}

const goToProperty = (): void => {
  void router.push('/property')
}

const fetchFeaturedProperties = async (): Promise<void> => {
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        property_type,
        purpose,
        listing_category,
        state,
        city,
        area,
        price,
        bedrooms,
        bathrooms,
        parking_spaces,
        cover_image,
        status,
        availability,
        created_at,
        inspection_fee,
        land_size,
        land_size_unit,
        land_use,
        access_road,
        title_document_status,
        profiles:agent_id (
          id,
          full_name,
          avatar_url,
          agency_name,
          verified
        )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error

    properties.value = (data ?? []) as FeaturedProperty[]
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error fetching featured properties:', message)
    properties.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchFeaturedProperties()
})
</script>

<style scoped>
.property-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgb(0 37 204 / 0.15);
}

@media (min-width: 640px) {
  .property-card:hover {
    transform: translateY(-12px);
  }
}

.property-image {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover .property-image {
  transform: scale(1.06);
}

.price-tag {
  background: linear-gradient(135deg, #0025cc, #2e4cd5);
}

.verification-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
</style>