
<template>
  <section class="py-10 bg-[#ebf8ff] min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center gap-2 bg-[var(--royal-blue)] text-[var(--white)] px-6 py-2 rounded-full text-sm font-medium mb-4"
        >
          <i class="fas fa-home"></i>
          <span>MY LISTINGS</span>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2
            class="text-xl md:text-3xl font-bold text-[var(--royal-blue)] tracking-tight mb-3 heading-font"
          >
            My Properties
          </h2>
          <p class="max-w-2xl md:text-xl text-sm text-[var(--royal-blue)] opacity-90">
            Manage your rental, lease, property sale, and land listings in one place.
          </p>
        </div>

        <button
          @click="goToAddProperty"
          class="group inline-flex items-center justify-center gap-3 md:text-lg text-sm bg-[#0025cc] hover:bg-[#546cdd] text-white font-semibold md:px-8 px-4 md:py-4 py-3 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30"
        >
          <span class="text-xl leading-none">+</span>
          Add New Property
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="flex-1">
          <label for="property-search" class="sr-only">Search properties</label>
          <input
            id="property-search"
            v-model="searchQuery"
            type="search"
            placeholder="Search by title, location or property type..."
            class="w-full bg-white border border-blue-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#546cdd]"
          />
        </div>

        <div>
          <label for="category-filter" class="sr-only">Filter by category</label>
          <select
            id="category-filter"
            v-model="selectedCategory"
            class="w-full sm:min-w-48 bg-white border border-blue-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#546cdd]"
          >
            <option value="all">All categories</option>
            <option value="rental">Rentals and leases</option>
            <option value="property_sale">Property for sale</option>
            <option value="land_sale">Land for sale</option>
          </select>
        </div>

        <div>
          <label for="status-filter" class="sr-only">Filter by status</label>
          <select
            id="status-filter"
            v-model="selectedStatus"
            class="w-full sm:min-w-40 bg-white border border-blue-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#546cdd]"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="mb-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm"
        role="alert"
      >
        {{ errorMessage }}
        <button
          @click="fetchMyProperties"
          class="ml-2 underline font-semibold"
        >
          Try again
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-32">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0025cc]"
          role="status"
          aria-label="Loading properties"
        ></div>
      </div>

      <template v-else>
        <!-- Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl p-5 border border-blue-50">
            <p class="text-xs text-gray-500 mb-2">TOTAL LISTINGS</p>
            <p class="text-2xl font-bold text-[#0025cc]">{{ properties.length }}</p>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-blue-50">
            <p class="text-xs text-gray-500 mb-2">PENDING REVIEW</p>
            <p class="text-2xl font-bold text-amber-600">{{ countByStatus('pending') }}</p>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-blue-50">
            <p class="text-xs text-gray-500 mb-2">APPROVED</p>
            <p class="text-2xl font-bold text-green-600">{{ countByStatus('approved') }}</p>
          </div>

          <div class="bg-white rounded-2xl p-5 border border-blue-50">
            <p class="text-xs text-gray-500 mb-2">COMPLETED SALES</p>
            <p class="text-2xl font-bold text-purple-600">{{ countByStatus('sold') }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredProperties.length === 0"
          class="text-center py-24 bg-white rounded-3xl border border-blue-50"
        >
          <img
            src="/lodgelink-logo.png"
            alt=""
            class="mx-auto mb-6 w-48 h-20 object-contain"
          />

          <h3 class="md:text-2xl text-lg font-semibold text-[var(--royal-blue)] mb-3">
            {{ properties.length === 0 ? 'No Properties Listed Yet' : 'No Matching Properties' }}
          </h3>

          <p class="md:text-base text-sm text-[var(--steel-blue)] mb-8 px-4">
            {{
              properties.length === 0
                ? 'Start building your portfolio by adding your first rental, property, or land listing.'
                : 'Try changing your search or filters to find your listings.'
            }}
          </p>

          <button
            v-if="properties.length === 0"
            @click="goToAddProperty"
            class="bg-[var(--royal-blue)] text-[var(--white)] font-semibold px-8 py-3 rounded-3xl text-sm hover:bg-[var(--steel-blue)] transition"
          >
            Add Your First Property
          </button>

          <button
            v-else
            @click="clearFilters"
            class="bg-[#0025cc] text-white font-semibold px-8 py-3 rounded-3xl text-sm hover:bg-[#546cdd] transition"
          >
            Clear Filters
          </button>
        </div>

        <!-- Properties Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="property in filteredProperties"
            :key="property.id"
            class="property-card bg-white rounded-3xl overflow-hidden border border-gray-100 group"
          >
            <!-- Image -->
            <div class="relative h-64 overflow-hidden">
              <img
                v-if="property.cover_image || property.image_1"
                :src="property.cover_image || property.image_1 || ''"
                class="property-image w-full h-full object-cover"
                :alt="property.title || 'Property cover'"
                loading="lazy"
              />

              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-[#dbeafe] via-[#ebf8ff] to-[#c7d2fe] flex items-center justify-center text-6xl"
                aria-label="No property image available"
              >
                {{ isLand(property) ? '🌳' : '🏠' }}
              </div>

              <!-- Category -->
              <div class="absolute top-4 left-4">
                <span
                  class="px-3 py-2 text-xs font-bold rounded-xl shadow-md"
                  :class="getCategoryClass(property)"
                >
                  {{ getCategoryLabel(property) }}
                </span>
              </div>

              <!-- Status -->
              <div class="absolute top-4 right-4">
                <span
                  class="px-3 py-2 text-xs font-semibold rounded-xl shadow-md"
                  :class="getStatusClass(property.status)"
                >
                  {{ formatStatus(property.status) }}
                </span>
              </div>

              <!-- Price -->
              <div
                class="price-tag absolute bottom-4 left-4 text-white px-4 py-3 rounded-2xl shadow-lg"
              >
                <p class="text-[10px] uppercase tracking-wider opacity-90">
                  {{ getPriceLabel(property) }}
                </p>
                <p class="text-xl font-bold">
                  {{ formatNaira(property.price) }}
                </p>
                <p
                  v-if="isRental(property) && property.purpose === 'For Rent'"
                  class="text-xs opacity-90 mt-1"
                >
                  Asking price
                </p>
                <p v-else-if="isSale(property)" class="text-xs opacity-90 mt-1">
                  Asking price · Final sale price may differ
                </p>
              </div>

              <div
                class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent"
              ></div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex justify-between items-start gap-3 mb-4">
                <div class="min-w-0">
                  <h3 class="text-xl font-semibold text-[#424242] line-clamp-2">
                    {{ property.title || 'Untitled Property' }}
                  </h3>

                  <div class="flex items-center gap-1.5 text-sm text-[#707070] mt-2">
                    <i class="fas fa-map-marker-alt text-[#546cdd]"></i>
                    <span>{{ property.city || 'City not specified' }}, {{ property.state || 'State not specified' }}</span>
                  </div>

                  <p v-if="property.area" class="text-xs text-gray-500 mt-1">
                    {{ property.area }}
                  </p>
                </div>

                <span
                  class="inline-block bg-[#ebf8ff] text-[#0025cc] text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap"
                >
                  {{ property.property_type || 'Property' }}
                </span>
              </div>

              <!-- Land details -->
              <div
                v-if="isLand(property)"
                class="rounded-2xl bg-[#ebf8ff] p-4 mb-5 space-y-2"
              >
                <div class="flex justify-between gap-3 text-sm">
                  <span class="text-gray-500">Land size</span>
                  <span class="font-semibold text-[#0025cc] text-right">
                    {{ formatLandSize(property) }}
                  </span>
                </div>

                <div v-if="property.land_use" class="flex justify-between gap-3 text-sm">
                  <span class="text-gray-500">Land use</span>
                  <span class="font-semibold text-right">{{ property.land_use }}</span>
                </div>

                <div v-if="property.access_road" class="flex justify-between gap-3 text-sm">
                  <span class="text-gray-500">Access road</span>
                  <span class="font-semibold text-right">{{ property.access_road }}</span>
                </div>

                <div v-if="property.title_document_status" class="flex justify-between gap-3 text-sm">
                  <span class="text-gray-500">Title documents</span>
                  <span class="font-semibold text-right">
                    {{ formatDocumentStatus(property.title_document_status) }}
                  </span>
                </div>
              </div>

              <!-- Property features -->
              <div
                v-else
                class="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-5 my-5"
              >
                <div class="flex flex-col items-center text-center gap-1">
                  <div class="w-9 h-9 bg-[#ebf8ff] rounded-xl flex items-center justify-center text-[#0025cc]">
                    <Bed class="w-5 h-5" />
                  </div>
                  <span class="text-[10px] text-gray-500">BEDROOMS</span>
                  <span class="font-semibold text-base">{{ property.bedrooms ?? 0 }}</span>
                </div>

                <div class="flex flex-col items-center text-center gap-1">
                  <div class="w-9 h-9 bg-[#ebf8ff] rounded-xl flex items-center justify-center text-[#0025cc]">
                    <Bath class="w-5 h-5" />
                  </div>
                  <span class="text-[10px] text-gray-500">BATHROOMS</span>
                  <span class="font-semibold text-base">{{ property.bathrooms ?? 0 }}</span>
                </div>

                <div class="flex flex-col items-center text-center gap-1">
                  <div class="w-9 h-9 bg-[#ebf8ff] rounded-xl flex items-center justify-center text-[#0025cc]">
                    <Car class="w-5 h-5" />
                  </div>
                  <span class="text-[10px] text-gray-500">PARKING</span>
                  <span class="font-semibold text-base">{{ property.parking_spaces ?? 0 }}</span>
                </div>
              </div>

              <!-- System charge estimate for sale listings -->
              <div
                v-if="isSale(property)"
                class="rounded-xl bg-purple-50 border border-purple-100 p-3 mb-5"
              >
                <div class="flex justify-between items-start gap-3 text-sm">
                  <span class="text-purple-800">Estimated system charge (5%)</span>
                  <span class="font-semibold text-purple-900 text-right">
                    {{ formatNaira(getEstimatedSystemCharge(property.price)) }}
                  </span>
                </div>
                <p class="text-[11px] text-purple-700 mt-2">
                  Estimate based on asking price. The final charge should be calculated from the agreed sale price at completion.
                </p>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click.stop="viewProperty(property.id)"
                  class="py-3 px-2 border border-[#0025cc] text-[#0025cc] hover:bg-[#0025cc] hover:text-white font-medium rounded-2xl transition-all text-sm"
                >
                  View Details
                </button>

                <button
                  @click.stop="editProperty(property.id)"
                  class="py-3 px-2 bg-[#0025cc] hover:bg-[#546cdd] text-white font-medium rounded-2xl transition-all text-sm"
                >
                  Edit Property
                </button>
              </div>
            </div>
          </article>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { Bed, Bath, Car } from 'lucide-vue-next'

type ListingCategory = 'rental' | 'property_sale' | 'land_sale'

interface Property {
  id: string
  agent_id: string
  title: string | null
  property_type: string | null
  purpose: string | null
  listing_category?: ListingCategory | null
  state: string | null
  city: string | null
  area: string | null
  address?: string | null
  price: number | string | null
  status: string
  cover_image?: string | null
  image_1?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  toilets?: number | null
  parking_spaces?: number | null
  land_size?: number | string | null
  land_size_unit?: string | null
  land_use?: string | null
  access_road?: string | null
  title_document_status?: string | null
  created_at?: string | null
}

const router = useRouter()

const properties = ref<Property[]>([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const selectedCategory = ref<'all' | ListingCategory>('all')
const selectedStatus = ref('all')

const isSale = (property: Property): boolean => {
  return (
    property.listing_category === 'property_sale' ||
    property.listing_category === 'land_sale' ||
    property.purpose === 'For Sale' ||
    property.purpose === 'Land for Sale'
  )
}

const isLand = (property: Property): boolean => {
  return (
    property.listing_category === 'land_sale' ||
    property.purpose === 'Land for Sale' ||
    property.property_type?.toLowerCase() === 'land'
  )
}

const isRental = (property: Property): boolean => !isSale(property)

const getCategory = (property: Property): ListingCategory => {
  if (property.listing_category) return property.listing_category
  if (property.purpose === 'Land for Sale') return 'land_sale'
  if (property.purpose === 'For Sale') return 'property_sale'
  return 'rental'
}

const getCategoryLabel = (property: Property): string => {
  const category = getCategory(property)

  if (category === 'land_sale') return 'LAND FOR SALE'
  if (category === 'property_sale') return 'PROPERTY FOR SALE'

  if (property.purpose === 'For Lease') return 'FOR LEASE'
  if (property.purpose === 'For Rent') return 'FOR RENT'

  return 'RENTAL / LEASE'
}

const getCategoryClass = (property: Property): string => {
  const category = getCategory(property)

  if (category === 'land_sale') return 'bg-emerald-600 text-white'
  if (category === 'property_sale') return 'bg-purple-600 text-white'

  return 'bg-blue-600 text-white'
}

const getPriceLabel = (property: Property): string => {
  if (isLand(property)) return 'LAND ASKING PRICE'
  if (isSale(property)) return 'SALE ASKING PRICE'
  if (property.purpose === 'For Lease') return 'LEASE PRICE'
  return 'RENTAL PRICE'
}

const formatNaira = (value: number | string | null | undefined): string => {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount)) return '₦0'

  return `₦${amount.toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })}`
}

const getEstimatedSystemCharge = (
  price: number | string | null | undefined,
): number => {
  const amount = Number(price ?? 0)

  if (!Number.isFinite(amount) || amount <= 0) return 0

  return amount * 0.05
}

const formatLandSize = (property: Property): string => {
  if (property.land_size === null || property.land_size === undefined || property.land_size === '') {
    return 'Not specified'
  }

  const size = Number(property.land_size)

  if (!Number.isFinite(size)) return 'Not specified'

  const formattedSize = size.toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })

  return `${formattedSize} ${property.land_size_unit || ''}`.trim()
}

