<template>
  <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-white rounded-3xl p-5 shadow-sm"
    >
      <p class="text-sm text-medium-gray mb-1">{{ card.label }}</p>
      <p class="text-2xl font-bold" :class="card.color || 'text-[var(--royal-blue)]'">
        {{ card.value ?? 0 }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ stats: { type: Object, default: () => ({}) } })

const cards = computed(() => [
  { label: 'Total', value: props.stats.total },
  { label: 'Action Required', value: props.stats.action_required, color: 'text-red-600' },
  { label: 'Pending', value: props.stats.pending },
  { label: 'Scheduled', value: props.stats.scheduled },
  { label: 'Confirmed', value: props.stats.confirmed },
  { label: 'In Progress', value: props.stats.in_progress },
  { label: 'Completed', value: props.stats.completed },
  { label: 'Cancelled / No-show', value: (props.stats.cancelled || 0) + (props.stats.no_show || 0) }
])
</script>