<template>
  <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
      <div>
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">Upcoming Inspection</h3>
          <span
            class="text-xs px-3 py-1 rounded-full font-semibold capitalize"
            :class="statusClass"
          >
            {{ displayStatus }}
          </span>
          <span
            v-if="actionBadge"
            class="text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide"
            :class="actionBadgeClass"
          >
            {{ actionBadge }}
          </span>
        </div>
        <p class="text-medium-gray mt-1">{{ statusHelperText }}</p>
      </div>
      <div class="text-left sm:text-right">
        <div class="text-sm text-medium-gray">Inspection ID</div>
        <div class="font-mono text-lg text-[var(--royal-blue)]">
          {{ inspection.inspection_code || `INS-${inspection.id?.slice(0, 8)}` }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Property Image -->
      <div class="lg:col-span-7">
        <div class="relative rounded-3xl overflow-hidden h-[320px] md:h-[380px]">
          <img
            :src="inspection.property?.cover_image || 'https://via.placeholder.com/800x500?text=No+Image'"
            class="w-full h-full object-cover"
            alt="Property"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="lg:col-span-5 space-y-6">
        <div>
          <h4 class="text-2xl md:text-3xl font-bold text-[var(--royal-blue)]">
            {{ inspection.property?.title || 'Property' }}
          </h4>
          <p class="text-medium-gray mt-2">
            📍
            {{ inspection.property?.area || inspection.property?.city || 'Location' }},
            {{ inspection.property?.city || inspection.property?.state || '' }}
          </p>
          <p class="text-sm text-[var(--royal-blue)] font-semibold mt-2">
            ₦{{ Number(inspection.property?.price || 0).toLocaleString() }}
          </p>
        </div>

        <!-- Countdown -->
        <div class="bg-[var(--light-blue)] rounded-3xl p-5">
          <div class="text-center">
            <div class="text-sm text-medium-gray mb-3">{{ countdownLabel }}</div>
            <div class="grid grid-cols-4 gap-3 text-center">
              <div>
                <div class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.days }}</div>
                <div class="text-xs text-medium-gray">DAYS</div>
              </div>
              <div>
                <div class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.hours }}</div>
                <div class="text-xs text-medium-gray">HOURS</div>
              </div>
              <div>
                <div class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.minutes }}</div>
                <div class="text-xs text-medium-gray">MINUTES</div>
              </div>
              <div>
                <div class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.seconds }}</div>
                <div class="text-xs text-medium-gray">SECONDS</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date / Time -->
        <div class="flex items-center gap-6">
          <div>
            <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ displayDay }}</div>
            <div class="text-sm text-medium-gray">{{ displayMonthYear }}</div>
          </div>
          <div>
            <div class="text-2xl font-medium text-[var(--royal-blue)]">{{ displayTime }}</div>
            <div class="text-medium-gray">{{ displayWeekday }}</div>
          </div>
        </div>

        <!-- Confirmations -->
        <div class="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          <div class="flex justify-between gap-3">
            <span class="text-medium-gray">Your confirmation</span>
            <span class="font-medium">{{ customerConfirmationLabel }}</span>
          </div>
          <div class="flex justify-between gap-3">
            <span class="text-medium-gray">Agent</span>
            <span class="font-medium">
              {{ inspection.agent?.full_name || 'To be assigned' }}
            </span>
          </div>
          <div v-if="inspection.agent?.agency_name" class="flex justify-between gap-3">
            <span class="text-medium-gray">Agency</span>
            <span class="font-medium">{{ inspection.agent.agency_name }}</span>
          </div>
          <div v-if="inspection.meeting_location" class="flex justify-between gap-3">
            <span class="text-medium-gray">Meeting point</span>
            <span class="font-medium text-right">{{ inspection.meeting_location }}</span>
          </div>
        </div>

        <!-- Primary workflow actions -->
        <div class="flex flex-col gap-3">
          <button
            v-if="needsCustomerConfirm"
            type="button"
            class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[var(--medium-blue)] transition"
            @click="emit('confirm', inspection)"
          >
            Confirm Attendance
          </button>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- <button
              type="button"
              class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)] transition"
              :class="needsCustomerConfirm ? 'sm:bg-white sm:text-[var(--royal-blue)] sm:border sm:border-[var(--royal-blue)]' : ''"
              @click="addToCalendar"
            >
              Add to Calendar
            </button> -->
            <!-- <button
              type="button"
              class="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
              @click="viewDirections"
            >
              View Directions
            </button> -->
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              class="flex-1 py-3 border rounded-2xl font-medium hover:bg-gray-50 transition"
              @click="emit('view', inspection)"
            >
              View Details
            </button>
            <button
              v-if="canCancel"
              type="button"
              class="flex-1 py-3 bg-red-50 text-red-700 rounded-2xl font-medium hover:bg-red-100 transition"
              @click="emit('cancel', inspection)"
            >
              Cancel Inspection
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  inspection: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'view', 'updated'])

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let timerInterval = null

const targetDateTime = computed(() => {
  if (!props.inspection?.inspection_date) return null

  const datePart = props.inspection.inspection_date
  const timePart = props.inspection.inspection_time || '10:00'
  const normalizedTime = timePart.length === 5 ? `${timePart}:00` : timePart
  const dt = new Date(`${datePart}T${normalizedTime}`)
  return isNaN(dt.getTime()) ? null : dt
})

const displayDay = computed(() => {
  if (!targetDateTime.value) return '—'
  return targetDateTime.value.getDate()
})

