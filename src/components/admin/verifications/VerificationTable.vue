<template>
  <div>
    <div class="flex justify-between items-center px-8 py-5 border-b border-[var(--royal-blue)] bg-white rounded-t-3xl">
      <h3 class="font-semibold text-lg text-[var(--royal-blue)]">
        Verification Requests ({{ verifications.length }})
      </h3>
      <button 
        @click="$emit('refresh')"
        class="text-[var(--royal-blue)] hover:underline text-sm flex items-center gap-1">
        ↻ Refresh
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-b-3xl">
      <table class="w-full min-w-full">
        <thead>
          <tr class="border-b text-left text-sm font-medium text-[var(--royal-blue)]">
            <th class="px-8 py-5 w-10">
              <input type="checkbox" class="rounded text-[var(--royal-blue)]" />
            </th>
            <th class="px-6 py-5">Agent</th>
            <th class="px-6 py-5">Agency</th>
            <th class="px-6 py-5">Phone</th>
            <th class="px-6 py-5">City / LGA</th>
            <th class="px-6 py-5">Applied On</th>
            <th class="px-6 py-5">Status</th>
            <th class="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--hover-blue)] text-[var(--royal-blue)]">
          <tr 
            v-for="item in verifications" 
            :key="item.id"
            class="hover:bg-[var(--hover-blue)] transition-colors"
          >
            <td class="px-8 py-5">
              <input type="checkbox" class="rounded" />
            </td>
            
            <td class="px-6 py-5">
              <div class="flex items-center gap-4">
                <img 
                  :src="item.profiles?.avatar_url || 'https://via.placeholder.com/48x48/0025cc/ffffff?text=NA'" 
                  class="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <div class="font-semibold text-[var(--royal-blue)]">{{ item.profiles?.full_name }}</div>
                  <div class="text-sm text-medium-gray">{{ item.profiles?.email }}</div>
                </div>
              </div>
            </td>

            <td class="px-6 py-5 font-medium text-[var(--royal-blue)]">
              {{ item.agency_name || '—' }}
            </td>

            <td class="px-6 py-5 text-sm text-[var(--royal-blue)]">
              {{ item.profiles?.phone || '—' }}
            </td>

            <td class="px-6 py-5 text-sm text-[var(--royal-blue)]">
              {{ item.city }} <span class="text-xs text-medium-gray">({{ item.lga }})</span>
            </td>

            <td class="px-6 py-5 text-sm text-[var(--royal-blue)]">
              {{ formatDate(item.submitted_at || item.created_at) }}
            </td>

            <td class="px-6 py-5">
              <VerificationStatusBadge :status="item.status || item.verification_status" />
            </td>

            <td class="px-6 py-5 text-right">
              <button 
                @click="$emit('view', item)"
                class="px-6 py-2.5 text-sm font-medium bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] transition">
                Review
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="verifications.length === 0" class="bg-white rounded-3xl py-20 text-center">
      <div class="text-6xl mb-4">📋</div>
      <p class="text-xl font-medium text-[var(--royal-blue)]">No verification requests found</p>
      <p class="text-[var(--steel-blue)] mt-2">All caught up in your state!</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import VerificationStatusBadge from './VerificationStatusBadge.vue'

const props = defineProps({
  verifications: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['view', 'refresh'])

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>