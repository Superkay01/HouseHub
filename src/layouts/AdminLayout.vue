<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <!-- Sidebar -->
    <AdminSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <AdminNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
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