<template>
  <div class="fixed inset-0 z-50 flex justify-end bg-black/40">
    <div class="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h2 class="text-xl font-bold text-[var(--royal-blue)]">Request Details</h2>
          <p class="text-sm text-medium-gray">{{ request.request_code || request.id }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div class="p-6 space-y-8">
        <!-- Status -->
        <div class="flex items-center justify-between">
          <RequestStatusBadge :status="request.status" />
          <span class="text-sm text-medium-gray">
            {{ formatDate(request.created_at) }}
          </span>
        </div>

        <!-- Customer -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Customer</h3>
          <div class="flex items-center gap-4">
            <img
              :src="request.customer?.avatar_url || '/default-avatar.png'"
              class="w-14 h-14 rounded-2xl object-cover border"
            />
            <div>
              <p class="font-medium">{{ request.customer?.full_name }}</p>
              <p class="text-sm text-medium-gray">{{ request.customer?.email }}</p>
              <p class="text-sm text-medium-gray">{{ request.customer?.phone }}</p>
            </div>
          </div>
        </section>

        <!-- Property -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Property</h3>
          <div class="flex gap-4">
            <img
              :src="request.property?.cover_image || 'https://via.placeholder.com/120x80'"
              class="w-28 h-20 object-cover rounded-2xl"
            />
            <div>
              <p class="font-medium">{{ request.property?.title }}</p>
              <p class="text-sm text-medium-gray">{{ request.property?.property_type }}</p>
              <p class="text-sm font-semibold text-[var(--royal-blue)]">
                ₦{{ Number(request.property?.price || 0).toLocaleString() }}
              </p>
              <p class="text-sm text-medium-gray">
                {{ request.property?.city }}, {{ request.property?.state }}
              </p>
            </div>
          </div>
        </section>

        <!-- Request Info -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Request Information</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-medium-gray">Type</span>
              <span class="capitalize">{{ request.request_type || 'inspection' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-medium-gray">Preferred Date</span>
              <span>{{ request.inspection_date || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-medium-gray">Preferred Time</span>
              <span>{{ request.inspection_time || '—' }}</span>
            </div>
            <div v-if="request.message">
              <p class="text-medium-gray mb-1">Customer Message</p>
              <p class="bg-gray-50 p-3 rounded-2xl">{{ request.message }}</p>
            </div>
          </div>
        </section>

        <!-- Assigned Agent -->
        <section v-if="request.agent">
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Assigned Agent</h3>
          <div class="flex items-center gap-4">
            <img
              :src="request.agent?.avatar_url || '/default-avatar.png'"
              class="w-12 h-12 rounded-2xl object-cover"
            />
            <div>
              <p class="font-medium">{{ request.agent?.full_name }}</p>
              <p class="text-sm text-medium-gray">{{ request.agent?.agency_name }}</p>
              <p class="text-sm text-medium-gray">{{ request.agent?.phone }}</p>
            </div>
          </div>
        </section>

        <!-- Timeline -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Timeline</h3>
          <RequestTimeline :request="request" />
        </section>
      </div>

      <!-- Actions -->
      <div class="sticky bottom-0 bg-white border-t p-6 space-y-3">
        <button
          v-if="['pending', 'reviewing', 'approved'].includes(request.status)"
          @click="$emit('assign', request)"
          class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)]"
        >
          Assign Agent
        </button>

        <button
          v-if="['approved', 'reviewing'].includes(request.status) || request.agent_id"
          @click="$emit('schedule', request)"
          class="w-full py-3.5 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl font-medium hover:bg-[var(--light-blue)]"
        >
          Schedule Inspection
        </button>

        <button
          @click="$emit('close')"
          class="w-full py-3.5 border border-gray-200 rounded-2xl text-medium-gray hover:bg-gray-50"
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