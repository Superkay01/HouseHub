<template>
  <section class="py-20 relative overflow-hidden" 
           style="background: linear-gradient(135deg, #ebf8ff 0%, #f8fbff 100%);">
    <!-- Background Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-10 left-10 w-72 h-72 bg-[#ebf8ff] rounded-full blur-3xl opacity-60"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-[#697fe1] rounded-full blur-3xl opacity-20"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-[#546cdd] rounded-full blur-3xl opacity-10"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-[#ebf8ff] text-[#0025cc] px-6 py-2 rounded-full text-sm font-medium mb-4">
          <Info class="w-5 h-5"/>
          <span>3 SIMPLE STEPS</span>
        </div>
        <h2 class="text-5xl md:text-6xl font-bold text-[#424242] tracking-tight mb-4 heading-font">
          How HouseHub Works
        </h2>
        <p class="max-w-2xl mx-auto text-xl text-[#707070]">
          Find your next home in just a few simple steps. Search, explore, and connect with trusted agents anywhere in Nigeria.
        </p>
      </div>

      <!-- Steps Container -->
      <div class="relative">
        <!-- Desktop Connecting Line -->
        <div class="hidden lg:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-[#546cdd] to-transparent"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 relative">
          <!-- Step 1 -->
          <div v-for="(step, index) in steps" 
               :key="step.id"
               class="how-step relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            
            <!-- Step Number -->
            <div class="absolute -top-5 left-8 bg-white border-2 border-[#0025cc] text-[#0025cc] w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
              {{ String(index + 1).padStart(2, '0') }}
            </div>

            <!-- Icon -->
            <div class="w-20 h-20 mx-auto mb-8 bg-[#ebf8ff] rounded-3xl flex items-center justify-center text-[#0025cc] group-hover:scale-110 transition-transform duration-300">
            <component
                :is="iconMap[step.icon]"
                class="w-8 h-8 text-[#0025cc]"
            />
            </div>

            <!-- Content -->
            <h3 class="text-2xl font-semibold text-[#424242] text-center mb-4">
              {{ step.title }}
            </h3>
            <p class="text-[#707070] text-center leading-relaxed">
              {{ step.description }}
            </p>

            <!-- Subtle Arrow for Mobile -->
            <div v-if="index < 2" class="md:hidden flex justify-center mt-8 text-[#546cdd]">
              <i class="fas fa-arrow-down text-3xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-20 text-center">
        <button 
          class="group inline-flex items-center gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-lg px-10 py-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30 active:scale-95"
        >
          Start Searching Homes
          <i class="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
        </button>
        <p class="text-sm text-[#707070] mt-4">Join thousands of happy renters across Nigeria</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Info, Map, Home, PhoneCall } from 'lucide-vue-next'
import { ref } from 'vue'

const iconMap = {
  Map,
  Home,
  PhoneCall
}

const steps = ref([
  {
    id: 1,
    icon: "Map",
    title: "Search Location",
    description: "Choose your preferred state, city, or neighborhood from our nationwide property database covering all 36 states and the FCT."
  },
  {
    id: 2,
    icon: "Home",
    title: "Find Property",
    description: "Browse verified rental listings, compare prices, view property details, photos, amenities, and nearby locations."
  },
  {
    id: 3,
    icon: "PhoneCall",
    title: "Contact Agent",
    description: "Connect directly with trusted agents, schedule inspections instantly, and secure your ideal home with confidence."
  }
])
</script>

<style scoped>
.heading-font {
  font-family: 'Playfair Display', sans-serif;
}

.how-step {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.how-step:hover {
  transform: translateY(-12px);
  border-color: #697fe1;
}

.how-step::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 2px;
  background: linear-gradient(to right, #546cdd, transparent);
  top: 28px;
  right: -20px;
  display: none;
}

.how-step:last-child::after {
  display: none;
}

@media (min-width: 1024px) {
  .how-step:not(:last-child)::after {
    display: block;
  }
}
</style>