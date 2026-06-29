<template>
  <div class="relative mb-12">
    <!-- Progress Line -->
    <div class="absolute top-5 left-0 right-0 h-[3px] bg-gray-200 rounded-full">
      <div 
        class="h-full bg-[#0025cc] rounded-full transition-all duration-500"
        :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
      ></div>
    </div>

    <!-- Steps -->
    <div class="relative flex justify-between">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="flex flex-col items-center cursor-pointer group"
        :class="{ 'pointer-events-none': index + 1 > currentStep + 1 }"
        @click="$emit('step-click', index + 1)"
      >
        <!-- Circle -->
        <div 
          class="w-11 h-11 flex items-center justify-center rounded-full border-4 transition-all duration-300 text-sm font-semibold mb-3"
          :class="[
            index + 1 < currentStep ? 'bg-[#00db00] border-[#00db00] text-white' : '',
            index + 1 === currentStep ? 'border-[#0025cc] text-[#0025cc] bg-white' : '',
            index + 1 > currentStep ? 'border-gray-300 text-gray-400 bg-white' : ''
          ]"
        >
          {{ index + 1 }}
        </div>

        <!-- Label -->
        <span 
          class="text-sm font-medium text-center max-w-[110px] transition-colors"
          :class="[
            index + 1 < currentStep ? 'text-[#00db00]' : '',
            index + 1 === currentStep ? 'text-[#0025cc] font-semibold' : '',
            index + 1 > currentStep ? 'text-gray-400' : ''
          ]"
        >
          {{ step }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: string[]
  currentStep: number
}>()

defineEmits<{
  (e: 'step-click', step: number): void
}>()
</script>