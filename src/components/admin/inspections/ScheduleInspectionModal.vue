<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 class="text-xl font-bold text-[var(--royal-blue)]">Schedule Inspection</h3>
          <p class="text-sm text-medium-gray mt-1">
            {{ adminProfile.city }}, {{ adminProfile.state }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Customer Search -->
        <div class="relative">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Customer
          </label>
          <input
            v-model="customerQuery"
            type="text"
            placeholder="Search by name, email or phone..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            @focus="showCustomerDropdown = true"
          />

          <div
            v-if="showCustomerDropdown && filteredCustomers.length"
            class="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg max-h-56 overflow-y-auto"
          >
            <button
              v-for="customer in filteredCustomers"
              :key="customer.id"
              type="button"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
              @click="selectCustomer(customer)"
            >
              <p class="font-medium text-[var(--royal-blue)]">{{ customer.full_name }}</p>
              <p class="text-xs text-medium-gray">
                {{ customer.email }} · {{ customer.phone }}
              </p>
            </button>
          </div>

          <div
            v-if="selectedCustomer"
            class="mt-3 flex items-center justify-between bg-[var(--light-blue)] rounded-2xl px-4 py-3"
          >
            <div>
              <p class="font-medium">{{ selectedCustomer.full_name }}</p>
              <p class="text-xs text-medium-gray">{{ selectedCustomer.phone }}</p>
            </div>
            <button class="text-sm text-red-500" @click="clearCustomer">Clear</button>
          </div>
        </div>

        <!-- Property Search -->
        <div class="relative">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Property
          </label>
          <input
            v-model="propertyQuery"
            type="text"
            placeholder="Search by title, area or city..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            @focus="showPropertyDropdown = true"
          />

          <div
            v-if="showPropertyDropdown && filteredProperties.length"
            class="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg max-h-64 overflow-y-auto"
          >
            <button
              v-for="property in filteredProperties"
              :key="property.id"
              type="button"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
              @click="selectProperty(property)"
            >
              <div class="flex gap-3">
                <img
                  :src="property.cover_image || 'https://via.placeholder.com/60x45'"
                  class="w-14 h-10 object-cover rounded-xl"
                />
                <div>
                  <p class="font-medium text-[var(--royal-blue)]">{{ property.title }}</p>
                  <p class="text-xs text-medium-gray">
                    {{ property.property_type }} · {{ property.city }}
                  </p>
                  <p class="text-xs font-semibold text-[var(--royal-blue)]">
                    ₦{{ Number(property.price || 0).toLocaleString() }}
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div
            v-if="selectedProperty"
            class="mt-3 flex items-center justify-between bg-[var(--light-blue)] rounded-2xl px-4 py-3"
          >
            <div class="flex gap-3 items-center">
              <img
                :src="selectedProperty.cover_image || 'https://via.placeholder.com/60x45'"
                class="w-14 h-10 object-cover rounded-xl"
              />
              <div>
                <p class="font-medium">{{ selectedProperty.title }}</p>
                <p class="text-xs text-medium-gray">
                  {{ selectedProperty.city }}, {{ selectedProperty.state }}
                </p>
              </div>
            </div>
            <button class="text-sm text-red-500" @click="clearProperty">Clear</button>
          </div>
        </div>

        <!-- Agent -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Verified Agent
          </label>
          <select
            v-model="form.agent_id"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">Select verified agent</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.full_name }} — {{ agent.agency_name || 'Independent' }}
            </option>
          </select>
        </div>

        <!-- Date / Time / Duration -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Date</label>
            <input
              v-model="form.inspection_date"
              type="date"
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Time</label>
            <input
              v-model="form.inspection_time"
              type="time"
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Duration</label>
            <select
              v-model="form.duration_minutes"
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none"
            >
              <option :value="30">30 mins</option>
              <option :value="60">1 hour</option>
              <option :value="90">1.5 hours</option>
              <option :value="120">2 hours</option>
            </select>
          </div>
        </div>

        <!-- Meeting Location -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Meeting Location
          </label>
          <input
            v-model="form.meeting_location"
            type="text"
            placeholder="e.g. Property address / Agency office"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Admin Notes
          </label>
          <textarea
            v-model="form.admin_notes"
            rows="3"
            placeholder="Optional notes for this inspection..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Summary -->
        <div
          v-if="selectedCustomer && selectedProperty"
          class="bg-gray-50 rounded-3xl p-5 space-y-2 text-sm"
        >
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Summary</p>
          <p><span class="text-medium-gray">Customer:</span> {{ selectedCustomer.full_name }}</p>
          <p><span class="text-medium-gray">Property:</span> {{ selectedProperty.title }}</p>
          <p>
            <span class="text-medium-gray">Date:</span>
            {{ form.inspection_date || '—' }} at {{ form.inspection_time || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Agent:</span>
            {{ selectedAgentName || 'Not selected' }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white border-t px-6 py-5 flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="scheduleInspection"
          :disabled="!canSubmit || saving"
          class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)] disabled:opacity-50"
        >
          {{ saving ? 'Scheduling...' : 'Confirm Inspection' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  adminProfile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'scheduled'])

const customers = ref([])
const properties = ref([])
const agents = ref([])

const customerQuery = ref('')
const propertyQuery = ref('')
const showCustomerDropdown = ref(false)
const showPropertyDropdown = ref(false)

const selectedCustomer = ref(null)
const selectedProperty = ref(null)

const form = ref({
  agent_id: '',
  inspection_date: '',
  inspection_time: '',
  duration_minutes: 60,
  meeting_location: '',
  admin_notes: ''
})

const saving = ref(false)

const filteredCustomers = computed(() => {
  const term = customerQuery.value.toLowerCase().trim()
  if (!term) return customers.value.slice(0, 8)

  return customers.value
    .filter(c =>
      c.full_name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    )
    .slice(0, 8)
})

const filteredProperties = computed(() => {
  const term = propertyQuery.value.toLowerCase().trim()
  if (!term) return properties.value.slice(0, 8)

  return properties.value
    .filter(p =>
      p.title?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.area?.toLowerCase().includes(term) ||
      p.property_type?.toLowerCase().includes(term)
    )
    .slice(0, 8)
})

const selectedAgentName = computed(() => {
  const agent = agents.value.find(a => a.id === form.value.agent_id)
  return agent ? agent.full_name : ''
})

const canSubmit = computed(() => {
  return (
    selectedCustomer.value &&
    selectedProperty.value &&
    form.value.agent_id &&
    form.value.inspection_date &&
    form.value.inspection_time
  )
})

const fetchData = async () => {
  try {
    const state = props.adminProfile.state
    if (!state) return

    // Customers in state
    const { data: customerData } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, city, state')
      .eq('role', 'customer')
      .eq('state', state)
      .order('full_name')

    customers.value = customerData || []

    // Approved properties in state
    const { data: propertyData } = await supabase
      .from('properties')
      .select('id, title, property_type, price, city, state, area, cover_image, status')
      .eq('state', state)
      .in('status', ['approved', 'pending'])
      .order('created_at', { ascending: false })

    properties.value = propertyData || []

    // Verified agents in state
    const { data: agentData } = await supabase
      .from('profiles')
      .select('id, full_name, agency_name, phone, verified')
      .eq('role', 'agent')
      .eq('state', state)
      .eq('verified', true)
      .order('full_name')

    agents.value = agentData || []
  } catch (err) {
    console.error('Failed to load schedule data:', err)
  }
}

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  customerQuery.value = customer.full_name
  showCustomerDropdown.value = false
}

const clearCustomer = () => {
  selectedCustomer.value = null
  customerQuery.value = ''
}

const selectProperty = (property) => {
  selectedProperty.value = property
  propertyQuery.value = property.title
  showPropertyDropdown.value = false

  // Auto-fill meeting location if empty
  if (!form.value.meeting_location) {
    form.value.meeting_location = `${property.title}, ${property.city}`
  }
}

const clearProperty = () => {
  selectedProperty.value = null
  propertyQuery.value = ''
}

const scheduleInspection = async () => {
  if (!canSubmit.value) return

  saving.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const payload = {
      customer_id: selectedCustomer.value.id,
      property_id: selectedProperty.value.id,
      agent_id: form.value.agent_id,
      admin_id: user.id,
      inspection_date: form.value.inspection_date,
      inspection_time: form.value.inspection_time,
      duration_minutes: form.value.duration_minutes,
      meeting_location: form.value.meeting_location,
      admin_notes: form.value.admin_notes,
      status: 'scheduled',
      state: props.adminProfile.state,
      city: selectedProperty.value.city || props.adminProfile.city,
      scheduled_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('inspections')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    // Notify customer
    await supabase.from('notifications').insert({
      user_id: selectedCustomer.value.id,
      title: 'Inspection Scheduled',
      message: `Your inspection for ${selectedProperty.value.title} has been scheduled for ${form.value.inspection_date} at ${form.value.inspection_time}.`,
      type: 'inspection'
    })

    // Notify agent
    if (form.value.agent_id) {
      await supabase.from('notifications').insert({
        user_id: form.value.agent_id,
        title: 'New Inspection Assigned',
        message: `You have been assigned an inspection for ${selectedProperty.value.title} on ${form.value.inspection_date} at ${form.value.inspection_time}.`,
        type: 'inspection'
      })
    }

    emit('scheduled', data)
  } catch (err) {
    console.error(err)
    alert(err.message || 'Failed to schedule inspection')
  } finally {
    saving.value = false
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showCustomerDropdown.value = false
    showPropertyDropdown.value = false
  }
}

onMounted(() => {
  fetchData()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>