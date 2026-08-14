<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-white rounded-3xl p-5 shadow-sm border border-transparent hover:border-gray-100 transition"
    >
      <p class="text-sm text-medium-gray mb-2">{{ card.label }}</p>
      <p class="text-2xl font-bold text-[var(--royal-blue)]">{{ card.value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      pending: 0,
      approved: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0
    })
  }
})

const cards = computed(() => [
  { label: 'Total Requests', value: props.stats.total },
  { label: 'Pending', value: props.stats.pending },
  { label: 'Approved', value: props.stats.approved },
  { label: 'Scheduled', value: props.stats.scheduled },
  { label: 'Completed', value: props.stats.completed },
  { label: 'Cancelled', value: props.stats.cancelled }
])
</script>