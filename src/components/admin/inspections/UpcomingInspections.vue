<template>
  <div v-if="inspections.length" class="bg-white rounded-3xl p-6 shadow-sm">
    <h3 class="text-lg font-semibold text-[var(--royal-blue)] mb-5">
      Upcoming Inspections
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="item in inspections"
        :key="item.id"
        class="border border-gray-100 rounded-3xl p-4 hover:shadow-md transition"
      >
        <img
          :src="item.property?.cover_image || 'https://via.placeholder.com/300x160'"
          class="w-full h-28 object-cover rounded-2xl mb-3"
        />

        <p class="font-semibold text-[var(--royal-blue)] line-clamp-1">
          {{ item.property?.title || 'Property' }}
        </p>
        <p class="text-xs text-medium-gray mt-1">
          📍 {{ item.city }}, {{ item.state }}
        </p>

        <div class="mt-3 text-sm space-y-1">
          <p><span class="text-medium-gray">Customer:</span> {{ item.customer?.full_name }}</p>
          <p>
            <span class="text-medium-gray">Date:</span>
            {{ formatDate(item.inspection_date) }} • {{ item.inspection_time || '—' }}
          </p>
          <p><span class="text-medium-gray">Agent:</span> {{ item.agent?.full_name || '—' }}</p>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <InspectionStatusBadge :status="item.status" />
          <button
            @click="$emit('view', item)"
            class="text-sm text-[var(--royal-blue)] hover:underline"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InspectionStatusBadge from './InspectionStatusBadge.vue'

defineProps({
  inspections: { type: Array, default: () => [] }
})

defineEmits(['view', 'reschedule'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}
</script>