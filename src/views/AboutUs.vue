<template>
  <Navbar/>
  <div class="about-page bg-white">
    <AboutHero />
    <AboutVisionMission />
    <AboutCoreValues />
    <AboutTrust />
    <AboutHowItWorks />
    <AboutLocations />
    <AboutAudience />
    <AboutCTA />

    <div class="bg-[var(--royal-blue)] text-white/80 text-center text-xs sm:text-sm py-4 px-4">
      Focused Locations: Ilorin, Kwara State &amp; Ijebu Ode, Ogun State, Nigeria
    </div>
  </div>
  <Footer/>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import AboutHero from '@/components/about/AboutHero.vue'
import AboutVisionMission from '@/components/about/AboutVisionMission.vue'
import AboutCoreValues from '@/components/about/AboutCoreValues.vue'
import AboutTrust from '@/components/about/AboutTrust.vue'
import AboutHowItWorks from '@/components/about/AboutHowItWorks.vue'
import AboutLocations from '@/components/about/AboutLocations.vue'
import AboutAudience from '@/components/about/AboutAudience.vue'
import AboutCTA from '@/components/about/AboutCTA.vue'
import Footer from '@/components/Footer.vue'
</script>