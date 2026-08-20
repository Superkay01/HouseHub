<template>
  <div class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl w-full max-w-md p-6">
      <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-2">Pay for Inspection</h3>
      <p class="text-sm text-medium-gray mb-4">
        Amount: <strong>₦{{ Number(amount).toLocaleString() }}</strong>
      </p>

      <p v-if="error" class="text-sm text-red-600 mb-3">{{ error }}</p>
      <p v-if="message" class="text-sm text-green-700 mb-3">{{ message }}</p>

      <button
        type="button"
        class="w-full py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold disabled:opacity-50"
        :disabled="loading"
        @click="startPayment"
      >
        {{ loading ? 'Processing...' : 'Continue to Secure Payment' }}
      </button>
      <button type="button" class="w-full mt-2 py-3 border rounded-2xl" @click="$emit('close')">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({
  inspectionId: { type: String, required: true },
  amount: { type: Number, required: true }
})
const emit = defineEmits(['close', 'initiated', 'verified'])

const loading = ref(false)
const error = ref(null)
const message = ref(null)

const startPayment = async () => {
  loading.value = true
  error.value = null
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Please sign in')

    const reference = `INS-${props.inspectionId.slice(0, 8)}-${Date.now()}`

    // 1) Create pending payment row (client may insert pending only)
    const { error: insErr } = await supabase.from('inspection_payments').insert({
      inspection_id: props.inspectionId,
      customer_id: user.id,
      amount: props.amount,
      currency: 'NGN',
      status: 'pending',
      payment_reference: reference,
      provider: 'paystack'
    })
    if (insErr) throw insErr

    await supabase
      .from('inspections')
      .update({ payment_status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', props.inspectionId)
      .eq('customer_id', user.id)

    emit('initiated')

    // 2) Call your Edge Function to initialize Paystack / Flutterwave
    // const { data, error: fnErr } = await supabase.functions.invoke('init-inspection-payment', {
    //   body: { inspection_id: props.inspectionId, reference, amount: props.amount }
    // })
    // if (fnErr) throw fnErr
    // window.location.href = data.authorization_url

    // DEV ONLY — remove in production. Webhook must set paid.
    message.value =
      'Payment initiated. Complete checkout with your provider. Report unlocks after webhook verification.'
  } catch (e) {
    error.value = e.message || 'Payment failed to start'
  } finally {
    loading.value = false
  }
}
</script>