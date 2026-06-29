<template>
  <div class="flex h-screen bg-[var(--light-blue)] overflow-hidden">
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-auto p-6 md:p-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Welcome Header + Verification Badge -->
          <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="text-4xl font-bold text-[var(--royal-blue)]">
                Welcome back, {{ userProfile.full_name || 'Agent' }} 👋
              </h1>
              <p class="text-[var(--royal-blue)] mt-1 text-lg">
                Here's what's happening with your properties today
              </p>
            </div>

            <!-- Verification Badge -->
            <div v-if="verificationStatus" class="flex-shrink-0">
              <button 
                v-if="verificationStatus !== 'approved'"
                @click="goToVerification"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold hover:scale-105 transition-all active:scale-95"
                :class="[
                  verificationStatus === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                ]"
              >
                <span v-if="verificationStatus === 'pending'" class="text-lg">⏳</span>
                <span v-else class="text-lg">🔒</span>
                {{
                  verificationStatus === 'pending' ? 'Verification Pending' : 'Complete Verification'
                }}
              </button>

              <!-- Verified Badge (Non-clickable) -->
              <div 
                v-else
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold bg-green-100 text-green-700 border border-green-200"
              >
                <span class="text-lg">✅</span>
                Verified Agent
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-500 text-sm">Total Properties</p>
                  <h3 class="text-3xl font-bold mt-2">{{ stats.totalProperties }}</h3>
                  <p class="text-sm text-gray-400 mt-2">+3 this month</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-[var(--light-blue)] flex items-center justify-center">
                  <House class="w-7 h-7 text-[var(--royal-blue)]" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-500 text-sm">Active Listings</p>
                  <h3 class="text-3xl font-bold mt-2">{{ stats.activeListings }}</h3>
                  <p class="text-sm text-gray-400 mt-2">+2</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <MapPin class="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-500 text-sm">New Requests</p>
                  <h3 class="text-3xl font-bold mt-2">{{ stats.newRequests }}</h3>
                  <p class="text-sm text-gray-400 mt-2">+12</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <User class="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-gray-500 text-sm">Scheduled Inspections</p>
                  <h3 class="text-3xl font-bold mt-2">{{ stats.inspections }}</h3>
                  <p class="text-sm text-gray-400 mt-2">4 today</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Calendar class="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Rest of your dashboard content remains the same -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-dark-gray">Property Performance</h2>
                <div class="flex gap-2 text-sm">
                  <button class="px-4 py-1.5 rounded-xl bg-[var(--royal-blue)] text-white">This Month</button>
                  <button class="px-4 py-1.5 rounded-xl hover:bg-gray-100">This Year</button>
                </div>
              </div>
              <AnalyticsChart />
            </div>

            <div class="bg-white rounded-3xl p-6 shadow-sm">
              <h2 class="text-xl font-semibold mb-6">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-4">
                <button class="p-6 rounded-2xl border border-dashed border-[var(--royal-blue)] hover:bg-[var(--light-blue)] transition-all text-center">
                  <Plus class="w-10 h-10 mx-auto mb-3 text-[var(--royal-blue)]" />
                  <div class="font-medium text-[var(--royal-blue)]">Add Property</div>
                </button>
                <button class="p-6 rounded-2xl border border-dashed border-[var(--royal-blue)] hover:bg-[var(--light-blue)] transition-all text-center">
                  <Camera class="w-10 h-10 mx-auto mb-3 text-[var(--royal-blue)]" />
                  <div class="font-medium text-[var(--royal-blue)]">Upload Photos</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useRouter } from 'vue-router'   // ← Added
import {
  House,
  MapPin,
  User,
  Calendar,
  Camera,
  Plus
} from 'lucide-vue-next'

const router = useRouter()

const userProfile = ref({ full_name: 'Loading...' })
const verificationStatus = ref(null) // 'approved' | 'pending' | null

const stats = ref({
  totalProperties: 0,
  activeListings: 0,
  newRequests: 0,
  inspections: 0
})

const fetchDashboardData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (profile) userProfile.value = profile

    // Verification Status
    const { data: verif } = await supabase
      .from('agent_verifications')
      .select('verification_status')
      .eq('user_id', user.id)
      .single()

    verificationStatus.value = verif?.verification_status || null

    // Stats...
    const { count: totalProps } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listed_by', user.id)

    const { count: activeProps } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('listed_by', user.id)
      .eq('status', 'approved')

    stats.value.totalProperties = totalProps || 0
    stats.value.activeListings = activeProps || 0

  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}

const goToVerification = () => {
  router.push('/agent/verification')   
}

onMounted(() => {
  fetchDashboardData()
})
</script>