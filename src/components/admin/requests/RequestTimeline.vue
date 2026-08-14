<template>
  <div class="space-y-5">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex gap-4"
    >
      <div class="flex flex-col items-center">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            step.completed
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-500'
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

      <div class="pb-6">
        <p class="font-medium text-[var(--royal-blue)]">{{ step.title }}</p>
        <p v-if="step.date" class="text-xs text-medium-gray mt-1">
          {{ formatDate(step.date) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const steps = computed(() => {
  const status = props.request.status
  const created = props.request.created_at
  const scheduled = props.request.scheduled_date
  const completed = props.request.completed_at

  return [
    {
      title: 'Request Submitted',
      completed: true,
      date: created
    },
    {
      title: 'Admin Received Request',
      completed: ['reviewing', 'approved', 'scheduled', 'completed'].includes(status),
      date: props.request.reviewed_at || null
    },
    {
      title: 'Agent Assigned',
      completed: !!props.request.agent_id,
      date: props.request.assigned_at || null
    },
    {
      title: 'Inspection Scheduled',
      completed: ['scheduled', 'completed'].includes(status),
      date: scheduled
    },
    {
      title: 'Customer Confirmed',
      completed: props.request.customer_confirmed || false,
      date: props.request.confirmed_at || null
    },
    {
      title: 'Inspection Completed',
      completed: status === 'completed',
      date: completed
    }
  ]
})

const formatDate = (date) => {
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