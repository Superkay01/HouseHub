<template>
  <div v-if="visible" class="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
    <div class="bg-white max-w-3xl w-full rounded-3xl max-h-[90vh] overflow-hidden shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b">
        <div>
          <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Request Details</h2>
          <p class="text-sm text-medium-gray">REQ-{{ request.id.slice(0,8) }}</p>
        </div>
        <button 
          @click="close"
          class="text-4xl leading-none text-medium-gray hover:text-black transition">
          ×
        </button>
      </div>

      <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Property Info -->
        <div class="flex gap-6 mb-10">
          <img 
            :src="request.properties.cover_image" 
            class="w-32 h-32 rounded-3xl object-cover"
          />
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-dark-gray">{{ request.properties.title }}</h3>
            <p class="text-medium-gray">📍 {{ request.properties.area }}, {{ request.properties.city }}</p>
            <p class="text-xl font-semibold text-[var(--royal-blue)] mt-3">
              ₦{{ Number(request.properties.price).toLocaleString() }} / year
            </p>
          </div>
        </div>

        <!-- Status -->
        <div class="mb-10">
          <RequestStatusBadge :status="request.status" />
        </div>

        <!-- Timeline -->
        <div class="mb-10">
          <h4 class="font-semibold mb-4 text-dark-gray">Request Timeline</h4>
          <RequestTimeline :status="request.status" />
        </div>

        <!-- Request Information -->
        <div class="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h4 class="font-semibold mb-3">Request Information</h4>
            <div class="space-y-4">
              <div>
                <div class="text-xs text-medium-gray">Type</div>
                <div class="capitalize font-medium">{{ request.request_type }}</div>
              </div>
              <div>
                <div class="text-xs text-medium-gray">Submitted</div>
                <div>{{ formatDate(request.created_at) }}</div>
              </div>
            </div>
          </div>

          <div v-if="request.inspection_date">
            <h4 class="font-semibold mb-3">Inspection Details</h4>
            <div class="space-y-4">
              <div>
                <div class="text-xs text-medium-gray">Date</div>
                <div>{{ formatDate(request.inspection_date) }}</div>
              </div>
              <div>
                <div class="text-xs text-medium-gray">Time</div>
                <div>{{ request.inspection_time || 'TBA' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Note -->
        <div v-if="request.admin_note" class="mb-10 bg-[var(--light-blue)] rounded-3xl p-6">
          <h4 class="font-semibold mb-3 text-[var(--royal-blue)]">Admin Note</h4>
          <p class="text-medium-gray leading-relaxed">{{ request.admin_note }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button 
            @click="close"
            class="flex-1 py-4 border border-gray-300 rounded-3xl font-medium">
            Close
          </button>
          <MessageAdminButton 
            :requestId="request.id"
            @message="messageAdmin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import RequestStatusBadge from './RequestStatusBadge.vue'
import RequestTimeline from './RequestTimeline.vue'
import MessageAdminButton from './MessageAdminButton.vue'

const props = defineProps({
  visible: Boolean,
  request: Object
})

const emit = defineEmits(['close', 'message'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const close = () => emit('close')

const messageAdmin = (id) => {
  emit('message', id)
}
</script>