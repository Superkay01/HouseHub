<template>
  <div class="bg-white rounded-3xl shadow-xl p-8 mb-12">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h3 class="text-2xl font-semibold text-dark-gray">Upcoming Inspection</h3>
        <p class="text-medium-gray">Next inspection is in</p>
      </div>
      <div class="text-right">
        <div class="text-sm text-medium-gray">Inspection ID</div>
        <div class="font-mono text-lg text-[var(--royal-blue)]">INS-{{ inspection.id?.slice(0,8) }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Property -->
      <div class="lg:col-span-7">
        <div class="relative rounded-3xl overflow-hidden h-[380px]">
          <img 
            :src="inspection.properties?.cover_image" 
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Details -->
      <div class="lg:col-span-5 space-y-8">
        <div>
          <h4 class="text-3xl font-bold">{{ inspection.properties?.title }}</h4>
          <p class="text-medium-gray">📍 {{ inspection.properties?.area }}, {{ inspection.properties?.city }}</p>
        </div>

        <!-- Countdown Timer -->
        <div class="bg-[var(--light-blue)] rounded-3xl p-6">
          <div class="text-center">
            <div class="text-sm text-medium-gray mb-2">Inspection starts in</div>
            <div class="grid grid-cols-4 gap-4 text-center">
              <div>
                <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.days }}</div>
                <div class="text-xs text-medium-gray">DAYS</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.hours }}</div>
                <div class="text-xs text-medium-gray">HOURS</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.minutes }}</div>
                <div class="text-xs text-medium-gray">MINUTES</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[var(--royal-blue)]">{{ countdown.seconds }}</div>
                <div class="text-xs text-medium-gray">SECONDS</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div>
            <div class="text-5xl font-bold text-[var(--royal-blue)]">{{ inspectionDate }}</div>
            <div class="text-sm text-medium-gray">{{ inspectionDay }}</div>
          </div>
          <div>
            <div class="text-3xl font-medium">{{ inspectionTime }}</div>
            <div class="text-medium-gray">{{ inspectionWeekday }}</div>
          </div>
        </div>

        <div class="flex gap-4">
          <button class="flex-1 py-4 bg-[var(--royal-blue)] text-white rounded-3xl font-medium">
            Add to Calendar
          </button>
          <button class="flex-1 py-4 border border-gray-300 rounded-3xl font-medium">
            View Directions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

const inspectionDate = ref('')
const inspectionDay = ref('')
const inspectionTime = ref('')
const inspectionWeekday = ref('')

const startCountdown = (targetDate) => {
  if (!targetDate) return

  const target = new Date(targetDate).getTime()

  timerInterval = setInterval(() => {
    const now = new Date().getTime()
    const distance = target - now

    if (distance < 0) {
      clearInterval(timerInterval)
      return
    }

    countdown.value.days = Math.floor(distance / (1000 * 60 * 60 * 24))
    countdown.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    countdown.value.seconds = Math.floor((distance % (1000 * 60)) / 1000)
  }, 1000)
}

onMounted(() => {
  if (props.inspection?.inspection_date) {
    const date = new Date(props.inspection.inspection_date)
    inspectionDate.value = date.getDate()
    inspectionDay.value = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear()
    inspectionTime.value = props.inspection.inspection_time || '10:00 AM'
    inspectionWeekday.value = date.toLocaleString('default', { weekday: 'long' })

    startCountdown(props.inspection.inspection_date)
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>