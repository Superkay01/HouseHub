<template>
  <div>
    <!-- ================= DESKTOP TABLE ================= -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left">
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Inspection ID
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Customer
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Property
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Location
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Date / Time
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Agent
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">
              Status
            </th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)] text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in inspections"
            :key="item.id"
            class="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
          >
            <!-- Inspection ID -->
            <td class="py-4 px-5">
              <span class="font-medium text-sm text-[var(--royal-blue)]">
                {{ item.inspection_code || item.id?.slice(0, 8) }}
              </span>
            </td>

            <!-- Customer -->
            <td class="py-4 px-5">
              <div class="font-medium text-sm text-[var(--royal-blue)]">
                {{ item.customer?.full_name || 'N/A' }}
              </div>
              <div class="text-xs text-[var(--steel-blue)] mt-0.5">
                {{ item.customer?.phone || '—' }}
              </div>
            </td>

            <!-- Property -->
            <td class="py-4 px-5">
              <div class="font-medium text-sm text-[var(--royal-blue)] line-clamp-1">
                {{ item.property?.title || 'N/A' }}
              </div>
              <div class="text-xs text-[var(--steel-blue)] mt-0.5 capitalize">
                {{ item.property?.property_type || '—' }}
              </div>
            </td>

            <!-- Location -->
            <td class="py-4 px-5">
              <span class="text-sm text-[var(--steel-blue)]">
                {{ item.city || '—' }}, {{ item.state || '—' }}
              </span>
            </td>

            <!-- Date / Time -->
            <td class="py-4 px-5">
              <div class="text-sm text-[var(--royal-blue)]">
                {{ formatDate(item.inspection_date) }}
              </div>
              <div class="text-xs text-[var(--steel-blue)] mt-0.5">
                {{ item.inspection_time || '—' }}
              </div>
            </td>

            <!-- Agent -->
            <td class="py-4 px-5">
              <span class="text-sm text-[var(--steel-blue)]">
                {{ item.agent?.full_name || '—' }}
              </span>
            </td>

            <!-- Status -->
            <td class="py-4 px-5">
              <InspectionStatusBadge :status="item.status" />
            </td>

            <!-- Actions -->
            <td class="py-4 px-5 text-right">
              <button
                @click="$emit('view', item)"
                class="px-4 py-2 text-sm font-medium rounded-xl
                       bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]
                       hover:bg-[var(--royal-blue)] hover:text-white
                       transition-colors"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= MOBILE CARDS ================= -->
    <div class="md:hidden space-y-4 p-4">
      <div
        v-for="item in inspections"
        :key="item.id"
        class="border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-white shadow-sm"
      >
        <!-- Top: Customer + Status -->
        <div class="flex justify-between items-start gap-3 mb-3">
          <div class="min-w-0">
            <p class="font-semibold text-sm sm:text-base text-[var(--royal-blue)] truncate">
              {{ item.customer?.full_name || 'N/A' }}
            </p>
            <p class="text-xs text-[var(--steel-blue)] mt-0.5">
              {{ item.inspection_code || item.id?.slice(0, 8) }}
            </p>
          </div>
          <InspectionStatusBadge :status="item.status" />
        </div>

        <!-- Details -->
        <div class="space-y-1.5 text-xs sm:text-sm mb-4">
          <p class="font-medium text-[var(--royal-blue)] line-clamp-2">
            {{ item.property?.title || 'N/A' }}
          </p>
          <p class="text-[var(--steel-blue)]">
            📍 {{ item.city || '—' }}, {{ item.state || '—' }}
          </p>
          <p class="text-[var(--steel-blue)]">
            {{ formatDate(item.inspection_date) }} • {{ item.inspection_time || '—' }}
          </p>
          <p class="text-[var(--steel-blue)]">
            Agent: <span class="text-[var(--royal-blue)]">{{ item.agent?.full_name || 'Not assigned' }}</span>
          </p>
        </div>

        <!-- Action -->
        <button
          @click="$emit('view', item)"
          class="w-full py-3 rounded-2xl text-sm font-medium
                 bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]
                 hover:bg-[var(--royal-blue)] hover:text-white
                 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && inspections.length === 0"
      class="text-center py-16 sm:py-20 px-4"
    >
      <p class="text-base sm:text-lg font-medium text-[var(--royal-blue)]">
        No Inspections Yet
      </p>
      <p class="mt-2 text-sm text-[var(--steel-blue)] max-w-md mx-auto">
        There are currently no property inspections in your assigned location.
      </p>
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