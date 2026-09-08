<template>
  <section
    class="relative min-h-[88vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center hero-bg"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />

    <!-- Premium overlay (multi-tone, not flat) -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/90 via-[var(--medium-blue)]/75 to-[var(--royal-blue)]/85"
    />
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_50%)]"
    />

    <!-- Soft decorative shapes -->
    <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[var(--periwinkle)]/20 blur-3xl pointer-events-none" />

    <!-- Content -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center text-white">
      <!-- Logo -->
      <div class="flex justify-center mb-6 sm:mb-8 animate-hero-0">
        <img
          src="/Lodgenext_logo__3_-removebg-preview.png"
          alt="LODGENEXT"
          class="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-lg"
        />
      </div>

      <p
        class="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80 mb-4 sm:mb-5 animate-hero-1"
      >
        <span class="w-8 h-px bg-white/50" />
        About LODGENEXT
        <span class="w-8 h-px bg-white/50" />
      </p>

      <h1
        class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.15] mb-5 sm:mb-6 max-w-4xl mx-auto animate-hero-2"
      >
        Finding a Home Shouldn’t Be This Difficult.
      </h1>

      <p
        class="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-hero-3"
      >
        LODGENEXT was created to make finding a home simpler, safer and more transparent for people
        searching for properties in
        <span class="font-semibold text-white">Ilorin</span> and
        <span class="font-semibold text-white">Ijebu Ode</span>.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-hero-4">
        <router-link
          to="/property"
          class="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-2xl
                 bg-white text-[var(--royal-blue)] font-semibold text-sm sm:text-base
                 hover:bg-[var(--light-blue)] hover:scale-[1.02] active:scale-[0.99]
                 transition-all duration-300 shadow-lg shadow-black/10"
        >
          Explore Properties
        </router-link>

        <router-link
          to="/signup"
          class="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 rounded-2xl
                 border-2 border-white/90 text-white font-semibold text-sm sm:text-base
                 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.99]
                 transition-all duration-300"
        >
          Find a Trusted Agent
        </router-link>
      </div>

      <!-- Focus chips -->
      <div
        class="mt-10 sm:mt-12 flex flex-wrap justify-center gap-2 sm:gap-3 animate-hero-5"
      >
        <span
          class="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-white/90 backdrop-blur-sm"
        >
          📍 Ilorin, Kwara
        </span>
        <span
          class="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-white/90 backdrop-blur-sm"
        >
          📍 Ijebu Ode, Ogun
        </span>
      </div>
    </div>

    <!-- Bottom fade into next section -->
    <div
      class="absolute bottom-0 left-0 right-0 h-20 sm:h-28 bg-gradient-to-t from-[var(--light-blue)] to-transparent pointer-events-none"
    />
  </section>
</template>

<script setup lang="ts">
const bgImage =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80'
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}

.hero-bg {
  animation: slowZoom 20s ease-out forwards;
}

.animate-hero-0 {
  animation: fadeUp 0.7s ease-out both;
}
.animate-hero-1 {
  animation: fadeUp 0.7s ease-out 0.08s both;
}
.animate-hero-2 {
  animation: fadeUp 0.75s ease-out 0.16s both;
}
.animate-hero-3 {
  animation: fadeUp 0.75s ease-out 0.28s both;
}
.animate-hero-4 {
  animation: fadeUp 0.75s ease-out 0.4s both;
}
.animate-hero-5 {
  animation: fadeUp 0.75s ease-out 0.52s both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg,
  .animate-hero-0,
  .animate-hero-1,
  .animate-hero-2,
  .animate-hero-3,
  .animate-hero-4,
  .animate-hero-5 {
    animation: none !important;
  }
}
</style>