<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-100">
    <h3 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">Payment</h3>

    <div v-if="loading" class="text-sm text-medium-gray py-4">
      Loading payment details...
    </div>

    <template v-else>
      <div class="flex justify-between items-end mb-2">
        <span class="text-medium-gray text-sm">Amount</span>
        <span class="text-3xl font-bold text-[var(--royal-blue)]">
          ₦{{ Number(payAmount).toLocaleString() }}
        </span>
      </div>

      <p v-if="propertyTitle" class="text-xs text-medium-gray mb-3">
        {{ propertyTitle }}
      </p>

      <p class="text-sm mb-4">
        Payment Status:
        <span class="font-semibold" :class="statusClass">
          {{ displayStatus(localStatus) }}
        </span>
      </p>

      <div
        v-if="localStatus === 'paid'"
        class="rounded-2xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-800 font-medium"
      >
        ✓ Payment successful
      </div>

      <button
        v-else
        type="button"
        class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold disabled:opacity-50"
        :disabled="starting || !payAmount"
        @click="showCheckout = true"
      >
        {{
          starting
            ? 'Preparing...'
            : `Pay ₦${Number(payAmount || 0).toLocaleString()} with Paystack`
        }}
      </button>

      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
    </template>

    <PaymentCheckoutModal
      v-if="showCheckout"
      :inspection-id="inspectionId"
      :amount="payAmount"
      @close="showCheckout = false"
      @initiated="onInitiated"
      @verified="onVerified"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from '@/supabaseClient.js'
import PaymentCheckoutModal from './PaymentCheckoutModal.vue'

const props = defineProps({
  inspectionId: { type: String, required: true },
  /** Optional override; if omitted, uses property.price */
  amount: { type: Number, default: null }
})

const emit = defineEmits(['paid'])

const showCheckout = ref(false)
const starting = ref(false)
const loading = ref(true)
const error = ref(null)
const localStatus = ref('pending')
const payAmount = ref(0)
const propertyTitle = ref('')
let channel = null

const displayStatus = (s) => (s || 'pending').replace(/_/g, ' ')

const statusClass = computed(() => {
  if (localStatus.value === 'paid') return 'text-green-700'
  if (localStatus.value === 'failed') return 'text-red-600'
  if (localStatus.value === 'processing') return 'text-amber-700'
  return 'text-amber-700'
})

const refresh = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: err } = await supabase
      .from('inspections')
      .select(
        `
        id,
        payment_status,
        property:properties (
          id,
          title,
          price
        )
      `
      )
      .eq('id', props.inspectionId)
      .single()

    if (err) throw err

    localStatus.value = data?.payment_status || 'pending'
    propertyTitle.value = data?.property?.title || ''

    // Actual payment = property price (public listing price), not an inspection fee
    if (props.amount != null && Number(props.amount) > 0) {
      payAmount.value = Number(props.amount)
    } else {
      payAmount.value = Number(data?.property?.price || 0)
    }

    if (localStatus.value === 'paid') emit('paid')
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Could not load payment details'
  } finally {
    loading.value = false
  }
}

const onInitiated = () => {
  localStatus.value = 'processing'
}

const onVerified = () => {
  localStatus.value = 'paid'
  showCheckout.value = false
  emit('paid')
  refresh()
}

watch(
  () => props.inspectionId,
  () => refresh()
)

onMounted(async () => {
  await refresh()
  channel = supabase
    .channel(`pay-${props.inspectionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'inspections',
        filter: `id=eq.${props.inspectionId}`
      },
      (payload) => {
        if (payload.new?.payment_status) {
          localStatus.value = payload.new.payment_status
          if (payload.new.payment_status === 'paid') emit('paid')
        }
      }
    )
    .subscribe()
})

onUnmounted(async () => {
  if (channel) await supabase.removeChannel(channel)
})
</script>