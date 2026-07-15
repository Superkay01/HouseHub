<template>
  <div 
    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-sm font-medium"
    :class="statusClasses"
  >
    <span class="w-2 h-2 rounded-full" :class="dotClass"></span>
    {{ displayStatus }}
  </div>
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
  const base = 'capitalize'
  
  switch (props.status?.toLowerCase()) {
    case 'pending':
      return `${base} bg-amber-100 text-amber-700 border border-amber-200`
    case 'approved':
    case 'confirmed':
      return `${base} bg-green-100 text-green-700 border border-green-200`
    case 'rejected':
      return `${base} bg-red-100 text-red-700 border border-red-200`
    case 'completed':
      return `${base} bg-blue-100 text-blue-700 border border-blue-200`
    default:
      return `${base} bg-gray-100 text-gray-600 border border-gray-200`
  }
})

const dotClass = computed(() => {
  switch (props.status?.toLowerCase()) {
    case 'pending':
      return 'bg-amber-500 animate-pulse'
    case 'approved':
    case 'confirmed':
      return 'bg-green-500'
    case 'rejected':
      return 'bg-red-500'
    case 'completed':
      return 'bg-blue-500'
    default:
      return 'bg-gray-400'
  }
})

const displayStatus = computed(() => {
  if (!props.status) return 'Unknown'
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>