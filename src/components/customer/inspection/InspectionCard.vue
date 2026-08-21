<template>
  <div
    class="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
  >
    <!-- Image (clickable) -->
    <div class="relative h-52 cursor-pointer" @click="viewInspection">
      <img
        :src="inspection.property?.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'"
        class="w-full h-full object-cover"
        alt="Property"
      />
      <div class="absolute top-4 right-4">
        <InspectionStatusBadge :status="inspection.status" />
      </div>
    </div>

    <div class="p-6">
      <!-- Title & Location (clickable) -->
      <div class="cursor-pointer" @click="viewInspection">
        <h4 class="font-semibold text-xl leading-tight mb-2 text-[var(--royal-blue)]">
          {{ inspection.property?.title || 'Property' }}
        </h4>

        <p class="text-medium-gray text-sm mb-4">
          📍
          {{ inspection.property?.area || inspection.property?.city || 'Location' }},
          {{ inspection.property?.city || inspection.property?.state || '' }}
        </p>

        <div class="flex items-center gap-3 text-sm mb-4">
          <Calendar class="w-5 h-5 text-[var(--royal-blue)]" />
          <div>
            <div class="font-medium text-[var(--royal-blue)]">
              {{ formatDate(inspection.inspection_date) }}
            </div>
            <div class="text-medium-gray">
              {{ inspection.inspection_time || 'Time TBA' }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm mb-5">
          <div>
            <p class="text-xs text-medium-gray">Inspection ID</p>
            <p class="font-mono text-[var(--royal-blue)]">
              {{ inspection.inspection_code || inspection.id?.slice(0, 8) }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-xs text-medium-gray">Agent</p>
            <p class="font-medium text-[var(--royal-blue)]">
              {{ inspection.agent?.full_name || 'Not assigned' }}
            </p>
          </div>
          <div class="text-right">
  <p class="text-xs text-medium-gray">Agent</p>
  <p class="font-medium text-[var(--royal-blue)]">
    {{ inspection.agent?.full_name || 'Not assigned' }}
  </p>
  <p
    v-if="agentRating"
    class="text-xs text-amber-600 font-medium mt-0.5"
  >
    ★ {{ agentRating.avg }}
    <span class="text-medium-gray font-normal">
      ({{ agentRating.count }})
    </span>
  </p>
</div>
        </div>
      </div>

      <!-- ========== COMPLETED FLOW BUTTONS ========== -->
      <div v-if="inspection.status === 'completed'" class="space-y-3">
        <!-- Step 1: Not reported yet -->
        <button
          v-if="!hasReported"
          type="button"
          @click.stop="emit('submit-report', inspection)"
          class="w-full py-3 bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white rounded-2xl text-sm font-semibold transition-all"
        >
          Submit Report to Admin
        </button>

        <!-- Step 2: Reported but not paid -->
        <template v-else-if="!hasPaid">
          <div class="text-center text-xs text-[var(--royal-blue)] font-medium py-1">
            ✓ Report submitted
          </div>
          <button
            type="button"
            :disabled="isPaying || !inspection.property?.price"
            @click.stop="emit('pay-property', inspection)"
            class="w-full py-3 bg-[var(--bright-green)] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-2xl text-sm font-semibold transition-all"
          >
            <span v-if="isPaying">Processing Payment...</span>
            <span v-else>
              Pay for Property · ₦{{ Number(inspection.property?.price || 0).toLocaleString() }}
            </span>
          </button>
        </template>

        <!-- Step 3: Already paid -->
        <template v-else>
          <div class="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-2xl text-sm font-semibold">
            <span>✓</span>
            <span>Payment Successful</span>
          </div>

          <button
            type="button"
            :disabled="isPaying"
            @click.stop="emit('pay-property', inspection, true)"
            class="w-full py-3 border-2 border-[var(--bright-green)] text-[var(--bright-green)] hover:bg-green-50 rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
          >
            <span v-if="isPaying">Processing Renewal...</span>
            <span v-else>
              Renew Payment · ₦{{ Number(inspection.property?.price || 0).toLocaleString() }}
            </span>
          </button>
        </template>
      </div>

      <!-- View Details button (always visible) -->
      <button
        type="button"
        @click.stop="viewInspection"
        class="w-full mt-3 py-2.5 border rounded-2xl text-sm font-medium text-[var(--royal-blue)] hover:bg-gray-50 transition"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'
import InspectionStatusBadge from './InspectionStatusBadge.vue'

const props = defineProps({
  inspection: { type: Object, required: true },
  hasPaid: { type: Boolean, default: false },
  hasReported: { type: Boolean, default: false },
  isPaying: { type: Boolean, default: false },
  agentRating: { type: Object, default: null }  // { avg, count }
})

const emit = defineEmits(['view', 'updated', 'submit-report', 'pay-property'])

const formatDate = (dateString) => {
  if (!dateString) return 'TBA'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const viewInspection = () => {
  emit('view', props.inspection)
}
</script>