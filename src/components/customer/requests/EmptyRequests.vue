<template>
  <div class="text-center py-20">
    <div class="mx-auto w-24 h-24 bg-[var(--light-blue)] rounded-full flex items-center justify-center text-6xl mb-8">
      <Inbox class="w-14 h-14 text-[var(--royal-blue)]" />
    </div>
    
    <h3 class="text-3xl font-semibold text-[var(--royal-blue)] mb-3">No Requests Yet</h3>
    <p class="text-[var(--royal-blue)] max-w-md mx-auto leading-relaxed mb-10">
      You haven't submitted any property requests yet.<br>
      Browse available properties and request an inspection to get started.
    </p>

    <button 
      @click="browse"
      class="bg-[var(--royal-blue)] text-white px-10 py-4 rounded-3xl text-lg font-medium hover:bg-[var(--medium-blue)] transition flex items-center gap-2 mx-auto">
        <Search class="w-5 h-5" />
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