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
      'bg-[var(--royal-blue)] text-white h-screen flex flex-col transition-all duration-300 z-50 border-r border-white/10',
      isMobile 
        ? 'fixed top-0 left-0 w-72 shadow-2xl transform ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
        : 'w-72 relative'
    ]"
  >
    <!-- Header -->
    <div class="px-6 py-0 border-b border-white/10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img
          src="/Lodgenext_logo__3_-removebg-preview.png"
          alt="Lodgenext logo"
          class="h-20 w-45 object-contain"
        />
      </div>

      <!-- Cancel Button -->
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
    

    <!-- Admin Profile -->
    <div class="px-6 py-6 border-b border-[var(--white)]">
      <div class="flex items-center gap-3">
        <img 
          :src="adminProfile.avatar_url || 'https://ui-avatars.com/api/?name=Admin&background=0025cc&color=fff'" 
          class="w-12 h-12 rounded-2xl object-cover"
        />
        <div class="flex-1">
          <p class="font-semibold">{{ adminProfile.full_name }}</p>
          <div class="flex items-center gap-2 text-xs">
            <span class="bg-[var(--bright-green)] text-black px-2 py-0.5 rounded-full font-medium">Approved</span>
            <span class="text-white/70">{{ adminProfile.city }}, {{ adminProfile.state }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-auto py-3 px-3">
      <nav class="space-y-1">
        <SidebarMenuItem icon="dashboard" label="Dashboard" to="/admin/dashboard" />
        <SidebarMenuItem icon="properties" label="Properties" to="/admin/Properties" />
        <SidebarMenuItem icon="agents" label="Agents" to="/admin/agents" />
        <SidebarMenuItem icon="customers" label="Customers" to="/admin/customers" />
        <SidebarMenuItem icon="requests" label="Property Requests" to="/admin/requests" />
         <SidebarMenuItem icon="requests" label="Customer Inspections" to="/admin/Inspections" />
        <SidebarMenuItem icon="verifications" label="Verifications" to="/admin/verifications" />
        <SidebarMenuItem icon="reports" label="Reports" to="/admin/reports" />
        <SidebarMenuItem icon="notifications" label="Notifications" to="/admin/notifications" />
        <SidebarMenuItem icon="AdminReviews" label="Reviews" to="/admin/AdminReviews" />
        <SidebarMenuItem
  icon="HelpCircle"
  label="Help & Support"
  to="/admin/help-support"
/>

<SidebarMenuItem
  icon="Bell"
  label="Notification Settings"
  to="/admin/notification-settings"
/>
<SidebarMenuItem
  icon="BarChart3"
  label="Analytics"
  to="/admin/analytics"
/>
<SidebarMenuItem
  icon="Support"
  label="Support Tickets"
  to="/admin/support"
/>
        <!-- Head Admin Only -->
        <div v-if="isHeadAdmin">
          <div class="px-5 py-2 text-xs text-white/50 font-medium mt-6">SYSTEM MANAGEMENT</div>
          <SidebarMenuItem icon="admins" label="Administrators" to="/admin/administrators" />
          <SidebarMenuItem icon="state" label="State Management" to="/admin/states" />
          <SidebarMenuItem icon="settings" label="System Settings" to="/admin/settings" />
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-white/10">
      <SidebarMenuItem icon="profile" label="Profile" to="/admin/profile" />
      <button 
        @click="logout"
        class="w-full mt-4 flex items-center gap-3 px-5 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
      >
        <LogOut class="w-5 h-5" />
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { 
  LayoutDashboard, Building2, Users, UserRound, FileText, 
  ShieldCheck, BarChart3, Bell, Settings, UserCog, MapPinned, 
  LogOut 
} from 'lucide-vue-next'

import SidebarMenuItem from './SidebarMenuItem.vue'

const router = useRouter()

const isOpen = ref(false)
const isMobile = ref(window.innerWidth < 1024)

const adminProfile = ref({
  full_name: 'Loading...',
  city: '',
  state: '',
  role: 'state_admin'
})

const isHeadAdmin = computed(() => adminProfile.value.role === 'head_admin')

const fetchAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (data) adminProfile.value = data
}

const toggleSidebar = () => isOpen.value = !isOpen.value
const closeSidebar = () => { if (isMobile.value) isOpen.value = false }

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

onMounted(() => {
  fetchAdminProfile()
  window.addEventListener('resize', () => isMobile.value = window.innerWidth < 1024)
})

defineExpose({ toggleSidebar })
</script>