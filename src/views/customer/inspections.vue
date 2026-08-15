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
            Track requests, confirm schedules, and view inspection outcomes
          </p>
        </div>
        <button
          type="button"
          @click="fetchInspections"
          class="px-5 py-3 bg-white border rounded-2xl text-sm font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">⚡</div>
          <div class="text-4xl font-bold text-red-600">{{ actionRequiredCount }}</div>
          <div class="text-medium-gray">Action Required</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">📅</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ upcomingCount }}</div>
          <div class="text-medium-gray">Upcoming</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">✅</div>
          <div class="text-4xl font-bold text-green-600">{{ completedCount }}</div>
          <div class="text-medium-gray">Completed</div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm">
          <div class="text-3xl mb-3">❌</div>
          <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ cancelledCount }}</div>
          <div class="text-medium-gray">Cancelled / No-show</div>
        </div>
      </div>

      <!-- Action Required -->
      <div v-if="actionRequiredInspections.length" class="mb-12">
        <div class="flex items-center gap-3 mb-5">
          <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide">
            ACTION REQUIRED
          </span>
          <h3 class="font-semibold text-xl text-[var(--royal-blue)]">
            Confirm or respond to these inspections
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="inspection in actionRequiredInspections"
            :key="inspection.id"
            class="bg-white rounded-3xl p-6 shadow-sm border-2 border-red-100"
          >
            <div class="flex gap-4">
              <img
                :src="inspection.property?.cover_image || placeholderImg"
                class="w-24 h-24 rounded-2xl object-cover"
                alt=""
              />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-red-600 tracking-wide mb-1">
                  {{ customerActionBadge(inspection) }}
                </p>
                <h4 class="font-semibold text-lg line-clamp-1">
                  {{ inspection.property?.title || 'Property' }}
                </h4>
                <p class="text-sm text-medium-gray mt-1">
                  {{ inspection.property?.area || inspection.property?.city }},
                  {{ inspection.property?.city }}
                </p>
                <p class="text-sm mt-2">
                  📅 {{ formatDate(inspection.inspection_date) }}
                  · ⏰ {{ inspection.inspection_time || 'TBD' }}
                </p>
                <p class="text-sm text-medium-gray mt-1">
                  Status: <span class="capitalize font-medium">{{ displayStatus(inspection.status) }}</span>
                </p>
              </div>
            </div>

            <p class="text-sm mt-4 text-medium-gray">
              {{ customerStatusMessage(inspection) }}
            </p>

            <div class="flex flex-wrap gap-2 mt-4">
              <button
                v-if="needsCustomerConfirm(inspection)"
                type="button"
                :disabled="savingId === inspection.id"
                @click="confirmAttendance(inspection)"
                class="flex-1 py-3 bg-[var(--royal-blue)] text-white rounded-2xl text-sm font-semibold disabled:opacity-50"
              >
                {{ savingId === inspection.id ? 'Saving...' : 'Confirm Attendance' }}
              </button>

              <button
                v-if="canCustomerCancel(inspection)"
                type="button"
                :disabled="savingId === inspection.id"
                @click="openCancel(inspection)"
                class="flex-1 py-3 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold disabled:opacity-50"
              >
                Request Cancellation
              </button>

              <button
                type="button"
                @click="selectedInspection = inspection"
                class="w-full py-3 border rounded-2xl text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Inspection -->
      <div v-if="nextInspection" class="mb-12">
        <h3 class="font-semibold text-xl mb-6 text-[var(--royal-blue)]">Next Inspection</h3>
        <UpcomingInspectionCard
          :inspection="nextInspection"
          @updated="fetchInspections"
          @confirm="confirmAttendance"
          @cancel="openCancel"
        />
        <InspectionCountdown
          v-if="isCountdownStatus(nextInspection.status)"
          class="mt-4"
          :targetDate="nextInspection.inspection_date"
          :targetTime="nextInspection.inspection_time"
        />
      </div>

      <!-- Filters / Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 class="font-semibold text-xl text-[var(--royal-blue)]">All Inspections</h3>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            @click="filterStatus = tab.value"
            :class="[
              'px-4 py-2.5 rounded-2xl text-sm font-medium transition',
              filterStatus === tab.value
                ? 'bg-[var(--royal-blue)] text-white'
                : 'bg-white text-medium-gray border border-gray-100 hover:bg-gray-50'
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.value === 'action' && actionRequiredCount"
              class="ml-1 inline-flex min-w-[1.15rem] h-5 px-1 items-center justify-center rounded-full bg-red-500 text-white text-[10px]"
            >
              {{ actionRequiredCount }}
            </span>
          </button>
        </div>
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
        <p class="text-lg font-medium text-[var(--royal-blue)]">{{ emptyTitle }}</p>
        <p class="mt-2">{{ emptyMessage }}</p>
        <a
          href="/properties"
          class="inline-block mt-6 px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl font-medium"
        >
          Browse Properties
        </a>
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="inspection in filteredInspections"
          :key="inspection.id"
          class="flex flex-col gap-4"
        >
          <InspectionCard
            :inspection="inspection"
            @updated="fetchInspections"
            @confirm="confirmAttendance"
            @cancel="openCancel"
            @view="selectedInspection = inspection"
          />

          <InspectionCountdown
            v-if="isCountdownStatus(inspection.status)"
            :targetDate="inspection.inspection_date"
            :targetTime="inspection.inspection_time"
          />

          <!-- Customer-facing status helper -->
          <div class="bg-white rounded-2xl px-4 py-3 text-sm text-medium-gray border border-gray-100">
            {{ customerStatusMessage(inspection) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Details Drawer -->
<div
  v-if="selectedInspection"
  class="fixed inset-0 z-50 bg-black/40 flex justify-end"
  @click.self="selectedInspection = null"
>
  <div class="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
    <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
      <div>
        <h2 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Details</h2>
        <p class="text-sm text-medium-gray">
          {{ selectedInspection.inspection_code || selectedInspection.id.slice(0, 8) }}
        </p>
      </div>
      <button type="button" class="text-3xl text-gray-400" @click="selectedInspection = null">×</button>
    </div>

    <div class="p-6 space-y-6">
      <img
        :src="selectedInspection.property?.cover_image || placeholderImg"
        class="w-full h-48 object-cover rounded-3xl"
        alt=""
      />
      <div>
        <h3 class="text-2xl font-semibold">{{ selectedInspection.property?.title }}</h3>
        <p class="text-medium-gray mt-1">
          {{ selectedInspection.property?.property_type }} ·
          {{ selectedInspection.property?.area }},
          {{ selectedInspection.property?.city }}
        </p>
        <p class="text-2xl font-bold text-green-600 mt-3">
          ₦{{ Number(selectedInspection.property?.price || 0).toLocaleString() }}
        </p>
      </div>

      <div class="bg-blue-50 rounded-2xl p-4 text-sm">
        <p class="font-semibold text-[var(--royal-blue)]">
          {{ displayStatus(selectedInspection.status) }}
        </p>
        <p class="text-medium-gray mt-1">
          {{ customerStatusMessage(selectedInspection) }}
        </p>
      </div>

      <div class="bg-gray-50 rounded-3xl p-5 space-y-3 text-sm">
        <div class="flex justify-between gap-3">
          <span class="text-medium-gray">Date</span>
          <span class="font-medium">{{ formatDate(selectedInspection.inspection_date) }}</span>
        </div>
        <div class="flex justify-between gap-3">
          <span class="text-medium-gray">Time</span>
          <span class="font-medium">{{ selectedInspection.inspection_time || '—' }}</span>
        </div>
        <div class="flex justify-between gap-3">
          <span class="text-medium-gray">Meeting point</span>
          <span class="font-medium text-right">
            {{ selectedInspection.meeting_location || 'Property address' }}
          </span>
        </div>
        <div class="flex justify-between gap-3">
          <span class="text-medium-gray">Your confirmation</span>
          <span class="font-medium">{{ customerConfirmationLabel(selectedInspection) }}</span>
        </div>
        <div v-if="selectedInspection.agent" class="flex justify-between gap-3">
          <span class="text-medium-gray">Agent</span>
          <span class="font-medium">{{ selectedInspection.agent.full_name || 'Assigned agent' }}</span>
        </div>
      </div>

      <div v-if="selectedInspection.admin_notes" class="bg-amber-50 rounded-2xl p-4 text-sm">
        <p class="font-semibold text-amber-800">Notes from LodgeNext</p>
        <p class="mt-1 text-amber-900">{{ selectedInspection.admin_notes }}</p>
      </div>

      <!-- Outcome -->
      <div
        v-if="selectedInspection.status === 'completed'"
        class="bg-green-50 rounded-2xl p-4 text-sm space-y-1"
      >
        <p class="font-semibold text-green-800">Inspection Outcome</p>
        <p v-if="selectedInspection.inspection_outcome" class="capitalize">
          Outcome: {{ displayStatus(selectedInspection.inspection_outcome) }}
        </p>
        <p v-if="selectedInspection.general_condition" class="capitalize">
          Condition: {{ selectedInspection.general_condition }}
        </p>
        <p v-if="selectedInspection.completion_notes">
          {{ selectedInspection.completion_notes }}
        </p>
        <p v-if="selectedInspection.agent_recommendation" class="capitalize">
          Agent recommendation:
          {{ displayStatus(selectedInspection.agent_recommendation) }}
        </p>
      </div>

      <!-- Evidence: photos + video (after completion) -->
      <div v-if="selectedInspection.status === 'completed'">
        <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Inspection Photos & Video</h3>

        <div v-if="drawerMediaLoading" class="grid grid-cols-2 gap-3">
          <div v-for="n in 2" :key="n" class="h-32 rounded-2xl bg-gray-100 animate-pulse" />
        </div>

        <template v-else-if="drawerPhotos.length || drawerVideos.length">
          <div v-if="drawerPhotos.length" class="grid grid-cols-2 gap-3">
            <a
              v-for="item in drawerPhotos"
              :key="item.id"
              :href="item.displayUrl"
              target="_blank"
              rel="noopener"
              class="block rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                :src="item.displayUrl"
                class="w-full h-32 object-cover"
                alt="Inspection photo"
              />
            </a>
          </div>

          <div v-if="drawerVideos.length" class="mt-4 space-y-3">
            <video
              v-for="item in drawerVideos"
              :key="item.id"
              :src="item.displayUrl"
              controls
              class="w-full rounded-2xl bg-black max-h-64"
            />
          </div>
        </template>

        <p v-else class="text-sm text-medium-gray">
          No photos or video were uploaded for this inspection.
        </p>
      </div>

      <div
        v-if="selectedInspection.status === 'cancelled'"
        class="bg-red-50 rounded-2xl p-4 text-sm"
      >
        <p class="font-semibold text-red-700">
          {{ cancellationLabel(selectedInspection) }}
        </p>
        <p class="mt-1 text-red-800">
          {{ selectedInspection.cancellation_reason || 'This inspection was cancelled.' }}
        </p>
      </div>

      <div class="space-y-3">
        <button
          v-if="needsCustomerConfirm(selectedInspection)"
          type="button"
          :disabled="savingId === selectedInspection.id"
          @click="confirmAttendance(selectedInspection)"
          class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold disabled:opacity-50"
        >
          Confirm Attendance
        </button>

        <button
          v-if="canCustomerCancel(selectedInspection)"
          type="button"
          @click="openCancel(selectedInspection)"
          class="w-full py-3.5 bg-red-50 text-red-700 rounded-2xl font-semibold"
        >
          Request Cancellation
        </button>

        <a
          v-if="selectedInspection.property?.id"
          :href="`/properties/${selectedInspection.property.id}`"
          class="block w-full text-center py-3.5 border rounded-2xl font-medium"
        >
          View Property
        </a>
      </div>
    </div>
  </div>
</div>
          

    <!-- Cancel modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-2">Cancel Inspection</h3>
        <p class="text-sm text-medium-gray mb-4">
          Please tell us why you need to cancel. Admin and agent will be notified.
        </p>
        <select v-model="cancelReason" class="w-full px-4 py-3 rounded-2xl border mb-4">
          <option value="">Select reason</option>
          <option value="Schedule conflict">Schedule conflict</option>
          <option value="No longer interested">No longer interested</option>
          <option value="Found another property">Found another property</option>
          <option value="Personal emergency">Personal emergency</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          v-if="cancelReason === 'Other'"
          v-model="cancelNotes"
          rows="3"
          class="w-full px-4 py-3 rounded-2xl border mb-4"
          placeholder="Additional details..."
        />
        <div class="flex gap-3">
          <button type="button" class="flex-1 py-3 border rounded-2xl" @click="showCancelModal = false">
            Back
          </button>
          <button
            type="button"
            class="flex-1 py-3 bg-red-600 text-white rounded-2xl disabled:opacity-50"
            :disabled="!cancelReason || !!savingId"
            @click="submitCancel"
          >
            {{ savingId ? 'Cancelling...' : 'Confirm Cancel' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-2xl shadow-lg text-sm font-medium text-white"
      :class="toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

import UpcomingInspectionCard from '@/components/customer/inspection/UpcomingInspectionCard.vue'
import InspectionCard from '@/components/customer/inspection/InspectionCard.vue'
import InspectionCountdown from '@/components/customer/inspection/InspectionCountdown.vue'

const placeholderImg = 'https://via.placeholder.com/400x250?text=Property'

const inspections = ref([])
const filterStatus = ref('')
const loading = ref(true)
const selectedInspection = ref(null)
const showCancelModal = ref(false)
const cancelTarget = ref(null)
const cancelReason = ref('')
const cancelNotes = ref('')
const savingId = ref(null)
const toast = ref(null)

let channel = null

const tabs = [
  { label: 'All', value: '' },
  { label: 'Action Required', value: 'action' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const showToast = (message, type = 'success') => {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3200)
}

const ACTIVE_UPCOMING = ['accepted', 'scheduled', 'confirmed', 'reschedule_requested', 'rescheduled']
const TERMINAL = ['completed', 'cancelled', 'no_show', 'declined']

const isCountdownStatus = (status) =>
  ['scheduled', 'confirmed', 'rescheduled', 'reschedule_requested'].includes(status)

const displayStatus = (status) => (status || '—').replace(/_/g, ' ')

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const needsCustomerConfirm = (i) => {
  // Agent/admin has scheduled or confirmed; customer has not confirmed yet
  if (!['scheduled', 'confirmed'].includes(i.status)) return false
  return !i.customer_confirmed_at && i.customer_confirmation_status !== 'confirmed'
}

const canCustomerCancel = (i) =>
  !TERMINAL.includes(i.status) && !['in_progress'].includes(i.status)

const isActionRequired = (i) => needsCustomerConfirm(i)

const customerActionBadge = (i) => {
  if (needsCustomerConfirm(i)) return 'CONFIRM ATTENDANCE'
  return 'ACTION REQUIRED'
}

const customerStatusMessage = (i) => {
  switch (i.status) {
    case 'pending':
      return 'Your inspection request is with the LodgeNext team. An agent will be assigned soon.'
    case 'accepted':
      return 'An agent has accepted your inspection. Final date and time will be confirmed shortly.'
    case 'scheduled':
      return needsCustomerConfirm(i)
        ? 'Your inspection is scheduled. Please confirm that you can attend.'
        : 'Inspection scheduled. Waiting for final confirmations.'
    case 'confirmed':
      return needsCustomerConfirm(i)
        ? 'Agent is confirmed. Please confirm your attendance.'
        : 'You and the agent are confirmed. See you at the property.'
    case 'reschedule_requested':
    case 'rescheduled':
      return 'A reschedule has been requested. We will update you with the new time.'
    case 'in_progress':
      return 'Your inspection is currently in progress.'
    case 'completed':
      return 'Inspection completed. Review the outcome below or in inspection details.'
    case 'cancelled':
      return i.cancellation_reason || 'This inspection was cancelled.'
    case 'no_show':
      return 'This inspection was marked as no-show because attendance could not be completed.'
    case 'declined':
      return 'The assigned agent could not take this inspection. LodgeNext will reassign if needed.'
    default:
      return 'Track updates here as your inspection progresses.'
  }
}

const customerConfirmationLabel = (i) => {
  if (i.customer_confirmation_status === 'confirmed' || i.customer_confirmed_at) {
    return '✓ You confirmed'
  }
  if (i.customer_confirmation_status === 'cancelled') return '✕ You cancelled'
  return '⏳ Awaiting your confirmation'
}

const cancellationLabel = (i) => {
  if (i.cancelled_by === 'admin') return 'Cancelled by LodgeNext'
  if (i.cancelled_by === 'agent') return 'Cancelled by Agent'
  if (i.cancelled_by === 'customer') return 'Cancelled by You'
  return 'Cancelled'
}

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
        cancelled_by,
        cancelled_at,
        customer_confirmation_status,
        customer_confirmed_at,
        inspection_outcome,
        general_condition,
        agent_recommendation,
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
      .order('inspection_date', { ascending: true, nullsFirst: false })

    if (error) throw error
    inspections.value = data || []

    // keep drawer in sync
    if (selectedInspection.value) {
      selectedInspection.value =
        inspections.value.find((i) => i.id === selectedInspection.value.id) || null
    }
  } catch (err) {
    console.error('Error fetching inspections:', err)
    showToast(err.message || 'Failed to load inspections', 'error')
  } finally {
    loading.value = false
  }
}

const upcomingInspections = computed(() =>
  inspections.value.filter((i) => ACTIVE_UPCOMING.includes(i.status))
)

const actionRequiredInspections = computed(() =>
  inspections.value.filter(isActionRequired)
)

const nextInspection = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    upcomingInspections.value.find((i) => {
      if (!i.inspection_date) return false
      return new Date(i.inspection_date) >= today
    }) ||
    upcomingInspections.value[0] ||
    null
  )
})

