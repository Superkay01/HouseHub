<template>
  <section class="bg-[var(--light-blue)] py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          Where We Serve
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Starting Where We Can Make the Biggest Difference
        </h2>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          LODGENEXT is currently focused on
          <strong class="text-[var(--royal-blue)]">Ilorin, Kwara State</strong> and
          <strong class="text-[var(--royal-blue)]">Ijebu Ode, Ogun State</strong>.
          As we grow, our vision is to make this easier for more communities across Nigeria.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div
          v-for="(loc, i) in locations"
          :key="loc.city"
          class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100
                 shadow-sm hover:shadow-md transition-shadow duration-300 reveal"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-12 h-12 rounded-2xl bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]
                     flex items-center justify-center text-2xl"
            >
              📍
            </div>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)]">
                {{ loc.city }}
              </h3>
              <p class="text-sm text-[var(--steel-blue)]">{{ loc.state }}</p>
            </div>
          </div>
          <ul class="space-y-2.5">
            <li
              v-for="point in loc.points"
              :key="point"
              class="flex items-center gap-2 text-sm text-[var(--steel-blue)]"
            >
              <span class="text-[var(--bright-green)] font-bold">•</span>
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const locations = [
  {
    city: 'Ilorin',
    state: 'Kwara State',
    points: ['Property discovery', 'Local agents', 'Home seekers & students'],
  },
  {
    city: 'Ijebu Ode',
    state: 'Ogun State',
    points: ['Property discovery', 'Local agents', 'Home seekers & families'],
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