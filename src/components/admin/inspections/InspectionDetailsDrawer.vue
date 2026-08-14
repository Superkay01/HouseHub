<template>
  <div class="fixed inset-0 z-50 flex justify-end bg-black/40" @click.self="$emit('close')">
    <div
      class="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h2 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Details</h2>
          <p class="text-sm text-medium-gray">{{ inspection.inspection_code }}</p>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div class="p-6 space-y-8 flex-1">
        <div class="flex items-center justify-between">
          <InspectionStatusBadge :status="inspection.status" />
          <span class="text-sm text-medium-gray">
            {{ formatDate(inspection.inspection_date) }} • {{ inspection.inspection_time || '—' }}
          </span>
        </div>

        <!-- Customer -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Customer</h3>
          <div class="flex items-center gap-4">
            <img
              :src="inspection.customer?.avatar_url || '/default-avatar.png'"
              class="w-14 h-14 rounded-2xl object-cover"
              alt="Customer"
            />
            <div>
              <p class="font-medium">{{ inspection.customer?.full_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.customer?.email || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.customer?.phone || '—' }}</p>
            </div>
          </div>
        </section>

        <!-- Property -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Property</h3>
          <div class="flex gap-4">
            <img
              :src="inspection.property?.cover_image || 'https://via.placeholder.com/120x80'"
              class="w-28 h-20 object-cover rounded-2xl"
              alt="Property"
            />
            <div>
              <p class="font-medium">{{ inspection.property?.title || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.property?.property_type || '—' }}</p>
              <p class="text-sm font-semibold text-[var(--royal-blue)]">
                ₦{{ Number(inspection.property?.price || 0).toLocaleString() }}
              </p>
              <p class="text-sm text-medium-gray">
                {{ inspection.property?.city || '—' }}, {{ inspection.property?.state || '—' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Agent -->
        <section v-if="inspection.agent">
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Assigned Agent</h3>
          <div class="flex items-center gap-4">
            <img
              :src="inspection.agent?.avatar_url || '/default-avatar.png'"
              class="w-12 h-12 rounded-2xl object-cover"
              alt="Agent"
            />
            <div>
              <p class="font-medium">{{ inspection.agent?.full_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.agent?.agency_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.agent?.phone || '—' }}</p>
            </div>
          </div>
        </section>

        <!-- Notes -->
        <section v-if="inspection.admin_notes || inspection.completion_notes">
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Notes</h3>
          <p class="text-sm bg-gray-50 p-4 rounded-2xl">
            {{ inspection.completion_notes || inspection.admin_notes }}
          </p>
        </section>

        <!-- Timeline -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Timeline</h3>
          <InspectionTimeline :inspection="inspection" />
        </section>
      </div>

      <!-- Actions -->
      <div class="sticky bottom-0 bg-white border-t p-6 space-y-3 z-20">
        <!-- Schedule -->
        <button
          v-if="['pending', 'accepted'].includes(inspection.status)"
          type="button"
          @click.stop="emit('schedule', inspection)"
          class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[var(--medium-blue)] transition"
        >
          📅 Schedule Inspection
        </button>

        <!-- Reschedule -->
        <button
          v-if="['scheduled', 'confirmed', 'rescheduled'].includes(inspection.status)"
          type="button"
          @click.stop="emit('reschedule', inspection)"
          class="w-full py-3.5 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl font-medium hover:bg-blue-50 transition"
        >
          Reschedule Inspection
        </button>

        <!-- Complete -->
        <button
          v-if="['scheduled', 'confirmed', 'rescheduled', 'in_progress'].includes(inspection.status)"
          type="button"
          @click.stop="emit('complete', inspection)"
          class="w-full py-3.5 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition"
        >
          ✓ Mark as Completed
        </button>

        <!-- Cancel -->
        <button
          v-if="!['completed', 'cancelled'].includes(inspection.status)"
          type="button"
          @click.stop="emit('cancel', inspection)"
          class="w-full py-3.5 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition"
        >
          Cancel Inspection
        </button>

        <!-- Close -->
        <button
          type="button"
          @click.stop="emit('close')"
          class="w-full py-3.5 border border-gray-200 rounded-2xl text-medium-gray hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import InspectionStatusBadge from './InspectionStatusBadge.vue'
import InspectionTimeline from './InspectionTimeline.vue'

const props = defineProps({
  inspection: { type: Object, required: true }
})

const emit = defineEmits([
  'close',
  'schedule',
  'reschedule',
  'complete',
  'cancel'
])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>