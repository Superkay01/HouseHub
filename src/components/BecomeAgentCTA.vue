<template>
  <section class="relative py-10 sm:py-16 md:py-20 overflow-hidden">
    <!-- Background Image + Gradient -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>

    <!-- Dark Blue Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-[var(--black)]/50 via-medium-blue to-transparent opacity-90"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">

        <!-- Left Content -->
        <div class="space-y-4 sm:space-y-6 md:space-y-8">
          <div>
            <span class="inline-block px-3 sm:px-5 py-1 sm:py-2 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-sm font-medium rounded-full border border-white/30">
              Join Our Agent Network
            </span>
          </div>

          <h2 class="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
            Are You a Property Agent?
          </h2>

          <p class="text-xs sm:text-sm md:text-base lg:text-lg text-[var(--light-blue)] max-w-lg">
            Showcase your properties to serious renters in
            <span class="font-semibold">Ilorin</span> and
            <span class="font-semibold">Ijebu Ode</span>. Grow your business with LodgeNext.
          </p>

          <!-- Benefits — 2 columns on all sizes -->
          <div class="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div
              v-for="(benefit, i) in benefits"
              :key="i"
              class="flex items-start gap-2 sm:gap-3 text-white"
            >
              <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bright-green flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-black text-xs sm:text-lg leading-none">✓</span>
              </div>
              <p class="text-xs sm:text-sm text-light-blue leading-snug">
                {{ benefit }}
              </p>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-2 gap-2.5 sm:gap-4 pt-2 sm:pt-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-3xl p-3 sm:p-6 hover:bg-white/20 transition-all"
            >
              <div class="text-xl sm:text-3xl font-bold text-white leading-tight">
                {{ stat.value }}
              </div>
              <div class="text-[10px] sm:text-sm text-light-blue mt-0.5 sm:mt-0">
                {{ stat.label }}
              </div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-6">
            <button
              @click="becomeAgent"
              class="bg-white text-royal-blue hover:bg-light-blue font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base md:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap"
            >
              Become an Agent
            </button>

            <button
              class="border border-white/70 text-white hover:bg-white/10 font-medium px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base md:text-lg transition-all backdrop-blur-md whitespace-nowrap"
            >
              Learn More
            </button>
          </div>
        </div>

        <!-- Right Side - Visual (lg and up only) -->
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