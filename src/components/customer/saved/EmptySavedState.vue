<template>
  <div class="bg-white rounded-3xl p-16 text-center">
    <div class="mx-auto w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center text-6xl mb-8">
      ❤️
    </div>
    
    <h3 class="text-3xl font-semibold text-dark-gray mb-4">No Saved Properties Yet</h3>
    
    <p class="text-medium-gray max-w-md mx-auto mb-10 text-lg">
      You haven't saved any properties yet. Browse available homes and tap the heart icon to save your favourites.
    </p>

    <button 
      @click="emit('browse')"
      class="bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white px-10 py-5 rounded-3xl font-semibold text-lg transition-all active:scale-95 flex items-center gap-3 mx-auto">
      <span>Browse Properties</span>
      <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-10" />
    </button>

    <!-- Tips -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
      <div class="bg-gray-50 rounded-3xl p-6">
        <div class="text-2xl mb-3">🔍</div>
        <div class="font-medium">Search Smartly</div>
        <div class="text-sm text-medium-gray mt-1">Use filters to find your perfect home</div>
      </div>
      <div class="bg-gray-50 rounded-3xl p-6">
        <div class="text-2xl mb-3">❤️</div>
        <div class="font-medium">Save Favorites</div>
        <div class="text-sm text-medium-gray mt-1">Tap the heart on any property</div>
      </div>
      <div class="bg-gray-50 rounded-3xl p-6">
        <div class="text-2xl mb-3">📅</div>
        <div class="font-medium">Book Inspections</div>
        <div class="text-sm text-medium-gray mt-1">Easily schedule visits from saved list</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['browse'])
</script>