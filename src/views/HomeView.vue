<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Browse by State -->
    <BrowseByState />
    <FeaturedProperties/>
    <HowItWorks/>
    <WhyChooseUs/>
    <BecomeAgentCTA/>
    <Testimonials/>
    <FAQSection/>
    <Footer/>

    <!-- Other sections... -->
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import BrowseByState from '@/components/BrowseByState.vue'
import FeaturedProperties from '@/components/FeaturedProperties.vue';
import HowItWorks from '@/components/HowItWorks.vue';
import WhyChooseUs from '@/components/WhyChooseUs.vue';
import BecomeAgentCTA from '@/components/BecomeAgentCTA.vue';
import Testimonials from '@/components/Testimonials.vue';
import FAQSection from '@/components/FAQSection.vue';
import Footer from '@/components/Footer.vue';

</script>