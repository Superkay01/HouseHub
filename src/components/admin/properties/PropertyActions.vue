<template>
  <div class="relative">
    <button 
      @click.stop="toggleDropdown"
      class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
    >
      <span class="text-xl text-medium-gray">⋮</span>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
    >
      <button 
        @click="viewProperty"
        class="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm">
        👁️ View Property
      </button>
      
      <button 
        v-if="property.status !== 'approved'"
        @click="approveProperty"
        class="w-full text-left px-4 py-2.5 hover:bg-green-50 text-green-600 flex items-center gap-3 text-sm">
        ✅ Approve
      </button>

      <button 
        v-if="property.status !== 'rejected'"
        @click="rejectProperty"
        class="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-3 text-sm">
        ❌ Reject
      </button>

      <button 
        @click="editProperty"
        class="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm">
        ✏️ Edit Property
      </button>

      <div class="border-t border-gray-100 my-1"></div>

      <button 
        @click="deleteProperty"
        class="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-3 text-sm">
        🗑️ Delete Property
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const showDropdown = ref(false)

const emit = defineEmits(['view', 'approve', 'reject', 'edit', 'delete'])

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const viewProperty = () => {
  emit('view', props.property)
  showDropdown.value = false
}

const approveProperty = () => {
  emit('approve', props.property.id)
  showDropdown.value = false
}

const rejectProperty = () => {
  emit('reject', props.property.id)
  showDropdown.value = false
}

const editProperty = () => {
  alert('Edit functionality coming soon...')
  showDropdown.value = false
}

const deleteProperty = () => {
  if (confirm('Are you sure you want to delete this property?')) {
    emit('delete', props.property.id)
  }
  showDropdown.value = false
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest('.relative')) {
    showDropdown.value = false
  }
}

document.addEventListener('click', closeDropdown)

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>