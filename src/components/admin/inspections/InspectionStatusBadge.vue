<template>
  <span :class="['px-3 py-1.5 rounded-2xl text-xs font-medium capitalize', classes]">
    {{ status?.replace('_', ' ') }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: String })
const classes = computed(() => {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    rescheduled: 'bg-purple-100 text-purple-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-600'
  }
  return map[props.status] || 'bg-gray-100 text-gray-600'
})
</script>