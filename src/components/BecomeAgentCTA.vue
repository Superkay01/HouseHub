<template>
  <section class="relative py-20 overflow-hidden">
    <!-- Background Image + Gradient -->
    <div class="absolute inset-0 bg-cover bg-center" 
         :style="{ backgroundImage: `url(${backgroundImage})` }">
    </div>
    
    <!-- Dark Blue Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-[var(--black)]/50 via-medium-blue to-transparent opacity-90"></div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <!-- Left Content -->
        <div class="space-y-8">
          <div>
            <span class="inline-block px-5 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
              Join Our Agent Network
            </span>
          </div>

          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Are You a Property Agent?
          </h2>

          <p class="text-xl text-light-blue max-w-lg">
            Showcase your properties to serious renters in <span class="font-semibold">Ilorin</span> and 
            <span class="font-semibold">Ijebu Ode</span>. Grow your business with LodgeNext.
          </p>

          <!-- Benefits -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(benefit, i) in benefits" :key="i" 
                 class="flex items-start gap-3 text-white">
              <div class="w-6 h-6 rounded-full bg-bright-green flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-black text-lg leading-none">✓</span>
              </div>
              <p class="text-light-blue">{{ benefit }}</p>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-2 gap-4 pt-4">
            <div v-for="stat in stats" :key="stat.label"
                 class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all">
              <div class="text-3xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-sm text-light-blue">{{ stat.label }}</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4 pt-6">
            <button 
              @click="becomeAgent"
              class="bg-white text-royal-blue hover:bg-light-blue font-semibold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
              Become an Agent
            </button>
            
            <button 
              class="border border-white/70 text-white hover:bg-white/10 font-medium px-8 py-4 rounded-2xl text-lg transition-all backdrop-blur-md">
              Learn More
            </button>
          </div>
        </div>

        <!-- Right Side - Visual -->
        <div class="relative hidden lg:block">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              :src="agentImage" 
              alt="Professional Real Estate Agent"
              class="w-full h-full object-cover"
            />
            <!-- Floating Badge -->
            <div class="absolute top-6 right-6 bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div class="w-3 h-3 bg-bright-green rounded-full animate-pulse"></div>
              <span class="font-semibold text-dark-gray">Verified Agent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const backgroundImage = ref('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2000&q=80')

const agentImage = ref('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80')

const benefits = ref([
  "Upload and manage unlimited property listings",
  "Reach serious tenants in Ilorin & Ijebu Ode",
  "Get direct inquiries and bookings",
  "Earn credibility with verified agent badge"
])

const stats = ref([
  { value: "2,450", label: "Active Listings" },
  { value: "8,920", label: "Interested Renters" },
  { value: "340", label: "Verified Agents" },
  { value: "1,850", label: "Successful Connections" }
])

const becomeAgent = () => {
  alert("Agent Registration Form will open here")
  // router.push('/agent-signup')
}
</script>