const actionRequiredCount = computed(() => actionRequiredInspections.value.length)
const upcomingCount = computed(() => upcomingInspections.value.length)
const completedCount = computed(() =>
  inspections.value.filter((i) => i.status === 'completed').length
)
const cancelledCount = computed(() =>
  inspections.value.filter((i) => ['cancelled', 'no_show'].includes(i.status)).length
)

const filteredInspections = computed(() => {
  if (!filterStatus.value) return inspections.value
  if (filterStatus.value === 'upcoming') return upcomingInspections.value
  if (filterStatus.value === 'action') return actionRequiredInspections.value
  if (filterStatus.value === 'cancelled') {
    return inspections.value.filter((i) => ['cancelled', 'no_show', 'declined'].includes(i.status))
  }
  return inspections.value.filter((i) => i.status === filterStatus.value)
})

const emptyTitle = computed(() => {
  if (filterStatus.value === 'action') return "You're all caught up"
  if (filterStatus.value === 'upcoming') return 'No upcoming inspections'
  if (filterStatus.value === 'completed') return 'No completed inspections yet'
  return 'No inspections found'
})

const emptyMessage = computed(() => {
  if (filterStatus.value === 'action') {
    return 'Nothing needs your confirmation right now.'
  }
  return 'Browse properties and request an inspection to get started.'
})

