<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left text-sm text-medium-gray">
            <th class="py-4 px-5">Inspection ID</th>
            <th class="py-4 px-5">Customer</th>
            <th class="py-4 px-5">Property</th>
            <th class="py-4 px-5">Location</th>
            <th class="py-4 px-5">Date / Time</th>
            <th class="py-4 px-5">Agent</th>
            <th class="py-4 px-5">Status</th>
            <th class="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in inspections"
            :key="item.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="py-4 px-5 font-medium text-[var(--royal-blue)]">
              {{ item.inspection_code || item.id?.slice(0, 8) }}
            </td>
            <td class="py-4 px-5">
              <div class="font-medium">{{ item.customer?.full_name || 'N/A' }}</div>
              <div class="text-xs text-medium-gray">{{ item.customer?.phone }}</div>
            </td>
            <td class="py-4 px-5">
              <div class="font-medium">{{ item.property?.title || 'N/A' }}</div>
              <div class="text-xs text-medium-gray">{{ item.property?.property_type }}</div>
            </td>
            <td class="py-4 px-5 text-sm">{{ item.city }}, {{ item.state }}</td>
            <td class="py-4 px-5 text-sm">
              <div>{{ formatDate(item.inspection_date) }}</div>
              <div class="text-xs text-medium-gray">{{ item.inspection_time || '—' }}</div>
            </td>
            <td class="py-4 px-5 text-sm">{{ item.agent?.full_name || '—' }}</td>
            <td class="py-4 px-5">
              <InspectionStatusBadge :status="item.status" />
            </td>
            <td class="py-4 px-5 text-right">
              <button
                @click="$emit('view', item)"
                class="px-4 py-2 text-sm bg-[var(--light-blue)] hover:bg-[var(--hover-blue)] rounded-xl text-[var(--royal-blue)]"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4 p-4">
      <div
        v-for="item in inspections"
        :key="item.id"
        class="border border-gray-100 rounded-3xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-semibold text-[var(--royal-blue)]">
              {{ item.customer?.full_name }}
            </p>
            <p class="text-xs text-medium-gray">{{ item.inspection_code }}</p>
          </div>
          <InspectionStatusBadge :status="item.status" />
        </div>

        <div class="text-sm space-y-1 mb-4">
          <p>{{ item.property?.title }}</p>
          <p class="text-medium-gray">📍 {{ item.city }}, {{ item.state }}</p>
          <p>{{ formatDate(item.inspection_date) }} • {{ item.inspection_time || '—' }}</p>
          <p>Agent: {{ item.agent?.full_name || 'Not assigned' }}</p>
        </div>

        <button
          @click="$emit('view', item)"
          class="w-full py-3 bg-[var(--light-blue)] rounded-2xl text-[var(--royal-blue)] font-medium text-sm"
        >
          View Details
        </button>
      </div>
    </div>

    <div
      v-if="!loading && inspections.length === 0"
      class="text-center py-20 text-medium-gray"
    >
      <p class="text-lg font-medium">No Inspections Yet</p>
      <p class="mt-2">There are currently no property inspections in your assigned location.</p>
    </div>
  </div>
</template>

<script setup>
import InspectionStatusBadge from './InspectionStatusBadge.vue'

defineProps({
  inspections: { type: Array, default: () => [] },
  loading: Boolean
})

defineEmits(['view', 'reschedule', 'complete', 'cancel'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>