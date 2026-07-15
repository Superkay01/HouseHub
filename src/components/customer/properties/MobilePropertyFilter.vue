<template>
  <div class="fixed inset-0 bg-white z-50 overflow-y-auto">
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
      <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Filters</h2>
      <button 
        @click="close"
        class="text-4xl leading-none text-medium-gray hover:text-black transition-colors">
        ×
      </button>
    </div>

    <div class="p-6 space-y-10">
      <!-- Price Range -->
      <div>
        <h3 class="font-semibold mb-4">Price Range (per year)</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-medium-gray mb-2">Minimum</label>
            <input 
              v-model="filters.minPrice"
              type="number" 
              placeholder="500000"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-medium-gray mb-2">Maximum</label>
            <input 
              v-model="filters.maxPrice"
              type="number" 
              placeholder="5000000"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Property Type -->
      <div>
        <h3 class="font-semibold mb-4">Property Type</h3>
        <div class="grid grid-cols-2 gap-3">
          <button 
            v-for="type in propertyTypes" 
            :key="type"
            @click="toggleType(type)"
            class="py-4 rounded-2xl text-sm font-medium transition-all"
            :class="filters.types.includes(type) ? 'bg-[var(--royal-blue)] text-white' : 'bg-gray-100 hover:bg-gray-200'"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Bedrooms -->
      <div>
        <h3 class="font-semibold mb-4">Bedrooms</h3>
        <div class="flex gap-3">
          <button 
            v-for="n in 5" 
            :key="n"
            @click="filters.bedrooms = n"
            class="flex-1 py-4 rounded-2xl text-sm font-medium transition-all"
            :class="filters.bedrooms === n ? 'bg-[var(--royal-blue)] text-white' : 'bg-gray-100 hover:bg-gray-200'"
          >
            {{ n }}+ 
          </button>
        </div>
      </div>

      <!-- Amenities -->
      <div>
        <h3 class="font-semibold mb-4">Amenities</h3>
        <div class="grid grid-cols-2 gap-3">
          <label v-for="amenity in amenities" :key="amenity" class="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.amenities" 
              :value="amenity"
              class="w-5 h-5 accent-[var(--royal-blue)]"
            />
            <span class="text-sm">{{ amenity }}</span>
          </label>
        </div>
      </div>

      <!-- Location -->
      <div>
        <h3 class="font-semibold mb-4">Location</h3>
        <select v-model="filters.city" class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)]">
          <option value="">All Cities</option>
          <option value="Ilorin">Ilorin</option>
          <option value="Ijebu Ode">Ijebu Ode</option>
        </select>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="sticky bottom-0 bg-white border-t p-6 flex gap-4">
      <button 
        @click="clearFilters"
        class="flex-1 py-4 border border-gray-300 rounded-2xl font-medium">
        Clear All
      </button>
      <button 
        @click="applyFilters"
        class="flex-1 py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold">
        Apply Filters ({{ filteredCount }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'apply'])

const filters = ref({
  minPrice: null,
  maxPrice: null,
  types: [],
  bedrooms: null,
  amenities: [],
  city: ''
})

const propertyTypes = ['Apartment', 'Duplex', 'Bungalow', 'Mini Flat', 'Self Contain']

const amenities = [
  'Borehole', 'Running Water', 'Security', 'Fenced Compound',
  'POP Ceiling', 'Balcony', 'Air Conditioning', 'Prepaid Meter',
  'Wi-Fi', 'Generator'
]

const filteredCount = computed(() => 124)

const toggleType = (type) => {
  const index = filters.value.types.indexOf(type)
  if (index === -1) filters.value.types.push(type)
  else filters.value.types.splice(index, 1)
}

const clearFilters = () => {
  filters.value = {
    minPrice: null,
    maxPrice: null,
    types: [],
    bedrooms: null,
    amenities: [],
    city: ''
  }
}

const applyFilters = () => {
  emit('apply', filters.value)
  emit('close')
}

const close = () => emit('close')
</script>