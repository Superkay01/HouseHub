<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between">
    
    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <!-- Hamburger -->
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu class="w-7 h-7 text-gray-700" />
      </button>

      <!-- Search -->
      <div class="relative hidden md:block w-96">
        <input 
          type="text"
          placeholder="Search properties, agents, or customers..."
          class="w-full bg-gray-100 border border-transparent focus:border-[var(--royal-blue)] rounded-2xl py-3 pl-12 text-sm focus:outline-none transition-all"
        />
        <Search class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-6">
      
      <!-- Notifications -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <Bell class="w-6 h-6 text-gray-600" />
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">8</span>
      </button>

      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <MessageCircle class="w-6 h-6 text-gray-600" />
      </button>

      <!-- Admin Profile -->
      <div class="flex items-center gap-3 cursor-pointer" @click="toggleDropdown">
        <div class="text-right hidden sm:block">
          <p class="font-semibold text-dark-gray text-sm">{{ adminProfile.full_name }}</p>
          <p class="text-xs text-medium-gray">{{ adminProfile.role === 'head_admin' ? 'Head Admin' : 'State Admin' }}</p>
        </div>
        
        <div class="relative">
          <img 
            :src="adminProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile.full_name || 'Admin')}&background=0025cc&color=fff`"
            alt="Profile"
            class="w-9 h-9 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--bright-green)] border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Menu, Bell, MessageCircle, Search } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])

const adminProfile = ref({
  full_name: 'Loading...',
  role: '',
  avatar_url: ''
})

const showDropdown = ref(false)

const fetchAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('admin_profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  if (data) adminProfile.value = data
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

onMounted(() => {
  fetchAdminProfile()
})
</script>