const confirmAttendance = async (inspection) => {
  if (!inspection?.id) return
  savingId.value = inspection.id
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Please sign in')

    const { error } = await supabase
      .from('inspections')
      .update({
        customer_confirmation_status: 'confirmed',
        customer_confirmed_at: new Date().toISOString(),
        // if agent already confirmed, keep confirmed; otherwise stay scheduled
        status: inspection.status === 'scheduled' ? 'scheduled' : inspection.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', inspection.id)
      .eq('customer_id', user.id)

    if (error) throw error
    showToast('Attendance confirmed. Agent and admin have been notified.')
    await fetchInspections()
  } catch (err) {
    console.error(err)
    showToast(err.message || 'Could not confirm attendance', 'error')
  } finally {
    savingId.value = null
  }
}

const openCancel = (inspection) => {
  cancelTarget.value = inspection
  cancelReason.value = ''
  cancelNotes.value = ''
  showCancelModal.value = true
}

const submitCancel = async () => {
  if (!cancelTarget.value || !cancelReason.value) return
  savingId.value = cancelTarget.value.id
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Please sign in')

    const reason =
      cancelReason.value === 'Other'
        ? (cancelNotes.value || 'Other')
        : cancelReason.value

    const { error } = await supabase
      .from('inspections')
      .update({
        status: 'cancelled',
        cancelled_by: 'customer',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        customer_confirmation_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', cancelTarget.value.id)
      .eq('customer_id', user.id)

    if (error) throw error

    showCancelModal.value = false
    selectedInspection.value = null
    showToast('Inspection cancelled.')
    await fetchInspections()
  } catch (err) {
    console.error(err)
    showToast(err.message || 'Could not cancel inspection', 'error')
  } finally {
    savingId.value = null
  }
}

const drawerMedia = ref([])
const drawerMediaLoading = ref(false)

const drawerPhotos = computed(() =>
  drawerMedia.value.filter((m) => m.media_type === 'photo')
)
const drawerVideos = computed(() =>
  drawerMedia.value.filter((m) => m.media_type === 'video')
)

const resolveMediaUrl = async (item) => {
  if (item.url && String(item.url).startsWith('http')) return item.url
  if (!item.storage_path) return item.url || null

  const { data } = await supabase.storage
    .from('inspection-evidence')
    .createSignedUrl(item.storage_path, 3600)

  return data?.signedUrl || item.url || null
}

const loadDrawerMedia = async (inspectionId) => {
  drawerMedia.value = []
  if (!inspectionId) return

  drawerMediaLoading.value = true
  try {
    const { data, error } = await supabase
      .from('inspection_media')
      .select('id, media_type, category, url, storage_path, created_at')
      .eq('inspection_id', inspectionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const withUrls = await Promise.all(
      (data || []).map(async (item) => ({
        ...item,
        displayUrl: await resolveMediaUrl(item)
      }))
    )
    drawerMedia.value = withUrls.filter((m) => m.displayUrl)
  } catch (err) {
    console.error(err)
    drawerMedia.value = []
  } finally {
    drawerMediaLoading.value = false
  }
}

watch(
  () => selectedInspection.value?.id,
  (id) => loadDrawerMedia(id)
)
const setupRealtime = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return

  if (channel) await supabase.removeChannel(channel)

  channel = supabase
    .channel(`customer-inspections-${session.user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inspections',
        filter: `customer_id=eq.${session.user.id}`
      },
      () => {
        fetchInspections()
      }
    )
    .subscribe()
}

onMounted(async () => {
  await fetchInspections()
  await setupRealtime()
})

onUnmounted(async () => {
  if (channel) await supabase.removeChannel(channel)
})
</script>