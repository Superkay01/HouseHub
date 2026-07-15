<template>
  <div class="space-y-6">
    <div v-for="(step, index) in timelineSteps" 
         :key="index" 
         class="flex gap-4">
      <!-- Circle -->
      <div class="flex-shrink-0">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
          :class="{
            'bg-green-100 border-green-600 text-green-600': step.completed,
            'bg-white border-gray-300 text-gray-400': !step.completed
          }"
        >
          <span v-if="step.completed" class="text-xl">✓</span>
          <span v-else class="text-sm">{{ index + 1 }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 pt-1">
        <div class="flex justify-between">
          <div>
            <p class="font-medium text-dark-gray">{{ step.title }}</p>
            <p v-if="step.date" class="text-xs text-medium-gray">{{ step.date }}</p>
          </div>
          <div v-if="step.completed" class="text-green-600 text-xs font-medium">Completed</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const timelineSteps = computed(() => [
  {
    title: "Request Submitted",
    completed: true,
    date: "Submitted on " + new Date().toLocaleDateString()
  },
  {
    title: "Under Review",
    completed: ['under_review', 'approved', 'inspection_scheduled', 'completed'].includes(props.status)
  },
  {
    title: "Approved",
    completed: ['approved', 'inspection_scheduled', 'completed'].includes(props.status)
  },
  {
    title: "Inspection Scheduled",
    completed: ['inspection_scheduled', 'completed'].includes(props.status)
  },
  {
    title: "Completed",
    completed: props.status === 'completed'
  }
])
</script>