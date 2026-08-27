<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-bold text-[var(--royal-blue)]">Recent Property Requests</h2>
      <button
        type="button"
        class="text-sm font-medium text-[var(--royal-blue)] hover:underline"
        @click="fetchRequests"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="py-10 text-center text-sm text-gray-500">
      Loading requests...
    </div>

    <div v-else-if="error" class="py-6 text-center text-sm text-red-600">
      {{ error }}
      <button type="button" class="block mx-auto mt-2 underline" @click="fetchRequests">
        Try again
      </button>
    </div>

    <div v-else-if="requests.length === 0" class="py-10 text-center text-sm text-gray-500">
      No recent property requests
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-gray-500 border-b">
            <th class="pb-3 pr-3 font-semibold">Customer</th>
            <th class="pb-3 pr-3 font-semibold">Property / Area</th>
            <th class="pb-3 pr-3 font-semibold">Status</th>
            <th class="pb-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="req in requests"
            :key="req.id"
            class="border-b border-gray-50 hover:bg-gray-50/80"
          >
            <td class="py-3 pr-3">
              <p class="font-medium text-gray-900">
                {{ req.customer?.full_name || '—' }}
              </p>
              <p class="text-xs text-gray-500">{{ req.customer?.phone || req.customer?.email || '' }}</p>
            </td>
            <td class="py-3 pr-3">
              <p class="font-medium text-gray-900 line-clamp-1">
                {{ req.property?.title || req.preferred_area || req.area || 'Request' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ req.city || req.property?.city || '—' }}
              </p>
            </td>
            <td class="py-3 pr-3">
              <span
                class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                :class="statusClass(req.status)"
              >
                {{ (req.status || '—').replace(/_/g, ' ') }}
              </span>
            </td>
            <td class="py-3 text-gray-600 whitespace-nowrap">
              {{ formatDate(req.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({
  adminState: {
    type: String,
    default: ''
  }
})

const requests = ref([])
const loading = ref(true)
const error = ref('')

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const statusClass = (status) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700',
    accepted: 'bg-blue-50 text-blue-700',
    scheduled: 'bg-indigo-50 text-indigo-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600',
    rejected: 'bg-red-50 text-red-700'
  }
  return map[status] || 'bg-gray-50 text-gray-600'
}

const fetchRequests = async () => {
  loading.value = true
  error.value = ''

  try {
    // Adjust FK names if your schema differs
    let query = supabase
      .from('property_requests')
      .select(`
        id,
        status,
        created_at,
        city,
        state,
        area,
        preferred_area,
        customer:profiles!customer_id (
          id,
          full_name,
          email,
          phone
        ),
        property:properties (
          id,
          title,
          city,
          state
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Scope to admin state when available
    if (props.adminState) {
      query = query.eq('state', props.adminState)
    }

    const { data, error: fetchError } = await query

    if (fetchError) throw fetchError
    requests.value = data || []
  } catch (err) {
    console.error('Recent requests error:', err)
    error.value = err.message || 'Failed to load requests'
    requests.value = []
  } finally {
    loading.value = false
  }
}

const refresh = () => fetchRequests()

defineExpose({ refresh })

watch(
  () => props.adminState,
  (val) => {
    if (val) fetchRequests()
  }
)

onMounted(() => {
  fetchRequests()
})
</script>