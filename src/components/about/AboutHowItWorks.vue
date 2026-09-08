<template>
  <section class="bg-white py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          How It Works
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Finding a Home in Four Simple Steps
        </h2>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          A clearer path from discovery to decision — designed for customers and agents.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative text-center rounded-2xl sm:rounded-3xl border border-gray-100
                 bg-[var(--light-blue)]/40 p-6 hover:shadow-md hover:bg-white
                 transition-all duration-300 reveal"
          :style="{ transitionDelay: `${i * 90}ms` }"
        >
          <div
            class="w-14 h-14 mx-auto rounded-full bg-[var(--royal-blue)] text-white
                   flex items-center justify-center font-bold text-lg mb-4
                   shadow-lg shadow-[var(--royal-blue)]/20"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </div>
          <h3 class="font-bold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
            {{ step.title }}
          </h3>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
            {{ step.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const steps = [
  {
    title: 'Browse Properties',
    text: 'Explore available properties based on your preferred location and requirements.',
  },
  {
    title: 'Choose a Property',
    text: 'Review photos, videos, amenities, pricing and other available details.',
  },
  {
    title: 'Connect & Inspect',
    text: 'Connect with the relevant agent and arrange an inspection where applicable.',
  },
  {
    title: 'Decide with Clarity',
    text: 'Use the property and inspection information to make a more informed decision.',
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