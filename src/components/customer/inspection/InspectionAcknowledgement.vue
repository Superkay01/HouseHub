<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-semibold text-[var(--royal-blue)] mb-2">
      Inspection Acknowledgement
    </h3>
    <p class="text-sm text-medium-gray mb-4">
      I confirm that I have reviewed the property information and understand that the
      inspection represents the observable condition of the property at the time of inspection.
    </p>

    <div v-if="loading" class="text-sm text-medium-gray py-2">
      Checking acknowledgement...
    </div>

    <div
      v-else-if="alreadyAck"
      class="bg-green-50 rounded-2xl p-4 text-sm text-green-800"
    >
      ✓ Acknowledgement recorded
      <span v-if="ackMeta?.acknowledged_at">
        · {{ formatDate(ackMeta.acknowledged_at) }}
      </span>
      <span v-if="ackMeta?.terms_version">
        · Terms {{ ackMeta.terms_version }}
      </span>
    </div>

    <template v-else>
      <label class="flex gap-3 items-start text-sm mb-3 cursor-pointer">
        <input v-model="checks.reviewed" type="checkbox" class="mt-1" />
        <span>I have reviewed the property information.</span>
      </label>
      <label class="flex gap-3 items-start text-sm mb-3 cursor-pointer">
        <input v-model="checks.terms" type="checkbox" class="mt-1" />
        <span>I understand the inspection terms and conditions.</span>
      </label>
      <label class="flex gap-3 items-start text-sm mb-3 cursor-pointer">
        <input v-model="checks.observations" type="checkbox" class="mt-1" />
        <span>I understand that the inspection is based on observations made during the inspection.</span>
      </label>
      <label class="flex gap-3 items-start text-sm mb-4 cursor-pointer">
        <input v-model="checks.reportPurpose" type="checkbox" class="mt-1" />
        <span>I understand that the inspection report is provided for property assessment purposes.</span>
      </label>

      <button
        type="button"
        class="text-sm text-[var(--royal-blue)] font-medium underline mb-4"
        @click="showTerms = true"
      >
        View Terms &amp; Conditions ({{ TERMS_VERSION }})
      </button>

      <p v-if="err" class="text-sm text-red-600 mb-2">{{ err }}</p>

      <button
        type="button"
        :disabled="!allChecked || saving"
        class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold disabled:opacity-50"
        @click="submit"
      >
        {{ saving ? 'Saving...' : 'Confirm Acknowledgement' }}
      </button>
    </template>

    <InspectionTermsModal
      v-if="showTerms"
      :version="TERMS_VERSION"
      @close="showTerms = false"
      @accept="onTermsAccept"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabaseClient.js'
import InspectionTermsModal from './InspectionTermsModal.vue'

const TERMS_VERSION = 'v1.0'

const props = defineProps({
  inspectionId: { type: String, required: true },
  customerId: { type: String, default: null }
})

const emit = defineEmits(['acknowledged'])

const checks = ref({
  reviewed: false,
  terms: false,
  observations: false,
  reportPurpose: false
})
const showTerms = ref(false)
const saving = ref(false)
const loading = ref(true)
const err = ref(null)
const alreadyAck = ref(false)
const ackMeta = ref(null)

const allChecked = computed(
  () =>
    checks.value.reviewed &&
    checks.value.terms &&
    checks.value.observations &&
    checks.value.reportPurpose
)

const formatDate = (d) => (d ? new Date(d).toLocaleString('en-GB') : '')

const load = async () => {
  if (!props.inspectionId) return
  loading.value = true
  err.value = null
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      err.value = 'Please sign in'
      return
    }

    const { data, error } = await supabase
      .from('inspection_acknowledgements')
      .select('*')
      .eq('inspection_id', props.inspectionId)
      .eq('customer_id', user.id)
      .maybeSingle()

    // Permission / missing table should not hide the form
    if (error) {
      console.warn('acknowledgement lookup:', error.message)
      alreadyAck.value = false
      return
    }

    if (data) {
      alreadyAck.value = true
      ackMeta.value = data
      emit('acknowledged')
    } else {
      alreadyAck.value = false
    }
  } catch (e) {
    console.error(e)
    alreadyAck.value = false
  } finally {
    loading.value = false
  }
}

const onTermsAccept = () => {
  checks.value.terms = true
  showTerms.value = false
}

const submit = async () => {
  if (!allChecked.value) return
  saving.value = true
  err.value = null
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Please sign in')

    const { error } = await supabase.from('inspection_acknowledgements').upsert(
      {
        inspection_id: props.inspectionId,
        customer_id: user.id,
        acknowledged_at: new Date().toISOString(),
        terms_version: TERMS_VERSION,
        reviewed_property: true,
        understood_terms: true,
        understood_observations: true,
        understood_report_purpose: true,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        status: 'acknowledged'
      },
      { onConflict: 'inspection_id,customer_id' }
    )

    if (error) throw error

    alreadyAck.value = true
    ackMeta.value = {
      acknowledged_at: new Date().toISOString(),
      terms_version: TERMS_VERSION
    }
    emit('acknowledged')
  } catch (e) {
    console.error(e)
    err.value = e.message || 'Could not save acknowledgement'
  } finally {
    saving.value = false
  }
}

watch(
  () => props.inspectionId,
  () => load()
)

onMounted(load)
</script>