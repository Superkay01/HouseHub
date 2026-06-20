<template>
  <section class="relative py-24 overflow-hidden min-h-screen flex items-center">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
         style="background-image: url('https://picsum.photos/id/1015/2000/1200');">
    </div>
    
    <!-- Dark Blue Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[rgba(0,37,204,0.85)] via-[rgba(46,76,213,0.75)] to-[rgba(0,37,204,0.8)]"></div>

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
        <h2 class="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 heading-font">
          Why Choose LodgeNext?
        </h2>
        <p class="max-w-2xl mx-auto text-xl text-white/90">
          Making it easier to find trusted rental properties in Ilorin and Ijebu Ode.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" 
             :key="index"
             class="glass-card group p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-[#9faffa]/50 transition-all duration-500 hover:-translate-y-3">
          
          <!-- Checkmark -->
          <div class="w-14 h-14 flex items-center justify-center bg-[#00db00]/20 rounded-2xl mb-8 group-hover:scale-110 transition-transform">
            <Check class="w-5 h-5 text-3xl text-[#00db00]"/>
          </div>

          <h3 class="text-2xl font-semibold text-white mb-4">{{ feature.title }}</h3>
          <p class="text-white/80 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- Statistics -->
      <div class="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <div class="text-5xl font-bold text-white mb-2">{{ stat.value }}</div>
          <div class="text-white/70 font-medium">{{ stat.label }}</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-20 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-2xl mx-auto">
        <h3 class="text-3xl font-semibold text-white mb-3">Ready to Find Your Next Home?</h3>
        <p class="text-white/80 mb-8">Browse available properties and connect with trusted agents today.</p>
        
        <router-link 
        to="/login"
        class="group inline-flex items-center gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-lg px-12 py-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#0025cc]/40 active:scale-95 inline-block"
        >
        Explore Properties
        <i class="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Check } from 'lucide-vue-next';
import { ref } from 'vue'

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

const stats = ref([
  { value: "250+", label: "Trusted Agents" },
  { value: "1,800+", label: "Verified Properties" },
  { value: "95%", label: "Ilorin Coverage" },
  { value: "88%", label: "Ijebu Ode Coverage" }
])
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

.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

/* Optional subtle parallax on scroll (requires JS or Intersection Observer in real app) */
</style>