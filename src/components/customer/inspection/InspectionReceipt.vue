<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <div v-if="loading" class="text-sm text-medium-gray">Loading receipt...</div>
    <div v-else-if="!receipt" class="text-sm text-medium-gray">
      Receipt will appear after payment is verified.
    </div>
    <template v-else>
      <div ref="receiptEl" class="space-y-4 text-sm">
        <div class="flex items-center gap-3 border-b pb-4">
          <img src="/Lodgenext_logo__2_-removebg-preview.png" alt="LodgeNext" class="h-10" />
          <div>
            <p class="font-bold text-[var(--royal-blue)] text-lg">LodgeNext</p>
            <p class="text-xs text-medium-gray">Property Inspection Payment Receipt</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <p>Receipt Number: <strong>{{ receipt.receipt_number }}</strong></p>
          <p>Transaction Ref: <strong>{{ receipt.transaction_reference || payment?.payment_reference }}</strong></p>
          <p>Inspection ID: <strong>{{ receipt.inspection_id }}</strong></p>
          <p>Issued: <strong>{{ formatDate(receipt.issued_at) }}</strong></p>
        </div>

        <div class="bg-gray-50 rounded-2xl p-4">
          <p class="font-semibold mb-1">Payment</p>
          <p>Property Inspection Service</p>
          <p class="text-xl font-bold mt-2">₦{{ Number(receipt.amount).toLocaleString() }}</p>
          <p class="text-green-700 font-semibold mt-1">Status: PAID ✓</p>
        </div>

        <p class="text-xs text-medium-gray">
          LodgeNext · Support · support@lodgenext.example · www.lodgenext.example
        </p>
      </div>

      <button
        type="button"
        class="mt-4 w-full py-3 border rounded-2xl font-medium"
        @click="download"
      >
        Download Receipt
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({ inspectionId: { type: String, required: true } })
const receipt = ref(null)
const payment = ref(null)
const loading = ref(true)
const receiptEl = ref(null)
let channel = null

const formatDate = (d) => (d ? new Date(d).toLocaleString('en-GB') : '—')

const load = async () => {
  loading.value = true
  try {
    const { data: r } = await supabase
      .from('inspection_receipts')
      .select('*')
      .eq('inspection_id', props.inspectionId)
      .order('issued_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    receipt.value = r

    const { data: p } = await supabase
      .from('inspection_payments')
      .select('*')
      .eq('inspection_id', props.inspectionId)
      .eq('status', 'paid')
      .order('paid_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    payment.value = p
  } finally {
    loading.value = false
  }
}

const download = () => {
  window.print() // or html2pdf on receiptEl
}

onMounted(async () => {
  await load()
  channel = supabase
    .channel(`receipt-${props.inspectionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inspection_receipts',
        filter: `inspection_id=eq.${props.inspectionId}`
      },
      () => load()
    )
    .subscribe()
})

onUnmounted(async () => {
  if (channel) await supabase.removeChannel(channel)
})
</script>