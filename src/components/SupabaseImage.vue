<template>
  <img
    :src="fullUrl"
    :alt="alt"
    :class="customClass"
    @error="handleError"
  >
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  path: { type: String, required: true },
  alt: { type: String, default: '' },
  bucket: { type: String, default: 'agent-documents' },
  customClass: { type: String, default: '' }
})

const fullUrl = computed(() => {
  return `https://bfjgmbxjgmfmhdixthzd.supabase.co/storage/v1/object/public/${props.bucket}/${props.path}`
})

const handleError = (e) => {
  e.target.src = '/placeholder-image.jpg' // optional fallback
}
</script>