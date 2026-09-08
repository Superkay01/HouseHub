<template>
  <section class="bg-white py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          Who We Serve
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Built for Home Seekers and Agents
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          v-for="(item, i) in audiences"
          :key="item.title"
          class="rounded-2xl sm:rounded-3xl bg-[var(--light-blue)]/50 border border-gray-100
                 p-6 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 reveal"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="text-3xl sm:text-4xl mb-4">{{ item.icon }}</div>
          <h3 class="font-bold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
            {{ item.title }}
          </h3>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
            {{ item.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const audiences = [
  {
    icon: '🎓',
    title: 'Students',
    text: 'Helping students relocating to another city find accommodation more easily.',
  },
  {
    icon: '💼',
    title: 'Workers & Professionals',
    text: 'Helping people moving for work discover properties in unfamiliar locations.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Families',
    text: 'Helping families explore suitable homes with clearer information.',
  },
  {
    icon: '🔑',
    title: 'Property Agents',
    text: 'Giving agents a structured platform to list properties and connect with customers.',
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