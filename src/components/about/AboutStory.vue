<template>
  <section class="bg-white py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section header (similar hierarchy to reference) -->
      <div class="max-w-3xl mb-8 sm:mb-10 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          Our Story
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Why We Created LODGENEXT
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-[var(--steel-blue)] leading-relaxed">
          Finding a house can be stressful — especially when you are moving to a new city where you
          don’t know anyone. LODGENEXT was built to make that journey clearer, safer and more organised.
        </p>
      </div>

      <!-- Image row (reference-style 3 cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
        <div
          v-for="(img, i) in storyImages"
          :key="i"
          class="rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-[4/3] reveal"
          :style="{ transitionDelay: `${i * 90}ms` }"
        >
          <img
            :src="img"
            alt="Property lifestyle"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Story body -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
        <div class="space-y-4 text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed reveal">
          <p>
            Imagine gaining admission into a school in another state and arriving in a completely
            unfamiliar environment. You need accommodation, but you don’t know where to start,
            who to trust, or which agent is genuine.
          </p>
          <p>
            At the same time, many people looking for accommodation face
            <span class="font-semibold text-[var(--royal-blue)]">high and sometimes inconvenient agent charges</span>
            and limited property information before they even schedule an inspection.
          </p>
          <p>
            We saw this gap and decided to build a platform that makes the process easier.
            <span class="font-semibold text-[var(--royal-blue)]">LODGENEXT</span> connects people
            looking for homes with property agents — helping customers discover available properties
            and connect with agents in a more organised and transparent way.
          </p>
        </div>

        <!-- Timeline cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(step, i) in timeline"
            :key="step.title"
            class="rounded-2xl border border-gray-100 bg-[var(--light-blue)]/60 p-5 hover:shadow-md hover:border-[var(--royal-blue)]/15 transition-all duration-300 reveal"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div
              class="w-9 h-9 rounded-xl bg-[var(--royal-blue)] text-white text-sm font-bold flex items-center justify-center mb-3"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </div>
            <h3 class="font-semibold text-[var(--royal-blue)] text-base mb-1.5">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
              {{ step.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Trust strip (no fake numbers — value points instead) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="(item, i) in valueStrip"
          :key="item.label"
          class="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-5 text-center reveal"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <div class="text-2xl mb-2">{{ item.icon }}</div>
          <p class="text-sm font-semibold text-[var(--royal-blue)]">{{ item.label }}</p>
          <p class="text-xs text-[var(--steel-blue)] mt-1">{{ item.sub }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const storyImages = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
  'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
]

const timeline = [
  {
    title: 'The Problem',
    text: 'House hunting in a new city is stressful, unclear and often expensive.',
  },
  {
    title: 'The Idea',
    text: 'Build a platform that organises property discovery and agent connections.',
  },
  {
    title: 'The Platform',
    text: 'LODGENEXT links customers with listed properties and local agents.',
  },
  {
    title: 'The Vision',
    text: 'Make finding a home easier, more transparent and more connected — then expand across Nigeria.',
  },
]

const valueStrip = [
  { icon: '🏠', label: 'Property Discovery', sub: 'Browse listed homes' },
  { icon: '🛡️', label: 'Agent Verification', sub: 'Trust-focused process' },
  { icon: '📋', label: 'Inspection Flow', sub: 'Request & track visits' },
  { icon: '📍', label: 'Local Focus', sub: 'Ilorin & Ijebu Ode' },
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