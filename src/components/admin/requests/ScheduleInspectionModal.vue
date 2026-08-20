<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl">
      <div class="p-6 border-b flex items-center justify-between">
        <h3 class="text-xl font-bold text-[var(--royal-blue)]">Schedule Inspection</h3>
        <button @click="$emit('close')" class="text-2xl text-gray-400">×</button>
      </div>

      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Inspection Date
          </label>
          <input
            v-model="form.scheduled_date"
            type="date"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Inspection Time
          </label>
          <input
            v-model="form.scheduled_time"
            type="time"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Meeting Location
          </label>
          <input
            v-model="form.meeting_location"
            type="text"
            placeholder="e.g. Property location / Office"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Admin Notes
          </label>
          <textarea
            v-model="form.admin_notes"
            rows="3"
            placeholder="Optional notes..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <div class="p-6 border-t flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 py-3.5 border border-gray-200 rounded-2xl"
        >
          Cancel
        </button>
        <button
          @click="scheduleInspection"
          :disabled="!form.scheduled_date || !form.scheduled_time || saving"
          class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl disabled:opacity-50"
        >
          {{ saving ? 'Scheduling...' : 'Schedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'scheduled'])

const form = ref({
  scheduled_date: '',
  scheduled_time: '',
  meeting_location: '',
  admin_notes: ''
})

const saving = ref(false)

// Normalize state so we always store "Kwara State"
const STATE_MAP = {
  'Kwara': 'Kwara State',
  'Ogun': 'Ogun State',
  'Lagos': 'Lagos State',
  'Oyo': 'Oyo State',
  'Osun': 'Osun State',
  'Ondo': 'Ondo State',
  'Ekiti': 'Ekiti State',
  'Edo': 'Edo State',
  'Delta': 'Delta State',
  'Rivers': 'Rivers State',
  'FCT': 'Federal Capital Territory',
  'Abuja': 'Federal Capital Territory'
}

const normalizeState = (state) => {
  if (!state) return state
  const trimmed = String(state).trim()
  if (trimmed.endsWith(' State') || trimmed === 'Federal Capital Territory') {
    return trimmed
  }
  return STATE_MAP[trimmed] || trimmed
}

const scheduleInspection = async () => {
  if (!props.request?.id) {
    alert('No request selected')
    return
  }

  if (!props.request.agent_id) {
    alert('Please assign an agent before scheduling the inspection.')
    return
  }

  saving.value = true

  try {
    const fullState = normalizeState(
      props.request.state ||
      props.request.property?.state ||
      props.request.properties?.state
    )

    // 1. Update the request
    const { error: requestError } = await supabase
      .from('property_requests')
      .update({
        scheduled_date: form.value.scheduled_date,
        scheduled_time: form.value.scheduled_time,
        meeting_location: form.value.meeting_location || null,
        admin_notes: form.value.admin_notes || null,
        status: 'scheduled',
        state: fullState,
        updated_at: new Date().toISOString()
      })
      .eq('id', props.request.id)

    if (requestError) throw requestError

    // 2. Create the inspection (this is what was missing)
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .insert({
        agent_id: props.request.agent_id,
        customer_id: props.request.customer_id,
        property_id: props.request.property_id,
        request_id: props.request.id,
        status: 'scheduled',
        state: fullState,
        city: props.request.city || props.request.property?.city || null,
        inspection_date: form.value.scheduled_date,
        inspection_time: form.value.scheduled_time,
        admin_notes: form.value.admin_notes || null,
        meeting_location: form.value.meeting_location || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (inspectionError) throw inspectionError

    // 3. Notify customer
    if (props.request.customer_id) {
      await supabase.from('notifications').insert({
        user_id: props.request.customer_id,
        title: 'Inspection Scheduled',
        message: `Your property inspection has been scheduled for ${form.value.scheduled_date} at ${form.value.scheduled_time}.`,
        type: 'inspection',
        related_id: inspection?.id || props.request.id,
        related_table: 'inspections'
      })
    }

    // 4. Notify agent
    if (props.request.agent_id) {
      await supabase.from('notifications').insert({
        user_id: props.request.agent_id,
        title: 'New Inspection Scheduled',
        message: `An inspection has been scheduled for ${form.value.scheduled_date} at ${form.value.scheduled_time}.`,
        type: 'inspection',
        related_id: inspection?.id || props.request.id,
        related_table: 'inspections'
      })
    }

    emit('scheduled')
  } catch (err) {
    console.error('Schedule error:', err)
    alert(err.message || 'Failed to schedule inspection')
  } finally {
    saving.value = false
  }
}
</script>