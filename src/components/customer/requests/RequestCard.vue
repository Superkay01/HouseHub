<template>
  <div class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden cursor-pointer" 
       @click="viewRequest">
    <!-- Status Badge -->
    <div class="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 border-b flex items-center justify-between gap-2">
      <RequestStatusBadge :status="request.status" />
      <div class="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
        {{ formatDate(request.created_at) }}
      </div>
    </div>

    <div class="p-3 sm:p-4 md:p-5 lg:p-6">
      <!-- Property Info -->
      <div class="flex gap-2 sm:gap-3 md:gap-4">
        <img 
          :src="request.properties.cover_image || 'https://via.placeholder.com/80x80?text=No+Image'" 
          class="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl md:rounded-2xl object-cover flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm sm:text-base md:text-lg leading-tight line-clamp-2">{{ request.properties.title }}</h4>
          <p class="text-[var(--royal-blue)] text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-1">📍 {{ request.properties.area }}, {{ request.properties.city }}</p>
          <p class="text-xs sm:text-sm text-[var(--royal-blue)] mt-1 sm:mt-2 font-medium">
            ₦{{ Number(request.properties.price).toLocaleString() }} / year
          </p>
        </div>
      </div>

      <!-- Request Info -->
      <div class="mt-3 sm:mt-4 md:mt-5 lg:mt-6 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t">
        <div class="flex justify-between gap-2 text-xs sm:text-sm">
          <div>
            <span class="text-[var(--periwinkle)] text-[10px] sm:text-xs">Request ID</span><br>
            <span class="font-mono text-[var(--royal-blue)] text-[11px] sm:text-xs md:text-sm">{{ request.id.slice(0,8) }}</span>
          </div>
          <div class="text-right">
            <span class="text-[var(--periwinkle)] text-[10px] sm:text-xs">Type</span><br>
            <span class="capitalize text-[var(--royal-blue)] text-[11px] sm:text-xs md:text-sm">{{ request.request_type }}</span>
          </div>
        </div>
      </div>

      <!-- Inspection Info with Conditional Countdown -->
      <div v-if="request.inspection_date" class="mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-[var(--light-blue)] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5">
        <div class="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2 sm:mb-3 md:mb-4">
          <Calendar class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[var(--royal-blue)] flex-shrink-0" />
          <div class="min-w-0">
            <div class="font-medium text-[var(--royal-blue)] text-xs sm:text-sm md:text-base">{{ formatDate(request.inspection_date) }}</div>
            <div class="text-[var(--royal-blue)] text-[10px] sm:text-xs md:text-sm">{{ request.inspection_time || 'Time TBA' }}</div>
          </div>
        </div>

        <!-- Countdown - Only show if admin has approved -->
        <div v-if="isInspectionConfirmed && timeLeft" class="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div class="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Time Remaining Until Inspection</div>
          <div class="text-xs sm:text-base md:text-xl lg:text-2xl font-mono font-semibold text-[var(--royal-blue)] tracking-wider whitespace-nowrap">
            {{ timeLeft.days }}d : {{ timeLeft.hours }}h : {{ timeLeft.minutes }}m : {{ timeLeft.seconds }}s
          </div>
        </div>

        <div v-else-if="request.inspection_date" class="text-center text-[10px] sm:text-xs md:text-sm text-amber-600 bg-white rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3">
          Awaiting admin confirmation for inspection date
        </div>
      </div>

      <!-- Admin Note -->
      <div v-if="request.admin_note" class="mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-[var(--royal-blue)] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 text-xs sm:text-sm text-white">
        "{{ request.admin_note }}"
      </div>
    </div>

    <!-- Footer -->
    <div class="px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 md:py-4 bg-gray-50 border-t flex items-center gap-2 sm:gap-3">
      <div class="flex-1 min-w-0">
        <div class="text-[10px] sm:text-xs text-[var(--royal-blue)]">Admin</div>
        <div class="text-xs sm:text-sm font-medium text-[var(--royal-blue)] truncate">{{ request.admin_name || 'State Admin' }}</div>
      </div>
      <button 
        type="button"
        @click.stop="viewRequest"
        class="text-[10px] sm:text-xs bg-[var(--royal-blue)] text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-[var(--mediumBlue)] transition flex items-center gap-1 whitespace-nowrap flex-shrink-0">
        <Eye class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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