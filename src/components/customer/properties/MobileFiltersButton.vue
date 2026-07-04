<template>
  <div class="lg:hidden fixed bottom-6 right-6 z-50">
    <button
      @click="emit('open')"
      class="flex items-center gap-3 bg-[#0025cc] hover:bg-[#001fa3] text-white shadow-xl shadow-[#0025cc]/30 px-6 py-4 rounded-3xl font-semibold transition-all active:scale-95"
    >
      <span class="text-xl">☰</span>
      <span>Filters</span>
      <div 
        v-if="hasActiveFilters"
        class="ml-1 w-2 h-2 bg-bright-green rounded-full animate-pulse"
      ></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  filters?: any;
}>();

const emit = defineEmits<{
  (e: 'open'): void;
}>();

const hasActiveFilters = computed(() => {
  if (!props.filters) return false;
  
  return (
    props.filters.state ||
    props.filters.city ||
    props.filters.area ||
    props.filters.property_type ||
    props.filters.minPrice ||
    props.filters.maxPrice ||
    props.filters.bedrooms
  );
});
</script>