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

const scheduleInspection = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('property_requests')
      .update({
        scheduled_date: form.value.scheduled_date,
        scheduled_time: form.value.scheduled_time,
        meeting_location: form.value.meeting_location,
        admin_notes: form.value.admin_notes,
        status: 'scheduled'
      })
      .eq('id', props.request.id)

    if (error) throw error

    // Optional: create notification for customer
    if (props.request.customer_id) {
      await supabase.from('notifications').insert({
        user_id: props.request.customer_id,
        title: 'Inspection Scheduled',
        message: `Your property inspection has been scheduled for ${form.value.scheduled_date} at ${form.value.scheduled_time}.`,
        type: 'inspection'
      })
    }

    emit('scheduled')
  } catch (err) {
    console.error(err)
    alert('Failed to schedule inspection')
  } finally {
    saving.value = false
  }
}
</script>