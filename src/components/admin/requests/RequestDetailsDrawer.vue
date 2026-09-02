<template>
  <div class="fixed inset-0 z-50 flex justify-end bg-black/40">
    <div class="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10">
        <div class="min-w-0">
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-[var(--royal-blue)] truncate">
            Request Details
          </h2>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5 truncate">
            {{ request.request_code || request.id }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-2xl sm:text-3xl text-[var(--steel-blue)] hover:text-[var(--royal-blue)] leading-none ml-4 flex-shrink-0"
        >
          ×
        </button>
      </div>

      <div class="p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1">

        <!-- Status + Date -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <RequestStatusBadge :status="request.status" />
          <span class="text-xs sm:text-sm text-[var(--steel-blue)]">
            Submitted {{ formatDate(request.created_at) }}
          </span>
        </div>

        <!-- 1. Customer -->
        <section class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            1. Customer Information
          </h3>
          <div class="flex items-start gap-3 sm:gap-4">
            <img
              :src="request.customer?.avatar_url || '/default-avatar.png'"
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-gray-200 flex-shrink-0"
              alt="Customer"
            />
            <div class="min-w-0">
              <p class="font-medium text-sm sm:text-base text-[var(--royal-blue)] truncate">
                {{ request.customer?.full_name || '—' }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5 truncate">
                {{ request.customer?.email || '—' }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5">
                {{ request.customer?.phone || '—' }}
              </p>
            </div>
          </div>
        </section>

        <!-- 2. Property -->
        <section class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            2. Property Details
          </h3>
          <div class="flex gap-3 sm:gap-4">
            <img
              :src="request.property?.cover_image || 'https://via.placeholder.com/120x80'"
              class="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-xl sm:rounded-2xl flex-shrink-0"
              alt="Property"
            />
            <div class="min-w-0">
              <p class="font-medium text-sm sm:text-base text-[var(--royal-blue)] line-clamp-2">
                {{ request.property?.title || '—' }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-1 capitalize">
                {{ request.property?.property_type || '—' }}
              </p>
              <p class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mt-1">
                ₦{{ Number(request.property?.price || 0).toLocaleString() }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5">
                {{ request.property?.city || '—' }}, {{ request.property?.state || '—' }}
              </p>
            </div>
          </div>
        </section>

        <!-- 3. Request Information -->
        <section class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            3. Request Information
          </h3>

          <div class="space-y-3 text-xs sm:text-sm">
            <div class="flex justify-between gap-4">
              <span class="text-[var(--steel-blue)]">Request Type</span>
              <span class="font-medium text-[var(--royal-blue)] capitalize text-right">
                {{ request.request_type || 'inspection' }}
              </span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="text-[var(--steel-blue)]">Preferred Date</span>
              <span class="font-medium text-[var(--royal-blue)] text-right">
                {{ request.inspection_date || '—' }}
              </span>
            </div>

            <div class="flex justify-between gap-4">
              <span class="text-[var(--steel-blue)]">Preferred Time</span>
              <span class="font-medium text-[var(--royal-blue)] text-right">
                {{ request.inspection_time || '—' }}
              </span>
            </div>

            <div v-if="request.message" class="pt-2">
              <p class="text-[var(--steel-blue)] mb-1.5">Customer Message</p>
              <p class="bg-white border border-gray-100 p-3 rounded-xl text-[var(--royal-blue)] text-xs sm:text-sm leading-relaxed">
                {{ request.message }}
              </p>
            </div>
          </div>
        </section>

        <!-- 4. Assigned Agent -->
        <section v-if="request.agent" class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            4. Assigned Agent
          </h3>
          <div class="flex items-start gap-3 sm:gap-4">
            <img
              :src="request.agent?.avatar_url || '/default-avatar.png'"
              class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border border-gray-200 flex-shrink-0"
              alt="Agent"
            />
            <div class="min-w-0">
              <p class="font-medium text-sm sm:text-base text-[var(--royal-blue)] truncate">
                {{ request.agent?.full_name || '—' }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5 truncate">
                {{ request.agent?.agency_name || '—' }}
              </p>
              <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5">
                {{ request.agent?.phone || '—' }}
              </p>
            </div>
          </div>
        </section>

        <!-- 5. Timeline -->
        <section>
          <h3 class="text-sm sm:text-base font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            5. Timeline
          </h3>
          <RequestTimeline :request="request" />
        </section>
      </div>

      <!-- Sticky Actions -->
      <div class="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6 space-y-2.5 sm:space-y-3">
        <button
          v-if="['pending', 'reviewing', 'approved'].includes(request.status)"
          @click="$emit('assign', request)"
          class="w-full py-3 sm:py-3.5 bg-[var(--royal-blue)] text-white text-sm sm:text-base rounded-2xl font-medium hover:opacity-90 transition-opacity"
        >
          Assign Agent
        </button>

        <button
          v-if="['approved', 'reviewing'].includes(request.status) || request.agent_id"
          @click="$emit('schedule', request)"
          class="w-full py-3 sm:py-3.5 border border-[var(--royal-blue)] text-[var(--royal-blue)] text-sm sm:text-base rounded-2xl font-medium hover:bg-[var(--royal-blue)]/5 transition-colors"
        >
          Schedule Inspection
        </button>

        <button
          @click="$emit('close')"
          class="w-full py-3 sm:py-3.5 border border-gray-200 text-[var(--steel-blue)] text-sm sm:text-base rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RequestStatusBadge from './RequestStatusBadge.vue'
import RequestTimeline from './RequestTimeline.vue'

defineProps({
  request: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'assign', 'schedule', 'status-updated'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>