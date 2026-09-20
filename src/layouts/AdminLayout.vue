<template>
  <div class="flex min-h-screen bg-[var(--light-blue)]">
    <!-- Sidebar -->
    <AdminSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen min-w-0">
      <!-- Navbar -->
      <AdminNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

import AdminNavbar from '@/components/admin/AdminNavbar.vue'

const sidebarRef = ref(null)

const toggleSidebar = () => {
  sidebarRef.value?.toggleSidebar()
}
</script>