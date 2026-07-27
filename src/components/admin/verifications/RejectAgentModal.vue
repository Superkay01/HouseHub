<template>
  <div class="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center">
    <div class="bg-white rounded-3xl max-w-md w-full p-8">
      <h3 class="text-2xl font-bold text-red-600 mb-2">Reject Application?</h3>
      <p class="text-medium-gray mb-6">
        You are about to reject <strong>{{ agentName }}</strong>. This action cannot be undone.
      </p>

      <label class="block text-sm font-medium mb-3">Reason for Rejection</label>
      <select v-model="selectedReason" class="w-full p-4 border rounded-2xl mb-4">
        <option value="">Select a reason...</option>
        <option value="Invalid documents">Invalid documents</option>
        <option value="Incomplete information">Incomplete information</option>
        <option value="Information mismatch">Information mismatch</option>
        <option value="Unverifiable agency">Unverifiable agency</option>
        <option value="Other">Other (please specify)</option>
      </select>

      <textarea
        v-if="selectedReason === 'Other'"
        v-model="customReason"
        placeholder="Please provide more details..."
        class="w-full h-24 p-4 border rounded-2xl mb-6"
      ></textarea>

      <div class="flex gap-3">
        <button 
          @click="emit('close')"
          class="flex-1 py-4 border border-gray-300 rounded-2xl font-medium">
          Cancel
        </button>
        <button 
          @click="reject"
          :disabled="!selectedReason"
          class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-semibold disabled:opacity-50">
          Confirm Rejection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  agentName: { type: String, default: 'this agent' }
})

const emit = defineEmits(['close', 'reject'])

const selectedReason = ref('')
const customReason = ref('')

const reject = () => {
  const reason = selectedReason.value === 'Other' ? customReason.value : selectedReason.value
  emit('reject', reason)
}
</script>