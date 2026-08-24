<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-12 md:pb-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          Activity History
        </h1>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-1">
          Your requests, inspections, and payments in one place
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-5 sm:mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          @click="activeTab = tab.value"
          class="px-4 py-2 text-sm rounded-xl border transition"
          :class="
            activeTab === tab.value
              ? 'bg-[var(--royal-blue)] text-white border-[var(--royal-blue)]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- REQUESTS -->
      <div v-else-if="activeTab === 'requests'" class="space-y-3">
        <div
          v-if="requests.length === 0"
          class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-10 text-center"
        >
          <p class="text-sm sm:text-base text-gray-500">No requests yet</p>
        </div>

        <button
          v-for="item in requests"
          :key="item.id"
          type="button"
          @click="openRequest(item)"
          class="w-full text-left bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {{ item.properties?.title || 'Property request' }}
              </p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">
                {{ item.request_code || 'No code' }} · {{ item.city || item.state || '—' }}
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-lg capitalize flex-shrink-0"
              :class="statusClass(item.status)"
            >
              {{ item.status || 'pending' }}
            </span>
          </div>
        </button>
      </div>

      <!-- INSPECTIONS -->
      <div v-else-if="activeTab === 'inspections'" class="space-y-3">
        <div
          v-if="inspections.length === 0"
          class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-10 text-center"
        >
          <p class="text-sm sm:text-base text-gray-500">No inspections yet</p>
        </div>

        <button
          v-for="item in inspections"
          :key="item.id"
          type="button"
          @click="openInspection(item)"
          class="w-full text-left bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {{ item.properties?.title || 'Inspection' }}
              </p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1">
                {{ item.inspection_code || 'No code' }}
                <span v-if="item.inspection_date">
                  · {{ item.inspection_date }}{{ item.inspection_time ? ` at ${item.inspection_time}` : '' }}
                </span>
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(item.created_at) }}</p>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-lg capitalize flex-shrink-0"
              :class="statusClass(item.status)"
            >
              {{ item.status || 'pending' }}
            </span>
          </div>
        </button>
      </div>

      <!-- PAYMENTS -->
      <div v-else class="space-y-3">
        <div
          v-if="payments.length === 0"
          class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-10 text-center"
        >
          <p class="text-sm sm:text-base text-gray-500">No payments yet</p>
        </div>

        <div
          v-for="item in payments"
          :key="item.id"
          class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm sm:text-base font-semibold text-gray-900">
                ₦{{ Number(item.amount || 0).toLocaleString() }}
              </p>
              <p class="text-xs sm:text-sm text-gray-500 mt-1 capitalize">
                {{ formatPaymentType(item.payment_type) }}
                <span v-if="item.properties?.title"> · {{ item.properties.title }}</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Ref: {{ item.reference || '—' }} · {{ formatDate(item.paid_at || item.created_at) }}
              </p>
            </div>
            <span
              class="text-xs px-2.5 py-1 rounded-lg capitalize flex-shrink-0"
              :class="paymentStatusClass(item.status)"
            >
              {{ item.status || 'pending' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()
const loading = ref(true)
const activeTab = ref('requests')

const requests = ref([])
const inspections = ref([])
const payments = ref([])

const tabs = [
  { value: 'requests', label: 'Requests' },
  { value: 'inspections', label: 'Inspections' },
  { value: 'payments', label: 'Payments' },
]

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPaymentType = (type) => {
  if (!type) return 'Payment'
  return type.replaceAll('_', ' ')
}

const statusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (['approved', 'accepted', 'confirmed', 'completed', 'paid', 'successful', 'success'].includes(s)) {
    return 'bg-green-100 text-green-700'
  }
  if (['pending', 'scheduled', 'processing', 'in_progress'].includes(s)) {
    return 'bg-yellow-100 text-yellow-700'
  }
  if (['declined', 'cancelled', 'rejected', 'failed', 'no_show'].includes(s)) {
    return 'bg-red-100 text-red-700'
  }
  return 'bg-gray-100 text-gray-700'
}

const paymentStatusClass = (status) => statusClass(status)

const openRequest = (item) => {
  router.push(`/customer/requests/${item.id}`)
}

const openInspection = () => {
  router.push('/customer/inspections')
}

const fetchAll = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const [reqRes, inspRes, payRes] = await Promise.all([
      supabase
        .from('property_requests')
        .select('*, properties(title, city, area)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('inspections')
        .select('*, properties(title, city, area)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('payments')
        .select('*, properties(title)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    if (reqRes.error) throw reqRes.error
    if (inspRes.error) throw inspRes.error
    if (payRes.error) throw payRes.error

    requests.value = reqRes.data || []
    inspections.value = inspRes.data || []
    payments.value = payRes.data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)
</script>