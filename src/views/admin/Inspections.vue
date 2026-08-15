<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Inspections
          </h1>
          <p class="text-medium-gray mt-2">
            Manage assignments, schedules, agent responses, and inspection outcomes in your location.
          </p>
          <p class="mt-1 text-sm font-medium text-[var(--royal-blue)]">
            📍 Assigned Location: {{ adminProfile.city || '—' }}, {{ adminProfile.state || '—' }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            @click="openSchedule()"
            class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] font-medium"
          >
            + Schedule Inspection
          </button>
          <button
            type="button"
            @click="refreshAll"
            class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats -->
      <InspectionStats :stats="stats" class="mb-8" />

      <!-- ACTION REQUIRED QUEUES -->
      <div v-if="actionQueues.total > 0" class="mb-8 space-y-4">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide">
            ACTION REQUIRED {{ actionQueues.total }}
          </span>
          <h2 class="text-lg font-semibold text-[var(--royal-blue)]">
            Needs admin attention
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Needs scheduling / assignment -->
          <div
            v-if="actionQueues.needsSchedule.length"
            class="bg-white rounded-3xl p-5 shadow-sm border border-amber-100"
          >
            <p class="text-xs font-bold text-amber-700 tracking-wide mb-3">
              NEEDS SCHEDULE / AGENT
            </p>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <button
                v-for="item in actionQueues.needsSchedule"
                :key="item.id"
                type="button"
                class="w-full text-left p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-50 transition"
                @click="openDrawer(item)"
              >
                <p class="font-medium text-sm line-clamp-1">{{ item.property?.title || 'Inspection' }}</p>
                <p class="text-xs text-medium-gray mt-1">
                  {{ item.customer?.full_name || 'Customer' }} · {{ displayStatus(item.status) }}
                </p>
                <div class="flex gap-2 mt-2">
                  <span
                    class="text-[10px] px-2 py-1 rounded-full bg-white border font-semibold"
                    @click.stop="openSchedule(item)"
                  >
                    Schedule / Assign
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Agent declined -->
          <div
            v-if="actionQueues.declined.length"
            class="bg-white rounded-3xl p-5 shadow-sm border border-red-100"
          >
            <p class="text-xs font-bold text-red-700 tracking-wide mb-3">
              AGENT DECLINED
            </p>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <button
                v-for="item in actionQueues.declined"
                :key="item.id"
                type="button"
                class="w-full text-left p-3 rounded-2xl bg-red-50/50 hover:bg-red-50 transition"
                @click="openDrawer(item)"
              >
                <p class="font-medium text-sm line-clamp-1">{{ item.property?.title || 'Inspection' }}</p>
                <p class="text-xs text-medium-gray mt-1">
                  Agent: {{ item.agent?.full_name || '—' }}
                </p>
                <p class="text-xs text-red-700 mt-1 line-clamp-2">
                  {{ item.agent_decline_reason || 'No reason provided' }}
                </p>
                <span
                  class="inline-block mt-2 text-[10px] px-2 py-1 rounded-full bg-white border font-semibold"
                  @click.stop="openSchedule(item)"
                >
                  Reassign Agent
                </span>
              </button>
            </div>
          </div>

          <!-- Reschedule requested -->
          <div
            v-if="actionQueues.reschedule.length"
            class="bg-white rounded-3xl p-5 shadow-sm border border-indigo-100"
          >
            <p class="text-xs font-bold text-indigo-700 tracking-wide mb-3">
              RESCHEDULE REQUESTED
            </p>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <button
                v-for="item in actionQueues.reschedule"
                :key="item.id"
                type="button"
                class="w-full text-left p-3 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition"
                @click="openDrawer(item)"
              >
                <p class="font-medium text-sm line-clamp-1">{{ item.property?.title || 'Inspection' }}</p>
                <p class="text-xs text-medium-gray mt-1">
                  Current: {{ formatDate(item.inspection_date) }} · {{ item.inspection_time || '—' }}
                </p>
                <p class="text-xs text-indigo-700 mt-1">
                  Proposed: {{ formatDate(item.proposed_inspection_date) }} · {{ item.proposed_inspection_time || '—' }}
                </p>
                <p class="text-xs text-medium-gray mt-1 line-clamp-2">
                  {{ item.reschedule_reason || 'No reason' }}
                </p>
                <div class="flex gap-2 mt-2">
                  <span
                    class="text-[10px] px-2 py-1 rounded-full bg-green-600 text-white font-semibold"
                    @click.stop="approveReschedule(item)"
                  >
                    Approve
                  </span>
                  <span
                    class="text-[10px] px-2 py-1 rounded-full bg-white border font-semibold"
                    @click.stop="openReschedule(item)"
                  >
                    Adjust
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming -->
      <UpcomingInspections
        :inspections="upcomingInspections"
        class="mb-8"
        @view="openDrawer"
        @reschedule="openReschedule"
      />

      <!-- Search + Filters + View Switch -->
      <div class="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div class="lg:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search customer, property, inspection ID, agent..."
              class="w-full px-5 py-3.5 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            />
          </div>
          <select
            v-model="statusFilter"
            class="px-4 py-3.5 rounded-2xl border border-[var(--light-blue)]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="reschedule_requested">Reschedule Requested</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
            <option value="action">Action Required</option>
          </select>
          <select
            v-model="dateFilter"
            class="px-4 py-3.5 rounded-2xl border border-[var(--light-blue)]"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <div class="flex gap-2">
            <button
              type="button"
              @click="viewMode = 'list'"
              :class="[
                'flex-1 px-4 py-3.5 rounded-2xl text-sm font-medium transition',
                viewMode === 'list'
                  ? 'bg-[var(--royal-blue)] text-white'
                  : 'bg-gray-50 text-[var(--royal-blue)] border border-gray-200'
              ]"
            >
              List
            </button>
            <button
              type="button"
              @click="viewMode = 'calendar'"
              :class="[
                'flex-1 px-4 py-3.5 rounded-2xl text-sm font-medium transition',
                viewMode === 'calendar'
                  ? 'bg-[var(--royal-blue)] text-white'
                  : 'bg-gray-50 text-[var(--royal-blue)] border border-gray-200'
              ]"
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <InspectionTable
          :inspections="filteredInspections"
          :loading="loading"
          @view="openDrawer"
          @reschedule="openReschedule"
          @complete="openComplete"
          @cancel="openCancel"
          @schedule="openSchedule"
        />
      </div>

      <!-- Calendar View -->
      <div v-else>
        <InspectionCalendar
          :inspections="filteredInspections"
          @view="openDrawer"
          @day-click="openDayPopup"
        />
      </div>
    </div>

    <!-- Details Drawer -->
    <InspectionDetailsDrawer
      v-if="selectedInspection && !showScheduleModal && !showRescheduleModal && !showCompleteModal && !showCancelModal"
      :inspection="selectedInspection"
      @close="selectedInspection = null"
      @schedule="openSchedule"
      @reschedule="openReschedule"
      @complete="openComplete"
      @cancel="openCancel"
      @approve-reschedule="approveReschedule"
      @reassign="openSchedule"
    />

    <!-- Day Detail Popup -->
    <div
      v-if="showDayPopup"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        <div class="px-6 py-5 border-b flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-[var(--royal-blue)]">
              {{ selectedDayLabel }}
            </h3>
            <p class="text-sm text-medium-gray">
              {{ selectedDayEvents.length }} inspection(s)
            </p>
          </div>
          <button type="button" @click="showDayPopup = false" class="text-2xl text-gray-400">×</button>
        </div>
        <div class="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          <button
            v-for="event in selectedDayEvents"
            :key="event.id"
            type="button"
            @click="openFromDay(event)"
            class="w-full text-left p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-[var(--royal-blue)]">
                  {{ event.property?.title || 'Inspection' }}
                </p>
                <p class="text-sm text-medium-gray mt-1">
                  {{ event.customer?.full_name || 'Customer' }}
                </p>
                <p class="text-sm mt-1">
                  {{ event.inspection_time || '—' }} · {{ event.agent?.full_name || 'No agent' }}
                </p>
              </div>
              <InspectionStatusBadge :status="event.status" />
            </div>
          </button>
          <div v-if="selectedDayEvents.length === 0" class="text-center py-10 text-medium-gray">
            No inspections on this day.
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Modal -->
    <ScheduleInspectionModal
      v-if="showScheduleModal"
      :inspection="selectedInspection"
      :admin-profile="adminProfile"
      @close="closeScheduleModal"
      @scheduled="onScheduled"
    />

    <!-- Reschedule Modal -->
    <RescheduleInspectionModal
      v-if="showRescheduleModal && selectedInspection"
      :inspection="selectedInspection"
      @close="showRescheduleModal = false"
      @rescheduled="onRescheduled"
    />

    <!-- Complete Modal -->
    <CompleteInspectionModal
      v-if="showCompleteModal && selectedInspection"
      :inspection="selectedInspection"
      @close="showCompleteModal = false"
      @completed="onCompleted"
    />

    <!-- Cancel Modal -->
    <CancelInspectionModal
      v-if="showCancelModal && selectedInspection"
      :inspection="selectedInspection"
      @close="showCancelModal = false"
      @cancelled="onCancelled"
    />

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient'
import InspectionStats from '@/components/admin/inspections/InspectionStats.vue'
import UpcomingInspections from '@/components/admin/inspections/UpcomingInspections.vue'
import InspectionTable from '@/components/admin/inspections/InspectionTable.vue'
import InspectionCalendar from '@/components/admin/inspections/InspectionCalendar.vue'
import InspectionDetailsDrawer from '@/components/admin/inspections/InspectionDetailsDrawer.vue'
import InspectionStatusBadge from '@/components/admin/inspections/InspectionStatusBadge.vue'
import ScheduleInspectionModal from '@/components/admin/inspections/ScheduleInspectionModal.vue'
import RescheduleInspectionModal from '@/components/admin/inspections/RescheduleInspectionModal.vue'
import CompleteInspectionModal from '@/components/admin/inspections/CompleteInspectionModal.vue'
import CancelInspectionModal from '@/components/admin/inspections/CancelInspectionModal.vue'

