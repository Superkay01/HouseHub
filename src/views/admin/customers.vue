<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] leading-tight">
            Customers
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-medium-gray mt-1 sm:mt-2">
            Manage customers in 
            <span class="font-semibold text-[var(--royal-blue)]">
              {{ adminProfile.city }}, {{ adminProfile.state }}
            </span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            @click="exportCSV"
            class="flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 
                   bg-white border border-[var(--royal-blue)] text-[var(--royal-blue)]
                   rounded-xl sm:rounded-2xl 
                   hover:bg-[var(--royal-blue)] hover:text-white
                   flex items-center justify-center gap-1.5 sm:gap-2 
                   text-xs sm:text-sm font-medium
                   transition-colors duration-200
                   min-h-[44px]"
          >
            <span class="text-base">📥</span>
            <span>CSV</span>
          </button>

          <button 
            @click="exportPDF"
            class="flex-1 sm:flex-none px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 
                   bg-white border border-[var(--royal-blue)] text-[var(--royal-blue)]
                   rounded-xl sm:rounded-2xl 
                   hover:bg-[var(--royal-blue)] hover:text-white
                   flex items-center justify-center gap-1.5 sm:gap-2 
                   text-xs sm:text-sm font-medium
                   transition-colors duration-200
                   min-h-[44px]"
          >
            <span class="text-base">📄</span>
            <span>PDF</span>
          </button>

          <button 
            @click="refreshAll"
            class="flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 
                   bg-[var(--royal-blue)] text-white 
                   rounded-xl sm:rounded-2xl 
                   hover:opacity-90 active:opacity-80
                   flex items-center justify-center gap-1.5 sm:gap-2 
                   text-xs sm:text-sm font-medium
                   transition-opacity duration-200
                   min-h-[44px] shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 lg:mb-10">
        <StatsCard type="total" label="Total Customers" color="royal-blue" />
        <StatsCard type="active" label="Active Customers" color="bright-green" />
        <StatsCard type="new" label="New This Month" color="periwinkle" />
        <StatsCard type="requests" label="Inspection Requests" color="medium-blue" />
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <div class="flex flex-col lg:flex-row flex-wrap gap-3 sm:gap-4 items-stretch lg:items-center">
          
          <!-- Search -->
          <div class="flex-1 min-w-0 lg:min-w-[280px]">
            <div class="relative">
              <Search class="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-[var(--steel-blue)] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email or phone number..."
                class="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 
                       rounded-xl sm:rounded-2xl 
                       border border-gray-200 
                       focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                       focus:outline-none text-sm sm:text-base text-[var(--royal-blue)] placeholder:text-[var(--steel-blue)] transition-colors duration-200
                       transition-colors"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:flex gap-3 sm:gap-4 w-full lg:w-auto">
            <select 
              v-model="cityFilter" 
              class="w-full lg:w-auto border border-gray-200 rounded-xl sm:rounded-2xl 
                     px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-sm sm:text-base bg-white min-h-[44px] text-[var(--royal-blue)] placeholder:text-[var(--steel-blue)]"
            >
              <option value="">All Cities</option>
              <option value="Ilorin">Ilorin</option>
              <option value="Ijebu Ode">Ijebu Ode</option>
            </select>

            <select 
              v-model="statusFilter" 
              class="w-full lg:w-auto border border-gray-200 rounded-xl sm:rounded-2xl 
                     px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                     focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                     focus:outline-none text-sm sm:text-base bg-white min-h-[44px] text-[var(--royal-blue)] placeholder:text-[var(--steel-blue)]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Export Button -->
          <button 
            @click="exportData" 
            class="w-full sm:w-auto lg:w-auto
                   px-4 sm:px-5 md:px-6 py-3 sm:py-4 
                   border border-[var(--royal-blue)] text-[var(--royal-blue)]
                   rounded-xl sm:rounded-2xl 
                   hover:bg-[var(--royal-blue)] hover:text-white
                   flex items-center justify-center gap-2 
                   text-sm sm:text-base font-medium
                   transition-colors duration-200
                   min-h-[44px]"
          >
            <Download class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <CustomerTable
            :customers="filteredCustomers"
            :loading="loading"
            @view="openCustomerDrawer"
          />
        </div>
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

    // Fetch Customers
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

// ✅ Correct handler
const openCustomerDrawer = (customer) => {
  console.log('Opening drawer with customer:', customer)
  selectedCustomer.value = customer
  console.log('selectedCustomer is now:', selectedCustomer.value)
}

const exportData = () => alert("Export functionality coming soon")
const exportCSV = () => alert("CSV export coming soon")
const exportPDF = () => alert("PDF export coming soon")
const refreshAll = () => fetchData()

onMounted(fetchData)
</script>