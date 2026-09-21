<template>
  <div>
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <PropertySkeleton v-for="n in 8" :key="n" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        :detail-route-name="detailRouteName"
        :enable-share="enableShare"
        @view-details="emitViewDetails"
        @link-copied="emitLinkCopied"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyCard from './PropertyCard.vue'
import PropertySkeleton from './PropertySkeleton.vue'

withDefaults(
  defineProps<{
    properties: any[]
    loading: boolean
    detailRouteName?: string
    enableShare?: boolean
  }>(),
  {
    detailRouteName: 'CustomerPropertyDetail',
    enableShare: true,
  }
)

const emit = defineEmits<{
  (e: 'view-details', id: string): void
  (e: 'link-copied'): void
}>()

const emitViewDetails = (id: string) => {
  emit('view-details', id)
}

const emitLinkCopied = () => {
  emit('link-copied')
}
</script>