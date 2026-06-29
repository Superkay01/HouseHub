<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <!-- Sidebar -->
    <AgentSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <AgentNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
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