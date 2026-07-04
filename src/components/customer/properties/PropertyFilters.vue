<template>
  <div class="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Filters</h2>
      <button
        @click="clearAllFilters"
        class="text-sm text-[#0025cc] hover:text-[#001fa3] font-medium"
      >
        Clear All
      </button>
    </div>

    <!-- Purpose -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Purpose</label>
      <div class="flex gap-2">
        <button
          v-for="option in ['For Rent', 'For Sale']"
          :key="option"
          @click="updateFilter('purpose', option)"
          :class="[
            'flex-1 py-3 text-sm font-medium rounded-2xl transition-all',
            filters.purpose === option 
              ? 'bg-[#0025cc] text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          ]"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- State -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
      <select
        v-model="filters.state"
        @change="emitChange"
        class="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#0025cc]"
      >
        <option value="">All States</option>
        <option value="Kwara">Kwara</option>
        <option value="Ogun">Ogun</option>
      </select>
    </div>

    <!-- City -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
      <select
        v-model="filters.city"
        @change="emitChange"
        class="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#0025cc]"
      >
        <option value="">All Cities</option>
        <option value="Ilorin">Ilorin</option>
        <option value="Ijebu Ode">Ijebu Ode</option>
      </select>
    </div>

    <!-- Area -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Area</label>
      <select
        v-model="filters.area"
        @change="emitChange"
        class="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#0025cc]"
      >
        <option value="">All Areas</option>
        <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
      </select>
    </div>

    <!-- Property Type -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="type in propertyTypes"
          :key="type"
          @click="togglePropertyType(type)"
          :class="[
            'py-2.5 text-xs font-medium rounded-2xl transition-all border',
            filters.property_type === type 
              ? 'bg-[#0025cc] text-white border-[#0025cc]' 
              : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Bedrooms -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="num in [1,2,3,4]"
          :key="num"
          @click="setBedrooms(num)"
          :class="[
            'px-5 py-2 rounded-2xl text-sm font-medium transition-all',
            filters.bedrooms === num 
              ? 'bg-[#0025cc] text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          ]"
        >
          {{ num }}+ 
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-3">Price Range (₦ per year)</label>
      <div class="space-y-4">
        <input
          v-model="filters.minPrice"
          type="number"
          placeholder="Min Price"
          @change="emitChange"
          class="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#0025cc]"
        />
        <input
          v-model="filters.maxPrice"
          type="number"
          placeholder="Max Price"
          @change="emitChange"
          class="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#0025cc]"
        />
      </div>
    </div>

    <button
      @click="emitChange"
      class="w-full bg-[#0025cc] hover:bg-[#001fa3] text-white py-4 rounded-2xl font-semibold transition-all"
    >
      Apply Filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change'): void;
}>();

const filters = ref({ ...props.modelValue });

const areas = ['Tanke', 'Fate', 'GRA', 'Oke-Ose', 'Oke-Aje', 'Molipa', 'Sango', 'Gaa-Akanbi'];

const propertyTypes = [
  'Apartment', 'Duplex', 'Bungalow', 'Mini Flat', 
  'Self Contain', 'Shop', 'Office Space'
];

const updateFilter = (key: string, value: any) => {
  filters.value[key] = value;
  emit('update:modelValue', { ...filters.value });
  emit('change');
};

const togglePropertyType = (type: string) => {
  filters.value.property_type = filters.value.property_type === type ? '' : type;
  emit('update:modelValue', { ...filters.value });
  emit('change');
};

const setBedrooms = (num: number) => {
  filters.value.bedrooms = filters.value.bedrooms === num ? null : num;
  emit('update:modelValue', { ...filters.value });
  emit('change');
};

const clearAllFilters = () => {
  filters.value = {
    state: '',
    city: '',
    area: '',
    property_type: '',
    purpose: 'For Rent',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    amenities: []
  };
  emit('update:modelValue', { ...filters.value });
  emit('change');
};

const emitChange = () => {
  emit('update:modelValue', { ...filters.value });
  emit('change');
};

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  filters.value = { ...newVal };
}, { deep: true });
</script>