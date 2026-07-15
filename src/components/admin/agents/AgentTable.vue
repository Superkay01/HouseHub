<template>
  <div>
    <!-- Table Header -->
    <div class="border-b bg-gray-50 px-8 py-5 flex items-center justify-between text-sm font-medium text-medium-gray">
      <div class="flex items-center gap-4">
        <input 
          type="checkbox"
          v-model="allSelected"
          class="w-5 h-5 accent-[var(--royal-blue)]"
        />
        <span>AGENT</span>
      </div>
      <div class="grid grid-cols-12 flex-1 px-8">
        <div class="col-span-2">Agency</div>
        <div class="col-span-2">Contact</div>
        <div class="col-span-2">City</div>
        <div class="col-span-1 text-center">Listings</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-2">Joined</div>
        <div class="col-span-1 text-right">Actions</div>
      </div>
    </div>

    <!-- Table Body -->
    <div v-if="agents.length" class="divide-y">
      <AgentRow
        v-for="agent in agents"
        :key="agent.id"
        :agent="agent"
        :is-selected="selected.includes(agent.id)"
        @toggle-select="toggleSelect(agent.id)"
        @view="$emit('view', agent)"
        @edit="$emit('edit', agent)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 text-center">
      <div class="mx-auto w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
        <Users class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-xl font-semibold text-dark-gray">No agents found</h3>
      <p class="text-medium-gray mt-2">Try adjusting your search or filters</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users } from 'lucide-vue-next'
import AgentRow from './AgentRow.vue'

const props = defineProps({
  agents: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view', 'edit'])

const selected = defineModel({
  type: Array,
  default: () => []
})

const allSelected = computed({
  get: () => props.agents.length > 0 && props.agents.every(agent => selected.value.includes(agent.id)),
  set: (value) => {
    if (value) {
      selected.value = props.agents.map(a => a.id)
    } else {
      selected.value = []
    }
  }
})

const toggleSelect = (id) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(item => item !== id)
  } else {
    selected.value.push(id)
  }
}
</script>