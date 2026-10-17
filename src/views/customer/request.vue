<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    

    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8 lg:mb-10">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--royal-blue)]">
            My Property Requests
          </h1>
          <p class="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-1.5">
            Track the progress of all your inspection and rental requests
          </p>
        </div>

        <div class="bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 shadow-sm self-start sm:self-auto">
          <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--royal-blue)]">
            {{ totalRequests }}
          </p>
          <p class="text-[10px] sm:text-xs md:text-sm text-gray-500">Total Requests</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-5 sm:mb-6 md:mb-8 lg:mb-10">
        <div class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[var(--light-blue)] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Send class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[var(--royal-blue)]" />
            </div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-[var(--royal-blue)] leading-tight">
                {{ totalRequests }}
              </p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Total</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-amber-600" />
            </div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-[var(--royal-blue)] leading-tight">
                {{ pendingRequests }}
              </p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Pending</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-emerald-600" />
            </div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-[var(--royal-blue)] leading-tight">
                {{ approvedRequests }}
              </p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Approved</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 lg:p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
            <div class="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <XCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-600" />
            </div>
            <div class="min-w-0">
              <p class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-[var(--royal-blue)] leading-tight">
                {{ rejectedRequests }}
              </p>
              <p class="text-[9px] sm:text-[11px] md:text-xs lg:text-sm text-gray-500 leading-tight">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm p-2.5 sm:p-3 md:p-4 lg:p-5 mb-4 sm:mb-6 md:mb-8">
        <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <!-- Search -->
          <div class="flex-1 relative">
            <Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by property or request ID..."
              class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm
                focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <!-- Filters — 3 columns on mobile, flex row on tablet+ -->
          <div class="grid grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-3">
            <select 
              v-model="statusFilter" 
              class="border border-gray-200 rounded-lg sm:rounded-xl px-1.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm
                focus:border-[var(--royal-blue)] focus:outline-none min-w-0"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="inspection_scheduled">Inspection Scheduled</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select 
              v-model="typeFilter" 
              class="border border-gray-200 rounded-lg sm:rounded-xl px-1.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm
                focus:border-[var(--royal-blue)] focus:outline-none min-w-0"
            >
              <option value="">All Types</option>
              <option value="inspection">Inspection</option>
              <option value="rent_inquiry">Rent Inquiry</option>
            </select>

            <select 
              v-model="sortBy" 
              class="border border-gray-200 rounded-lg sm:rounded-xl px-1.5 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm
                focus:border-[var(--royal-blue)] focus:outline-none min-w-0"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Requests Grid -->
      <div v-if="filteredRequests.length" class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <RequestCard
          v-for="request in filteredRequests"
          :key="request.id"
          :request="request"
          @view="viewRequest"
        />
      </div>

      <!-- Empty State -->
      <EmptyRequests v-else @browse="goToBrowse" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Search, Send, Clock, CheckCircle, XCircle } from 'lucide-vue-next'

import RequestCard from '@/components/customer/requests/RequestCard.vue'
import EmptyRequests from '@/components/customer/requests/EmptyRequests.vue'

const router = useRouter()
const requests = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const sortBy = ref('newest')

const fetchRequests = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('property_requests')
    .select(`
      *,
      properties (
        title,
        cover_image,
        price,
        area,
        city,
        state
      )
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  } else {
    requests.value = data || []
  }
}

const filteredRequests = computed(() => {
  let result = [...requests.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.properties?.title?.toLowerCase().includes(term) ||
      r.id?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) {
    result = result.filter(r => r.status === statusFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter(r => r.request_type === typeFilter.value)
  }

  if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }

  return result
})

const totalRequests = computed(() => requests.value.length)
const pendingRequests = computed(() => 
  requests.value.filter(r => r.status === 'pending').length
)
const approvedRequests = computed(() => 
  requests.value.filter(r => r.status === 'approved').length
)
const rejectedRequests = computed(() => 
  requests.value.filter(r => r.status === 'rejected').length
)

const viewRequest = (id) => {
  router.push({ 
    name: 'RequestDetail', 
    params: { id } 
  })
}

const goToBrowse = () => {
  router.push('/customer/browse')
}

onMounted(() => {
  fetchRequests()
})
</script>