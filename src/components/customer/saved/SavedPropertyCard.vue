<template>
  <div class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <!-- Image -->
    <div class="relative h-40 sm:h-48 md:h-56 lg:h-64">
      <img 
        :src="property.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'" 
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      
      <!-- Verified Badge -->
      <div
        v-if="property.profiles?.is_verified"
        class="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-green-500 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full sm:rounded-xl md:rounded-2xl flex items-center gap-0.5 sm:gap-1"
      >
        <span>✓</span> Verified
      </div>

      <!-- Favorite Button -->
      <button 
        @click.stop="removeSaved"
        class="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow hover:bg-red-50 transition-all text-sm sm:text-base"
        title="Remove from saved"
      >
        ❤️
      </button>

      <!-- Image Counter -->
      <div class="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 bg-black/70 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-xl md:rounded-2xl">
        1/5
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 sm:p-4 md:p-5 lg:p-6">
      <div class="flex justify-between items-start gap-2 mb-2 sm:mb-2.5 md:mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm sm:text-base md:text-lg lg:text-xl leading-tight line-clamp-2">{{ property.title }}</h3>
          <p class="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-1">📍 {{ property.area }}, {{ property.city }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[var(--bright-green)] whitespace-nowrap">₦{{ Number(property.price).toLocaleString() }}</p>
          <p class="text-[10px] sm:text-xs text-gray-500">per year</p>
        </div>
      </div>

      <!-- Specs -->
      <div class="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
        <div class="flex items-center gap-1">
          <span>🛏️</span>
          <span>{{ property.bedrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>🚿</span>
          <span>{{ property.bathrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>🚗</span>
          <span>{{ property.parking_spaces || 0 }}</span>
        </div>
      </div>

      <!-- Agent -->
      <div class="flex items-center gap-2 sm:gap-3 border-t pt-3 sm:pt-4 md:pt-5">
        <img 
          :src="property.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${property.profiles?.full_name}`" 
          class="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0"
        />
        <div class="text-xs sm:text-sm min-w-0">
          <div class="font-medium truncate">{{ property.profiles?.full_name }}</div>
          <div class="text-gray-500 text-[10px] sm:text-xs">Verified Agent</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-5 lg:mt-6">
        <button 
          @click="viewProperty"
          class="flex-1 bg-gray-100 hover:bg-gray-200 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-xs sm:text-sm font-medium transition-all">
          View Details
        </button>
        <button 
          @click="requestInspection"
          class="flex-1 bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl text-xs sm:text-sm font-medium transition-all">
          Request Inspection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'


const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove', 'view'])
const router = useRouter()

const removeSaved = () => {
  if (confirm('Remove from saved properties?')) {
    emit('remove', props.property.id)
  }
}

const viewProperty = () => {
  emit('view', props.property.id)
}

// const requestInspection = () => {
  
//   router.push({
//     name: 'request-inspection', 
//     params: { id: props.property.id }
//   })
// }



const requestInspection = () => {
  router.push({
    name: 'request-inspection', 
    params: { id: props.property.id }
  })
}
</script>