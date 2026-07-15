<template>
  <span 
    class="inline-flex items-center px-4 py-1.5 text-xs font-medium rounded-2xl"
    :class="statusClasses"
  >
    {{ displayStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'under_review':
      return 'bg-blue-100 text-blue-700'
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'inspection_scheduled':
      return 'bg-purple-100 text-purple-700'
    case 'confirmed':
      return 'bg-teal-100 text-teal-700'
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    case 'cancelled':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const displayStatus = computed(() => {
  return props.status
    .replace('_', ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
})
</script>