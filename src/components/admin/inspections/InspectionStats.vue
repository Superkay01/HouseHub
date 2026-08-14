<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-white rounded-3xl p-5 shadow-sm"
    >
      <p class="text-sm text-medium-gray mb-1">{{ card.label }}</p>
      <p class="text-2xl font-bold text-[var(--royal-blue)]">{{ card.value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ stats: Object })
const cards = computed(() => [
  { label: 'Total', value: props.stats.total },
  { label: 'Pending', value: props.stats.pending },
  { label: 'Scheduled', value: props.stats.scheduled },
  { label: 'Confirmed', value: props.stats.confirmed },
  { label: 'Completed', value: props.stats.completed },
  { label: 'Cancelled', value: props.stats.cancelled }
])
</script>