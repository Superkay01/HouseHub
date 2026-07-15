<template>
  <div class="bg-white border border-[var(--royal-blue)]/20 rounded-3xl p-5 mb-8 shadow-sm flex items-center justify-between sticky top-6 z-40">
    <div class="flex items-center gap-4">
      <div class="bg-[var(--royal-blue)] text-white text-sm font-medium px-5 py-2.5 rounded-2xl flex items-center gap-2">
        <span>{{ count }} selected</span>
      </div>
      <p class="text-medium-gray text-sm">Agents selected for bulk action</p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Primary Actions -->
      <button
        @click="$emit('approve')"
        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl transition-all font-medium"
      >
        <CheckCircle class="w-5 h-5" />
        Approve Selected
      </button>

      <button
        @click="$emit('suspend')"
        class="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-2xl transition-all font-medium"
      >
        <PauseCircle class="w-5 h-5" />
        Suspend Selected
      </button>

      <!-- Danger Zone -->
      <button
        @click="confirmDelete"
        class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl transition-all font-medium"
      >
        <Trash2 class="w-5 h-5" />
        Delete Selected
      </button>

      <!-- Export -->
      <div class="relative group">
        <button
          @click="showExportMenu = !showExportMenu"
          class="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-6 py-3.5 rounded-2xl transition-all font-medium"
        >
          <Download class="w-5 h-5" />
          Export
        </button>

        <!-- Export Dropdown -->
        <div 
          v-if="showExportMenu"
          class="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-xl border border-gray-100 py-2 z-50"
        >
          <div class="px-4 py-2 text-xs font-medium text-medium-gray">EXPORT AS</div>
          <button @click="exportAs('csv')" class="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3">
            <span class="text-sm">CSV</span>
          </button>
          <button @click="exportAs('xlsx')" class="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3">
            <span class="text-sm">Excel (.xlsx)</span>
          </button>
          <button @click="exportAs('pdf')" class="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3">
            <span class="text-sm">PDF</span>
          </button>
        </div>
      </div>

      <button 
        @click="clearSelection"
        class="text-medium-gray hover:text-gray-900 px-4 py-3.5 transition-colors"
      >
        Clear Selection
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle, PauseCircle, Trash2, Download } from 'lucide-vue-next'

const props = defineProps({
  count: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['approve', 'suspend', 'delete'])

const showExportMenu = ref(false)

const confirmDelete = () => {
  if (confirm(`Delete ${props.count} selected agents? This action cannot be undone.`)) {
    emit('delete')
  }
}

const clearSelection = () => {
  emit('clear') // You can handle this in parent if needed
}

const exportAs = (format) => {
  alert(`Exporting ${props.count} agents as ${format.toUpperCase()}...`)
  showExportMenu.value = false
}
</script>