<!-- <template>
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
  return `https://kmkcrttmchdvnpggqwey.supabase.co/storage/v1/object/public/${props.bucket}/${props.path}`
})

const handleError = (e) => {
  e.target.src = '/placeholder-image.jpg' // optional fallback
}
</script> -->

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
import { supabase } from '@/supabaseClient'   // ← Import your client

const props = defineProps({
  path: { type: String, required: true },
  alt: { type: String, default: '' },
  bucket: { type: String, default: 'agent-documents' },
  customClass: { type: String, default: '' }
})

const fullUrl = computed(() => {
  if (!props.path) return ''

  const { data } = supabase.storage
    .from(props.bucket)
    .getPublicUrl(props.path)

  return data.publicUrl
})

// const handleError = (e: Event) => {
//   const target = e.target as HTMLImageElement
//   target.src = '/placeholder-image.jpg' // fallback image
// }
const handleError = (e) => {
  e.target.src = '/placeholder-image.jpg' // optional fallback
}
</script>