const adminProfile = ref({ city: '', state: '', full_name: '' })
const inspections = ref([])
const stats = ref({
  total: 0,
  pending: 0,
  accepted: 0,
  scheduled: 0,
  confirmed: 0,
  reschedule_requested: 0,
  in_progress: 0,
  completed: 0,
  cancelled: 0,
  no_show: 0,
  declined: 0,
  action_required: 0
})

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const viewMode = ref('list')
const loading = ref(true)
const toast = ref(null)

const selectedInspection = ref(null)
const showScheduleModal = ref(false)
const showRescheduleModal = ref(false)
const showCompleteModal = ref(false)
const showCancelModal = ref(false)
const showDayPopup = ref(false)
const selectedDayEvents = ref([])
const selectedDayLabel = ref('')

let realtimeChannel = null

const showToast = (message, type = 'success') => {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3000)
}

const displayStatus = (status) => (status || '—').replace(/_/g, ' ')

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const isActionRequired = (i) => {
  if (['pending', 'declined', 'reschedule_requested'].includes(i.status)) return true
  // accepted but no schedule yet
  if (i.status === 'accepted' && !i.inspection_date) return true
  return false
}

const fetchAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('admin_profiles')
    .select('full_name, city, state')
    .eq('id', user.id)
    .single()

  if (data) adminProfile.value = data
}

