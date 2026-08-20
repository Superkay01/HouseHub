<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-center py-10 text-medium-gray">
      Loading inspection...
    </div>

    <div v-else-if="error" class="bg-red-50 rounded-2xl p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <template v-else-if="inspection">
      <!-- Compact summary -->
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="statusBadgeClass(inspection.status)"
          >
            {{ displayStatus(inspection.status) }}
          </span>
        </div>

        <div>
          <p class="text-xs text-medium-gray">Inspection ID</p>
          <p class="font-semibold text-[var(--royal-blue)]">
            {{ inspection.inspection_code || inspection.id?.slice(0, 8) }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-medium-gray">Date</p>
            <p class="font-medium">{{ formatDate(inspection.inspection_date) }}</p>
          </div>
          <div>
            <p class="text-medium-gray">Time</p>
            <p class="font-medium">{{ inspection.inspection_time || '—' }}</p>
          </div>
          <div>
            <p class="text-medium-gray">Agent</p>
            <p class="font-medium">{{ inspection.agent?.full_name || 'Assigned agent' }}</p>
          </div>
          <div>
            <p class="text-medium-gray">Completed</p>
            <p class="font-medium">
              {{ formatDate(inspection.inspection_completed_at || inspection.updated_at) }}
            </p>
          </div>
          <div v-if="inspection.inspection_outcome">
            <p class="text-medium-gray">Outcome</p>
            <p class="font-medium capitalize">
              {{ displayStatus(inspection.inspection_outcome) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Property only when parent opts in -->
      <PropertyInformationSection
        v-if="showPropertyInfo"
        :property-id="inspection.property_id || inspection.property?.id"
        :property="inspection.property"
      />

      <!-- Post-completion: acknowledgement + payment + report -->
      <template v-if="inspection.status === 'completed'">
        <InspectionAcknowledgement
          :inspection-id="inspection.id"
          :customer-id="customerId"
          @acknowledged="onAcknowledged"
        />

        <!-- Payment button (shown when acknowledgement is done and not yet paid) -->
        <InspectionPayment
  :inspection-id="inspection.id"
  @paid="onPaid"
/>

        <InspectionReportViewer
          :inspection-id="inspection.id"
          :status="inspection.status"
          :payment-status="inspection.payment_status || 'pending'"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import PropertyInformationSection from './PropertyInformationSection.vue'
import InspectionAcknowledgement from './InspectionAcknowledgement.vue'
import InspectionPayment from './InspectionPayment.vue'
import InspectionReportViewer from './InspectionReportViewer.vue'

const props = defineProps({
  inspectionId: { type: String, required: true },
  /** Parent drawer already shows property — keep false there */
  showPropertyInfo: { type: Boolean, default: false }
})

const inspection = ref(null)
const loading = ref(true)
const error = ref(null)
const customerId = ref(null)
const ackDone = ref(false)
let channel = null

const displayStatus = (s) => (s || '—').replace(/_/g, ' ')

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '—'

const statusBadgeClass = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800'
  if (['cancelled', 'no_show'].includes(status)) return 'bg-red-100 text-red-700'
  if (status === 'in_progress') return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-700'
}

const fetchInspection = async () => {
  loading.value = true
  error.value = null
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Please sign in')
    customerId.value = user.id

    const { data, error: err } = await supabase
      .from('inspections')
      .select(
        `
        id,
        inspection_code,
        property_id,
        inspection_date,
        inspection_time,
        status,
        inspection_completed_at,
        inspection_outcome,
        general_condition,
        completion_notes,
        agent_recommendation,
        payment_status,
        inspection_fee,
        updated_at,
        property:properties (
          id,
          title,
          property_type,
          purpose,
          state,
          city,
          area,
          address,
          description,
          price,
          bedrooms,
          bathrooms,
          toilets,
          condition,
          amenities,
          cover_image,
          image_1,
          image_2,
          image_3,
          image_4,
          image_5,
          video_url
        ),
        agent:profiles!agent_id (
          id,
          full_name,
          agency_name,
          phone,
          avatar_url
        )
      `
      )
      .eq('id', props.inspectionId)
      .eq('customer_id', user.id)
      .single()

    if (err) throw err
    inspection.value = data

    const { data: ack } = await supabase
      .from('inspection_acknowledgements')
      .select('id')
      .eq('inspection_id', props.inspectionId)
      .eq('customer_id', user.id)
      .maybeSingle()
    ackDone.value = !!ack
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Failed to load inspection'
  } finally {
    loading.value = false
  }
}

const onAcknowledged = () => {
  ackDone.value = true
}

const onPaid = () => {
  // Refresh so payment_status becomes 'paid' and the button hides
  fetchInspection()
}

const setupRealtime = async () => {
  channel = supabase
    .channel(`inspection-detail-${props.inspectionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inspections',
        filter: `id=eq.${props.inspectionId}`
      },
      () => fetchInspection()
    )
    .subscribe()
}

onMounted(async () => {
  await fetchInspection()
  await setupRealtime()
})

onUnmounted(async () => {
  if (channel) await supabase.removeChannel(channel)
})
</script>