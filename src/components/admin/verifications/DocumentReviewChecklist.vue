<template>
  <div>
    <h4 class="font-semibold text-lg text-[var(--royal-blue)] mb-5">Verification Checklist</h4>
    
    <div class="space-y-3">
      <label 
        v-for="(item, index) in checklistItems"
        :key="index"
        class="flex items-center gap-3 bg-white border border-gray-100 hover:border-[var(--periwinkle)] p-4 rounded-2xl cursor-pointer transition-all"
      >
        <input 
          type="checkbox" 
          v-model="checkedItems"
          :value="item.key"
          class="w-5 h-5 accent-[var(--royal-blue)]"
        />
        <span class="text-[var(--royal-blue)] font-medium">{{ item.label }}</span>
      </label>
    </div>

    <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-700" 
         v-if="checkedItems.length < checklistItems.length">
      <strong>Note:</strong> All items must be checked before approving the agent.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'complete'])

const checklistItems = [
  { key: 'identity', label: 'Agent identity confirmed' },
  { key: 'phone', label: 'Phone number verified' },
  { key: 'agency', label: 'Agency information reviewed' },
  { key: 'government_id', label: 'Government ID reviewed' },
  { key: 'business_doc', label: 'Business / CAC documentation reviewed' },
  { key: 'address', label: 'Proof of address verified' },
  { key: 'accuracy', label: 'All submitted information is accurate' }
]

const checkedItems = ref([...props.modelValue])

watch(checkedItems, (newValue) => {
  emit('update:modelValue', newValue)
  const isComplete = newValue.length === checklistItems.length
  emit('complete', isComplete)
}, { deep: true })

// Allow parent to control checked items
watch(() => props.modelValue, (newVal) => {
  checkedItems.value = [...newVal]
})
</script>