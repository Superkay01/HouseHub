<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between">
    
    <!-- Left Side: Hamburger + Search -->
    <div class="flex items-center gap-4">
      <!-- Hamburger Button -->
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Search Bar -->
      <div class="relative hidden sm:block w-80 lg:w-96">
        <input 
          type="text"
          placeholder="Search homes in Ilorin & Ijebu Ode..."
          class="w-full bg-gray-100 border border-transparent focus:border-[var(--royal-blue)] rounded-2xl py-3 pl-12 text-sm focus:outline-none transition-all"
        />
        <span class="absolute left-4 top-3.5 text-gray-400">🔍</span>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-6">
      
      <!-- Notifications -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9-5.197V8.5m.002 3.5L12 14" />
        </svg>
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
      </button>

      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 012-2z" />
        </svg>
      </button>

      <!-- User Profile -->
      <div class="flex items-center gap-3 cursor-pointer" @click="toggleDropdown">
        <div class="text-right hidden sm:block">
          <p class="font-semibold text-dark-gray text-sm">{{ userProfile.full_name || 'Customer' }}</p>
          <p class="text-xs text-medium-gray">Renter</p>
        </div>
        
        <div class="relative">
          <img 
            :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Customer')}&background=0025cc&color=fff`"
            alt="Profile"
            class="w-9 h-9 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useRouter } from 'vue-router'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()

const userProfile = ref({
  full_name: '',
  avatar_url: ''
})

const showDropdown = ref(false)

const fetchUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) userProfile.value = data
    }
  } catch (error) {
    console.error(error)
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

onMounted(() => {
  fetchUserProfile()
})
</script>