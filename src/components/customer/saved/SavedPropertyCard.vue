<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <!-- Image -->
    <div class="relative h-64">
      <img 
        :src="property.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'" 
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      
      <!-- Verified Badge -->
      <div v-if="property.profiles?.is_verified" class="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-4 py-1 rounded-2xl flex items-center gap-1">
        <span>✓</span> Verified
      </div>

      <!-- Favorite Button -->
      <button 
        @click.stop="removeSaved"
        class="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow hover:bg-red-50 transition-all">
        ❤️
      </button>

      <!-- Image Counter -->
      <div class="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-2xl">
        1/5
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-xl leading-tight">{{ property.title }}</h3>
          <p class="text-medium-gray text-sm mt-1">📍 {{ property.area }}, {{ property.city }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold text-[var(--bright-green)]">₦{{ Number(property.price).toLocaleString() }}</p>
          <p class="text-xs text-medium-gray">per year</p>
        </div>
      </div>

      <!-- Specs -->
      <div class="flex gap-6 text-sm text-medium-gray mb-6">
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
      <div class="flex items-center gap-3 border-t pt-5">
        <img 
          :src="property.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${property.profiles?.full_name}`" 
          class="w-9 h-9 rounded-2xl"
        />
        <div class="text-sm">
          <div class="font-medium">{{ property.profiles?.full_name }}</div>
          <div class="text-medium-gray text-xs">Verified Agent</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button 
          @click="viewProperty"
          class="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-2xl text-sm font-medium transition-all">
          View Details
        </button>
        <button 
          @click="requestInspection"
          class="flex-1 bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white py-3 rounded-2xl text-sm font-medium transition-all">
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