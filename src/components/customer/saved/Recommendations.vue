<template>
  <div class="mt-8 sm:mt-12 md:mt-16 lg:mt-20">
    <div class="flex items-center justify-between gap-2 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
      <h3 class="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
        You May Also Like
      </h3>
      <button 
        @click="browseMore"
        class="text-[var(--royal-blue)] hover:underline text-xs sm:text-sm font-medium flex items-center gap-1 whitespace-nowrap flex-shrink-0"
      >
        Browse More <span class="text-base sm:text-lg">→</span>
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
      <div 
        v-for="property in recommendations" 
        :key="property.id"
        @click="viewProperty(property.id)"
        class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
      >
        <div class="relative h-32 sm:h-40 md:h-44 lg:h-48">
          <img 
            :src="property.cover_image || 'https://via.placeholder.com/400x300?text=No+Image'" 
            class="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div class="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 bg-white/90 text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full font-medium capitalize">
            {{ property.property_type }}
          </div>
        </div>

        <div class="p-2.5 sm:p-3 md:p-4 lg:p-5">
          <h4 class="font-semibold text-xs sm:text-sm md:text-base lg:text-lg leading-tight mb-1 line-clamp-2">
            {{ property.title }}
          </h4>
          <p class="text-gray-500 text-[10px] sm:text-xs md:text-sm mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">
            📍 {{ property.area }}, {{ property.city }}
          </p>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-0.5 sm:gap-1">
            <div class="leading-tight">
              <span class="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-[var(--bright-green)]">
                ₦{{ Number(property.price).toLocaleString() }}
              </span>
              <span class="text-[9px] sm:text-[10px] md:text-xs text-gray-500">/year</span>
            </div>
            
            <div class="text-[9px] sm:text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
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