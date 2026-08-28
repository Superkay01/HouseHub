<template>
  <section 
    ref="sectionRef"
    class="relative py-24 overflow-hidden min-h-screen flex items-center"
  >
    <!-- Background Image with Overlay -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
      style="background-image: url('https://picsum.photos/id/1015/2000/1200');">
    ></div>
    
    <!-- Dark Blue Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/50 via-[var(--medium-blue)]/40 to-[var(--steel-blue)]/70"></div>

    <!-- Subtle Animated Gradient Blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-96 h-96 bg-[#697fe1] rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute bottom-32 right-32 w-[500px] h-[500px] bg-[#546cdd] rounded-full blur-3xl opacity-15 animate-pulse" style="animation-delay: 1.5s"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-3xl text-sm font-medium mb-6">
          <span class="text-[#00db00]">✦</span>
          PREMIUM EXPERIENCE
        </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 heading-font">
          Why Choose LodgeNext?
        </h2>
        <p class="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-white/90">
          Making it easier to find trusted rental properties in Ilorin and Ijebu Ode.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="glass-card group p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-[#9faffa]/50 transition-all duration-500 hover:-translate-y-3"
        >
          <div class="w-14 h-14 flex items-center justify-center bg-[#00db00]/20 rounded-2xl mb-8 group-hover:scale-110 transition-transform">
            <Check class="w-6 h-6 text-[#00db00]" />
          </div>

          <h3 class="text-2xl font-semibold text-white mb-4">{{ feature.title }}</h3>
          <p class="text-white/80 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Statistics with Count-up Animation -->
      <div class="grid grid-cols-4 mt-20 text-white">
        <div class="text-center ">
          <div class="text-4xl sm:text-6xl font-bold tabular-nums">
            {{ displayStats.agents }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Trusted Agents</div>
        </div>

        <div class="text-center min-w-[100px]">
          <div class="text-4xl sm:text-6xl font-bold tabular-nums">
            {{ displayStats.properties }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Verified Properties</div>
        </div>

        <div class="text-center min-w-[100px]">
          <div class="text-4xl sm:text-6xl font-bold tabular-nums">
            {{ displayStats.ilorin }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Ilorin Coverage</div>
        </div>

        <div class="text-center min-w-[100px]">
          <div class="text-4xl sm:text-6xl font-bold tabular-nums">
            {{ displayStats.ijebuOde }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 mt-1">Ijebu Ode Coverage</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-20 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-2xl mx-auto">
        <h3 class="text-3xl font-semibold text-white mb-3">Ready to Find Your Next Home?</h3>
        <p class="text-white/80 mb-8">Browse available properties and connect with trusted agents today.</p>
        
        <router-link 
          to="/property"
          class="group inline-flex items-center gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-lg px-12 py-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#0025cc]/40 active:scale-95"
        >
          Explore Properties
          <i class="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Check } from 'lucide-vue-next'
import { supabase } from '@/supabaseClient.js'

const sectionRef = ref(null)
let observer = null
let hasAnimated = false

const features = ref([
  {
    title: "Verified Agents",
    description: "Connect only with trusted and verified property agents."
  },
  {
    title: "Verified Listings",
    description: "Every property listing is reviewed before publication."
  },
  {
    title: "Local Property Expertise",
    description: "Specialized property listings in Ilorin and Ijebu Ode."
  },
  {
    title: "Instant Messaging",
    description: "Communicate directly with agents in real-time."
  },
  {
    title: "Secure Property Search",
    description: "Browse properties with confidence and transparency."
  },
  {
    title: "Fast Property Discovery",
    description: "Find your ideal home quickly with smart filters."
  }
])

// Final values from database
const stats = ref({
  agents: 0,
  properties: 0,
  ilorin: 0,
  ijebuOde: 0
})

// Values shown on screen (animated)
const displayStats = ref({
  agents: 0,
  properties: 0,
  ilorin: 0,
  ijebuOde: 0
})

// ---------- Count-up animation ----------
const animateValue = (key, endValue, duration = 1800) => {
  const start = 0
  const startTime = performance.now()

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Smooth ease-out
    const ease = 1 - Math.pow(1 - progress, 3)
    
    displayStats.value[key] = Math.floor(start + (endValue - start) * ease)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayStats.value[key] = endValue
    }
  }

  requestAnimationFrame(step)
}

const startCountUp = () => {
  if (hasAnimated) return
  hasAnimated = true

  animateValue('agents', stats.value.agents)
  animateValue('properties', stats.value.properties)
  animateValue('ilorin', stats.value.ilorin)
  animateValue('ijebuOde', stats.value.ijebuOde)
}

// ---------- Fetch real stats (based on your tables) ----------
const fetchStats = async () => {
  try {
    // 1. Trusted Agents → profiles where role = 'agent'
    const { count: agentsCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent')

    // 2. Verified Properties → properties with status = 'approved'
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // 3. Ilorin Coverage → approved properties in Ilorin
    const { count: ilorinCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .ilike('city', '%ilorin%')

    // 4. Ijebu Ode Coverage → approved properties in Ijebu Ode
    const { count: ijebuOdeCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .or('city.ilike.%ijebu%,city.ilike.%ijebu-ode%,city.ilike.%ijebu ode%')

    stats.value = {
      agents: agentsCount || 0,
      properties: propertiesCount || 0,
      ilorin: ilorinCount || 0,
      ijebuOde: ijebuOdeCount || 0
    }

  } catch (err) {
    console.error('Failed to load stats:', err)
  }
}

// ---------- Lifecycle ----------
onMounted(async () => {
  // Fetch data first
  await fetchStats()

  // Start animation only when section is visible
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCountUp()
          if (sectionRef.value) {
            observer.unobserve(sectionRef.value)
          }
        }
      })
    },
    {
      threshold: 0.3 // starts when 30% of section is visible
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  if (observer && sectionRef.value) {
    observer.unobserve(sectionRef.value)
  }
})
</script>

<style scoped>
.heading-font {
  font-family: 'Playfair Display', sans-serif;
}

.glass-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px -15px rgba(0, 37, 204, 0.3);
}

.glass-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 37, 204, 0.4);
}
</style>