const formatDocumentStatus = (status: string): string => {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-600 text-white',
    pending: 'bg-amber-500 text-white',
    approved: 'bg-green-600 text-white',
    published: 'bg-green-600 text-white',
    rejected: 'bg-red-600 text-white',
    sold: 'bg-purple-600 text-white',
    rented: 'bg-blue-600 text-white',
  }

  return classes[status] || 'bg-gray-500 text-white'
}

const countByStatus = (status: string): number => {
  return properties.value.filter((property) => property.status === status).length
}

const filteredProperties = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return properties.value.filter((property) => {
    const matchesSearch =
      !query ||
      [property.title, property.city, property.state, property.area, property.property_type]
        .some((value) => value?.toLowerCase().includes(query))

    const matchesCategory =
      selectedCategory.value === 'all' ||
      getCategory(property) === selectedCategory.value

    const matchesStatus =
      selectedStatus.value === 'all' ||
      property.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesStatus
  })
})

const fetchMyProperties = async (): Promise<void> => {
  loading.value = true
  errorMessage.value = ''

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) throw authError

    if (!user) {
      await router.push('/login')
      return
    }

    // Match the same ownership convention used when creating a listing.
    const agentId =
      typeof user.user_metadata?.agent_id === 'string'
        ? user.user_metadata.agent_id
        : user.id

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw error

    properties.value = (data ?? []) as Property[]
  } catch (error: unknown) {
    console.error('Failed to fetch properties:', error)
    errorMessage.value = 'Unable to load your property listings. Please try again.'
  } finally {
    loading.value = false
  }
}

const viewProperty = (id: string): void => {
  router.push(`/properties/${id}`)
}

const editProperty = (id: string): void => {
  router.push(`/properties/edit/${id}`)
}

const goToAddProperty = (): void => {
  router.push('/agent/add-property')
}

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
}

const toggleFavorite = (id: string): void => {
  // Connect this action to saved_properties when the favourite feature is implemented.
  console.log('Favourite action requested for:', id)
}

onMounted(fetchMyProperties)
</script>

<style scoped>
.property-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgb(0 37 204 / 0.15);
}

.property-image {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover .property-image {
  transform: scale(1.06);
}

.price-tag {
  background: linear-gradient(135deg, #0025cc, #2e4cd5);
}
</style>
