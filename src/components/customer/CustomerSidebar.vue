<template>
  <!-- Mobile Overlay -->
  <div 
    v-if="isOpen && isMobile"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <div 
    :class="[
      'bg-[var(--royal-blue)] text-white h-screen flex flex-col transition-all duration-300 z-50',
      isMobile 
        ? 'fixed top-0 left-0 w-62 shadow-2xl transform ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
        : 'w-62 relative'
    ]"
  >
    <!-- Logo -->
    <div class="px-8 py-0 border-b flex items-center justify-between border-[var(--light-blue)]">
      <div class="flex items-center gap-3">
        <img
          src="/Lodgenext_logo__3_-removebg-preview.png"
          alt="Lodgenext logo"
          class="h-20 w-45 object-contain"
        />
      </div>
      <!-- Cancel Button (Visible only on Mobile) -->
      <button 
        v-if="isMobile"
        @click="closeSidebar"
        class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6h12v12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-auto py-3 px-3">
      <nav class="space-y-1">
        <SidebarLink 
          icon="home" 
          label="Dashboard" 
          :to="'/customer/dashboard'" 
          :active="isActive('/customer/dashboard')"
          @click="closeSidebar"
        />
        <SidebarLink 
          icon="search" 
          label="Browse Properties" 
          :to="'/customer/browse'"
          @click="closeSidebar"
        />
        <SidebarLink 
          icon="heart" 
          label="Saved Properties" 
          :to="'/customer/saved'"
          @click="closeSidebar"
        />
        <SidebarLink 
          icon="clipboard" 
          label="My Requests" 
          :to="'/customer/requests'"
          @click="closeSidebar"
        />
        <SidebarLink 
          icon="calendar" 
          label="Inspections" 
          :to="'/customer/inspections'"
          @click="closeSidebar"
        />
        <SidebarLink 
          icon="bell" 
          label="Notifications" 
          :to="'/customer/notifications'"
          @click="closeSidebar"
        />
      </nav>
    </div>

    <!-- Bottom Section -->
    <div class="p-4 border-t border-white/10">
      <SidebarLink 
        icon="user" 
        label="Profile" 
        :to="'/customer/profile'"
        @click="closeSidebar"
      />
      <SidebarLink 
        icon="help" 
        label="Help & Support" 
        :to="'/customer/help'"
        @click="closeSidebar"
      />
      
      <button 
        @click="logout"
        class="w-full mt-6 flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4V7V4" />
        </svg>
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarLink from './SidebarLink.vue'

const route = useRoute()
const router = useRouter()

const isOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}



const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

const isActive = (path) => {
  return route.path === path
}

const logout = () => {
  alert("Logged out successfully")
  router.push('/login')
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) isOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({ toggleSidebar })
</script>






