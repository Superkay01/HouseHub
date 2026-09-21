<template>
  <div class="flex h-[100dvh] max-h-[100dvh] bg-[var(--light-blue)] overflow-hidden">
    <!-- Sidebar -->
    <AgentSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
      <!-- Navbar: never shrink / always visible -->
      <div class="flex-shrink-0 sticky top-0 z-50">
        <AgentNavbar @toggle-sidebar="toggleSidebar" />
      </div>

      <!-- Page Content: only this scrolls -->
      <div class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AgentSidebar from '@/components/agent/AgentSidebar.vue'
import AgentNavbar from '@/components/agent/AgentNavbar.vue'

const sidebarRef = ref(null)

const toggleSidebar = () => {
  sidebarRef.value?.toggleSidebar()
}
</script>