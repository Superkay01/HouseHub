<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Inspection Requests</h1>
        <p class="text-gray-600 mt-1">Manage customer property inspection requests</p>
      </div>
      
      <select v-model="filterStatus" class="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--royal-blue)]">
        <option value="">All Requests</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-3xl p-6 border">
        <div class="text-sm text-gray-500">Total Requests</div>
        <div class="text-4xl font-bold text-gray-900 mt-2">{{ requests.length }}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border">
        <div class="text-sm text-amber-600">Pending</div>
        <div class="text-4xl font-bold text-amber-600 mt-2">{{ pendingCount }}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border">
        <div class="text-sm text-green-600">Approved</div>
        <div class="text-4xl font-bold text-green-600 mt-2">{{ approvedCount }}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border">
        <div class="text-sm text-blue-600">Today</div>
        <div class="text-4xl font-bold text-blue-600 mt-2">{{ todayCount }}</div>
      </div>
    </div>

    <!-- Requests List -->
    <div class="bg-white rounded-3xl shadow overflow-hidden">
      <div v-if="filteredRequests.length === 0" class="p-20 text-center text-gray-500">
        No inspection requests found
      </div>

      <div v-else class="divide-y">
        <div v-for="req in filteredRequests" :key="req.id" 
             class="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row gap-6 items-start cursor-pointer"
             @click="openDetail(req)">
          
          <div class="flex-1">
            <div class="flex gap-4">
              <img 
                :src="req.properties?.cover_image" 
                class="w-24 h-20 rounded-2xl object-cover" 
              />
              <div>
                <h4 class="font-semibold text-lg">{{ req.properties?.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">
                  📍 {{ req.properties?.area }}, {{ req.properties?.city }}
                </p>
                <p class="text-sm font-medium text-[var(--royal-blue)] mt-2">
                  ₦{{ Number(req.properties?.price).toLocaleString() }} / year
                </p>
              </div>
            </div>
          </div>

          <div class="flex-1 md:flex-none">
            <div class="text-sm">
              <span class="text-gray-500">Customer ID:</span> 
              <span class="font-mono">{{ req.customer_id?.slice(0,8) }}</span>
            </div>
            
            <div class="mt-4">
              <div class="text-xs text-gray-500">Inspection Schedule</div>
              <div class="font-medium">
                {{ formatDate(req.inspection_date) }} • {{ req.inspection_time || 'TBA' }}
              </div>
            </div>

            <!-- Countdown Timer - ONLY when Approved -->
            <div v-if="req.status === 'approved' && req.timeLeft" class="mt-3 bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
              <div class="text-xs text-green-600 font-medium">Time Left Until Inspection</div>
              <div class="font-mono text-lg font-semibold text-green-700">
                {{ req.timeLeft.days }}d : {{ req.timeLeft.hours }}h : {{ req.timeLeft.minutes }}m
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 md:w-64">
            <RequestStatusBadge :status="req.status" />
          </div>
        </div>
      </div>
    </div>

    <!-- Inspection Detail Modal -->
    <InspectionDetailModal
      :isOpen="!!selectedRequest"
      :request="selectedRequest"
      @close="selectedRequest = null"
      @approve="approveRequest"
      @reject="rejectRequest"
      @complete="markAsCompleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import RequestStatusBadge from '@/components/admin/inspections/RequestStatusBadge.vue'
import InspectionDetailModal from '@/components/admin/inspections/InspectionDetailModal.vue'

const requests = ref([])
const filterStatus = ref('')
const selectedRequest = ref(null)
let countdownInterval = null

const fetchRequests = async () => {
  const { data, error } = await supabase
    .from('property_requests')
    .select(`
      *,
      properties (*)
    `)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching requests:', error)
  else requests.value = data || []
}

const calculateTimeLeft = (req) => {
  if (!req.inspection_date || req.status !== 'approved') return null

  const inspectionDate = new Date(req.inspection_date)
  if (req.inspection_time) {
    const [hours, minutes] = req.inspection_time.split(':').map(Number)
    inspectionDate.setHours(hours, minutes || 0)
  }

  const diff = inspectionDate - new Date()

  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  }
}

const startCountdowns = () => {
  countdownInterval = setInterval(() => {
    requests.value.forEach(req => {
      req.timeLeft = calculateTimeLeft(req)
    })
  }, 60000) // Update every minute
}

const filteredRequests = computed(() => {
  if (!filterStatus.value) return requests.value
  return requests.value.filter(r => r.status === filterStatus.value)
})

const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length)
const approvedCount = computed(() => requests.value.filter(r => r.status === 'approved').length)
const todayCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return requests.value.filter(r => r.inspection_date?.startsWith(today)).length
})

const formatDate = (date) => {
  if (!date) return 'Not Set'
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric' 
  })
}

const openDetail = (req) => {
  selectedRequest.value = req
}

const approveRequest = async (req) => {
  await supabase.from('property_requests').update({ status: 'approved' }).eq('id', req.id)
  await fetchRequests()
  selectedRequest.value = null
}

const rejectRequest = async (req) => {
  await supabase.from('property_requests').update({ status: 'rejected' }).eq('id', req.id)
  await fetchRequests()
  selectedRequest.value = null
}

const markAsCompleted = async (req) => {
  await supabase.from('property_requests').update({ status: 'completed' }).eq('id', req.id)
  await fetchRequests()
  selectedRequest.value = null
}

onMounted(() => {
  fetchRequests()
  startCountdowns()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>