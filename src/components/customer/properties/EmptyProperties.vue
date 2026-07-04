<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <!-- Icon -->
    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <span class="text-5xl">🏠</span>
    </div>

    <h3 class="text-2xl font-semibold text-gray-900 mb-2">
      No properties found
    </h3>
    
    <p class="text-gray-500 max-w-xs mx-auto mb-8">
      We couldn't find any properties matching your current filters. 
      Try adjusting your search or filters.
    </p>

    <button
      @click="emit('clear-filters')"
      class="bg-[#0025cc] hover:bg-[#001fa3] text-white px-8 py-3.5 rounded-2xl font-medium transition-all flex items-center gap-2"
    >
      Clear All Filters
    </button>

    <!-- Optional helpful tips -->
    <div class="mt-10 text-xs text-gray-400">
      <p>💡 Tips:</p>
      <ul class="mt-1 space-y-1">
        <li>• Try broadening your price range</li>
        <li>• Remove some filters</li>
        <li>• Search in a different area</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'clear-filters'): void;
}>();
</script>