<template>
  <section class="bg-white py-14 sm:py-16 lg:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Intro -->
      <div class="max-w-3xl mx-auto text-center mb-10 sm:mb-14 reveal">
        <p class="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--medium-blue)] mb-3">
          Who We Are
        </p>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight mb-4">
          Built to Make Home-Finding Clearer
        </h2>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
          LODGENEXT exists to help people discover properties and connect with agents in a more
          organised, transparent way — starting in Ilorin and Ijebu Ode.
        </p>
      </div>

      <!-- Vision + Mission cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        <!-- Vision -->
        <div
          class="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10
                 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--medium-blue)] text-white
                 shadow-lg reveal"
        >
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide mb-5">
              <span>✨</span> OUR VISION
            </div>
            <h3 class="text-xl sm:text-2xl md:text-3xl font-bold leading-snug mb-4">
              Make finding a home easier, more transparent and more connected.
            </h3>
            <p class="text-sm sm:text-base text-white/85 leading-relaxed">
              We want a future where someone moving to a new city can open LODGENEXT, explore
              available properties, connect with agents, and make better-informed decisions —
              without depending only on word-of-mouth.
            </p>
          </div>
        </div>

        <!-- Mission -->
        <div
          class="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10
                 bg-[var(--light-blue)] border border-gray-100 shadow-sm reveal"
          style="transition-delay: 100ms"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--royal-blue)]/10 text-[var(--royal-blue)] text-xs font-semibold tracking-wide mb-5">
            <span>🎯</span> OUR MISSION
          </div>
          <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--royal-blue)] leading-snug mb-4">
            Help people find homes and connect with agents — then grow across Nigeria.
          </h3>
          <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed mb-5">
            We are focused on making property discovery simpler for customers and giving agents a
            structured way to list properties and engage serious home seekers.
          </p>
          <ul class="space-y-2.5 text-sm text-[var(--steel-blue)]">
            <li class="flex items-start gap-2">
              <span class="text-[var(--bright-green)] mt-0.5">✓</span>
              Start deep in <strong class="text-[var(--royal-blue)]">Ilorin</strong> &amp;
              <strong class="text-[var(--royal-blue)]">Ijebu Ode</strong>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[var(--bright-green)] mt-0.5">✓</span>
              Improve transparency through clear listings and inspection flows
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[var(--bright-green)] mt-0.5">✓</span>
              Expand responsibly to more communities across Nigeria
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

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