<template>
  <div v-if="password" class="mt-2">
    <div class="h-1.5 bg-[var(--dark-gray)] rounded-full overflow-hidden">
      <div 
        class="h-full transition-all duration-300"
        :class="strength.color"
        :style="{ width: strength.width + '%' }">
      </div>
    </div>
    <p class="text-xs mt-1" :class="strength.textColor">{{ strength.label }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ password: String })

const strength = computed(() => {
  const len = props.password?.length || 0
  if (len === 0) return { label: '', width: 0, color: '', textColor: '' }
  if (len < 6) return { label: 'Weak', width: 30, color: 'bg-red-500', textColor: 'text-red-500' }
  if (len < 8) return { label: 'Fair', width: 50, color: 'bg-orange-500', textColor: 'text-orange-500' }
  if (len < 10) return { label: 'Good', width: 75, color: 'bg-yellow-500', textColor: 'text-yellow-500' }
  return { label: 'Strong', width: 100, color: 'bg-bright-green', textColor: 'text-bright-green' }
})
</script>