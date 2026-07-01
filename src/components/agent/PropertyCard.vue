<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <!-- Property Image -->
    <div class="relative h-56">
      <img 
        :src="property.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'" 
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      
      <!-- Status Badge -->
      <div 
        class="absolute top-4 right-4 px-4 py-1.5 text-xs font-semibold rounded-2xl"
        :class="getStatusClass(property.status)"
      >
        {{ property.status || 'Pending' }}
      </div>
    </div>

    <!-- Property Info -->
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-lg leading-tight">{{ property.title }}</h3>
          <p class="text-medium-gray text-sm mt-1">
            {{ property.area }}, {{ property.city }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-[var(--bright-green)]">
            ₦{{ property.price?.toLocaleString() }}
          </p>
          <p class="text-xs text-medium-gray">per year</p>
        </div>
      </div>

      <!-- Features -->
      <div class="flex gap-6 text-sm text-medium-gray mb-6">
        <div class="flex items-center gap-1">
          <span>🛏️</span>
          <span>{{ property.bedrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>🛁</span>
          <span>{{ property.bathrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>🚽</span>
          <span>{{ property.toilets || 0 }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button 
          @click="$emit('edit', property.id)"
          class="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-2xl text-sm font-medium transition-all"
        >
          Edit
        </button>
        <button 
          @click="$emit('delete', property.id)"
          class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-2xl text-sm font-medium transition-all"
        >
          Delete
        </button>
        <button 
          @click="viewProperty"
          class="flex-1 bg-[var(--royal-blue)] text-white py-3 rounded-2xl text-sm font-medium hover:bg-[var(--medium-blue)] transition-all"
        >
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const getStatusClass = (status) => {
  if (status === 'approved') return 'bg-green-100 text-green-700'
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
  if (status === 'rented') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
}

const viewProperty = () => {
  alert(`Viewing property: ${props.property.title}`)
}
</script>