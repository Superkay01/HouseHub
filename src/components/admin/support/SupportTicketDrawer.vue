<template>
  <div class="fixed inset-0 z-50 flex justify-end bg-black/40">
    <div class="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-10">
        <div class="min-w-0">
          <h2 class="text-lg sm:text-xl font-bold text-[var(--royal-blue)]">
            Ticket Details
          </h2>
          <p class="text-xs sm:text-sm text-[var(--steel-blue)] mt-0.5">
            {{ ticket.id?.slice(0, 8) }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-2xl text-[var(--steel-blue)] hover:text-[var(--royal-blue)] leading-none"
        >
          ×
        </button>
      </div>

      <div class="p-4 sm:p-6 space-y-6 flex-1">

        <!-- Status + Date -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span
            class="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
            :class="statusClass(ticket.status)"
          >
            {{ ticket.status?.replace('_', ' ') }}
          </span>
          <span class="text-xs sm:text-sm text-[var(--steel-blue)]">
            {{ formatDate(ticket.created_at) }}
          </span>
        </div>

        <!-- User Info -->
        <section class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm font-semibold text-[var(--royal-blue)] mb-3">
            Submitted By
          </h3>
          <div class="flex items-start gap-3">
            <img
              :src="ticket.user?.avatar_url || '/default-avatar.png'"
              class="w-12 h-12 rounded-2xl object-cover border border-gray-200"
              alt="User"
            />
            <div class="min-w-0">
              <p class="font-medium text-sm text-[var(--royal-blue)]">
                {{ ticket.user?.full_name || 'Unknown' }}
              </p>
              <p class="text-xs text-[var(--steel-blue)] mt-0.5">
                {{ ticket.user?.email }}
              </p>
              <p class="text-xs text-[var(--steel-blue)]">
                {{ ticket.user?.phone || 'No phone' }}
              </p>
              <span
                class="inline-block mt-2 px-2.5 py-0.5 rounded-lg text-xs font-medium capitalize"
                :class="ticket.role === 'agent' 
                  ? 'bg-blue-50 text-[var(--royal-blue)]' 
                  : 'bg-purple-50 text-purple-700'"
              >
                {{ ticket.role }}
              </span>
            </div>
          </div>
        </section>

        <!-- Ticket Content -->
        <section class="bg-gray-50/70 rounded-2xl p-4 sm:p-5">
          <h3 class="text-sm font-semibold text-[var(--royal-blue)] mb-3">
            Ticket Information
          </h3>

          <div class="space-y-3 text-sm">
            <div>
              <p class="text-xs text-[var(--steel-blue)] mb-1">Category</p>
              <p class="font-medium text-[var(--royal-blue)] capitalize">
                {{ ticket.category }}
              </p>
            </div>

            <div>
              <p class="text-xs text-[var(--steel-blue)] mb-1">Subject</p>
              <p class="font-medium text-[var(--royal-blue)]">
                {{ ticket.subject }}
              </p>
            </div>

            <div>
              <p class="text-xs text-[var(--steel-blue)] mb-1">Message</p>
              <p class="text-[var(--royal-blue)] leading-relaxed bg-white border border-gray-100 p-3 rounded-xl">
                {{ ticket.message }}
              </p>
            </div>
          </div>
        </section>

        <!-- Admin Notes -->
        <section>
          <h3 class="text-sm font-semibold text-[var(--royal-blue)] mb-3">
            Admin Notes
          </h3>
          <textarea
            v-model="adminNotes"
            rows="4"
            placeholder="Add internal notes about this ticket..."
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                   focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/20
                   focus:outline-none text-[var(--royal-blue)] resize-none"
          ></textarea>
        </section>

        <!-- Update Status -->
        <section>
          <h3 class="text-sm font-semibold text-[var(--royal-blue)] mb-3">
            Update Status
          </h3>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
                   focus:border-[var(--royal-blue)] focus:outline-none text-[var(--royal-blue)]"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </section>
      </div>

      <!-- Actions -->
      <div class="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-6 space-y-2.5">
        <button
          @click="saveChanges"
          :disabled="isSaving"
          class="w-full py-3 bg-[var(--royal-blue)] text-white rounded-2xl text-sm font-medium
                 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>

        <button
          @click="$emit('close')"
          class="w-full py-3 border border-gray-200 text-[var(--steel-blue)] rounded-2xl text-sm
                 hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({
  ticket: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])

const adminNotes = ref('')
const selectedStatus = ref('open')
const isSaving = ref(false)

watch(
  () => props.ticket,
  (val) => {
    if (val) {
      adminNotes.value = val.admin_notes || ''
      selectedStatus.value = val.status || 'open'
    }
  },
  { immediate: true }
)

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClass = (status) => {
  const map = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({
        status: selectedStatus.value,
        admin_notes: adminNotes.value,
        updated_at: new Date().toISOString()
      })
      .eq('id', props.ticket.id)

    if (error) throw error

    emit('updated')
  } catch (err) {
    console.error('Failed to update ticket:', err)
    alert('Failed to save changes')
  } finally {
    isSaving.value = false
  }
}
</script>