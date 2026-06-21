<template>
  <section class="relative py-20 bg-[var(--light-blue)]">
    <div class="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold text-[var(--royal-blue)] tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-[var(--medium-blue)] text-lg max-w-2xl mx-auto">
          Find answers to common questions about renting properties, connecting with agents, and using LodgeNext.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-[var(--periwinkle)] backdrop-blur-2xl border border-[var(--royal-blue)]/20 rounded-3xl overflow-hidden hover:bg-[var(--hover-blue)] transition-all"
        >
          <!-- Question -->
          <button
            @click="toggleFAQ(index)"
            class="w-full px-8 py-6 text-left flex items-center justify-between group"
          >
            <div class="flex items-start gap-4">
              <span class="text-2xl text-white mt-0.5 transition-transform" 
                    :class="{ 'rotate-45': openIndex === index }">✦</span>
              <span class="text-lg font-medium text-white leading-relaxed pr-8 text-left">
                {{ faq.question }}
              </span>
            </div>
            
            <span
              class="text-3xl font-light text-white transition-transform duration-300 flex-shrink-0"
              :class="{ 'rotate-45': openIndex === index }"
            >
              +
            </span>
          </button>

          <!-- Answer -->
          <div
            v-if="openIndex === index"
            class="px-8 pb-8 text-[var(--light-blue)] leading-relaxed border-t border-white"
          >
            <p class="pt-6">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 bg-[var(--periwinkle)] backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-12 text-center">
        <h3 class="text-3xl font-bold text-white mb-3">
          Still Have Questions?
        </h3>
        <p class="text-[var(--light-blue)] mb-8 max-w-md mx-auto">
          Our team is here to help you find the right property in Ilorin and Ijebu Ode.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            class="bg-white text-[var(--royal-blue)] font-semibold px-8 py-4 rounded-2xl hover:bg-[var(--light-blue)] transition-all hover:scale-105">
            Contact Support
          </button>
          <button 
            class="border border-white/70 text-white font-medium px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: "Is NestFinder free to use?",
    answer: "Yes. Browsing properties, searching locations, and connecting with agents are completely free for renters."
  },
  {
    question: "How do I become an agent?",
    answer: "Simply create an agent account, complete your profile verification, and start listing properties on LodgeNext."
  },
  {
    question: "How do I report a fake listing?",
    answer: "If you encounter a suspicious or inaccurate listing, use the 'Report Listing' feature on the property page. Our team will review and take appropriate action."
  },
  {
    question: "Can I search by LGA or neighborhood?",
    answer: "Yes. You can search properties by city, local government area (LGA), neighborhood, or popular districts within Ilorin and Ijebu Ode."
  },
  {
    question: "Are all properties verified?",
    answer: "We strive to verify all listings and agents before publication to provide a safer and more reliable rental experience."
  },
  {
    question: "How do I contact a property agent?",
    answer: "You can contact agents directly through the platform using messaging, phone calls, or inspection booking requests."
  }
])

const openIndex = ref(null)

const toggleFAQ = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>