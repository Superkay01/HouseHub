<template>
  <div class="bg-white rounded-3xl md:p-6 p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[var(--light-blue)] group">
    <div class="flex items-start justify-between">
      <!-- Icon -->
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl mb-2 md:mb-4 transition-transform group-hover:scale-110"
         :class="`bg-[var(--${color})]/10 text-[var(--${color})]`">
        <component :is="icon" class="w-7 h-7" v-if="typeof icon !=='string'"/>
        <span v-else>{{ icon }}</span>
    </div>

      <!-- Trend -->
      <div v-if="trend" 
           class="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
        ↑ {{ trend }}
      </div>
    </div>

    <!-- Value -->
    <div class="md:text-4xl text-2xl font-bold text-[var(--royal-blue)]  tracking-tighter">
      {{ displayValue.toLocaleString() }}
    </div>

    <!-- Title -->
    <div class="md:text-lg text-sm text-[var(--royal-blue)] font-medium">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: null },  // Manual value
  icon: { type: [String, Object], required: true },
  color: { type: String, default: 'royal-blue' },
  trend: { type: String, default: null }
})

const iconComponent = computed(() => typeof props.icon === 'object' ? props.icon : null)

// Use passed value if provided, otherwise 0
const displayValue = computed(() => {
  return props.value !== null ? Number(props.value) : 0
})
</script>