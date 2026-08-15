<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 class="text-xl font-bold text-red-600">Cancel Inspection</h3>
          <p class="text-sm text-medium-gray mt-1">
            {{ inspection.inspection_code || 'Inspection' }}
          </p>
        </div>
        <button type="button" @click="$emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6 space-y-6">
        <div class="bg-gray-50 rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Inspection Summary</p>
          <p><span class="text-medium-gray">Customer:</span> {{ inspection.customer?.full_name || 'N/A' }}</p>
          <p><span class="text-medium-gray">Property:</span> {{ inspection.property?.title || 'N/A' }}</p>
          <p>
            <span class="text-medium-gray">Date:</span>
            {{ formatDate(inspection.inspection_date) }} at {{ inspection.inspection_time || '—' }}
          </p>
          <p><span class="text-medium-gray">Agent:</span> {{ inspection.agent?.full_name || 'Not assigned' }}</p>
          <p>
            <span class="text-medium-gray">Current Status:</span>
            <span class="capitalize">{{ inspection.status || '—' }}</span>
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Cancellation Reason
          </label>
          <div class="space-y-3">
            <button
              v-for="option in reasonOptions"
              :key="option"
              type="button"
              @click="form.reason = option"
              :class="[
                'w-full text-left px-4 py-3 rounded-2xl border transition',
                form.reason === option
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <p class="font-medium text-[var(--royal-blue)]">{{ option }}</p>
            </button>
          </div>
        </div>

        <div v-if="form.reason === 'Other'">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Custom Reason</label>
          <textarea
            v-model="form.custom_reason"
            rows="3"
            placeholder="Enter the cancellation reason..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Any extra details..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.notify_customer" class="accent-[var(--royal-blue)] w-4 h-4" />
            <span class="text-sm text-[var(--royal-blue)]">Notify customer</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.notify_agent" class="accent-[var(--royal-blue)] w-4 h-4" />
            <span class="text-sm text-[var(--royal-blue)]">Notify assigned agent</span>
          </label>
        </div>

        <div class="bg-red-50 border border-red-100 rounded-3xl p-4 text-sm text-red-700">
          This will mark the inspection as <strong>cancelled by admin</strong>.
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t px-6 py-5 flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50"
        >
          Keep Inspection
        </button>
        <button
          type="button"
          @click="cancelInspection"
          :disabled="!canSubmit || saving"
          class="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 disabled:opacity-50"
        >
          {{ saving ? 'Cancelling...' : 'Cancel Inspection' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  inspection: { type: Object, required: true }
})

const emit = defineEmits(['close', 'cancelled'])
const saving = ref(false)

const reasonOptions = [
  'Property unavailable',
  'Agent unavailable',
  'Customer requested cancellation',
  'Scheduling conflict',
  'Other'
]

const form = ref({
  reason: '',
  custom_reason: '',
  notes: '',
  notify_customer: true,
  notify_agent: true
})

const finalReason = computed(() => {
  if (form.value.reason === 'Other') return form.value.custom_reason.trim() || 'Other'
  return form.value.reason
})

const canSubmit = computed(() => {
  if (!form.value.reason) return false
  if (form.value.reason === 'Other' && !form.value.custom_reason.trim()) return false
  return true
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const cancelInspection = async () => {
  if (!canSubmit.value) return
  saving.value = true

  try {
    const reasonText = finalReason.value

    const updatePayload = {
      status: 'cancelled',
      cancelled_by: 'admin',
      cancellation_reason: reasonText,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      admin_notes: [
        props.inspection.admin_notes,
        form.value.notes ? `Cancellation note: ${form.value.notes}` : null
      ].filter(Boolean).join('\n')
    }

    const { error } = await supabase
      .from('inspections')
      .update(updatePayload)
      .eq('id', props.inspection.id)

    if (error) throw error

    if (form.value.notify_customer && props.inspection.customer_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.customer_id,
        title: 'Inspection Cancelled',
        message: `Your inspection for ${props.inspection.property?.title || 'the property'} has been cancelled. Reason: ${reasonText}`,
        type: 'inspection',
        related_id: props.inspection.id,
        related_table: 'inspections'
      })
    }

    if (form.value.notify_agent && props.inspection.agent_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.agent_id,
        title: 'Inspection Cancelled',
        message: `The inspection for ${props.inspection.property?.title || 'a property'} has been cancelled. Reason: ${reasonText}`,
        type: 'inspection',
        related_id: props.inspection.id,
        related_table: 'inspections'
      })
    }

    emit('cancelled')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Failed to cancel inspection')
  } finally {
    saving.value = false
  }
}
</script>