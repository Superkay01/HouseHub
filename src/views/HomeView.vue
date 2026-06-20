<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Browse by State -->
    <BrowseByState />
    <FeaturedProperties/>
    <HowItWorks/>

    <!-- Other sections... -->
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import BrowseByState from '@/components/BrowseByState.vue'
import FeaturedProperties from '@/components/FeaturedProperties.vue';
import HowItWorks from '@/components/HowItWorks.vue';

</script>