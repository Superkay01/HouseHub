<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 class="text-xl font-bold text-[var(--royal-blue)]">Reschedule Inspection</h3>
          <p class="text-sm text-medium-gray mt-1">
            {{ inspection.inspection_code || 'Inspection' }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Current Info -->
        <div class="bg-gray-50 rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Current Schedule</p>
          <p>
            <span class="text-medium-gray">Property:</span>
            {{ inspection.property?.title || 'N/A' }}
          </p>
          <p>
            <span class="text-medium-gray">Customer:</span>
            {{ inspection.customer?.full_name || 'N/A' }}
          </p>
          <p>
            <span class="text-medium-gray">Date:</span>
            {{ formatDate(inspection.inspection_date) }} at {{ inspection.inspection_time || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Agent:</span>
            {{ inspection.agent?.full_name || 'Not assigned' }}
          </p>
        </div>

        <!-- New Date / Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
              New Date
            </label>
            <input
              v-model="form.inspection_date"
              type="date"
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
              New Time
            </label>
            <input
              v-model="form.inspection_time"
              type="time"
              class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
            />
          </div>
        </div>

        <!-- Optional Agent Reassignment -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-[var(--royal-blue)]">
              Assigned Agent
            </label>
            <label class="flex items-center gap-2 text-sm text-medium-gray cursor-pointer">
              <input
                type="checkbox"
                v-model="reassignAgent"
                class="accent-[var(--royal-blue)]"
              />
              Reassign agent
            </label>
          </div>

          <select
            v-model="form.agent_id"
            :disabled="!reassignAgent"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">Keep current agent</option>
            <option
              v-for="agent in agents"
              :key="agent.id"
              :value="agent.id"
            >
              {{ agent.full_name }} — {{ agent.agency_name || 'Independent' }}
            </option>
          </select>
        </div>

        <!-- Meeting Location -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Meeting Location
          </label>
          <input
            v-model="form.meeting_location"
            type="text"
            placeholder="Property address / Office"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          />
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Reason for Rescheduling
          </label>
          <select
            v-model="form.reason"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none mb-3"
          >
            <option value="">Select reason</option>
            <option value="Customer requested new date">Customer requested new date</option>
            <option value="Agent unavailable">Agent unavailable</option>
            <option value="Property unavailable">Property unavailable</option>
            <option value="Scheduling conflict">Scheduling conflict</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            v-if="form.reason === 'Other' || form.reason"
            v-model="form.notes"
            rows="3"
            placeholder="Additional notes (optional)..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Summary -->
        <div class="bg-[var(--light-blue)] rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)] mb-2">New Schedule Summary</p>
          <p>
            <span class="text-medium-gray">New Date:</span>
            {{ form.inspection_date || '—' }} at {{ form.inspection_time || '—' }}
          </p>
          <p>
            <span class="text-medium-gray">Agent:</span>
            {{ displayAgentName }}
          </p>
          <p>
            <span class="text-medium-gray">Reason:</span>
            {{ form.reason || '—' }}
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
          @click="rescheduleInspection"
          :disabled="!canSubmit || saving"
          class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)] disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Confirm Reschedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  inspection: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'rescheduled'])

const agents = ref([])
const reassignAgent = ref(false)
const saving = ref(false)

const form = ref({
  inspection_date: props.inspection.inspection_date || '',
  inspection_time: props.inspection.inspection_time || '',
  agent_id: props.inspection.agent_id || '',
  meeting_location: props.inspection.meeting_location || '',
  reason: '',
  notes: ''
})

const canSubmit = computed(() => {
  return form.value.inspection_date && form.value.inspection_time && form.value.reason
})

const displayAgentName = computed(() => {
  if (reassignAgent.value && form.value.agent_id) {
    const agent = agents.value.find(a => a.id === form.value.agent_id)
    return agent?.full_name || 'Selected agent'
  }
  return props.inspection.agent?.full_name || 'Current agent'
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const fetchAgents = async () => {
  try {
    const state = props.inspection.state
    if (!state) return

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, agency_name, phone, verified')
      .eq('role', 'agent')
      .eq('state', state)
      .eq('verified', true)
      .order('full_name')

    if (error) throw error
    agents.value = data || []
  } catch (err) {
    console.error('Failed to load agents:', err)
  }
}

const rescheduleInspection = async () => {
  if (!canSubmit.value) return

  saving.value = true
  try {
    const updatePayload = {
      inspection_date: form.value.inspection_date,
      inspection_time: form.value.inspection_time,
      meeting_location: form.value.meeting_location,
      status: 'rescheduled',
      admin_notes: [
        form.value.reason,
        form.value.notes
      ].filter(Boolean).join(' — ')
    }

    // Only change agent if reassignment is enabled
    if (reassignAgent.value && form.value.agent_id) {
      updatePayload.agent_id = form.value.agent_id
    }

    const { error } = await supabase
      .from('inspections')
      .update(updatePayload)
      .eq('id', props.inspection.id)

    if (error) throw error

    // Notify customer
    if (props.inspection.customer_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.customer_id,
        title: 'Inspection Rescheduled',
        message: `Your inspection for ${props.inspection.property?.title || 'the property'} has been rescheduled to ${form.value.inspection_date} at ${form.value.inspection_time}.`,
        type: 'inspection'
      })
    }

    // Notify old agent (if exists)
    if (props.inspection.agent_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.agent_id,
        title: 'Inspection Rescheduled',
        message: `An inspection assigned to you has been rescheduled to ${form.value.inspection_date} at ${form.value.inspection_time}.`,
        type: 'inspection'
      })
    }

    // Notify new agent if reassigned
    if (
      reassignAgent.value &&
      form.value.agent_id &&
      form.value.agent_id !== props.inspection.agent_id
    ) {
      await supabase.from('notifications').insert({
        user_id: form.value.agent_id,
        title: 'New Inspection Assigned',
        message: `You have been assigned a rescheduled inspection for ${props.inspection.property?.title || 'a property'} on ${form.value.inspection_date} at ${form.value.inspection_time}.`,
        type: 'inspection'
      })
    }

    emit('rescheduled')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Failed to reschedule inspection')
  } finally {
    saving.value = false
  }
}

onMounted(fetchAgents)
</script>