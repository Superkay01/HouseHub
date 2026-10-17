<template>
  <div class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 text-center">
    <div class="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-100 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 md:mb-6 lg:mb-8">
      ❤️
    </div>
    
    <h3 class="text-base sm:text-lg md:text-xl lg:text-3xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">
      No Saved Properties Yet
    </h3>
    
    <p class="text-gray-500 max-w-sm md:max-w-md mx-auto mb-5 sm:mb-6 md:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
      You haven't saved any properties yet. Browse available homes and tap the heart icon to save your favourites.
    </p>

    <button 
      @click="emit('browse')"
      class="bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl md:rounded-3xl font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 md:gap-3 mx-auto"
    >
      <span>Browse Properties</span>
      <img 
        src="/Lodgenext_logo__2_-removebg-preview.png" 
        alt="LodgeNext" 
        class="h-5 sm:h-6 md:h-8 lg:h-10" 
      />
    </button>

    <!-- Tips -->
    <div class="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-left max-w-2xl mx-auto">
      <div class="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2.5 sm:p-3 md:p-4 lg:p-6">
        <div class="text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 md:mb-3">🔍</div>
        <div class="font-medium text-[11px] sm:text-xs md:text-sm lg:text-base leading-tight">Search Smartly</div>
        <div class="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
          Use filters to find your perfect home
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2.5 sm:p-3 md:p-4 lg:p-6">
        <div class="text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 md:mb-3">❤️</div>
        <div class="font-medium text-[11px] sm:text-xs md:text-sm lg:text-base leading-tight">Save Favorites</div>
        <div class="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
          Tap the heart on any property
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-2.5 sm:p-3 md:p-4 lg:p-6">
        <div class="text-base sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 md:mb-3">📅</div>
        <div class="font-medium text-[11px] sm:text-xs md:text-sm lg:text-base leading-tight">Book Inspections</div>
        <div class="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
          Easily schedule visits from saved list
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['browse'])
</script>