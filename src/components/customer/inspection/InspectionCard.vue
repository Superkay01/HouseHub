<template>
  <div class="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden cursor-pointer" 
       @click="viewInspection">
    <div class="relative h-52">
      <img 
        :src="inspection.properties?.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'" 
        class="w-full h-full object-cover"
      />
      <div class="absolute top-4 right-4">
        <InspectionStatusBadge :status="inspection.status" />
      </div>
    </div>

    <div class="p-6">
      <h4 class="font-semibold text-xl leading-tight mb-2">{{ inspection.properties?.title }}</h4>
      <p class="text-medium-gray text-sm mb-4">📍 {{ inspection.properties?.area }}, {{ inspection.properties?.city }}</p>

      <!-- Inspection Info -->
      <div class="flex items-center gap-3 text-sm mb-6">
        <Calendar class="w-5 h-5 text-[var(--royal-blue)]" />
        <div>
          <div>{{ formatDate(inspection.inspection_date) }}</div>
          <div class="text-medium-gray">{{ inspection.inspection_time || 'Time TBA' }}</div>
        </div>
      </div>

      <!-- Status -->
      <div class="flex justify-between items-center">
        <div class="text-xs text-medium-gray">Status</div>
        <div class="text-xs font-medium capitalize">{{ inspection.status?.replace('_', ' ') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Calendar } from 'lucide-vue-next'
import InspectionStatusBadge from './InspectionStatusBadge.vue'

const props = defineProps({
  inspection: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view'])

const formatDate = (dateString) => {
  if (!dateString) return 'TBA'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const viewInspection = () => {
  emit('view', props.inspection.id)
}
</script>