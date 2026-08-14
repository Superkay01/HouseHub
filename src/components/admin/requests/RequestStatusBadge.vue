<template>
  <span
    :class="[
      'px-3 py-1.5 rounded-2xl text-xs font-medium capitalize',
      statusClasses
    ]"
  >
    {{ status || 'pending' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'pending'
  }
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'reviewing':
      return 'bg-blue-100 text-blue-700'
    case 'approved':
      return 'bg-indigo-100 text-indigo-700'
    case 'scheduled':
      return 'bg-purple-100 text-purple-700'
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'cancelled':
      return 'bg-gray-100 text-gray-600'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
})
</script>