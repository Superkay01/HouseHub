<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left text-sm text-[var(--royal-blue)]">
            <th class="py-4 px-5">Customer</th>
            <th class="py-4 px-5">Property</th>
            <th class="py-4 px-5">Type</th>
            <th class="py-4 px-5">Location</th>
            <th class="py-4 px-5">Date</th>
            <th class="py-4 px-5">Status</th>
            <th class="py-4 px-5">Agent</th>
            <th class="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="request in requests"
            :key="request.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="py-4 px-5">
              <div class="font-medium text-[var(--royal-blue)]">
                {{ request.customer?.full_name || 'N/A' }}
              </div>
              <div class="text-xs text-[var(--steel-blue)]">{{ request.customer?.phone }}</div>
            </td>
            <td class="py-4 px-5">
              <div class="font-medium text-[var(--royal-blue)]">{{ request.property?.title || 'N/A' }}</div>
              <div class="text-xs text-[var(--steel-blue)]">{{ request.property?.property_type }}</div>
            </td>
            <td class="py-4 px-5 capitalize">{{ request.request_type || 'inspection' }}</td>
            <td class="py-4 px-5">{{ request.city }}, {{ request.state }}</td>
            <td class="py-4 px-5 text-sm">{{ formatDate(request.created_at) }}</td>
            <td class="py-4 px-5">
              <RequestStatusBadge :status="request.status" />
            </td>
            <td class="py-4 px-5 text-sm">
              {{ request.agent?.full_name || '—' }}
            </td>
            <td class="py-4 px-5 text-right">
              <button
                @click="$emit('view', request)"
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
        v-for="request in requests"
        :key="request.id"
        class="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="font-semibold text-[var(--royal-blue)]">
              {{ request.customer?.full_name || 'N/A' }}
            </p>
            <p class="text-xs text-[var(--steel-blue)] mt-1">
              {{ request.request_code || request.id?.slice(0, 8) }}
            </p>
          </div>
          <RequestStatusBadge :status="request.status" />
        </div>

        <div class="space-y-2 text-sm mb-4">
          <p>
            <span class="text-[var(--steel-blue)]">Property:</span>
            {{ request.property?.title || 'N/A' }}
          </p>
          <p>
            <span class="text-[var(--steel-blue)]">Type:</span>
            <span class="capitalize text-[var(--royal-blue)]">{{ request.request_type || 'inspection' }}</span>
          </p>
          <p class="text-sm text-[var(--steel-blue)]">
            <span class="text-[var(--steel-blue)]">Location:</span>
            {{ request.city }}, {{ request.state }}
          </p>
          <p class="text-sm text-[var(--steel-blue)]">
            <span class="text-[var(--steel-blue)]">Date:</span>
            {{ formatDate(request.created_at) }}
          </p>
          <p>
            <span class="text-[var(--steel-blue)]">Agent:</span>
            {{ request.agent?.full_name || 'Not assigned' }}
          </p>
        </div>

        <button
          @click="$emit('view', request)"
          class="w-full py-3 bg-[var(--light-blue)] hover:bg-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)] font-medium text-sm"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && requests.length === 0"
      class="text-center py-20 text-[var(--steel-blue)]"
    >
      <p class="text-lg font-medium text-[var(--royal-blue)]">No Requests Yet</p>
      <p class="mt-2 text-[var(--steel-blue)]">
        There are currently no customer requests in your assigned location.
      </p>
    </div>
  </div>
</template>

<script setup>
import RequestStatusBadge from './RequestStatusBadge.vue'

defineProps({
  requests: { type: Array, default: () => [] },
  loading: Boolean
})

defineEmits(['view', 'assign', 'schedule'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>