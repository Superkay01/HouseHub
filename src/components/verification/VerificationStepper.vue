<template>
  <div class="mb-12">
    <!-- Progress Bar -->
    <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
      <div 
        class="absolute top-0 left-0 h-full bg-[var(--royal-blue)] transition-all duration-500 rounded-full"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>

    <!-- Step Labels -->
    <div class="flex justify-between text-xs font-medium">
      <div 
        v-for="(step, index) in steps"
        :key="index"
        class="text-center flex-1"
        :class="currentStep > index + 1 ? 'text-[var(--bright-green)]' : currentStep === index + 1 ? 'text-[var(--royal-blue)]' : 'text-medium-gray'"
      >
        {{ step }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})

const steps = [
  "Personal Info",
  "Business Info",
  "Documents",
  "Review"
]

const progressWidth = computed(() => {
  return ((props.currentStep - 1) / (steps.length - 1)) * 100
})
</script>