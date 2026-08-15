<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 class="text-xl font-bold text-[var(--royal-blue)]">
            {{ isEditMode ? 'Assign / Schedule Inspection' : 'Schedule Inspection' }}
          </h3>
          <p class="text-sm text-medium-gray mt-1">
            {{ adminProfile.city }}, {{ adminProfile.state }}
          </p>
        </div>
        <button type="button" @click="$emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Existing inspection context -->
        <div v-if="isEditMode" class="bg-gray-50 rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)]">Existing inspection</p>
          <p>Code: {{ inspection.inspection_code || inspection.id?.slice(0, 8) }}</p>
          <p>Status: <span class="capitalize">{{ inspection.status }}</span></p>
          <p>Customer: {{ inspection.customer?.full_name || selectedCustomer?.full_name || '—' }}</p>
          <p>Property: {{ inspection.property?.title || selectedProperty?.title || '—' }}</p>
        </div>

        <!-- Customer Search (create mode only) -->
        <div v-if="!isEditMode" class="relative">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Customer</label>
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
              <p class="text-xs text-medium-gray">{{ customer.email }} · {{ customer.phone }}</p>
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
            <button type="button" class="text-sm text-red-500" @click="clearCustomer">Clear</button>
          </div>
        </div>

        <!-- Property Search (create mode only) -->
        <div v-if="!isEditMode" class="relative">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Property</label>
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
            <button type="button" class="text-sm text-red-500" @click="clearProperty">Clear</button>
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

        <!-- Assignment mode -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            After saving
          </label>
          <select
            v-model="form.assignment_mode"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none"
          >
            <option value="pending">
              Assign to agent (status: pending — agent must accept)
            </option>
            <option value="scheduled">
              Confirm schedule (status: scheduled — ready for confirmations)
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
            placeholder="Optional notes for agent/customer..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Summary -->
        <div
          v-if="(selectedCustomer || isEditMode) && (selectedProperty || isEditMode)"
          class="bg-gray-50 rounded-3xl p-5 space-y-2 text-sm"
        >
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Summary</p>
          <p>
            <span class="text-medium-gray">Customer:</span>
            {{ selectedCustomer?.full_name || inspection?.customer?.full_name || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Property:</span>
            {{ selectedProperty?.title || inspection?.property?.title || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Date:</span>
            {{ form.inspection_date || '—' }} at {{ form.inspection_time || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Agent:</span>
            {{ selectedAgentName || 'Not selected' }}
          </p>
          <p>
            <span class="text-medium-gray">Status will be:</span>
            {{ form.assignment_mode }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white border-t px-6 py-5 flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="scheduleInspection"
          :disabled="!canSubmit || saving"
          class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)] disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : (isEditMode ? 'Save Assignment' : 'Confirm Inspection') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  adminProfile: { type: Object, required: true },
  inspection: { type: Object, default: null }
})

const emit = defineEmits(['close', 'scheduled'])

const isEditMode = computed(() => !!(props.inspection && props.inspection.id))

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
  admin_notes: '',
  assignment_mode: 'pending' // pending | scheduled
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
  if (isEditMode.value) {
    return !!(form.value.agent_id && form.value.inspection_date && form.value.inspection_time)
  }
  return !!(
    selectedCustomer.value &&
    selectedProperty.value &&
    form.value.agent_id &&
    form.value.inspection_date &&
    form.value.inspection_time
  )
})

const hydrateFromInspection = () => {
  const i = props.inspection
  if (!i) return

  selectedCustomer.value = i.customer || null
  selectedProperty.value = i.property || null
  form.value.agent_id = i.agent_id || ''
  form.value.inspection_date = i.inspection_date || ''
  form.value.inspection_time = (i.inspection_time || '').slice(0, 5)
  form.value.duration_minutes = i.duration_minutes || 60
  form.value.meeting_location = i.meeting_location || ''
  form.value.admin_notes = i.admin_notes || ''
  // declined / pending -> usually pending until agent accepts again
  form.value.assignment_mode =
    i.status === 'declined' || i.status === 'pending' ? 'pending' : 'scheduled'
}

const fetchData = async () => {
  try {
    const state = props.adminProfile.state
    if (!state) return

    const { data: customerData } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, city, state')
      .eq('role', 'customer')
      .eq('state', state)
      .order('full_name')
    customers.value = customerData || []

    const { data: propertyData } = await supabase
      .from('properties')
      .select('id, title, property_type, price, city, state, area, cover_image, status')
      .eq('state', state)
      .in('status', ['approved', 'pending'])
      .order('created_at', { ascending: false })
    properties.value = propertyData || []

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

    const status = form.value.assignment_mode // pending | scheduled
    const property = selectedProperty.value || props.inspection?.property
    const customer = selectedCustomer.value || props.inspection?.customer

    const payload = {
      agent_id: form.value.agent_id,
      admin_id: user.id,
      inspection_date: form.value.inspection_date,
      inspection_time: form.value.inspection_time,
      duration_minutes: form.value.duration_minutes,
      meeting_location: form.value.meeting_location,
      admin_notes: form.value.admin_notes,
      status,
      state: props.adminProfile.state,
      city: property?.city || props.adminProfile.city,
      scheduled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // reset decline / reschedule markers when reassigning
      agent_declined_at: null,
      agent_decline_reason: null,
      agent_accepted_at: status === 'pending' ? null : props.inspection?.agent_accepted_at || null
    }

    let data

    if (isEditMode.value) {
      const { data: updated, error } = await supabase
        .from('inspections')
        .update(payload)
        .eq('id', props.inspection.id)
        .select()
        .single()
      if (error) throw error
      data = updated
    } else {
      const insertPayload = {
        ...payload,
        customer_id: customer.id,
        property_id: property.id
      }
      const { data: created, error } = await supabase
        .from('inspections')
        .insert(insertPayload)
        .select()
        .single()
      if (error) throw error
      data = created
    }

    const title =
      status === 'pending' ? 'New Inspection Assignment' : 'Inspection Scheduled'
    const when = `${form.value.inspection_date} at ${form.value.inspection_time}`
    const propertyTitle = property?.title || 'a property'

    if (customer?.id) {
      await supabase.from('notifications').insert({
        user_id: customer.id,
        title: status === 'pending' ? 'Inspection Update' : 'Inspection Scheduled',
        message: status === 'pending'
          ? `An agent is being assigned for ${propertyTitle}.`
          : `Your inspection for ${propertyTitle} is scheduled for ${when}.`,
        type: 'inspection',
        related_id: data.id,
        related_table: 'inspections'
      })
    }

    if (form.value.agent_id) {
      await supabase.from('notifications').insert({
        user_id: form.value.agent_id,
        title,
        message: status === 'pending'
          ? `You have a new inspection assignment for ${propertyTitle} on ${when}. Please accept or decline.`
          : `Inspection for ${propertyTitle} is scheduled on ${when}.`,
        type: 'inspection',
        related_id: data.id,
        related_table: 'inspections'
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

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showCustomerDropdown.value = false
    showPropertyDropdown.value = false
  }
}

watch(
  () => props.inspection,
  () => hydrateFromInspection(),
  { immediate: true }
)

onMounted(() => {
  fetchData()
  hydrateFromInspection()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>