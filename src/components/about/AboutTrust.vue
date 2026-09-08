<template>
  <section class="bg-white py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="max-w-3xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          Trust &amp; Safety
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Building Processes That Support Better Decisions
        </h2>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          We are building processes that help customers make more informed decisions when searching
          for properties and connecting with agents.
        </p>
      </div>

      <!-- Feature grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <div
          v-for="(item, i) in trustFeatures"
          :key="item.title"
          class="group rounded-2xl sm:rounded-3xl border border-gray-100 bg-[var(--light-blue)]/50
                 p-5 sm:p-6 hover:bg-white hover:shadow-md hover:border-[var(--royal-blue)]/15
                 transition-all duration-300 reveal"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <div
            class="w-11 h-11 rounded-2xl bg-[var(--bright-green)]/15 text-[var(--bright-green)]
                   flex items-center justify-center text-lg font-bold mb-4
                   group-hover:scale-105 transition-transform"
          >
            ✓
          </div>
          <h3 class="text-base sm:text-lg font-bold text-[var(--royal-blue)] mb-2">
            {{ item.title }}
          </h3>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
            {{ item.text }}
          </p>
        </div>
      </div>

      <!-- Disclaimer -->
      <div
        class="rounded-2xl border border-[var(--royal-blue)]/10 bg-[var(--royal-blue)]/5
               px-5 py-4 sm:px-6 sm:py-5 text-center reveal"
      >
        <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed max-w-3xl mx-auto">
          LODGENEXT encourages customers to review property information carefully and use the
          available inspection and verification processes before making decisions. These features
          support informed choices — they are
          <strong class="text-[var(--royal-blue)]">not a guarantee</strong>
          that a property or agent is completely risk-free.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const trustFeatures = [
  {
    title: 'Agent Verification',
    text: 'Agents complete a verification process so the platform can identify verified agents.',
  },
  {
    title: 'Property Review',
    text: 'Property listings pass through an administrative review process before approval.',
  },
  {
    title: 'Property Information',
    text: 'Listings include structured details such as type, location, address, price, bedrooms, bathrooms, toilets, amenities, condition, photos and video.',
  },
  {
    title: 'Inspection Process',
    text: 'Customers request inspections and track key details including status, date and time, agent, property, outcome, condition, feedback, reports and media.',
  },
  {
    title: 'Inspection Acknowledgement',
    text: 'Customers acknowledge that they reviewed the property and understood the relevant inspection terms and observations.',
  },
  {
    title: 'Customer Reports',
    text: 'Customers submit reports and feedback related to their inspection experience.',
  },
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )

  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>