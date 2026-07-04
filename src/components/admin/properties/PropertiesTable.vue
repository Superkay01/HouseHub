<template>
  <div>
    <div class="flex justify-between items-center mb-6 px-10 mt-4">
      <h3 class="font-semibold text-lg text-[var(--medium-blue)]">
        All Properties ({{ properties.length }})
      </h3>
      <button 
        @click="$emit('refresh')"
        class="text-[var(--royal-blue)] text-sm hover:underline">
        Refresh
      </button>
    </div>

    <!-- Agency Filter -->
    <div class="px-10 mb-6">
      <label class="block text-sm font-medium text-medium-gray mb-2">Filter by Agency</label>
      <select 
        v-model="agencyFilter" 
        class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)]">
        <option value="">All Agencies</option>
        <option 
          v-for="agency in uniqueAgencies" 
          :key="agency"
          :value="agency">
          {{ agency }}
        </option>
      </select>
    </div>

    <div v-if="filteredProperties.length === 0" 
         class="text-center py-16 border border-dashed border-[var(--hover-blue)] rounded-3xl">
      <div class="text-6xl mb-4 ">
        <img
          src="/Lodgenext_logo__2_-removebg-preview.png"
          alt="Lodgenext logo"
          class="h-25 w-55 object-contain m-auto"
        />
      </div>
      <p class="text-lg text-medium-gray">
        No properties found matching your criteria
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-[var(--hover-blue)] text-left text-sm font-medium text-medium-gray">
            <th class="py-4 px-4">Property</th>
            <th class="py-4 px-4">Price</th>
            <th class="py-4 px-4">Location</th>
            <th class="py-4 px-4">Agent / Agency</th>
            <th class="py-4 px-4">Status</th>
            <th class="py-4 px-4">Date Added</th>
            <th class="py-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--hover-blue)]">
          <tr 
            v-for="property in filteredProperties" 
            :key="property.id"
            class="hover:bg-[var(--light-blue)] transition-colors"
          >
            <td class="py-5 px-4">
              <div class="flex items-center gap-4">
                <img 
                  :src="property.cover_image || 'https://via.placeholder.com/80x60/0025cc/ffffff?text=No+Image'" 
                  class="w-16 h-12 object-cover rounded-xl"
                />
                <div>
                  <div class="font-semibold text-[var(--royal-blue)]">{{ property.title }}</div>
                  <div class="text-sm text-[var(--steel-blue)]">{{ property.property_type }}</div>
                </div>
              </div>
            </td>
            <td class="py-5 px-4">
              <div class="font-semibold text-xs sm:text-[15px] text-[var(--royal-blue)]">₦{{ Number(property.price || 0).toLocaleString() }}</div>
            </td>
            <td class="py-5 px-4 text-sm text-[var(--royal-blue)]">
              📍 {{ property.city }}, {{ property.state }}
            </td>
            <td class="py-5 px-4 text-sm text-[var(--royal-blue)]">
              {{ property.agent_id || 'N/A' }} 
              <!-- <span v-if="property.agent_id" class="text-xs text-medium-gray">
                ({{ property.agent_id }})
              </span> -->
            </td>
            <td class="py-5 px-4">
              <PropertyStatusBadge :status="property.status" />
            </td>
            <td class="py-5 px-4 text-sm text-[var(--royal-blue)]">
              {{ formatDate(property.created_at) }}
            </td>
            <td class="py-5 px-4 text-right">
              <div class="flex gap-2 justify-end">
                <button
                  @click="$emit('view', property)"
                  class="px-3 py-1 text-xs bg-[var(--light-blue)] hover:bg-[var(--hover-blue)] rounded-xl">
                  View
                </button>
                <button
                  v-if="property.status === 'pending'"
                  @click="$emit('approve', property.id)"
                  class="px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded-xl">
                  Approve
                </button>
                <button
                  v-if="property.status === 'pending'"
                  @click="$emit('reject', property.id)"
                  class="px-3 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded-xl">
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import PropertyStatusBadge from './PropertyStatusBadge.vue'

const props = defineProps({
  properties: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['view', 'approve', 'reject', 'refresh'])

const agencyFilter = ref('')

const uniqueAgencies = computed(() => {
  const agencies = props.properties
    .map(p => p.profiles?.agency_name)
    .filter(Boolean)
  return [...new Set(agencies)]
})

const filteredProperties = computed(() => {
  let result = [...props.properties]

  if (agencyFilter.value) {
    result = result.filter(p => p.profiles?.agency_name === agencyFilter.value)
  }

  return result
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>