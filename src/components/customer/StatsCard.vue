<template>
   <div class="bg-[var(--white)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[var(--light-blue)] group">
    <div class="flex items-start justify-between">
        <!-- Icon -->
         <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
         :class="`bg-[var(--${color})]/10 text-[var(--${color})]`">
        <component :is="icon" class="w-7 h-7" v-if="typeof icon !=='string'"/>
        <span v-else>{{ icon }}</span>
    </div>

    
    <div v-if="trend" 
    class="text-xs font-medium px-3 py-1 rounded-full bg-green-400 text-green-100 flex items-center gap-1">
      ↑ {{ trend }}
    </div>
    </div>
    <!-- Value -->
   
<div class="text-4xl font-bold text-[var(--dark-gray)] mb-1 tracking-tighter">
    {{ value }}
</div>
<div class="text-[var(--medium-gray)] font-medium">
    {{ title }}
</div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    icon: {
        type: [String, Object],
        required: true
    },
     trend: {
    type: String,
    default: null
  },
    color: {
        type: String,
        default: 'royal-blue'
    }
})
</script>