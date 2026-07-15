<template>
  <div class="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden cursor-pointer" 
       @click="viewRequest">
    <!-- Status Badge -->
    <div class="px-6 py-4 border-b flex items-center justify-between">
      <RequestStatusBadge :status="request.status" />
      <div class="text-xs text-medium-gray">
        {{ formatDate(request.created_at) }}
      </div>
    </div>

    <div class="p-6">
      <!-- Property Info -->
      <div class="flex gap-4">
        <img 
          :src="request.properties.cover_image || 'https://via.placeholder.com/80x80?text=No+Image'" 
          class="w-20 h-20 rounded-2xl object-cover"
        />
        <div class="flex-1">
          <h4 class="font-semibold md:text-lg text-[15px] leading-tight">{{ request.properties.title }}</h4>
          <p class="text-[var(--royal-blue)] text-sm mt-1">📍 {{ request.properties.area }}, {{ request.properties.city }}</p>
          <p class="text-sm text-[var(--royal-blue)] mt-2 font-medium">
            ₦{{ Number(request.properties.price).toLocaleString() }} / year
          </p>
        </div>
      </div>

      <!-- Request Info -->
      <div class="mt-6 pt-6 border-t">
        <div class="flex justify-between text-sm">
          <div>
            <span class="text-[var(--periwinkle)]">Request ID</span><br>
            <span class="font-mono text-[var(--royal-blue)]">{{ request.id.slice(0,8) }}</span>
          </div>
          <div class="text-right">
            <span class="text-[var(--periwinkle)]">Type</span><br>
            <span class="capitalize text-[var(--royal-blue)]">{{ request.request_type }}</span>
          </div>
        </div>
      </div>

      <!-- Inspection Info with Conditional Countdown -->
      <div v-if="request.inspection_date" class="mt-6 bg-[var(--light-blue)] rounded-2xl p-5">
        <div class="flex items-center gap-3 mb-4">
          <Calendar class="w-5 h-5 text-[var(--royal-blue)]" />
          <div>
            <div class="font-medium text-[var(--royal-blue)]">{{ formatDate(request.inspection_date) }}</div>
            <div class="text-[var(--royal-blue)] text-sm">{{ request.inspection_time || 'Time TBA' }}</div>
          </div>
        </div>

        <!-- Countdown - Only show if admin has approved -->
        <div v-if="isInspectionConfirmed && timeLeft" class="bg-white rounded-xl p-4 text-center">
          <div class="text-xs text-medium-gray mb-1">Time Remaining Until Inspection</div>
          <div class="text-2xl font-mono font-semibold text-[var(--royal-blue)] tracking-wider">
            {{ timeLeft.days }}d : {{ timeLeft.hours }}h : {{ timeLeft.minutes }}m : {{ timeLeft.seconds }}s
          </div>
        </div>

        <div v-else-if="request.inspection_date" class="text-center text-sm text-amber-600 bg-white rounded-xl p-3">
          Awaiting admin confirmation for inspection date
        </div>
      </div>

      <!-- Admin Note -->
      <div v-if="request.admin_note" class="mt-6 bg-[var(--royal-blue)] rounded-2xl p-4 text-sm text-white">
        "{{ request.admin_note }}"
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t flex items-center gap-3">
      <div class="flex-1">
        <div class="text-xs text-[var(--royal-blue)]">Admin</div>
        <div class="text-sm font-medium text-[var(--royal-blue)]">{{ request.admin_name || 'State Admin' }}</div>
      </div>
      <button class="text-xs bg-[var(--royal-blue)] text-white px-5 py-2 rounded-2xl hover:bg-[var(--mediumBlue)] transition flex items-center gap-1">
        <Eye class="w-4 h-4" />
        View Details
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'   // ← Added computed
import RequestStatusBadge from './RequestStatusBadge.vue'
import { Calendar, Eye } from 'lucide-vue-next'

const props = defineProps({
  request: { type: Object, required: true }
})

const emit = defineEmits(['view'])

const timeLeft = ref(null)
let timerInterval = null

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

// Check if inspection is confirmed by admin
const isInspectionConfirmed = computed(() => {
  return ['approved', 'confirmed', 'scheduled'].includes(props.request.status?.toLowerCase())
})

const calculateTimeLeft = () => {
  if (!props.request.inspection_date || !isInspectionConfirmed.value) return null

  const inspectionDateTime = new Date(props.request.inspection_date)
  
  if (props.request.inspection_time) {
    const [hours, minutes] = props.request.inspection_time.split(':').map(Number)
    inspectionDateTime.setHours(hours, minutes || 0)
  }

  const now = new Date()
  const diff = inspectionDateTime - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false
  }
}

const startCountdown = () => {
  if (!props.request.inspection_date || !isInspectionConfirmed.value) return

  timerInterval = setInterval(() => {
    timeLeft.value = calculateTimeLeft()
  }, 1000)
}

const viewRequest = () => {
  emit('view', props.request.id)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>