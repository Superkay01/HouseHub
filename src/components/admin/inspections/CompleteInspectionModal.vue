<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 class="text-xl font-bold text-[var(--royal-blue)]">Mark as Completed</h3>
          <p class="text-sm text-medium-gray mt-1">
            {{ inspection.inspection_code || 'Inspection' }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-2xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Inspection Summary -->
        <div class="bg-gray-50 rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Inspection Summary</p>
          <p>
            <span class="text-medium-gray">Customer:</span>
            {{ inspection.customer?.full_name || 'N/A' }}
          </p>
          <p>
            <span class="text-medium-gray">Property:</span>
            {{ inspection.property?.title || 'N/A' }}
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

        <!-- Completion Notes -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Inspection Notes
          </label>
          <textarea
            v-model="form.completion_notes"
            rows="4"
            placeholder="Example: Customer inspected the property successfully and asked about payment plans..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Customer Interest -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Customer Interest
          </label>
          <div class="grid grid-cols-1 gap-3">
            <button
              type="button"
              @click="form.customer_interest = 'interested'"
              :class="[
                'w-full text-left px-4 py-3 rounded-2xl border transition',
                form.customer_interest === 'interested'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <p class="font-medium text-green-700">Interested</p>
              <p class="text-xs text-medium-gray mt-1">
                Customer wants to proceed with this property
              </p>
            </button>

            <button
              type="button"
              @click="form.customer_interest = 'not_interested'"
              :class="[
                'w-full text-left px-4 py-3 rounded-2xl border transition',
                form.customer_interest === 'not_interested'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <p class="font-medium text-red-600">Not Interested</p>
              <p class="text-xs text-medium-gray mt-1">
                Customer does not want to continue with this property
              </p>
            </button>

            <button
              type="button"
              @click="form.customer_interest = 'awaiting'"
              :class="[
                'w-full text-left px-4 py-3 rounded-2xl border transition',
                form.customer_interest === 'awaiting'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <p class="font-medium text-amber-700">Awaiting Response</p>
              <p class="text-xs text-medium-gray mt-1">
                Customer has not decided yet
              </p>
            </button>
          </div>
        </div>

        <!-- Follow-up Action -->
        <div>
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Follow-up Action
          </label>
          <select
            v-model="form.follow_up_action"
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none"
          >
            <option value="">No follow-up needed</option>
            <option value="call_customer">Call customer</option>
            <option value="send_offer">Send offer / pricing details</option>
            <option value="share_documents">Share property documents</option>
            <option value="schedule_followup">Schedule follow-up meeting</option>
            <option value="assign_agent_followup">Assign agent for follow-up</option>
          </select>
        </div>

        <!-- Optional Follow-up Note -->
        <div v-if="form.follow_up_action">
          <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">
            Follow-up Note
          </label>
          <textarea
            v-model="form.follow_up_note"
            rows="3"
            placeholder="Add details for the follow-up action..."
            class="w-full px-4 py-3 rounded-2xl border border-[var(--light-blue)] focus:border-[var(--royal-blue)] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Notify Options -->
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.notify_customer"
              class="accent-[var(--royal-blue)] w-4 h-4"
            />
            <span class="text-sm text-[var(--royal-blue)]">Notify customer</span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.notify_agent"
              class="accent-[var(--royal-blue)] w-4 h-4"
            />
            <span class="text-sm text-[var(--royal-blue)]">Notify assigned agent</span>
          </label>
        </div>

        <!-- Final Summary -->
        <div class="bg-[var(--light-blue)] rounded-3xl p-4 text-sm space-y-1">
          <p class="font-semibold text-[var(--royal-blue)] mb-2">Completion Summary</p>
          <p>
            <span class="text-medium-gray">Interest:</span>
            {{ interestLabel }}
          </p>
          <p>
            <span class="text-medium-gray">Follow-up:</span>
            {{ followUpLabel }}
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
          @click="completeInspection"
          :disabled="!canSubmit || saving"
          class="flex-1 py-3.5 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Complete Inspection' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  inspection: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'completed'])

const saving = ref(false)

const form = ref({
  completion_notes: '',
  customer_interest: 'awaiting',
  follow_up_action: '',
  follow_up_note: '',
  notify_customer: true,
  notify_agent: true
})

const canSubmit = computed(() => {
  return !!form.value.customer_interest
})

const interestLabel = computed(() => {
  const map = {
    interested: 'Interested',
    not_interested: 'Not Interested',
    awaiting: 'Awaiting Response'
  }
  return map[form.value.customer_interest] || '—'
})

const followUpLabel = computed(() => {
  const map = {
    call_customer: 'Call customer',
    send_offer: 'Send offer / pricing details',
    share_documents: 'Share property documents',
    schedule_followup: 'Schedule follow-up meeting',
    assign_agent_followup: 'Assign agent for follow-up'
  }
  return map[form.value.follow_up_action] || 'No follow-up needed'
})

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const completeInspection = async () => {
  if (!canSubmit.value) return

  saving.value = true
  try {
    const updatePayload = {
      status: 'completed',
      completion_notes: form.value.completion_notes || null,
      customer_interest: form.value.customer_interest,
      completed_at: new Date().toISOString(),
      admin_notes: [
        props.inspection.admin_notes,
        form.value.follow_up_action
          ? `Follow-up: ${followUpLabel.value}${form.value.follow_up_note ? ' — ' + form.value.follow_up_note : ''}`
          : null
      ].filter(Boolean).join('\n')
    }

    const { error } = await supabase
      .from('inspections')
      .update(updatePayload)
      .eq('id', props.inspection.id)

    if (error) throw error

    // Notify customer
    if (form.value.notify_customer && props.inspection.customer_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.customer_id,
        title: 'Inspection Completed',
        message: `Your inspection for ${props.inspection.property?.title || 'the property'} has been marked as completed.`,
        type: 'inspection'
      })
    }

    // Notify agent
    if (form.value.notify_agent && props.inspection.agent_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.agent_id,
        title: 'Inspection Completed',
        message: `The inspection for ${props.inspection.property?.title || 'a property'} has been marked as completed.`,
        type: 'inspection'
      })
    }

    // Extra admin-style notification if customer is interested
    if (form.value.customer_interest === 'interested' && props.inspection.admin_id) {
      await supabase.from('notifications').insert({
        user_id: props.inspection.admin_id,
        title: 'Customer Interested',
        message: `${props.inspection.customer?.full_name || 'A customer'} is interested in ${props.inspection.property?.title || 'a property'} after inspection.`,
        type: 'inspection'
      })
    }

    emit('completed')
  } catch (err) {
    console.error(err)
    alert(err.message || 'Failed to complete inspection')
  } finally {
    saving.value = false
  }
}
</script>