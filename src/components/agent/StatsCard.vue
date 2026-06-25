<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[var(--light-blue)] group">
    <div class="flex items-start justify-between">
      <div 
        class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
        :class="`bg-[var(--${color})]/10 text-[var(--${color})]`"
      >
        {{ icon }}
      </div>

      <div v-if="trend" class="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600">
        ↑ {{ trend }}
      </div>
    </div>

    <div class="text-4xl font-bold text-dark-gray mb-1 tracking-tighter">
      {{ value.toLocaleString() }}
    </div>

    <div class="text-medium-gray font-medium">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  icon: String,
  trend: String,
  color: String
})
</script>