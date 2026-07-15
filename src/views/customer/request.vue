<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <!-- Navbar -->
    <nav class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-15 w-30 object-cover" />
          <!-- <h1 class="text-2xl font-bold text-[var(--royal-blue)]">LodgeNext</h1> -->
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 class="md:text-5xl text-3xl font-bold text-[var(--royal-blue)]">My Property Requests</h1>
          <p class="text-[var(--steel-blue)] mt-3 md:text-lg text-sm">
            Track the progress of all your inspection and rental requests
          </p>
        </div>
        <div class="text-right bg-white rounded-3xl px-8 py-4 shadow-sm">
          <p class="text-4xl font-semibold text-[var(--royal-blue)]">{{ totalRequests }}</p>
          <p class="text-sm text-[var(--royal-blue)]">Total Requests</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-[var(--light-blue)] rounded-2xl flex items-center justify-center">
              <Send class="w-7 h-7 text-[var(--royal-blue)]" />
            </div>
            <div>
              <p class="text-4xl font-bold text-[var(--royal-blue)]">{{ totalRequests }}</p>
              <p class="text-[var(--royal-blue)] text-sm">Total Requests</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Clock class="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p class="text-4xl font-bold text-[var(--royal-blue)]">{{ pendingRequests }}</p>
              <p class="text-[var(--royal-blue)] text-sm">Pending</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <CheckCircle class="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p class="text-4xl font-bold text-[var(--royal-blue)]">{{ approvedRequests }}</p>
              <p class="text-[var(--royal-blue)] text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <XCircle class="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p class="text-4xl font-bold text-[var(--royal-blue)]">{{ rejectedRequests }}</p>
              <p class="text-[var(--royal-blue)] text-sm">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl shadow-sm p-6 mb-10">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-[280px]">
            <div class="relative">
              <Search class="absolute left-5 top-4 text-[var(--royal-blue)] w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by property title or request ID..."
                class="w-full pl-14 pr-6 py-4 rounded-2xl text-[var(--royal-blue)] border border-[var(--steel-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <select 
            v-model="statusFilter" 
            class="border border-[var(--steel-blue)] rounded-2xl px-6 py-4 text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="inspection_scheduled">Inspection Scheduled</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select 
            v-model="typeFilter" 
            class="border border-[var(--steel-blue)] rounded-2xl px-6 py-4 text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
          >
            <option value="">All Types</option>
            <option value="inspection">Inspection</option>
            <option value="rent_inquiry">Rent Inquiry</option>
          </select>

          <select 
            v-model="sortBy" 
            class="border border-[var(--steel-blue)] rounded-2xl px-6 py-4 text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Requests Grid -->
      <div v-if="filteredRequests.length" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

  // Sort
  if (sortBy.value === 'oldest') {
    result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }

  return result
})

const totalRequests = computed(() => requests.value.length)
const pendingRequests = computed(() => requests.value.filter(r => r.status === 'pending').length)
const approvedRequests = computed(() => requests.value.filter(r => r.status === 'approved').length)
const rejectedRequests = computed(() => requests.value.filter(r => r.status === 'rejected').length)

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