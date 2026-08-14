<template>
  <div class="space-y-5">
    <div v-for="(step, index) in steps" :key="index" class="flex gap-4">
      <div class="flex flex-col items-center">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
          ]"
        >
          {{ step.completed ? '✓' : index + 1 }}
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-0.5 flex-1 mt-1"
          :class="step.completed ? 'bg-green-400' : 'bg-gray-200'"
        ></div>
      </div>

      <div class="pb-5">
        <p class="font-medium text-[var(--royal-blue)]">{{ step.title }}</p>
        <p v-if="step.date" class="text-xs text-medium-gray mt-1">
          {{ formatDateTime(step.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  inspection: { type: Object, required: true }
})

const steps = computed(() => {
  const i = props.inspection
  return [
    { title: 'Inspection Requested', completed: true, date: i.created_at },
    { title: 'Request Reviewed', completed: !!i.admin_id, date: i.scheduled_at },
    { title: 'Agent Assigned', completed: !!i.agent_id, date: i.scheduled_at },
    { title: 'Inspection Scheduled', completed: ['scheduled', 'confirmed', 'rescheduled', 'completed'].includes(i.status), date: i.scheduled_at },
    { title: 'Customer Confirmed', completed: i.status === 'confirmed' || i.status === 'completed', date: i.confirmed_at },
    { title: 'Inspection Completed', completed: i.status === 'completed', date: i.completed_at }
  ]
})

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>