<template>
  <div class="bg-[var(--light-blue)] rounded-3xl p-6">
    <div class="text-center">
      <div class="text-sm text-medium-gray mb-3">
        {{ isExpired ? 'Inspection time has passed' : 'Inspection starts in' }}
      </div>

      <div class="grid grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-4xl md:text-5xl font-bold text-[var(--royal-blue)]">{{ days }}</div>
          <div class="text-xs text-medium-gray">DAYS</div>
        </div>
        <div>
          <div class="text-4xl md:text-5xl font-bold text-[var(--royal-blue)]">{{ hours }}</div>
          <div class="text-xs text-medium-gray">HOURS</div>
        </div>
        <div>
          <div class="text-4xl md:text-5xl font-bold text-[var(--royal-blue)]">{{ minutes }}</div>
          <div class="text-xs text-medium-gray">MINUTES</div>
        </div>
        <div>
          <div class="text-4xl md:text-5xl font-bold text-[var(--royal-blue)]">{{ seconds }}</div>
          <div class="text-xs text-medium-gray">SECONDS</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  },
  targetTime: {
    type: String,
    default: '10:00'
  }
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const isExpired = ref(false)

let timerInterval = null

const getTargetTimestamp = () => {
  if (!props.targetDate) return null

  // Normalize time: supports "10:00" or "10:00:00"
  let time = props.targetTime || '10:00'
  if (time.length === 5) time = `${time}:00`

  const target = new Date(`${props.targetDate}T${time}`)
  if (isNaN(target.getTime())) return null

  return target.getTime()
}

const updateCountdown = () => {
  const target = getTargetTimestamp()

  if (!target) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    isExpired.value = true
    return
  }

  const now = Date.now()
  const distance = target - now

  if (distance <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    isExpired.value = true

    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    return
  }

  isExpired.value = false
  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

const startCountdown = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
}

watch(
  () => [props.targetDate, props.targetTime],
  () => startCountdown(),
  { immediate: true }
)

onMounted(startCountdown)

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>