<template>
  <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">Upcoming Inspection</h3>
        <p class="text-medium-gray mt-1">Your next scheduled property visit</p>
      </div>
      <div class="text-right">
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
            <div class="text-sm text-medium-gray mb-3">Inspection starts in</div>
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

        <!-- Agent -->
        <div v-if="inspection.agent" class="bg-gray-50 rounded-2xl p-4">
          <p class="text-sm text-medium-gray mb-1">Assigned Agent</p>
          <p class="font-medium text-[var(--royal-blue)]">
            {{ inspection.agent.full_name }}
          </p>
          <p class="text-sm text-medium-gray">
            {{ inspection.agent.agency_name || 'Independent' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)] transition"
            @click="addToCalendar"
          >
            Add to Calendar
          </button>
          <button
            class="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
            @click="viewDirections"
          >
            View Directions
          </button>
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

  // Supports "10:00" or "10:00:00"
  const normalizedTime = timePart.length === 5 ? `${timePart}:00` : timePart
  return new Date(`${datePart}T${normalizedTime}`)
})

const displayDay = computed(() => {
  if (!targetDateTime.value || isNaN(targetDateTime.value)) return '—'
  return targetDateTime.value.getDate()
})

const displayMonthYear = computed(() => {
  if (!targetDateTime.value || isNaN(targetDateTime.value)) return ''
  return targetDateTime.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const displayWeekday = computed(() => {
  if (!targetDateTime.value || isNaN(targetDateTime.value)) return ''
  return targetDateTime.value.toLocaleDateString('en-US', {
    weekday: 'long'
  })
})

const displayTime = computed(() => {
  return props.inspection?.inspection_time || 'Time TBA'
})

const startCountdown = () => {
  if (timerInterval) clearInterval(timerInterval)
  if (!targetDateTime.value || isNaN(targetDateTime.value)) return

  const tick = () => {
    const now = Date.now()
    const distance = targetDateTime.value.getTime() - now

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
  // Simple placeholder action
  alert('Calendar download coming soon')
}

const viewDirections = () => {
  const location = [
    props.inspection?.property?.area,
    props.inspection?.property?.city,
    props.inspection?.property?.state
  ].filter(Boolean).join(', ')

  if (!location) {
    alert('Location not available')
    return
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank')
}

watch(() => props.inspection, startCountdown, { immediate: true, deep: true })

onMounted(startCountdown)

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>