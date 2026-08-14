<template>
  <div
    class="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden cursor-pointer"
    @click="viewInspection"
  >
    <div class="relative h-52">
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

      <div class="flex items-center justify-between text-sm">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'
import InspectionStatusBadge from './InspectionStatusBadge.vue'

const props = defineProps({
  inspection: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'updated'])

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