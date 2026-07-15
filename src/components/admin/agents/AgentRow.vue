<template>
  <div class="group px-8 py-6 hover:bg-gray-50 transition-colors flex items-center gap-4">
    <!-- Checkbox -->
    <input 
      type="checkbox"
      :checked="isSelected"
      @change="$emit('toggle-select')"
      class="w-5 h-5 accent-[var(--royal-blue)]"
    />

    <!-- Avatar & Name -->
    <div class="flex items-center gap-4 flex-1">
      <img 
        :src="agent.avatar_url || `https://ui-avatars.com/api/?name=${agent.full_name}`" 
        class="w-11 h-11 rounded-2xl object-cover border border-gray-200"
      />
      <div>
        <p class="font-semibold text-gray-900">{{ agent.full_name }}</p>
        <p class="text-sm text-medium-gray">{{ agent.email }}</p>
      </div>
    </div>

    <!-- Agency -->
    <div class="flex-1">
      <p class="font-medium">{{ agent.agency_name || '—' }}</p>
    </div>

    <!-- Contact -->
    <div class="flex-1">
      <p class="font-medium text-sm">{{ agent.phone }}</p>
    </div>

    <!-- City -->
    <div class="flex-1">
      <p>{{ agent.city || '—' }}</p>
    </div>

    <!-- Listings -->
    <div class="w-20 text-center">
      <p class="font-semibold text-[var(--royal-blue)]">{{ agent.properties?.count || 0 }}</p>
    </div>

    <!-- Status -->
    <div class="flex-1">
      <span 
        :class="getStatusClass(agent.verification_status)"
        class="inline-block px-4 py-1.5 text-xs font-medium rounded-2xl"
      >
        {{ formatStatus(agent.verification_status) }}
      </span>
    </div>

    <!-- Joined -->
    <div class="flex-1 text-sm text-medium-gray">
      {{ new Date(agent.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) }}
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
      <button 
        @click.stop="$emit('view', agent)"
        class="px-4 py-2 text-sm hover:bg-gray-100 rounded-2xl transition-colors"
      >
        View
      </button>
      <button 
        @click.stop="$emit('edit', agent)"
        class="px-4 py-2 text-sm hover:bg-gray-100 rounded-2xl transition-colors"
      >
        Edit
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  agent: Object,
  isSelected: Boolean
})

const emit = defineEmits(['toggle-select', 'view', 'edit'])

const getStatusClass = (status) => {
  switch(status) {
    case 'verified': return 'bg-emerald-100 text-emerald-700'
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    case 'suspended': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
</script>