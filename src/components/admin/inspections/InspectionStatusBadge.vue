<template>
  <span :class="['px-3 py-1.5 rounded-2xl text-xs font-medium capitalize', classes]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ status: String })

const label = computed(() => (props.status || '—').replace(/_/g, ' '))

const classes = computed(() => {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-cyan-100 text-cyan-700',
    declined: 'bg-orange-100 text-orange-700',
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    rescheduled: 'bg-purple-100 text-purple-700',
    reschedule_requested: 'bg-indigo-100 text-indigo-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-600'
  }
  return map[props.status] || 'bg-gray-100 text-gray-600'
})
</script>