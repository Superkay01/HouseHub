<template>
  <section class="relative py-10 sm:py-16 md:py-20 overflow-hidden">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
    <div class="absolute inset-0 bg-gradient-to-br from-[#000000]/90 via-[#546cdd]/85 to-[var(--royal-blue)]/90"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 md:mb-14">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-4">
          What Our Users Say
        </h2>
        <p class="text-xs sm:text-sm md:text-lg text-light-blue max-w-2xl mx-auto px-2 leading-snug sm:leading-normal">
          Discover how LodgeNext is helping renters find quality homes and property agents connect with the right tenants in Ilorin and Ijebu Ode.
        </p>

        <!-- Average rating (only when we have real reviews) -->
        <div
          v-if="displayReviews.length && !usingFallback"
          class="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-5"
        >
          <div class="flex text-bright-green text-sm sm:text-lg md:text-2xl">
            <span v-for="star in 5" :key="star">
              {{ star <= Math.round(averageRating) ? '★' : '☆' }}
            </span>
          </div>
          <span class="text-white text-xs sm:text-sm md:text-base font-medium">
            {{ averageRating }} · {{ displayReviews.length }} review{{ displayReviews.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10 sm:py-16 text-white/80 text-xs sm:text-base">
        Loading reviews...
      </div>

      <!-- Slider -->
      <div v-else class="relative">
        <!-- Navigation Arrows (desktop) -->
        <button
          v-if="canScrollPrev"
          @click="prev"
          class="hidden md:flex absolute -left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 items-center justify-center text-white text-xl sm:text-2xl transition"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          v-if="canScrollNext"
          @click="next"
          class="hidden md:flex absolute -right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 items-center justify-center text-white text-xl sm:text-2xl transition"
          aria-label="Next"
        >
          ›
        </button>

        <!-- Track -->
        <div
          ref="track"
          class="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 sm:pb-4 scrollbar-hide"
          @scroll="updateScrollState"
        >
          <div
            v-for="(item, index) in displayReviews"
            :key="item.id || index"
            class="snap-start shrink-0 w-full sm:w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div
              class="h-full group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <!-- Quote Icon -->
              <div class="text-3xl sm:text-4xl md:text-5xl text-white/30 mb-2 sm:mb-3 md:mb-5 leading-none">“</div>

              <!-- Rating -->
              <div class="flex text-bright-green mb-2 sm:mb-3 md:mb-5 text-sm sm:text-base md:text-lg tracking-wider">
                <span v-for="star in 5" :key="star">
                  {{ star <= (item.rating || 5) ? '★' : '☆' }}
                </span>
              </div>

              <!-- Testimonial Text -->
              <p class="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 md:mb-8 min-h-[80px] sm:min-h-[100px] md:min-h-[120px]">
                "{{ item.text || item.review }}"
              </p>

              <!-- User Info -->
              <div class="flex items-center gap-2.5 sm:gap-3 md:gap-4 mt-auto">
                <div
                  v-if="item.avatar"
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-white/50 shrink-0"
                >
                  <img
                    :src="item.avatar"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-[var(--royal-blue)] text-white flex items-center justify-center font-bold text-sm sm:text-base md:text-lg ring-2 ring-white/50 shrink-0"
                >
                  {{ getInitials(item.name) }}
                </div>

                <div class="min-w-0">
                  <h4 class="font-semibold text-white text-xs sm:text-sm md:text-base truncate">
                    {{ item.name }}
                  </h4>
                  <p class="text-light-blue text-[10px] sm:text-xs md:text-sm truncate">
                    {{ item.location }}
                  </p>
                  <p class="text-white/70 text-[10px] sm:text-xs md:text-sm font-medium truncate">
                    {{ item.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots (mobile & tablet) -->
        <div class="flex justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-8 md:hidden">
          <button
            v-for="(_, i) in Math.ceil(displayReviews.length / slidesPerView)"
            :key="i"
            @click="goToSlide(i)"
            class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all"
            :class="currentSlide === i ? 'bg-white w-5 sm:w-6' : 'bg-white/40'"
          ></button>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-10 sm:mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
        <div
          v-for="(item, i) in trustItems"
          :key="i"
          class="flex flex-col items-center"
        >
          <div class="text-bright-green text-lg sm:text-2xl mb-1 sm:mb-2">✓</div>
          <p class="text-white font-medium text-xs sm:text-sm md:text-base">
            {{ item }}
          </p>
        </div>
      </div>

      <!-- Final CTA -->
      <div class="mt-10 sm:mt-14 md:mt-20 text-center">
        <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
          Ready to Find Your Next Home?
        </h3>
        <p class="text-xs sm:text-sm md:text-base text-light-blue mb-5 sm:mb-6 md:mb-8 max-w-md mx-auto px-2">
          Join hundreds of renters and agents already using LodgeNext.
        </p>
        <button
          @click="exploreProperties"
          class="bg-white text-[var(--royal-blue)] hover:bg-light-blue font-semibold px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base md:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          Start Exploring Properties
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()
const backgroundImage = ref('/testimonia.jpg')

const track = ref(null)
const loading = ref(true)
const realReviews = ref([])
const currentSlide = ref(0)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const slidesPerView = ref(1)

// Fallback testimonials (your original ones)
const fallbackTestimonials = [
  {
    id: 'fallback-1',
    text: "I found my apartment in Ilorin within just three days. The process was simple, and I connected with a trusted agent almost immediately.",
    name: "Adewale A.",
    location: "Ilorin, Kwara State",
    role: "Tenant",
    avatar: "/Testimony3.jpg",
    rating: 5
  },
  {
    id: 'fallback-2',
    text: "LodgeNext helped me reach serious renters faster than traditional advertising. I've successfully rented out multiple properties through the platform.",
    name: "Adeola O.",
    location: "Ijebu Ode, Ogun State",
    role: "Property Agent",
    avatar: "/Testimony2.jpg",
    rating: 5
  },
  {
    id: 'fallback-3',
    text: "The property listings were clear, verified, and easy to compare. It saved me a lot of time searching for the right home.",
    name: "Fatimah K.",
    location: "Ilorin, Kwara State",
    role: "Tenant",
    avatar: "/Testimony1.jpg",
    rating: 5
  }
]

const trustItems = [
  "Verified Listings",
  "Trusted Agents",
  "Faster Property Discovery",
  "Local Expertise in Ilorin & Ijebu Ode"
]

const usingFallback = computed(() => realReviews.value.length === 0)

const displayReviews = computed(() => {
  return usingFallback.value ? fallbackTestimonials : realReviews.value
})

const averageRating = computed(() => {
  if (!realReviews.value.length) return '0.0'
  const sum = realReviews.value.reduce((acc, r) => acc + (r.rating || 0), 0)
  return (sum / realReviews.value.length).toFixed(1)
})

const getInitials = (name) => {
  if (!name) return 'C'
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const updateSlidesPerView = () => {
  const width = window.innerWidth
  if (width >= 1024) slidesPerView.value = 3      // desktop / laptop
  else if (width >= 640) slidesPerView.value = 2 // tablet
  else slidesPerView.value = 1                   // mobile
}

const updateScrollState = () => {
  if (!track.value) return
  const el = track.value
  canScrollPrev.value = el.scrollLeft > 10
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10

  // Update current slide for dots
  const cardWidth = el.clientWidth / slidesPerView.value
  currentSlide.value = Math.round(el.scrollLeft / (cardWidth + 24))
}

const prev = () => {
  if (!track.value) return
  const cardWidth = track.value.clientWidth / slidesPerView.value
  track.value.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' })
}

const next = () => {
  if (!track.value) return
  const cardWidth = track.value.clientWidth / slidesPerView.value
  track.value.scrollBy({ left: cardWidth + 24, behavior: 'smooth' })
}

const goToSlide = (index) => {
  if (!track.value) return
  const cardWidth = track.value.clientWidth / slidesPerView.value
  track.value.scrollTo({ left: index * (cardWidth + 24), behavior: 'smooth' })
}

const fetchPublicReviews = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('app_reviews')
      .select(`
        id,
        rating,
        review,
        created_at,
        customer_id,
        property:properties ( title )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) throw error

    if (!data || data.length === 0) {
      realReviews.value = []
      return
    }

    // Fetch customer names
    const customerIds = [...new Set(data.map(r => r.customer_id).filter(Boolean))]
    let profilesMap = {}

    if (customerIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, city, state')
        .in('id', customerIds)

      if (profiles) {
        profilesMap = Object.fromEntries(profiles.map(p => [p.id, p]))
      }
    }

    realReviews.value = data.map(r => {
      const customer = profilesMap[r.customer_id]
      return {
        id: r.id,
        text: r.review || 'Great experience with LodgeNext!',
        rating: r.rating || 5,
        name: customer?.full_name || 'Happy Customer',
        location: customer
          ? [customer.city, customer.state].filter(Boolean).join(', ') || 'Nigeria'
          : 'Nigeria',
        role: 'Tenant',
        avatar: null,
        propertyTitle: r.property?.title || null
      }
    })
  } catch (err) {
    console.error('Error loading public reviews:', err)
    realReviews.value = []
  } finally {
    loading.value = false
    await nextTick()
    updateScrollState()
  }
}

const exploreProperties = () => {
  router.push('/login')
}

let resizeObserver = null

onMounted(async () => {
  updateSlidesPerView()
  await fetchPublicReviews()

  window.addEventListener('resize', () => {
    updateSlidesPerView()
    updateScrollState()
  })

  // Hide scrollbar
  if (track.value) {
    track.value.style.scrollbarWidth = 'none'
    track.value.style.msOverflowStyle = 'none'
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesPerView)
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>