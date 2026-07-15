<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-10" />
          <h1 class="text-2xl font-bold text-[var(--royal-blue)]">LodgeNext</h1>
        </div>
        <div class="flex items-center gap-8">
          <a href="/properties" class="font-medium text-medium-gray hover:text-[var(--royal-blue)] transition">Browse</a>
          <a href="/my-inspections" class="font-medium text-[var(--royal-blue)]">Inspections</a>
          <a href="/saved" class="font-medium text-medium-gray hover:text-[var(--royal-blue)] transition">Saved</a>
          <button class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--mediumBlue)] transition">
            Post a Property
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex justify-between items-end mb-10">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">My Inspections</h1>
          <p class="text-medium-gray mt-2">Track and manage all your scheduled property inspections</p>
        </div>
        <button class="px-8 py-4 bg-[var(--royal-blue)] text-white rounded-3xl font-medium flex items-center gap-2 hover:bg-[var(--mediumBlue)] transition">
          <span>📅</span> Schedule New Inspection
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-4xl mb-3">📅</div>
          <div class="text-4xl font-bold">{{ upcomingInspections.length }}</div>
          <div class="text-medium-gray">Upcoming Inspections</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-4xl mb-3">✅</div>
          <div class="text-4xl font-bold">{{ completedInspections.length }}</div>
          <div class="text-medium-gray">Completed</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-4xl mb-3">⏳</div>
          <div class="text-4xl font-bold">{{ pendingInspections.length }}</div>
          <div class="text-medium-gray">Awaiting Confirmation</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-4xl mb-3">⭐</div>
          <div class="text-4xl font-bold">18</div>
          <div class="text-medium-gray">Saved Properties</div>
        </div>
      </div>

      <!-- Upcoming Inspection -->
      <div v-if="upcomingInspections.length" class="mb-12">
        <h3 class="font-semibold text-xl mb-6">Next Inspection</h3>
        <UpcomingInspectionCard 
          :inspection="upcomingInspections[0]" 
        />
      </div>

      <!-- All Inspections -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-semibold text-xl">All Inspections</h3>
          <select v-model="filterStatus" class="px-6 py-3 rounded-2xl border border-gray-200">
            <option value="">All Inspections</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="pending">Awaiting Confirmation</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="inspection in filteredInspections" 
               :key="inspection.id"
               class="flex flex-col gap-4">
            
            <InspectionCard 
              :inspection="inspection"
            />
            
            <InspectionCountdown 
              :targetDate="inspection.inspection_date" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

import UpcomingInspectionCard from '@/components/customer/inspection/UpcomingInspectionCard.vue'
import InspectionCard from '@/components/customer/inspection/InspectionCard.vue'
import InspectionCountdown from '@/components/customer/inspection/InspectionCountdown.vue'

const inspections = ref([])
const filterStatus = ref('')

const fetchInspections = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('property_requests')
    .select(`
      id,
      inspection_date,
      status,
      notes,
      properties (
        id,
        title,
        cover_image,
        area,
        city,
        state,
        price
      )
    `)
    .eq('customer_id', user.id)
    .order('inspection_date', { ascending: true })

  if (error) {
    console.error("Error fetching inspections:", error)
  } else {
    inspections.value = data || []
  }
}

const upcomingInspections = computed(() => 
  inspections.value.filter(i => 
    i.status === 'inspection_scheduled' || i.status === 'confirmed'
  )
)

const completedInspections = computed(() => 
  inspections.value.filter(i => i.status === 'completed')
)

const pendingInspections = computed(() => 
  inspections.value.filter(i => i.status === 'pending')
)

const filteredInspections = computed(() => {
  if (!filterStatus.value) return inspections.value
  return inspections.value.filter(i => i.status === filterStatus.value)
})

onMounted(() => {
  fetchInspections()
})
</script>