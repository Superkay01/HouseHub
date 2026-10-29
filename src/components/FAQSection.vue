<template>
  <section class="relative py-10 sm:py-16 md:py-20 bg-[var(--light-blue)]">
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 md:mb-14">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--royal-blue)] tracking-tight mb-2 sm:mb-4 leading-tight">
          Frequently Asked Questions
        </h2>
        <p class="text-xs sm:text-sm md:text-lg text-[var(--medium-blue)] max-w-2xl mx-auto px-2 leading-snug sm:leading-normal">
          Find answers to common questions about renting properties, connecting with agents, and using LodgeNext.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-2.5 sm:space-y-3 md:space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-[var(--periwinkle)] backdrop-blur-2xl border border-[var(--royal-blue)]/20 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-[var(--hover-blue)] transition-all"
        >
          <!-- Question -->
          <button
            @click="toggleFAQ(index)"
            class="w-full px-3 sm:px-6 md:px-8 py-3.5 sm:py-5 md:py-6 text-left flex items-center justify-between gap-2 group"
          >
            <div class="flex items-start gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
              <span
                class="text-base sm:text-xl md:text-2xl text-white mt-0.5 transition-transform shrink-0"
                :class="{ 'rotate-45': openIndex === index }"
              >✦</span>
              <span class="text-xs sm:text-base md:text-lg font-medium text-white leading-snug sm:leading-relaxed pr-2 sm:pr-4 md:pr-8 text-left">
                {{ faq.question }}
              </span>
            </div>

            <span
              class="text-xl sm:text-2xl md:text-3xl font-light text-white transition-transform duration-300 flex-shrink-0"
              :class="{ 'rotate-45': openIndex === index }"
            >
              +
            </span>
          </button>

          <!-- Answer -->
          <div
            v-if="openIndex === index"
            class="px-3 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-[var(--light-blue)] text-xs sm:text-sm md:text-base leading-relaxed border-t border-white"
          >
            <p class="pt-3 sm:pt-4 md:pt-6">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-10 sm:mt-14 md:mt-16 bg-[var(--periwinkle)] backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 text-center">
        <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 sm:mb-2 md:mb-3 leading-tight">
          Still Have Questions?
        </h3>
        <p class="text-xs sm:text-sm md:text-base text-[var(--light-blue)] mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto px-1">
          Our team is here to help you find the right property in Ilorin and Ijebu Ode.
        </p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
          <button
            @click="goToSupport"
            class="bg-white text-[var(--royal-blue)] font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base hover:bg-[var(--light-blue)] transition-all hover:scale-105"
          >
            Contact Support
          </button>
          <button
            @click="goToProperties"
            class="border border-white/70 text-white font-medium px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base hover:bg-white/10 transition-all"
          >
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const faqs = ref([
  {
    question: "Is Lodgenext free to use?",
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

const goToSupport = () => {
  router.push('/support')
}

const goToProperties = () => {
  router.push('/property')
}
</script>