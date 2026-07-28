<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-10">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Customers</h1>
          <p class="text-medium-gray mt-2 text-lg">
            Manage customers in <span class="font-semibold">{{ adminProfile.city }}, {{ adminProfile.state }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="exportCSV" class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50 flex items-center gap-2">
            📥 CSV
          </button>
          <button @click="exportPDF" class="px-5 py-3 bg-white border border-[var(--light-blue)] rounded-2xl hover:bg-gray-50 flex items-center gap-2">
            📄 PDF
          </button>
          <button @click="refreshAll" class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)]">
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard type="total" label="Total Customers" color="royal-blue" />
        <StatsCard type="active" label="Active Customers" color="bright-green" />
        <StatsCard type="new" label="New This Month" color="periwinkle" />
        <StatsCard type="requests" label="Inspection Requests" color="medium-blue" />
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <Search class="absolute left-5 top-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email or phone number..."
                class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none"
              />
            </div>
          </div>

          <select v-model="cityFilter" class="border border-gray-200 rounded-2xl px-6 py-4 focus:border-[var(--royal-blue)]">
            <option value="">All Cities</option>
            <option value="Ilorin">Ilorin</option>
            <option value="Ijebu Ode">Ijebu Ode</option>
          </select>

          <select v-model="statusFilter" class="border border-gray-200 rounded-2xl px-6 py-4 focus:border-[var(--royal-blue)]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button @click="exportData" class="px-6 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center gap-2">
            <Download class="w-5 h-5" /> Export
          </button>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
        <CustomerTable
          :customers="filteredCustomers"
          :loading="loading"
          @view="openCustomerDrawer"
        />
      </div>
    </div>

    <!-- Customer Details Drawer -->
    <CustomerDetailsDrawer
      v-if="selectedCustomer"
      :customer="selectedCustomer"
      @close="selectedCustomer = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Search, Download } from 'lucide-vue-next'

import StatsCard from '@/components/admin/customers/StatsCard.vue'
import CustomerTable from '@/components/admin/customers/CustomerTable.vue'
import CustomerDetailsDrawer from '@/components/admin/customers/CustomerDetailsDrawer.vue'

const searchQuery = ref('')
const cityFilter = ref('')
const statusFilter = ref('')

const adminProfile = ref({ full_name: '', city: '', state: '' })
const customers = ref([])
const selectedCustomer = ref(null)
const loading = ref(true)



// Fetch Admin Profile + Customers
const fetchData = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get Admin Profile
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('full_name, state, city')
      .eq('id', user.id)
      .single()

    if (profile) adminProfile.value = profile

    // Fetch Customers (without problematic join)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .eq('state', profile.state)
      .order('created_at', { ascending: false })

    if (error) throw error

    customers.value = data || []
  } catch (err) {
    console.error('Error fetching customers:', err)
  } finally {
    loading.value = false
  }
}

const filteredCustomers = computed(() => {
  let result = [...customers.value]

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.full_name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    )
  }

  if (cityFilter.value) {
    result = result.filter(c => c.city === cityFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(c => c.status === statusFilter.value)
  }

  return result
})

const handleView = (customer) => {
  console.log("View button clicked for:", customer)
  emit('view', customer)
}

const exportData = () => alert("Export functionality coming soon")
const refreshAll = () => fetchData()

onMounted(fetchData)
</script>