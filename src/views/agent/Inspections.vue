<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-4 md:p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">My Inspections</h1>
          <p class="text-medium-gray mt-2">
            Manage your upcoming, scheduled and completed property inspections.
          </p>
          <p class="mt-2 text-sm font-medium text-[var(--royal-blue)]">
            📍 {{ agentProfile.city || '—' }}, {{ agentProfile.state || '—' }}
          </p>
        </div>
        <button
          type="button"
          @click="refreshData"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] transition"
        >
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Total Inspections</p>
          <p class="text-3xl md:text-4xl font-bold mt-2">{{ stats.total }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Upcoming</p>
          <p class="text-3xl md:text-4xl font-bold text-blue-600 mt-2">{{ stats.upcoming }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Today</p>
          <p class="text-3xl md:text-4xl font-bold text-amber-600 mt-2">{{ stats.today }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Completed</p>
          <p class="text-3xl md:text-4xl font-bold text-green-600 mt-2">{{ stats.completed }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          @click="activeTab = tab.value"
          :class="[
            'px-5 py-2.5 rounded-2xl text-sm font-medium transition',
            activeTab === tab.value
              ? 'bg-[var(--royal-blue)] text-white'
              : 'bg-white text-medium-gray hover:bg-gray-50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-5 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search property, inspection ID, area, city..."
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          />
          <select
            v-model="statusFilter"
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select
            v-model="dateFilter"
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-3xl h-32 animate-pulse" />
      </div>

      <!-- Empty -->
      <div v-else-if="inspections.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm">
        <div class="text-6xl mb-4">🏠</div>
        <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">No Inspections Yet</h3>
        <p class="text-medium-gray mt-2 max-w-md mx-auto">
          You don't have any scheduled property inspections at the moment.
          New inspections assigned by your State Admin will appear here automatically.
        </p>
        <button
          type="button"
          @click="$router.push('/agent/requests')"
          class="mt-6 px-8 py-3 bg-[var(--royal-blue)] text-white rounded-2xl"
        >
          View Requests
        </button>
      </div>

      <template v-else>
        <!-- Upcoming cards -->
        <div v-if="upcomingPreview.length" class="mb-10">
          <h2 class="text-xl font-semibold mb-4">Upcoming Inspections</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in upcomingPreview"
              :key="item.id"
              class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
            >
              <img
                :src="item.properties?.cover_image || placeholderImg"
                class="w-full h-36 object-cover rounded-2xl mb-4"
              />
              <p class="font-semibold line-clamp-1">{{ item.properties?.title }}</p>
              <p class="text-sm text-medium-gray mt-1">
                {{ item.properties?.property_type }} · {{ item.properties?.area || item.city }}, {{ item.city }}
              </p>
              <p class="text-sm mt-2">Customer: {{ maskName(item.customer?.full_name) }}</p>
              <p class="text-sm mt-1">
                📅 {{ formatDate(item.inspection_date || item.scheduled_date) }}
                · ⏰ {{ item.inspection_time || item.scheduled_time || '—' }}
              </p>
              <span
                class="inline-block mt-3 text-xs px-3 py-1 rounded-2xl font-medium capitalize"
                :class="statusClass(item.status)"
              >
                {{ displayStatus(item.status) }}
              </span>
              <button
                type="button"
                @click="openDrawer(item)"
                class="w-full mt-4 py-3 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl text-sm font-medium"
              >
                View Inspection
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden lg:block bg-white rounded-3xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-sm text-medium-gray">
                <th class="py-4 px-6">Inspection ID</th>
                <th class="py-4 px-6">Property</th>
                <th class="py-4 px-6">Customer</th>
                <th class="py-4 px-6">Location</th>
                <th class="py-4 px-6">Date</th>
                <th class="py-4 px-6">Time</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr
                v-for="item in filteredInspections"
                :key="item.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="py-5 px-6 font-medium text-sm">
                  {{ item.request_code || item.id.slice(0, 8) }}
                </td>
                <td class="py-5 px-6">
                  <div class="flex items-center gap-3">
                    <img
                      :src="item.properties?.cover_image || placeholderImg"
                      class="w-12 h-12 rounded-xl object-cover"
                    />
                    <span class="font-medium line-clamp-1">{{ item.properties?.title }}</span>
                  </div>
                </td>
                <td class="py-5 px-6 text-sm">{{ maskName(item.customer?.full_name) }}</td>
                <td class="py-5 px-6 text-sm text-medium-gray">
                  {{ item.properties?.area || item.city }}, {{ item.city }}
                </td>
                <td class="py-5 px-6 text-sm">
                  {{ formatDate(item.inspection_date || item.scheduled_date) }}
                </td>
                <td class="py-5 px-6 text-sm">
                  {{ item.inspection_time || item.scheduled_time || '—' }}
                </td>
                <td class="py-5 px-6">
                  <span
                    class="text-xs px-3 py-1.5 rounded-2xl font-medium capitalize"
                    :class="statusClass(item.status)"
                  >
                    {{ displayStatus(item.status) }}
                  </span>
                </td>
                <td class="py-5 px-6 text-right space-x-2">
                  <button
                    type="button"
                    @click="openDrawer(item)"
                    class="px-4 py-2 bg-[var(--royal-blue)] text-white rounded-2xl text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredInspections.length === 0" class="p-10 text-center text-medium-gray">
            No inspections match your filters.
          </div>
        </div>

        <!-- Mobile / tablet cards -->
        <div class="lg:hidden space-y-4">
          <div
            v-for="item in filteredInspections"
            :key="item.id"
            class="bg-white rounded-3xl p-5 shadow-sm"
          >
            <div class="flex gap-4">
              <img
                :src="item.properties?.cover_image || placeholderImg"
                class="w-20 h-20 rounded-2xl object-cover"
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold line-clamp-1">{{ item.properties?.title }}</p>
                <p class="text-sm text-medium-gray mt-1">
                  {{ item.properties?.area || item.city }}, {{ item.city }}
                </p>
                <p class="text-sm mt-1">
                  {{ formatDate(item.inspection_date || item.scheduled_date) }}
                  · {{ item.inspection_time || item.scheduled_time || '—' }}
                </p>
                <span
                  class="inline-block mt-2 text-xs px-3 py-1 rounded-2xl font-medium capitalize"
                  :class="statusClass(item.status)"
                >
                  {{ displayStatus(item.status) }}
                </span>
              </div>
            </div>
            <button
              type="button"
              @click="openDrawer(item)"
              class="w-full mt-4 py-3 border rounded-2xl text-sm font-medium"
            >
              View Inspection
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Details Drawer -->
    <div
      v-if="selected"
      class="fixed inset-0 z-50 bg-black/50 flex justify-end"
      @click.self="selected = null"
    >
      <div class="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Details</h2>
            <p class="text-sm text-medium-gray">{{ selected.request_code || selected.id.slice(0, 8) }}</p>
          </div>
          <button type="button" @click="selected = null" class="text-3xl text-gray-400">×</button>
        </div>

        <div class="p-6 space-y-8">
          <!-- Property -->
          <div>
            <img
              :src="selected.properties?.cover_image || placeholderImg"
              class="w-full h-48 object-cover rounded-3xl mb-4"
            />
            <h3 class="text-2xl font-semibold">{{ selected.properties?.title }}</h3>
            <p class="text-medium-gray mt-1">
              {{ selected.properties?.property_type }} ·
              {{ selected.properties?.area }}, {{ selected.city }}, {{ selected.state }}
            </p>
            <p class="text-2xl font-bold text-green-600 mt-3">
              ₦{{ Number(selected.properties?.price || 0).toLocaleString() }}
              <span class="text-sm font-normal text-medium-gray">/ year</span>
            </p>
            <div class="flex gap-6 mt-3 text-sm">
              <span>🛏️ {{ selected.properties?.bedrooms || 0 }}</span>
              <span>🚿 {{ selected.properties?.bathrooms || 0 }}</span>
            </div>
            <p v-if="selected.properties?.address" class="text-sm text-medium-gray mt-3">
              {{ selected.properties.address }}
            </p>
          </div>

          <!-- Customer -->
          <div class="bg-gray-50 rounded-3xl p-5">
            <p class="text-sm text-medium-gray">Customer</p>
            <p class="font-semibold mt-1">{{ maskName(selected.customer?.full_name) }}</p>
            <p class="text-sm text-medium-gray mt-2">Managed by State Admin</p>
          </div>

          <!-- Inspection details -->
          <div class="bg-gray-50 rounded-3xl p-5 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-medium-gray">Status</span>
              <span class="font-medium capitalize">{{ displayStatus(selected.status) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-medium-gray">Date</span>
              <span class="font-medium">{{ formatDate(selected.inspection_date || selected.scheduled_date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-medium-gray">Time</span>
              <span class="font-medium">{{ selected.inspection_time || selected.scheduled_time || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-medium-gray">State Admin</span>
              <span class="font-medium">{{ selected.state }} Admin</span>
            </div>
            <div v-if="selected.inspection_started_at" class="flex justify-between">
              <span class="text-medium-gray">Started</span>
              <span class="font-medium">{{ formatDateTime(selected.inspection_started_at) }}</span>
            </div>
          </div>

          <!-- Timeline -->
          <div>
            <h4 class="font-semibold mb-4">Inspection Progress</h4>
            <div class="space-y-3">
              <div
                v-for="(step, i) in timelineSteps"
                :key="i"
                class="flex items-center gap-3 text-sm"
              >
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    isStepDone(step.key)
                      ? 'bg-green-500 text-white'
                      : isStepCurrent(step.key)
                        ? 'bg-[var(--royal-blue)] text-white'
                        : 'bg-gray-200 text-gray-500'
                  ]"
                >
                  {{ isStepDone(step.key) ? '✓' : i + 1 }}
                </div>
                <span :class="isStepDone(step.key) || isStepCurrent(step.key) ? 'font-medium' : 'text-medium-gray'">
                  {{ step.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pt-2">
            <button
              v-if="canStart(selected.status)"
              type="button"
              @click="startInspection"
              class="w-full py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold"
            >
              Start Inspection
            </button>

            <button
              v-if="selected.status === 'in_progress'"
              type="button"
              @click="showCompleteModal = true"
              class="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold"
            >
              Complete Inspection
            </button>

            <button
              v-if="['scheduled', 'confirmed', 'in_progress'].includes(selected.status)"
              type="button"
              @click="markNoShow"
              class="w-full py-4 bg-amber-50 text-amber-800 rounded-2xl font-semibold"
            >
              Customer No Show
            </button>

            <button
              v-if="['scheduled', 'confirmed'].includes(selected.status)"
              type="button"
              @click="showCancelModal = true"
              class="w-full py-4 bg-red-50 text-red-700 rounded-2xl font-semibold"
            >
              Cancel Inspection
            </button>

            <button
              type="button"
              @click="openProperty"
              class="w-full py-4 border rounded-2xl font-medium"
            >
              Open Property
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Modal -->
    <div
      v-if="showCompleteModal"
      class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-4">Complete Inspection</h3>

        <label class="block text-sm font-medium mb-2">Inspection Outcome</label>
        <select v-model="completeForm.outcome" class="w-full px-4 py-3 rounded-2xl border mb-4">
          <option value="property_inspected">Property inspected</option>
          <option value="customer_attended">Customer attended</option>
          <option value="customer_did_not_attend">Customer did not attend</option>
          <option value="property_unavailable">Property unavailable</option>
          <option value="other">Other</option>
        </select>

        <label class="block text-sm font-medium mb-2">Inspection Notes</label>
        <textarea
          v-model="completeForm.notes"
          rows="4"
          class="w-full px-4 py-3 rounded-2xl border mb-4"
          placeholder="Describe what happened during the inspection..."
        />

        <div class="flex gap-3">
          <button
            type="button"
            @click="showCompleteModal = false"
            class="flex-1 py-3 border rounded-2xl"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="completing"
            @click="completeInspection"
            class="flex-1 py-3 bg-green-600 text-white rounded-2xl disabled:opacity-50"
          >
            {{ completing ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-4">Cancel Inspection</h3>

        <label class="block text-sm font-medium mb-2">Reason</label>
        <select v-model="cancelReason" class="w-full px-4 py-3 rounded-2xl border mb-4">
          <option value="">Select reason</option>
          <option value="Scheduling conflict">Scheduling conflict</option>
          <option value="Property unavailable">Property unavailable</option>
          <option value="Customer unavailable">Customer unavailable</option>
          <option value="Emergency">Emergency</option>
          <option value="Other">Other</option>
        </select>

        <div class="flex gap-3">
          <button
            type="button"
            @click="showCancelModal = false"
            class="flex-1 py-3 border rounded-2xl"
          >
            Back
          </button>
          <button
            type="button"
            :disabled="!cancelReason || cancelling"
            @click="cancelInspection"
            class="flex-1 py-3 bg-red-600 text-white rounded-2xl disabled:opacity-50"
          >
            {{ cancelling ? 'Cancelling...' : 'Confirm Cancel' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

type InspectionStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'approved'
  | 'assigned'

interface InspectionRow {
  id: string
  request_code?: string
  status: InspectionStatus
  agent_id?: string
  customer_id?: string
  property_id?: string
  state?: string
  city?: string
  inspection_date?: string
  scheduled_date?: string
  inspection_time?: string
  scheduled_time?: string
  inspection_started_at?: string
  inspection_completed_at?: string
  agent_notes?: string
  admin_notes?: string
  message?: string
  properties?: any
  customer?: { id: string; full_name?: string } | null
}

const router = useRouter()
const placeholderImg = 'https://via.placeholder.com/400x250?text=Property'

const agentProfile = ref<{ city?: string; state?: string; id?: string }>({})
const inspections = ref<InspectionRow[]>([])
const selected = ref<InspectionRow | null>(null)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const activeTab = ref('all')

const showCompleteModal = ref(false)
const showCancelModal = ref(false)
const completing = ref(false)
const cancelling = ref(false)
const cancelReason = ref('')
const completeForm = ref({
  outcome: 'property_inspected',
  notes: ''
})

let channel: ReturnType<typeof supabase.channel> | null = null

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Today', value: 'today' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const inspectionStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'approved']

const timelineSteps = [
  { key: 'requested', label: 'Customer Request' },
  { key: 'approved', label: 'Approved by State Admin' },
  { key: 'assigned', label: 'Assigned to Agent' },
  { key: 'scheduled', label: 'Inspection Scheduled' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' }
]

const isToday = (d?: string) => {
  if (!d) return false
  const date = new Date(d)
  const now = new Date()
  return date.toDateString() === now.toDateString()
}

const isUpcomingDate = (d?: string) => {
  if (!d) return false
  const date = new Date(d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return date >= now
}

const stats = computed(() => {
  const list = inspections.value
  return {
    total: list.length,
    upcoming: list.filter(i =>
      isUpcomingDate(i.inspection_date || i.scheduled_date) &&
      ['scheduled', 'confirmed', 'approved', 'in_progress'].includes(i.status)
    ).length,
    today: list.filter(i => isToday(i.inspection_date || i.scheduled_date)).length,
    completed: list.filter(i => i.status === 'completed').length
  }
})

const upcomingPreview = computed(() =>
  inspections.value
    .filter(i =>
      isUpcomingDate(i.inspection_date || i.scheduled_date) &&
      ['scheduled', 'confirmed', 'approved'].includes(i.status)
    )
    .slice(0, 3)
)

const filteredInspections = computed(() => {
  let result = [...inspections.value]

  if (activeTab.value === 'upcoming') {
    result = result.filter(i =>
      isUpcomingDate(i.inspection_date || i.scheduled_date) &&
      !['completed', 'cancelled', 'no_show'].includes(i.status)
    )
  } else if (activeTab.value === 'today') {
    result = result.filter(i => isToday(i.inspection_date || i.scheduled_date))
  } else if (activeTab.value === 'completed') {
    result = result.filter(i => i.status === 'completed')
  } else if (activeTab.value === 'cancelled') {
    result = result.filter(i => i.status === 'cancelled' || i.status === 'no_show')
  }

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.properties?.title?.toLowerCase().includes(term) ||
      i.request_code?.toLowerCase().includes(term) ||
      i.city?.toLowerCase().includes(term) ||
      i.properties?.area?.toLowerCase().includes(term) ||
      i.customer?.full_name?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) {
    result = result.filter(i => i.status === statusFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    result = result.filter(i => {
      const raw = i.inspection_date || i.scheduled_date
      if (!raw) return false
      const date = new Date(raw)

      if (dateFilter.value === 'today') return isToday(raw)
      if (dateFilter.value === 'tomorrow') {
        const t = new Date(now)
        t.setDate(t.getDate() + 1)
        return date.toDateString() === t.toDateString()
      }
      if (dateFilter.value === 'week') {
        const week = new Date(now)
        week.setDate(week.getDate() + 7)
        return date >= now && date <= week
      }
      if (dateFilter.value === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }
      if (dateFilter.value === 'past') return date < now
      return true
    })
  }

  return result
})

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    scheduled: 'bg-purple-100 text-purple-700',
    confirmed: 'bg-green-100 text-green-700',
    approved: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-700'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const displayStatus = (status: string) => status?.replace('_', ' ') || '—'

const formatDate = (d?: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (d?: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const maskName = (name?: string): string => {
  if (!name?.trim()) return 'Customer'

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Customer'

  const first = parts[0] ?? ''
  if (parts.length === 1) {
    return `${first.charAt(0)}.`
  }

  const last = parts[parts.length - 1] ?? ''
  return `${first} ${last.charAt(0)}.`
}

const canStart = (status: string) => ['confirmed', 'scheduled', 'approved'].includes(status)

const statusOrder = ['requested', 'approved', 'assigned', 'scheduled', 'confirmed', 'in_progress', 'completed']

const isStepDone = (key: string) => {
  if (!selected.value) return false
  const current = selected.value.status
  if (current === 'completed') return true
  if (current === 'cancelled' || current === 'no_show') return false
  const currentIdx = statusOrder.indexOf(current)
  const stepIdx = statusOrder.indexOf(key)
  return stepIdx >= 0 && currentIdx > stepIdx
}

const isStepCurrent = (key: string) => selected.value?.status === key

const fetchAgentProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, city, state, role')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Agent profile error:', error)
    return user
  }

  agentProfile.value = data || {}
  return user
}

const fetchInspections = async () => {
  loading.value = true
  try {
    const user = await fetchAgentProfile()
    if (!user) {
      inspections.value = []
      return
    }

    const { data, error } = await supabase
      .from('property_requests')
      .select(`
        *,
        properties (
          id, title, cover_image, area, city, state, address,
          price, bedrooms, bathrooms, property_type, status
        )
      `)
      .eq('agent_id', user.id)
      .in('status', inspectionStatuses)
      .order('inspection_date', { ascending: true, nullsFirst: false })

    if (error) throw error

    const enriched: InspectionRow[] = await Promise.all(
      (data || []).map(async (row: any) => {
        let customer = null
        if (row.customer_id) {
          const { data: c } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', row.customer_id)
            .maybeSingle()
          customer = c
        }
        return { ...row, customer }
      })
    )

    inspections.value = enriched
  } catch (err: any) {
    console.error('Failed to fetch inspections:', err)
    alert(err.message || 'Failed to load inspections')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await fetchInspections()
  if (selected.value) {
    const updated = inspections.value.find(i => i.id === selected.value!.id)
    if (updated) selected.value = updated
    else selected.value = null
  }
}

const openDrawer = (item: InspectionRow) => {
  selected.value = item
}

const updateInspection = async (id: string, payload: Record<string, any>) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('property_requests')
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('agent_id', user.id)
    .select()
    .maybeSingle()

  if (error) throw error
  return data
}

const startInspection = async () => {
  if (!selected.value) return
  if (!confirm('Start this inspection now?')) return

  try {
    const data = await updateInspection(selected.value.id, {
      status: 'in_progress',
      inspection_started_at: new Date().toISOString()
    })
    if (data) selected.value = { ...selected.value, ...data }
    await fetchInspections()
    alert('Inspection started')
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to start inspection')
  }
}

const completeInspection = async () => {
  if (!selected.value) return
  completing.value = true
  try {
    const notes = [
      `Outcome: ${completeForm.value.outcome}`,
      completeForm.value.notes ? `Notes: ${completeForm.value.notes}` : ''
    ].filter(Boolean).join('\n')

    const data = await updateInspection(selected.value.id, {
      status: 'completed',
      inspection_completed_at: new Date().toISOString(),
      agent_notes: notes
    })

    if (data) selected.value = { ...selected.value, ...data }
    showCompleteModal.value = false
    completeForm.value = { outcome: 'property_inspected', notes: '' }
    await fetchInspections()
    alert('Inspection completed successfully.')
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to complete inspection')
  } finally {
    completing.value = false
  }
}

const markNoShow = async () => {
  if (!selected.value) return
  if (!confirm('Mark this inspection as Customer No Show?')) return
  const note = prompt('Optional note:') || 'Customer did not attend'

  try {
    const data = await updateInspection(selected.value.id, {
      status: 'no_show',
      agent_notes: note
    })
    if (data) selected.value = { ...selected.value, ...data }
    await fetchInspections()
    alert('Marked as No Show')
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to update status')
  }
}

const cancelInspection = async () => {
  if (!selected.value || !cancelReason.value) return
  cancelling.value = true
  try {
    const data = await updateInspection(selected.value.id, {
      status: 'cancelled',
      admin_notes: `Agent cancelled: ${cancelReason.value}`
    })
    if (data) selected.value = { ...selected.value, ...data }
    showCancelModal.value = false
    cancelReason.value = ''
    await fetchInspections()
    alert('Inspection cancelled')
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to cancel inspection')
  } finally {
    cancelling.value = false
  }
}

const openProperty = () => {
  const id = selected.value?.properties?.id || selected.value?.property_id
  if (id) router.push(`/agent/properties/${id}`)
}

const setupRealtime = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return

  if (channel) await supabase.removeChannel(channel)

  channel = supabase
    .channel(`agent-inspections-${session.user.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'property_requests'
      },
      (payload) => {
        const row: any = payload.new || payload.old
        if (row?.agent_id === session.user.id) {
          refreshData()
        }
      }
    )
    .subscribe((status, err) => {
      console.log('Inspections realtime:', status, err)
    })
}

onMounted(async () => {
  await fetchInspections()
  await setupRealtime()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>