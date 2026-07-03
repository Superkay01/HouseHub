<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-semibold text-[var(--royal-blue)]">Recent Property Requests</h3>
      <button 
        @click="fetchRecentRequests"
        class="text-[var(--royal-blue)] text-sm font-medium hover:underline"
      >
        Refresh
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-4 px-4 font-medium text-sm text-[var(--royal-blue)]">Property</th>
            <th class="text-left py-4 px-4 font-medium text-sm text-[var(--royal-blue)]">Client</th>
            <th class="text-left py-4 px-4 font-medium text-sm text-[var(--royal-blue)]">Location</th>
            <th class="text-left py-4 px-4 font-medium text-sm text-[var(--royal-blue)]">Status</th>
            <th class="text-right py-4 px-4 font-medium text-sm text-[var(--royal-blue)]">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="request in recentRequests" 
            :key="request.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-5 px-4">
              <div class="font-medium">{{ request.property_title || 'Untitled Property' }}</div>
              <div class="text-xs text-medium-gray">{{ request.property_type }}</div>
            </td>
            <td class="py-5 px-4">
              <div class="font-medium">{{ request.client_name || 'Unknown Client' }}</div>
              <div class="text-xs text-medium-gray">{{ request.client_phone }}</div>
            </td>
            <td class="py-5 px-4 text-sm">
              {{ request.city }}, {{ request.state }}
            </td>
            <td class="py-5 px-4">
              <span 
                :class="getStatusClass(request.status)"
                class="inline-block px-4 py-1 text-xs font-medium rounded-full"
              >
                {{ request.status }}
              </span>
            </td>
            <td class="py-5 px-4 text-right text-sm text-medium-gray">
              {{ formatDate(request.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!recentRequests.length" class="text-center py-16 text-medium-gray">
      No recent property requests
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const recentRequests = ref([])

const fetchRecentRequests = async () => {
  const { data, error } = await supabase
    .from('property_requests') // Change table name if different
    .select(`
      id,
      property_title,
      property_type,
      client_name,
      client_phone,
      city,
      state,
      status,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching recent requests:', error)
  } else {
    recentRequests.value = data || []
  }
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(() => {
  fetchRecentRequests()
})
</script>