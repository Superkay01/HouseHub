<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">Inspection Report</h3>

    <div v-if="!isUnlocked" class="text-center py-8">
      <p class="text-3xl mb-2">🔒</p>
      <p class="font-semibold text-medium-gray">Payment Required</p>
      <p class="text-sm text-medium-gray mt-2 max-w-sm mx-auto">
        Your inspection has been completed. Complete payment to access your full inspection report.
      </p>
    </div>

    <div v-else-if="loading" class="text-sm text-medium-gray">Loading report...</div>
    <div v-else-if="denied" class="text-sm text-red-600">
      Report is not available. Access is controlled by payment verification.
    </div>
    <template v-else-if="report">
      <p class="text-green-700 font-semibold mb-4">✓ Report Available</p>
      <div class="space-y-3 text-sm">
        <p v-if="report.general_condition"><strong>General:</strong> {{ report.general_condition }}</p>
        <p v-if="report.exterior_condition"><strong>Exterior:</strong> {{ report.exterior_condition }}</p>
        <p v-if="report.interior_condition"><strong>Interior:</strong> {{ report.interior_condition }}</p>
        <!-- map your real report columns -->
        <p v-if="report.completion_notes">{{ report.completion_notes }}</p>
        <p v-if="report.agent_recommendation">
          <strong>Recommendation:</strong> {{ report.agent_recommendation }}
        </p>
      </div>
      <div class="flex gap-2 mt-4">
        <button type="button" class="flex-1 py-3 bg-[var(--royal-blue)] text-white rounded-2xl text-sm font-semibold">
          View Report
        </button>
        <button type="button" class="flex-1 py-3 border rounded-2xl text-sm font-medium">
          Download PDF Report
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({
  inspectionId: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, default: '' }
})

const loading = ref(false)
const report = ref(null)
const denied = ref(false)

const isUnlocked = computed(
  () => props.status === 'completed' && props.paymentStatus === 'paid'
)

const load = async () => {
  if (!isUnlocked.value) {
    report.value = null
    return
  }
  loading.value = true
  denied.value = false
  try {
    // Prefer a dedicated inspection_reports table with RLS;
    // fallback: only non-sensitive fields if RLS blocks full row
    const { data, error } = await supabase
      .from('inspections')
      .select(
        `
        general_condition,
        completion_notes,
        agent_recommendation,
        inspection_outcome,
        exterior_condition,
        interior_condition,
        structural_condition,
        electrical_condition,
        plumbing_condition
      `
      )
      .eq('id', props.inspectionId)
      .single()

    if (error) {
      denied.value = true
      return
    }
    report.value = data
  } catch (e) {
    denied.value = true
  } finally {
    loading.value = false
  }
}

watch(isUnlocked, load, { immediate: true })
onMounted(load)
</script>