<template>
  <span 
    class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-2xl capitalize"
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
  const base = 'text-xs font-medium'

  switch (props.status?.toLowerCase()) {
    case 'pending':
      return `${base} bg-yellow-100 text-yellow-700`
    case 'under_review':
      return `${base} bg-blue-100 text-blue-700`
    case 'approved':
      return `${base} bg-green-100 text-green-700`
    case 'rejected':
      return `${base} bg-red-100 text-red-700`
    case 'more_information_required':
      return `${base} bg-orange-100 text-orange-700`
    case 'suspended':
      return `${base} bg-red-800 text-white`
    default:
      return `${base} bg-gray-100 text-gray-600`
  }
})

const displayStatus = computed(() => {
  const status = props.status?.toLowerCase()
  
  switch (status) {
    case 'pending':
      return 'Pending Review'
    case 'under_review':
      return 'Under Review'
    case 'more_information_required':
      return 'More Info Required'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'suspended':
      return 'Suspended'
    default:
      return props.status || 'Unknown'
  }
})
</script>