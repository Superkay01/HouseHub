<template>
  <section class="relative py-20 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-cover bg-center" 
         :style="{ backgroundImage: `url(${backgroundImage})` }">
    </div>
    <div class="absolute inset-0 bg-gradient-to-br from-[#000000]/90 via-[#546cdd]/85 to-royal-blue/90"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          What Our Users Say
        </h2>
        <p class="text-light-blue text-lg max-w-2xl mx-auto">
          Discover how LodgeNext is helping renters find quality homes and property agents connect with the right tenants in Ilorin and Ijebu Ode.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="group royal-blue/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
        >
          <!-- Quote Icon -->
          <div class="text-5xl text-white/30 mb-6">“</div>

          <!-- Rating -->
          <div class="flex text-bright-green mb-6">
            ★★★★★
          </div>

          <!-- Testimonial Text -->
          <p class="text-white text-lg leading-relaxed mb-8 min-h-[140px]">
            "{{ testimonial.text }}"
          </p>

          <!-- User Info -->
          <div class="flex items-center gap-4">
            <img
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/50"
            />
            <div>
              <h4 class="font-semibold text-white">{{ testimonial.name }}</h4>
              <p class="text-light-blue text-sm">{{ testimonial.location }}</p>
              <p class="text-white/70 text-sm font-medium">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div v-for="(item, i) in trustItems" :key="i" 
             class="flex flex-col items-center">
          <div class="text-bright-green text-2xl mb-2">✓</div>
          <p class="text-white font-medium">{{ item }}</p>
        </div>
      </div>

      <!-- Final CTA -->
      <div class="mt-20 text-center">
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your Next Home?
        </h3>
        <p class="text-light-blue mb-8 max-w-md mx-auto">
          Join hundreds of renters and agents already using NestFinder.
        </p>
        <button 
          @click="exploreProperties"
          class="bg-white text-royal-blue hover:bg-light-blue font-semibold px-10 py-4 rounded-2xl text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
          Start Exploring Properties
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const backgroundImage = ref('/testimonia.jpg')

const testimonials = ref([
  {
    text: "I found my apartment in Ilorin within just three days. The process was simple, and I connected with a trusted agent almost immediately.",
    name: "Adewale A.",
    location: "Ilorin, Kwara State",
    role: "Tenant",
    avatar: "/Testimony3.jpg"
  },
  {
    text: "LodgeNext helped me reach serious renters faster than traditional advertising. I've successfully rented out multiple properties through the platform.",
    name: "Adeola O.",
    location: "Ijebu Ode, Ogun State",
    role: "Property Agent",
    avatar: "/Testimony2.jpg"
  },
  {
    text: "The property listings were clear, verified, and easy to compare. It saved me a lot of time searching for the right home.",
    name: "Fatimah K.",
    location: "Ilorin, Kwara State",
    role: "Tenant",
    avatar: "/Testimony1.jpg"
  }
])

const trustItems = ref([
  "Verified Listings",
  "Trusted Agents",
  "Faster Property Discovery",
  "Local Expertise in Ilorin & Ijebu Ode"
])

const exploreProperties = () => {
  // router.push('/properties')
  console.log('Navigating to properties...')
}
</script>