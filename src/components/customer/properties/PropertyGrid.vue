<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <PropertySkeleton v-for="n in 8" :key="n" />
    </div>

    <!-- Properties Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        @view-details="emitViewDetails"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyCard from './PropertyCard.vue';
import PropertySkeleton from './PropertySkeleton.vue';

const props = defineProps<{
  properties: any[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'view-details', id: string): void;
}>();

const emitViewDetails = (id: string) => {
  emit('view-details', id);
};
</script>