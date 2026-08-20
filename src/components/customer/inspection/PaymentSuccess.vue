<template>
  <div class="bg-green-50 rounded-3xl p-6 border border-green-100">
    <p class="text-lg font-bold text-green-800">✓ Payment Successful</p>
    <p class="text-sm text-medium-gray mt-1">Inspection Payment</p>
    <div class="mt-4 space-y-2 text-sm">
      <p>Amount Paid: <strong>₦{{ Number(payment?.amount || 0).toLocaleString() }}</strong></p>
      <p>Payment Reference: <strong>{{ payment?.payment_reference || '—' }}</strong></p>
      <p>Inspection ID: <strong>{{ inspectionId }}</strong></p>
      <p>Payment Date: <strong>{{ formatDate(payment?.paid_at) }}</strong></p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  payment: { type: Object, default: null },
  inspectionId: { type: String, required: true }
})
const formatDate = (d) =>
  d ? new Date(d).toLocaleString('en-GB') : '—'
</script>