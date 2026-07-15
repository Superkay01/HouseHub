<template>
  <div class="bg-[var(--light-blue)] rounded-3xl p-6">
    <div class="text-center">
      <div class="text-sm text-medium-gray mb-3">Inspection starts in</div>
      <div class="grid grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-5xl font-bold text-[var(--royal-blue)]">{{ days }}</div>
          <div class="text-xs text-medium-gray">DAYS</div>
        </div>
        <div>
          <div class="text-5xl font-bold text-[var(--royal-blue)]">{{ hours }}</div>
          <div class="text-xs text-medium-gray">HOURS</div>
        </div>
        <div>
          <div class="text-5xl font-bold text-[var(--royal-blue)]">{{ minutes }}</div>
          <div class="text-xs text-medium-gray">MINUTES</div>
        </div>
        <div>
          <div class="text-5xl font-bold text-[var(--royal-blue)]">{{ seconds }}</div>
          <div class="text-xs text-medium-gray">SECONDS</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let timerInterval = null

const startCountdown = () => {
  const target = new Date(props.targetDate).getTime()

  timerInterval = setInterval(() => {
    const now = new Date().getTime()
    const distance = target - now

    if (distance < 0) {
      clearInterval(timerInterval)
      return
    }

    days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>