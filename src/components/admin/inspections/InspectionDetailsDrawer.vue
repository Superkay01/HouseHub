<template>
  <div class="fixed inset-0 z-50 flex justify-end bg-black/40" @click.self="emit('close')">
    <div
      class="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h2 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Details</h2>
          <p class="text-sm text-medium-gray">
            {{ inspection.inspection_code || inspection.id?.slice(0, 8) }}
          </p>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="text-2xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div class="p-6 space-y-8 flex-1">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <InspectionStatusBadge :status="inspection.status" />
          <span class="text-sm text-medium-gray">
            {{ formatDate(inspection.inspection_date) }} • {{ inspection.inspection_time || '—' }}
          </span>
        </div>

        <!-- Workflow helper -->
        <div class="rounded-2xl p-4 bg-blue-50 border border-blue-100 text-sm">
          <p class="font-semibold text-[var(--royal-blue)]">{{ statusHelper.title }}</p>
          <p class="text-medium-gray mt-1">{{ statusHelper.body }}</p>
        </div>

        <!-- Reschedule request banner -->
        <div
          v-if="inspection.status === 'reschedule_requested'"
          class="rounded-2xl p-4 bg-indigo-50 border border-indigo-100 text-sm space-y-1"
        >
          <p class="font-semibold text-indigo-800">Agent requested reschedule</p>
          <p>
            Current:
            {{ formatDate(inspection.inspection_date) }} · {{ inspection.inspection_time || '—' }}
          </p>
          <p>
            Proposed:
            {{ formatDate(inspection.proposed_inspection_date) }} ·
            {{ inspection.proposed_inspection_time || '—' }}
          </p>
          <p class="text-indigo-900">Reason: {{ inspection.reschedule_reason || '—' }}</p>
        </div>

        <!-- Decline banner -->
        <div
          v-if="inspection.status === 'declined'"
          class="rounded-2xl p-4 bg-orange-50 border border-orange-100 text-sm"
        >
          <p class="font-semibold text-orange-800">Agent declined this assignment</p>
          <p class="mt-1">{{ inspection.agent_decline_reason || 'No reason provided' }}</p>
          <p v-if="inspection.agent_declined_at" class="text-xs text-medium-gray mt-1">
            {{ formatDateTime(inspection.agent_declined_at) }}
          </p>
        </div>

        <!-- Customer -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Customer</h3>
          <div class="flex items-center gap-4">
            <img
              :src="inspection.customer?.avatar_url || '/default-avatar.png'"
              class="w-14 h-14 rounded-2xl object-cover"
              alt="Customer"
            />
            <div>
              <p class="font-medium">{{ inspection.customer?.full_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.customer?.email || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.customer?.phone || '—' }}</p>
              <p class="text-sm mt-1">
                Confirmation:
                <span class="font-medium">{{ customerConfirmationLabel }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- ========== CUSTOMER REPORT ========== -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Customer Report</h3>

          <div v-if="loadingReport" class="text-sm text-medium-gray">
            Loading report...
          </div>

          <div
            v-else-if="customerReport"
            class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm space-y-3"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="font-medium text-indigo-800 capitalize">
                Interest Level:
                {{ (customerReport.interest_level || '—').replace(/_/g, ' ') }}
              </span>
              <span class="text-xs text-medium-gray whitespace-nowrap">
                {{ formatDateTime(customerReport.created_at) }}
              </span>
            </div>

            <div>
              <p class="text-xs font-semibold text-indigo-700 mb-1">Report / Feedback</p>
              <p class="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {{ customerReport.report }}
              </p>
            </div>
          </div>

          <div
            v-else
            class="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-medium-gray"
          >
            {{ inspection.status === 'completed'
              ? 'No customer report has been submitted yet.'
              : 'Customer report will appear here after the inspection is completed and the customer submits feedback.' }}
          </div>
        </section>

        <!-- Property -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Property</h3>
          <div class="flex gap-4">
            <img
              :src="inspection.property?.cover_image || 'https://via.placeholder.com/120x80'"
              class="w-28 h-20 object-cover rounded-2xl"
              alt="Property"
            />
            <div>
              <p class="font-medium">{{ inspection.property?.title || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.property?.property_type || '—' }}</p>
              <p class="text-sm font-semibold text-[var(--royal-blue)]">
                ₦{{ Number(inspection.property?.price || 0).toLocaleString() }}
              </p>
              <p class="text-sm text-medium-gray">
                {{ inspection.property?.city || '—' }}, {{ inspection.property?.state || '—' }}
              </p>
            </div>
          </div>
        </section>

        <!-- Agent -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Assigned Agent</h3>
          <div v-if="inspection.agent" class="flex items-center gap-4">
            <img
              :src="inspection.agent?.avatar_url || '/default-avatar.png'"
              class="w-12 h-12 rounded-2xl object-cover"
              alt="Agent"
            />
            <div>
              <p class="font-medium">{{ inspection.agent?.full_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.agent?.agency_name || '—' }}</p>
              <p class="text-sm text-medium-gray">{{ inspection.agent?.phone || '—' }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-medium-gray">No agent assigned yet.</p>
        </section>

        <!-- Notes -->
        <section v-if="inspection.admin_notes || inspection.completion_notes || inspection.agent_notes">
          <h3 class="font-semibold text-[var(--royal-blue)] mb-3">Notes</h3>
          <div class="space-y-3 text-sm">
            <div v-if="inspection.admin_notes" class="bg-amber-50 p-4 rounded-2xl">
              <p class="font-medium text-amber-800 mb-1">Admin</p>
              <p>{{ inspection.admin_notes }}</p>
            </div>
            <div v-if="inspection.agent_notes" class="bg-gray-50 p-4 rounded-2xl">
              <p class="font-medium mb-1">Agent</p>
              <p>{{ inspection.agent_notes }}</p>
            </div>
            <div v-if="inspection.completion_notes" class="bg-green-50 p-4 rounded-2xl">
              <p class="font-medium text-green-800 mb-1">Completion</p>
              <p>{{ inspection.completion_notes }}</p>
            </div>
          </div>
        </section>

        <!-- Outcome (completed) -->
        <section
          v-if="inspection.status === 'completed'"
          class="bg-green-50 rounded-2xl p-4 text-sm space-y-1"
        >
          <h3 class="font-semibold text-green-800 mb-2">Inspection Outcome</h3>
          <p v-if="inspection.inspection_outcome" class="capitalize">
            Outcome: {{ String(inspection.inspection_outcome).replace(/_/g, ' ') }}
          </p>
          <p v-if="inspection.general_condition" class="capitalize">
            Condition: {{ inspection.general_condition }}
          </p>
          <p v-if="inspection.agent_recommendation" class="capitalize">
            Recommendation: {{ String(inspection.agent_recommendation).replace(/_/g, ' ') }}
          </p>
          <p v-if="inspection.customer_attended !== null && inspection.customer_attended !== undefined">
            Customer attended: {{ inspection.customer_attended ? 'Yes' : 'No' }}
          </p>
        </section>

        <!-- Inspection Evidence (photos + video) -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-[var(--royal-blue)]">Inspection Evidence</h3>
            <span v-if="mediaLoading" class="text-xs text-medium-gray">Loading...</span>
          </div>

          <div v-if="mediaLoading" class="grid grid-cols-3 gap-3">
            <div v-for="n in 3" :key="n" class="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
          </div>

          <template v-else-if="mediaItems.length">
            <!-- Photos -->
            <div v-if="photoItems.length" class="grid grid-cols-3 gap-3">
              <button
                v-for="item in photoItems"
                :key="item.id"
                type="button"
                class="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square group"
                @click="openLightbox(item)"
              >
                <img
                  :src="item.displayUrl"
                  class="w-full h-full object-cover transition group-hover:scale-105"
                  alt="Inspection photo"
                />
                <span
                  class="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full capitalize"
                >
                  {{ item.category || 'photo' }}
                </span>
              </button>
            </div>

            <!-- Videos -->
            <div v-if="videoItems.length" class="mt-4 space-y-3">
              <p class="text-sm font-medium text-[var(--royal-blue)]">Video evidence</p>
              <video
                v-for="item in videoItems"
                :key="item.id"
                :src="item.displayUrl"
                controls
                class="w-full rounded-2xl bg-black max-h-72"
              />
            </div>
          </template>

          <p
            v-else-if="inspection.status === 'completed' || inspection.status === 'in_progress'"
            class="text-sm text-medium-gray"
          >
            No photos or video uploaded for this inspection yet.
          </p>
        </section>

        <!-- Cancellation info -->
        <section v-if="inspection.status === 'cancelled'" class="bg-red-50 rounded-2xl p-4 text-sm">
          <p class="font-semibold text-red-700">
            Cancelled by {{ inspection.cancelled_by || 'system' }}
          </p>
          <p class="mt-1">{{ inspection.cancellation_reason || '—' }}</p>
        </section>

        <!-- Timeline -->
        <section>
          <h3 class="font-semibold text-[var(--royal-blue)] mb-4">Timeline</h3>
          <InspectionTimeline :inspection="inspection" />
        </section>
      </div>

      <!-- Actions -->
      <div class="sticky bottom-0 bg-white border-t p-6 space-y-3 z-20">
        <button
          v-if="['pending', 'accepted', 'declined'].includes(inspection.status) || !inspection.agent_id"
          type="button"
          @click.stop="emit('schedule', inspection)"
          class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[var(--medium-blue)] transition"
        >
          {{ inspection.status === 'declined' ? 'Reassign / Schedule' : '📅 Schedule / Assign Agent' }}
        </button>

        <button
          v-if="inspection.status === 'reschedule_requested'"
          type="button"
          @click.stop="emit('approve-reschedule', inspection)"
          class="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition"
        >
          Approve Proposed Reschedule
        </button>

        <button
          v-if="['scheduled', 'confirmed', 'rescheduled', 'reschedule_requested', 'accepted'].includes(inspection.status)"
          type="button"
          @click.stop="emit('reschedule', inspection)"
          class="w-full py-3.5 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl font-medium hover:bg-blue-50 transition"
        >
          Reschedule Inspection
        </button>

        <button
          v-if="['scheduled', 'confirmed', 'rescheduled', 'in_progress'].includes(inspection.status)"
          type="button"
          @click.stop="emit('complete', inspection)"
          class="w-full py-3.5 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition"
        >
          ✓ Mark as Completed
        </button>

        <button
          v-if="!['completed', 'cancelled'].includes(inspection.status)"
          type="button"
          @click.stop="emit('cancel', inspection)"
          class="w-full py-3.5 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition"
        >
          Cancel Inspection
        </button>

        <button
          type="button"
          @click.stop="emit('close')"
          class="w-full py-3.5 border border-gray-200 rounded-2xl text-medium-gray hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Photo lightbox -->
    <div
      v-if="lightboxUrl"
      class="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
      @click.self="lightboxUrl = null"
    >
      <button
        type="button"
        class="absolute top-4 right-4 text-white text-3xl"
        @click="lightboxUrl = null"
      >
        ×
      </button>
      <img :src="lightboxUrl" class="max-w-full max-h-[90vh] rounded-2xl object-contain" alt="Evidence" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { supabase } from '@/supabaseClient'
import InspectionStatusBadge from './InspectionStatusBadge.vue'
import InspectionTimeline from './InspectionTimeline.vue'

const props = defineProps({
  inspection: { type: Object, required: true }
})

const emit = defineEmits([
  'close',
  'schedule',
  'reschedule',
  'complete',
  'cancel',
  'approve-reschedule',
  'reassign'
])

const mediaItems = ref([])
const mediaLoading = ref(false)
const lightboxUrl = ref(null)

const customerReport = ref(null)
const loadingReport = ref(false)

const photoItems = computed(() =>
  mediaItems.value.filter((m) => m.media_type === 'photo')
)
const videoItems = computed(() =>
  mediaItems.value.filter((m) => m.media_type === 'video')
)

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateTime = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const customerConfirmationLabel = computed(() => {
  const i = props.inspection
  if (i.customer_confirmation_status === 'confirmed' || i.customer_confirmed_at) {
    return '✓ Customer confirmed'
  }
  if (i.customer_confirmation_status === 'cancelled') return '✕ Customer cancelled'
  return '⏳ Awaiting customer'
})

const statusHelper = computed(() => {
  const s = props.inspection.status
  const map = {
    pending: {
      title: 'Awaiting agent response',
      body: 'Assign/schedule an agent. Agent must accept before the visit is fully locked in.'
    },
    accepted: {
      title: 'Agent accepted',
      body: 'Agent accepted the assignment. Confirm final schedule if not already set.'
    },
    declined: {
      title: 'Agent declined',
      body: 'Reassign to another verified agent and notify the customer if needed.'
    },
    scheduled: {
      title: 'Scheduled',
      body: 'Waiting for agent confirmation and/or customer attendance confirmation.'
    },
    confirmed: {
      title: 'Confirmed',
      body: 'Agent confirmed. Monitor customer confirmation and inspection day progress.'
    },
    reschedule_requested: {
      title: 'Reschedule requested',
      body: 'Review the proposed time. Approve it or set a different schedule.'
    },
    in_progress: {
      title: 'In progress',
      body: 'Agent is conducting the inspection / completing the report.'
    },
    completed: {
      title: 'Completed',
      body: 'Inspection report submitted. Review outcome, customer feedback and evidence below.'
    },
    cancelled: {
      title: 'Cancelled',
      body: props.inspection.cancellation_reason || 'This inspection will not hold.'
    },
    no_show: {
      title: 'No-show',
      body: 'Customer did not attend. Follow up if another visit is needed.'
    }
  }
  return map[s] || { title: s || 'Inspection', body: '' }
})

const resolveDisplayUrl = async (item) => {
  if (item.url && String(item.url).startsWith('http')) return item.url
  if (!item.storage_path) return item.url || null

  const { data, error } = await supabase.storage
    .from('inspection-evidence')
    .createSignedUrl(item.storage_path, 3600)

  if (error) {
    console.error('Signed URL error:', error)
    return item.url || null
  }
  return data?.signedUrl || null
}

const loadMedia = async (inspectionId) => {
  mediaItems.value = []
  if (!inspectionId) return

  mediaLoading.value = true
  try {
    const { data, error } = await supabase
      .from('inspection_media')
      .select('id, media_type, category, url, storage_path, created_at')
      .eq('inspection_id', inspectionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const withUrls = await Promise.all(
      (data || []).map(async (item) => ({
        ...item,
        displayUrl: await resolveDisplayUrl(item)
      }))
    )

    mediaItems.value = withUrls.filter((m) => m.displayUrl)
  } catch (err) {
    console.error('Failed to load inspection media:', err)
    mediaItems.value = []
  } finally {
    mediaLoading.value = false
  }
}

const loadCustomerReport = async (inspectionId) => {
  customerReport.value = null
  if (!inspectionId) return

  loadingReport.value = true
  try {
    const { data, error } = await supabase
      .from('customer_reports')
      .select('*')
      .eq('inspection_id', inspectionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    customerReport.value = data
  } catch (err) {
    console.error('Failed to load customer report:', err)
    customerReport.value = null
  } finally {
    loadingReport.value = false
  }
}

const openLightbox = (item) => {
  lightboxUrl.value = item.displayUrl
}

watch(
  () => props.inspection?.id,
  (id) => {
    lightboxUrl.value = null
    loadMedia(id)
    loadCustomerReport(id)
  },
  { immediate: true }
)
</script>