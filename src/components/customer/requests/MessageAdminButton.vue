<template>
  <button 
    @click="messageAdmin"
    class="flex items-center gap-3 bg-[var(--light-blue)] hover:bg-[var(--hover-blue)] text-[var(--royal-blue)] px-6 py-4 rounded-3xl font-medium transition-all w-full justify-center">
    <MessageCircle class="w-5 h-5" />
    Message State Admin
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { MessageCircle } from 'lucide-vue-next'

const props = defineProps({
  requestId: {
    type: String,
    required: true
  },
  adminName: {
    type: String,
    default: 'State Admin'
  }
})

const emit = defineEmits(['message'])

const messageAdmin = () => {
  emit('message', props.requestId)
}
</script>