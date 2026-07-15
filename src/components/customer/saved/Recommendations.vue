<template>
  <div class="mt-20">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-2xl font-semibold text-dark-gray">You May Also Like</h3>
      <button 
        @click="browseMore"
        class="text-[var(--royal-blue)] hover:underline text-sm font-medium flex items-center gap-1">
        Browse More <span class="text-lg">→</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="property in recommendations" 
        :key="property.id"
        @click="viewProperty(property.id)"
        class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
      >
        <div class="relative h-48">
          <img 
            :src="property.cover_image || 'https://via.placeholder.com/400x300?text=No+Image'" 
            class="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div class="absolute top-3 right-3 bg-white/90 text-xs px-3 py-1 rounded-full font-medium">
            {{ property.property_type }}
          </div>
        </div>

        <div class="p-5">
          <h4 class="font-semibold text-lg leading-tight mb-1">{{ property.title }}</h4>
          <p class="text-medium-gray text-sm mb-3">📍 {{ property.area }}, {{ property.city }}</p>
          
          <div class="flex justify-between items-end">
            <div>
              <span class="text-2xl font-bold text-[var(--bright-green)]">₦{{ Number(property.price).toLocaleString() }}</span>
              <span class="text-xs text-medium-gray">/year</span>
            </div>
            
            <div class="text-xs text-medium-gray">
              {{ property.bedrooms }} Bed • {{ property.bathrooms }} Bath
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  recommendations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view', 'browse'])

const viewProperty = (id) => {
  emit('view', id)
}

const browseMore = () => {
  emit('browse')
}
</script>