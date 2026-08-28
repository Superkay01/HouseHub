<template>
  <section class="py-12 sm:py-16 md:py-20 bg-[var(--steel-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2 bg-[var(--light-blue)] text-[var(--royal-blue)] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <i class="fas fa-star"></i>
          <span>PREMIUM SELECTION</span>
        </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-[var(--white)] tracking-tight mb-3 sm:mb-4 heading-font">
          Featured Homes
        </h2>
        <p class="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[var(--white)] px-2">
          Explore some of the most sought-after rental properties within Ilorin and Ijebu Ode.
          Verified listings, trusted agents, and premium locations.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 sm:py-16 text-white/80 text-sm sm:text-base">
        Loading featured homes...
      </div>

      <!-- Empty -->
      <div v-else-if="properties.length === 0" class="text-center py-12 sm:py-16 text-white/80 text-sm sm:text-base">
        No featured properties available at the moment.
      </div>

      <!-- Properties Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        <div
          v-for="property in visibleProperties"
          :key="property.id"
          class="property-card bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 group"
        >
          <!-- Image -->
          <div class="relative h-52 sm:h-60 md:h-72 overflow-hidden">
            <img
              :src="property.cover_image || placeholderImg"
              class="property-image w-full h-full object-cover"
              :alt="property.title"
            />

            <!-- Price -->
            <div class="price-tag absolute top-3 left-3 sm:top-5 sm:left-5 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-semibold shadow-lg">
              <span class="text-lg sm:text-xl md:text-2xl">₦{{ formatPrice(property.price) }}</span>
              <span class="text-xs sm:text-sm opacity-75">/year</span>
            </div>

            <!-- Verified Badge -->
            <div
              class="verification-badge absolute top-3 right-3 sm:top-5 sm:right-5 bg-[#00db00] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1 shadow-md"
            >
              <i class="fas fa-shield-alt text-xs"></i>
              <span>VERIFIED</span>
            </div>

            <!-- Favorite → login -->
            <button
              @click.stop="requireAuth(`/properties/${property.id}`)"
              class="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md transition-all hover:scale-110"
            >
              <i class="fas fa-heart text-base sm:text-xl text-gray-400 group-hover:text-red-500 transition-colors"></i>
            </button>

            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6 md:p-8">
            <div class="flex justify-between items-start gap-2 mb-2 sm:mb-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--royal-blue)] line-clamp-1">
                  {{ property.title }}
                </h3>
                <div class="flex items-center gap-1.5 text-[var(--royal-blue)] mt-1 sm:mt-2 text-sm sm:text-base">
                  <i class="fas fa-map-marker-alt text-[var(--royal-blue)] text-xs sm:text-sm"></i>
                  <span class="truncate">{{ property.area || property.city }}, {{ property.city }}</span>
                </div>
              </div>
              <span class="shrink-0 inline-block bg-[#ebf8ff] text-[var(--royal-blue)] text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl">
                {{ property.property_type }}
              </span>
            </div>

            <!-- Features -->
            <div class="flex justify-between border-t border-b border-gray-100 py-4 sm:py-5 my-4 sm:my-5">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-[#ebf8ff] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Bed class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div class="text-[10px] sm:text-xs text-[var(--medium-blue)]">BEDS</div>
                  <div class="font-semibold text-base sm:text-lg">{{ property.bedrooms ?? '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-[#ebf8ff] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Bath class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div class="text-[10px] sm:text-xs text-[var(--medium-blue)]">BATHS</div>
                  <div class="font-semibold text-base sm:text-lg">{{ property.bathrooms ?? '—' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div class="w-8 h-8 sm:w-9 sm:h-9 bg-[#ebf8ff] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Car class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div class="text-[10px] sm:text-xs text-[var(--medium-blue)]">PARK</div>
                  <div class="font-semibold text-base sm:text-lg">{{ property.parking_spaces ?? '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
              <button
                @click="requireAuth(`/properties/${property.id}`)"
                class="py-2.5 sm:py-3.5 border border-[#0025cc] text-[#0025cc] hover:bg-[#0025cc] hover:text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all"
              >
                View Details
              </button>
              <button
                @click="requireAuth(`/properties/${property.id}?action=contact`)"
                class="py-2.5 sm:py-3.5 bg-[#0025cc] hover:bg-[#546cdd] text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Phone class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="hidden xs:inline">Contact</span>
                <span class="xs:hidden sm:inline">Contact Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- View More / Browse All -->
      <div v-if="!loading && properties.length > 0" class="mt-10 sm:mt-14 md:mt-16 text-center space-y-4 sm:space-y-5">
        <!-- View More (only when showing 3 and more exist) -->
        <button
          v-if="!showAll && properties.length > 3"
          @click="showAll = true"
          class="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm sm:text-base underline underline-offset-4 transition"
        >
          View more properties
          <i class="fas fa-chevron-down text-xs"></i>
        </button>

        <!-- Browse All → Sign Up -->
        <div>
          <button
            @click="goToProperty"
            class="group inline-flex items-center gap-2.5 sm:gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30"
          >
            Browse All Properties
            <ArrowRight class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Bath, Bed, Car, Phone } from 'lucide-vue-next'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()
const properties = ref([])
const loading = ref(true)
const showAll = ref(false)
const placeholderImg = 'https://via.placeholder.com/600x400?text=Property'

// Show 3 by default, 6 when "View more" is clicked
const visibleProperties = computed(() => {
  return showAll.value ? properties.value.slice(0, 6) : properties.value.slice(0, 3)
})

const formatPrice = (price) => {
  if (!price && price !== 0) return '—'
  const num = Number(price)
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K'
  }
  return num.toLocaleString()
}

/** Redirect to login with return URL */
const requireAuth = (redirectTo = '/properties') => {
  router.push({
    path: '/login',
    query: { redirect: redirectTo }
  })
}

/** Browse All → Property */
const goToProperty = () => {
  router.push('/property') 
}

const fetchFeaturedProperties = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        property_type,
        purpose,
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
        created_at
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }) // newest first
      .limit(6)

    if (error) throw error
    properties.value = data || []
  } catch (err) {
    console.error('Error fetching featured properties:', err)
    properties.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeaturedProperties()
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