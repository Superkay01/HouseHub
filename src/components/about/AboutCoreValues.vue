<template>
  <section class="bg-[var(--light-blue)] py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="max-w-2xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          What Guides Us
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Our Core Values
        </h2>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          These principles shape how we build LODGENEXT and how we serve customers and agents.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          v-for="(value, i) in values"
          :key="value.title"
          class="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-gray-100
                 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[var(--royal-blue)]/20
                 transition-all duration-300 reveal"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5
                   bg-[var(--royal-blue)]/8 group-hover:bg-[var(--royal-blue)]/12 transition-colors"
          >
            {{ value.icon }}
          </div>
          <h3 class="text-lg font-bold text-[var(--royal-blue)] mb-2">
            {{ value.title }}
          </h3>
          <p class="text-sm text-[var(--steel-blue)] leading-relaxed">
            {{ value.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const values = [
  {
    icon: '🔍',
    title: 'Transparency',
    text: 'Clear property information — photos, details, location and pricing — so people can decide with confidence.',
  },
  {
    icon: '🛡️',
    title: 'Trust',
    text: 'Verification and inspection processes that help customers and agents interact with greater accountability.',
  },
  {
    icon: '🤝',
    title: 'Connection',
    text: 'A better link between home seekers and property agents, without unnecessary confusion.',
  },
  {
    icon: '🌱',
    title: 'Growth',
    text: 'Start strong in Ilorin and Ijebu Ode, then expand carefully to more communities across Nigeria.',
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