const fetchInspections = async () => {
  loading.value = true
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      inspections.value = []
      return
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_profiles')
      .select('id, state, city, full_name')
      .eq('id', user.id)
      .single()

    if (adminError) throw adminError

    if (!admin?.state) {
      inspections.value = []
      return
    }

    adminProfile.value = admin

    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        customer:profiles!customer_id (
          id,
          full_name,
          email,
          phone,
          city,
          avatar_url
        ),
        property:properties (
          id,
          title,
          property_type,
          price,
          city,
          state,
          cover_image,
          bedrooms,
          bathrooms,
          address,
          area
        ),
        agent:profiles!agent_id (
          id,
          full_name,
          agency_name,
          phone,
          avatar_url,
          verified
        )
      `)
      .eq('state', admin.state)
      .order('inspection_date', {
        ascending: true,
        nullsFirst: false
      })

    if (error) throw error

    inspections.value = data || []
    calculateStats()

    // keep drawer in sync after refresh
    if (selectedInspection.value) {
      const updated = inspections.value.find(i => i.id === selectedInspection.value.id)
      selectedInspection.value = updated || null
    }
  } catch (err) {
    console.error('Failed to fetch inspections:', err)
    showToast(err.message || 'Failed to load inspections', 'error')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const list = inspections.value
  stats.value = {
    total: list.length,
    pending: list.filter(i => i.status === 'pending').length,
    accepted: list.filter(i => i.status === 'accepted').length,
    scheduled: list.filter(i => i.status === 'scheduled').length,
    confirmed: list.filter(i => i.status === 'confirmed').length,
    reschedule_requested: list.filter(i => i.status === 'reschedule_requested').length,
    in_progress: list.filter(i => i.status === 'in_progress').length,
    completed: list.filter(i => i.status === 'completed').length,
    cancelled: list.filter(i => i.status === 'cancelled').length,
    no_show: list.filter(i => i.status === 'no_show').length,
    declined: list.filter(i => i.status === 'declined').length,
    action_required: list.filter(isActionRequired).length
  }
}

const actionQueues = computed(() => {
  const needsSchedule = inspections.value.filter(i =>
    ['pending', 'accepted'].includes(i.status) ||
    (i.status === 'declined')
  ).filter(i => i.status !== 'declined' && (!i.agent_id || !i.inspection_date || i.status === 'pending' || i.status === 'accepted'))

  // cleaner split:
  const needsScheduleClean = inspections.value.filter(i =>
    i.status === 'pending' ||
    (i.status === 'accepted' && !i.inspection_date)
  )

  const declined = inspections.value.filter(i => i.status === 'declined')
  const reschedule = inspections.value.filter(i => i.status === 'reschedule_requested')

  return {
    needsSchedule: needsScheduleClean.slice(0, 8),
    declined: declined.slice(0, 8),
    reschedule: reschedule.slice(0, 8),
    total: needsScheduleClean.length + declined.length + reschedule.length
  }
})

const upcomingInspections = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return inspections.value
    .filter(i =>
      ['scheduled', 'confirmed', 'rescheduled', 'reschedule_requested', 'accepted'].includes(i.status) &&
      i.inspection_date &&
      new Date(i.inspection_date) >= today
    )
    .slice(0, 4)
})

const filteredInspections = computed(() => {
  let result = [...inspections.value]

  if (statusFilter.value === 'action') {
    result = result.filter(isActionRequired)
  } else if (statusFilter.value) {
    result = result.filter(i => i.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.customer?.full_name?.toLowerCase().includes(term) ||
      i.property?.title?.toLowerCase().includes(term) ||
      i.inspection_code?.toLowerCase().includes(term) ||
      i.customer?.phone?.includes(term) ||
      i.agent?.full_name?.toLowerCase().includes(term) ||
      i.city?.toLowerCase().includes(term)
    )
  }

  if (dateFilter.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    result = result.filter(i => {
      if (!i.inspection_date) return false
      const d = new Date(i.inspection_date)

      if (dateFilter.value === 'today') {
        return d.toDateString() === today.toDateString()
      }
      if (dateFilter.value === 'tomorrow') {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return d.toDateString() === tomorrow.toDateString()
      }
      if (dateFilter.value === 'week') {
        const week = new Date(today)
        week.setDate(week.getDate() + 7)
        return d >= today && d <= week
      }
      if (dateFilter.value === 'month') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
      }
      return true
    })
  }

  return result
})

const openDrawer = (inspection) => {
  selectedInspection.value = inspection
}

const openSchedule = (inspection = null) => {
  selectedInspection.value = inspection
  showScheduleModal.value = true
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
}

const openReschedule = (inspection) => {
  selectedInspection.value = inspection
  showRescheduleModal.value = true
}

const openComplete = (inspection) => {
  selectedInspection.value = inspection
  showCompleteModal.value = true
}

const openCancel = (inspection) => {
  selectedInspection.value = inspection
  showCancelModal.value = true
}

const openDayPopup = (payload) => {
  selectedDayLabel.value = payload.dateLabel
  selectedDayEvents.value = payload.events || []
  showDayPopup.value = true
}

const openFromDay = (event) => {
  showDayPopup.value = false
  openDrawer(event)
}

/** Approve agent reschedule request using proposed date/time */
const approveReschedule = async (inspection) => {
  if (!inspection?.id) return
  if (!inspection.proposed_inspection_date) {
    openReschedule(inspection)
    return
  }

  try {
    const { error } = await supabase
      .from('inspections')
      .update({
        status: 'scheduled',
        inspection_date: inspection.proposed_inspection_date,
        inspection_time: inspection.proposed_inspection_time,
        // clear request fields
        reschedule_requested_at: null,
        // keep reason in notes trail if useful
        admin_notes: [
          inspection.admin_notes,
          `Reschedule approved. Previous request: ${inspection.reschedule_reason || '—'}`
        ].filter(Boolean).join('\n'),
        proposed_inspection_date: null,
        proposed_inspection_time: null,
        reschedule_reason: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', inspection.id)

    if (error) throw error
    showToast('Reschedule approved. Inspection moved to scheduled.')
    await fetchInspections()
  } catch (err) {
    console.error(err)
    showToast(err.message || 'Failed to approve reschedule', 'error')
  }
}

const onScheduled = async () => {
  showScheduleModal.value = false
  selectedInspection.value = null
  await fetchInspections()
  showToast('Inspection scheduled / assigned')
}

const onRescheduled = async () => {
  showRescheduleModal.value = false
  await fetchInspections()
  showToast('Inspection rescheduled')
}

const onCompleted = async () => {
  showCompleteModal.value = false
  await fetchInspections()
  showToast('Inspection marked completed')
}

const onCancelled = async () => {
  showCancelModal.value = false
  await fetchInspections()
  showToast('Inspection cancelled')
}

const refreshAll = () => fetchInspections()

const setupRealtime = async () => {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel)
    realtimeChannel = null
  }

  const state = adminProfile.value?.state
  if (!state) return

  const channelName = `admin-inspections-${state.replace(/\s+/g, '-').toLowerCase()}`

  realtimeChannel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inspections'
      },
      async (payload) => {
        // Optional: only refresh when state matches admin
        const row = payload.new || payload.old
        if (row?.state && row.state !== adminProfile.value.state) return

        await fetchInspections()
      }
    )
    .subscribe((status) => {
      console.log('Admin inspection realtime:', status)
    })
}

onMounted(async () => {
  await fetchAdminProfile()
  await fetchInspections()
  await setupRealtime()
})

onUnmounted(async () => {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel)
    realtimeChannel = null
  }
})
</script>