<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <!-- Sidebar -->
    <CustomerSidebar ref="sidebarRef" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <CustomerNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useCustomerNotifications } from '@/composables/useCustomerNotifications'
import CustomerSidebar from '@/components/customer/CustomerSidebar.vue'
import CustomerNavbar from '@/components/customer/CustomerNavbar.vue'

const sidebarRef = ref(null)

const toggleSidebar = () => {
  sidebarRef.value?.toggleSidebar()
}

const {
  unreadCount,
  startNotificationListener,
  stopNotificationListener,
} = useCustomerNotifications()

onMounted(() => {
  startNotificationListener()
})

onBeforeUnmount(() => {
  stopNotificationListener()
})
</script>