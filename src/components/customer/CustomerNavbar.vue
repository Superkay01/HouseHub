<template>
  <nav class="h-16 bg-white border-b flex items-center px-6 md:px-8 justify-between">
    
    <!-- Left Side: Hamburger + Search -->
    <div class="flex items-center gap-4">
      <!-- Hamburger Button -->
      <button 
        @click="toggleSidebar"
        class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu class="w-7 h-7 text-gray-700" />
      </button>

      <!-- Search Bar -->
      <div class="relative hidden sm:block w-80 lg:w-96">
        <input 
          type="text"
          placeholder="Search homes in Ilorin & Ijebu Ode..."
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
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
      </button>

      <!-- Messages -->
      <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <MessageCircle class="w-6 h-6 text-gray-600" />
      </button>

      <!-- User Profile with Dropdown -->
      <div class="relative">
        <div 
          @click="toggleDropdown"
          class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all"
        >
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
            <!-- Online Badge -->
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--bright-green)] border-2 border-white rounded-full"></div>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div 
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
        >
          <div class="px-4 py-3 border-b">
            <div class="flex items-center gap-3">
              <img 
                :src="userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.full_name || 'Customer')}&background=0025cc&color=fff`"
                class="w-11 h-11 rounded-2xl"
              />
              <div>
                <p class="font-semibold">{{ userProfile.full_name }}</p>
                <p class="text-xs text-medium-gray">Renter</p>
              </div>
            </div>
          </div>

          <div class="py-2">
            <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">👤 Profile Settings</a>
            <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">❤️ Saved Properties</a>
            <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">📋 My Requests</a>
            <a href="#" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">❓ Help & Support</a>
          </div>

          <div class="border-t pt-2">
            <button 
              @click="logout"
              class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useRouter } from 'vue-router'
import { Menu, Bell, MessageCircle, Search } from 'lucide-vue-next'

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

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>