<template>
  <div class="lg:hidden fixed bottom-6 right-6 z-50">
    <button
      @click="openFilters"
      class="flex items-center gap-3 bg-[#0025cc] hover:bg-[#001fa3] text-white shadow-xl shadow-[#0025cc]/30 px-6 py-4 rounded-3xl font-semibold transition-all active:scale-95"
    >
      <span class="text-xl">☰</span>
      <span>Filters</span>
      <div 
        v-if="hasActiveFilters"
        class="ml-1 w-2 h-2 bg-[var(--bright-green)] rounded-full animate-pulse"
      ></div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['open'])

const hasActiveFilters = computed(() => {
  return (
    props.filters.state ||
    props.filters.city ||
    props.filters.area ||
    props.filters.property_type ||
    props.filters.minPrice ||
    props.filters.maxPrice ||
    props.filters.bedrooms
  )
})

const openFilters = () => {
  emit('open')
}
</script>