const displayMonthYear = computed(() => {
  if (!targetDateTime.value) return ''
  return targetDateTime.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const displayWeekday = computed(() => {
  if (!targetDateTime.value) return ''
  return targetDateTime.value.toLocaleDateString('en-US', {
    weekday: 'long'
  })
})

const displayTime = computed(() => {
  return props.inspection?.inspection_time || 'Time TBA'
})

const displayStatus = computed(() =>
  (props.inspection?.status || 'scheduled').replace(/_/g, ' ')
)

const statusClass = computed(() => {
  const map = {
    pending: 'bg-blue-100 text-blue-700',
    accepted: 'bg-cyan-100 text-cyan-700',
    scheduled: 'bg-purple-100 text-purple-700',
    confirmed: 'bg-green-100 text-green-700',
    reschedule_requested: 'bg-indigo-100 text-indigo-700',
    rescheduled: 'bg-indigo-100 text-indigo-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-700'
  }
  return map[props.inspection?.status] || 'bg-gray-100 text-gray-600'
})

const needsCustomerConfirm = computed(() => {
  const i = props.inspection
  if (!['scheduled', 'confirmed'].includes(i?.status)) return false
  return !i.customer_confirmed_at && i.customer_confirmation_status !== 'confirmed'
})

const canCancel = computed(() =>
  !['completed', 'cancelled', 'no_show', 'in_progress', 'declined'].includes(
    props.inspection?.status
  )
)

const actionBadge = computed(() => {
  if (needsCustomerConfirm.value) return 'CONFIRM ATTENDANCE'
  if (props.inspection?.status === 'confirmed') return 'CONFIRMED'
  if (props.inspection?.status === 'reschedule_requested') return 'RESCHEDULE PENDING'
  return ''
})

const actionBadgeClass = computed(() => {
  if (needsCustomerConfirm.value) return 'bg-red-100 text-red-700'
  if (props.inspection?.status === 'confirmed') return 'bg-green-100 text-green-700'
  return 'bg-indigo-100 text-indigo-700'
})

const customerConfirmationLabel = computed(() => {
  const i = props.inspection
  if (i?.customer_confirmation_status === 'confirmed' || i?.customer_confirmed_at) {
    return '✓ You confirmed'
  }
  if (i?.customer_confirmation_status === 'cancelled') return '✕ Cancelled'
  return '⏳ Awaiting your confirmation'
})

const statusHelperText = computed(() => {
  if (needsCustomerConfirm.value) {
    return 'Please confirm that you can attend this inspection.'
  }
  switch (props.inspection?.status) {
    case 'accepted':
      return 'An agent accepted your request. Final schedule details are being set.'
    case 'scheduled':
      return 'Your inspection is scheduled. Add it to your calendar and arrive on time.'
    case 'confirmed':
      return 'You’re all set. Meet the agent at the property on the scheduled date.'
    case 'reschedule_requested':
    case 'rescheduled':
      return 'A new time has been requested. We’ll update you when it’s confirmed.'
    default:
      return 'Your next scheduled property visit'
  }
})

const countdownLabel = computed(() => {
  const totalSeconds =
    countdown.value.days * 86400 +
    countdown.value.hours * 3600 +
    countdown.value.minutes * 60 +
    countdown.value.seconds

  if (totalSeconds <= 0) return 'Inspection time reached'
  if (countdown.value.days === 0 && countdown.value.hours < 3) return 'Starting soon'
  if (countdown.value.days === 0) return 'Inspection today — starts in'
  return 'Inspection starts in'
})

const fullAddress = computed(() =>
  [
    props.inspection?.property?.address,
    props.inspection?.property?.area,
    props.inspection?.property?.city,
    props.inspection?.property?.state
  ]
    .filter(Boolean)
    .join(', ')
)

const startCountdown = () => {
  if (timerInterval) clearInterval(timerInterval)
  if (!targetDateTime.value) return

  const tick = () => {
    const distance = targetDateTime.value.getTime() - Date.now()

    if (distance <= 0) {
      countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      clearInterval(timerInterval)
      return
    }

    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  }

  tick()
  timerInterval = setInterval(tick, 1000)
}

const addToCalendar = () => {
  if (!targetDateTime.value) {
    alert('Inspection date is not available yet')
    return
  }

  const start = targetDateTime.value
  const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 hour

  const formatICS = (d) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const title = `Property Inspection: ${props.inspection?.property?.title || 'LodgeNext'}`
  const description = [
    `Inspection ID: ${props.inspection?.inspection_code || props.inspection?.id}`,
    `Agent: ${props.inspection?.agent?.full_name || 'TBA'}`,
    `Status: ${displayStatus.value}`
  ].join('\\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LodgeNext//Inspections//EN',
    'BEGIN:VEVENT',
    `UID:${props.inspection?.id || Date.now()}@lodgenext`,
    `DTSTAMP:${formatICS(new Date())}`,
    `DTSTART:${formatICS(start)}`,
    `DTEND:${formatICS(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${fullAddress.value || ''}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inspection-${props.inspection?.inspection_code || 'lodgenext'}.ics`
  link.click()
  URL.revokeObjectURL(url)
}

const viewDirections = () => {
  const location = fullAddress.value ||
    [
      props.inspection?.property?.area,
      props.inspection?.property?.city,
      props.inspection?.property?.state
    ]
      .filter(Boolean)
      .join(', ')

  if (!location) {
    alert('Location not available')
    return
  }

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
    '_blank'
  )
}

watch(() => props.inspection, startCountdown, { immediate: true, deep: true })

onMounted(startCountdown)

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>