<template>
  <section
    class="py-10 sm:py-14 md:py-20 relative overflow-hidden"
    style="background: linear-gradient(135deg, #ebf8ff 0%, #f8fbff 100%);"
  >
    <!-- Background Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute top-10 left-10 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-[#ebf8ff] rounded-full blur-3xl opacity-60"></div>
      <div class="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-52 sm:w-72 md:w-96 h-52 sm:h-72 md:h-96 bg-[#697fe1] rounded-full blur-3xl opacity-20"></div>
      <div class="absolute top-1/3 right-1/4 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-[#546cdd] rounded-full blur-3xl opacity-10"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 md:mb-16">
        <div class="inline-flex items-center gap-1.5 sm:gap-2 bg-[#ebf8ff] text-[#0025cc] px-3 sm:px-6 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium mb-3 sm:mb-4">
          <Info class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span>3 SIMPLE STEPS</span>
        </div>
        <h2 class="text-xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] tracking-tight mb-2 sm:mb-4 heading-font">
          How LodgeNext Works
        </h2>
        <p class="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-[var(--royal-blue)] px-2 leading-snug sm:leading-normal">
          Find your next home in just a few simple steps. Search, explore, and connect with trusted agents anywhere in Nigeria.
        </p>
      </div>

      <!-- Steps Container -->
      <div class="relative">
        <!-- Desktop Connecting Line -->
        <div class="hidden lg:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-[#546cdd] to-transparent"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 relative">
          <!-- Step -->
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="how-step relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <!-- Step Number -->
            <div class="absolute -top-3.5 sm:-top-5 left-4 sm:left-8 bg-white border-2 border-[#0025cc] text-[#0025cc] w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-xl shadow-md">
              {{ String(index + 1).padStart(2, '0') }}
            </div>

            <!-- Icon -->
            <div class="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 md:mb-8 bg-[#ebf8ff] rounded-2xl sm:rounded-3xl flex items-center justify-center text-[#0025cc] group-hover:scale-110 transition-transform duration-300">
              <component
                :is="iconMap[step.icon]"
                class="w-6 h-6 sm:w-8 sm:h-8 text-[#0025cc]"
              />
            </div>

            <!-- Content -->
            <h3 class="text-base sm:text-xl md:text-2xl font-semibold text-[var(--royal-blue)] text-center mb-2 sm:mb-3 md:mb-4 leading-tight">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm md:text-base text-[var(--medium-blue)] text-center leading-relaxed">
              {{ step.description }}
            </p>

            <!-- Subtle Arrow for Mobile -->
            <div
              v-if="index < 2"
              class="md:hidden flex justify-center mt-4 sm:mt-6 text-[#546cdd]"
            >
              <i class="fas fa-arrow-down text-xl sm:text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-10 sm:mt-14 md:mt-20 text-center">
        <button
          @click="goToProperties"
          class="group inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-xs sm:text-base md:text-lg px-5 sm:px-8 md:px-10 py-2.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30 active:scale-95"
        >
          Start Searching Homes
          <i class="fas fa-arrow-right text-xs sm:text-base md:text-lg transition-transform group-hover:translate-x-1"></i>
        </button>
        <p class="text-[10px] sm:text-sm text-[var(--steel-blue)] mt-3 sm:mt-4 px-4">
          Join thousands of happy renters within Ilorin and Ijebu Ode
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Info, Map, Home, PhoneCall } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const iconMap = {
  Map,
  Home,
  PhoneCall
}

const goToProperties = () => {
  router.push('/property')
}

const steps = ref([
  {
    id: 1,
    icon: "Map",
    title: "Search Location",
    description: "Explore verified rental properties in your preferred location across Ilorin and Ijebu Ode, with listings tailored to your housing needs."
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