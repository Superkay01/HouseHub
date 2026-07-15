<template>
  <div class="flex items-center justify-between mt-10 px-4">
    <!-- Left: Info -->
    <div class="text-sm text-medium-gray">
      Showing 
      <span class="font-medium text-dark-gray">{{ startItem }}</span> to 
      <span class="font-medium text-dark-gray">{{ endItem }}</span> of 
      <span class="font-medium text-dark-gray">{{ totalItems }}</span> agents
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <!-- Previous -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="hidden sm:inline">Previous</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-10 h-10 flex items-center justify-center rounded-2xl font-medium transition-all',
            currentPage === page 
              ? 'bg-[var(--royal-blue)] text-white' 
              : 'hover:bg-gray-100 text-medium-gray'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <span class="hidden sm:inline">Next</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Mobile Load More -->
    <button 
      v-if="totalPages > 1"
      @click="loadMore"
      class="sm:hidden px-6 py-3 text-[var(--royal-blue)] font-medium flex items-center gap-2"
    >
      Load More
      <ChevronDown class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const startItem = computed(() => (props.currentPage - 1) * 15 + 1)
const endItem = computed(() => Math.min(props.currentPage * 15, props.totalItems))

const visiblePages = computed(() => {
  const pages = []
  let start = Math.max(1, props.currentPage - 2)
  let end = Math.min(props.totalPages, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page) => {
  if (page !== props.currentPage) {
    emit('change', page)
  }
}

const prevPage = () => {
  if (props.currentPage > 1) emit('change', props.currentPage - 1)
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) emit('change', props.currentPage + 1)
}

const loadMore = () => {
  if (props.currentPage < props.totalPages) {
    emit('change', props.currentPage + 1)
  }
}
</script>