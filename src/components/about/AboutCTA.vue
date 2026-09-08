<template>
  <section class="relative py-16 sm:py-20 lg:py-24 overflow-hidden text-white">
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />

    <!-- Overlay for readability -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/90 via-[var(--medium-blue)]/85 to-[var(--hover-blue)]/90"
    />

    <!-- Soft decorative blurs -->
    <div class="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
    <div class="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 reveal">
        Your Next Home Could Be Closer Than You Think
      </h2>
      <p class="text-sm sm:text-base text-white/85 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto reveal">
        Whether you’re looking for a home or you’re an agent with a property to list,
        LODGENEXT helps make the connection easier.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center reveal">
        <router-link
          to="/property"
          class="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-2xl
                 bg-white text-[var(--royal-blue)] font-semibold text-sm sm:text-base
                 hover:bg-[var(--light-blue)] transition-colors"
        >
          Find a Property
        </router-link>
        <router-link
          to="/signup"
          class="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-2xl
                 border-2 border-white text-white font-semibold text-sm sm:text-base
                 hover:bg-white/10 transition-colors"
        >
          Become an Agent
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const bgImage =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'

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