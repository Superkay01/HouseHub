<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- <Navbar /> -->
    <router-view />
      <GlobalChat />
  </div>
</template>

<script setup>
import GlobalChat from '@/components/GlobalChat.vue'
import Navbar from '@/components/Navbar.vue'
</script>