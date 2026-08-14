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
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">My Inspections</h1>
          <p class="text-medium-gray mt-2">
            Track and manage all your scheduled property inspections
          </p>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">📅</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ upcomingCount }}</div>
          <div class="text-medium-gray">Upcoming</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">✅</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ completedCount }}</div>
          <div class="text-medium-gray">Completed</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">⏳</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ pendingCount }}</div>
          <div class="text-medium-gray">Pending / Scheduled</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">❌</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ cancelledCount }}</div>
          <div class="text-medium-gray">Cancelled</div>
        </div>
      </div>

      <!-- Next Inspection -->
      <div v-if="nextInspection" class="mb-12">
        <h3 class="font-semibold text-xl mb-6 text-[var(--royal-blue)]">Next Inspection</h3>
        <UpcomingInspectionCard :inspection="nextInspection" />
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 class="font-semibold text-xl text-[var(--royal-blue)]">All Inspections</h3>

        <select
          v-model="filterStatus"
          class="px-6 py-3 rounded-2xl border border-gray-200 bg-white"
        >
          <option value="">All Inspections</option>
          <option value="upcoming">Upcoming</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16 text-medium-gray">
        Loading inspections...
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredInspections.length === 0"
        class="bg-white rounded-3xl p-12 text-center text-medium-gray"
      >
        <p class="text-lg font-medium text-[var(--royal-blue)]">No inspections found</p>
        <p class="mt-2">You don’t have any inspections in this category yet.</p>
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="inspection in filteredInspections"
          :key="inspection.id"
          class="flex flex-col gap-4"
        >
          <InspectionCard :inspection="inspection" @updated="fetchInspections" />

          <InspectionCountdown
            v-if="['scheduled', 'confirmed', 'rescheduled'].includes(inspection.status)"
            :targetDate="inspection.inspection_date"
            :targetTime="inspection.inspection_time"
          />
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
const loading = ref(true)

const fetchInspections = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('inspections')
      .select(`
        id,
        inspection_code,
        inspection_date,
        inspection_time,
        status,
        meeting_location,
        admin_notes,
        completion_notes,
        customer_interest,
        cancellation_reason,
        created_at,
        property:properties (
          id,
          title,
          cover_image,
          area,
          city,
          state,
          price,
          property_type
        ),
        agent:profiles!agent_id (
          id,
          full_name,
          agency_name,
          phone,
          avatar_url
        )
      `)
      .eq('customer_id', user.id)
      .order('inspection_date', { ascending: true })

    if (error) throw error
    inspections.value = data || []
  } catch (err) {
    console.error('Error fetching inspections:', err)
  } finally {
    loading.value = false
  }
}

const upcomingInspections = computed(() =>
  inspections.value.filter(i =>
    ['scheduled', 'confirmed', 'rescheduled'].includes(i.status)
  )
)

const nextInspection = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return upcomingInspections.value.find(i => {
    if (!i.inspection_date) return false
    return new Date(i.inspection_date) >= today
  }) || upcomingInspections.value[0] || null
})

const upcomingCount = computed(() => upcomingInspections.value.length)

const completedCount = computed(() =>
  inspections.value.filter(i => i.status === 'completed').length
)

const pendingCount = computed(() =>
  inspections.value.filter(i => ['pending', 'scheduled'].includes(i.status)).length
)

const cancelledCount = computed(() =>
  inspections.value.filter(i => i.status === 'cancelled').length
)

const filteredInspections = computed(() => {
  if (!filterStatus.value) return inspections.value

  if (filterStatus.value === 'upcoming') {
    return upcomingInspections.value
  }

  return inspections.value.filter(i => i.status === filterStatus.value)
})

onMounted(fetchInspections)
</script>