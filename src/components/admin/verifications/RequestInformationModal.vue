<template>
  <div class="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center">
    <div class="bg-white rounded-3xl max-w-md w-full p-8">
      <h3 class="text-2xl font-bold text-orange-600 mb-2">Request More Information</h3>
      <p class="text-medium-gray mb-6">
        Tell the agent what additional information is needed.
      </p>

      <textarea
        v-model="message"
        placeholder="Please upload a clearer copy of your government-issued ID..."
        class="w-full h-32 p-4 border rounded-2xl mb-6 focus:border-[var(--royal-blue)]"
      ></textarea>

      <div class="flex gap-3">
        <button 
          @click="emit('close')"
          class="flex-1 py-4 border border-gray-300 rounded-2xl font-medium">
          Cancel
        </button>
        <button 
          @click="sendRequest"
          :disabled="!message.trim()"
          class="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-semibold disabled:opacity-50">
          Send Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'send'])

const message = ref('')

const sendRequest = () => {
  emit('send', message.value.trim())
}
</script>