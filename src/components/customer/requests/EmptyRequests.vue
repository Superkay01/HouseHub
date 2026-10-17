<template>
  <div class="text-center py-8 sm:py-12 md:py-16 lg:py-20">
    <div class="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[var(--light-blue)] rounded-2xl sm:rounded-full md:rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
      <Inbox class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-[var(--royal-blue)]" />
    </div>
    
    <h3 class="text-base sm:text-lg md:text-xl lg:text-3xl font-semibold text-[var(--royal-blue)] mb-2 sm:mb-2.5 md:mb-3">
      No Requests Yet
    </h3>
    <p class="text-xs sm:text-sm md:text-base lg:text-lg text-[var(--royal-blue)] max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-relaxed mb-5 sm:mb-6 md:mb-8 lg:mb-10">
      You haven't submitted any property requests yet. Browse available properties and request an inspection to get started.
    </p>

    <button 
      @click="browse"
      class="bg-[var(--royal-blue)] text-white px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl text-xs sm:text-sm md:text-base lg:text-lg font-medium hover:bg-[var(--medium-blue)] transition flex items-center gap-1 sm:gap-1.5 md:gap-2 mx-auto">
        <Search class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        Browse Properties
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { Inbox, Search } from 'lucide-vue-next'

const emit = defineEmits(['browse'])

const browse = () => {
  emit('browse')
}
</script>