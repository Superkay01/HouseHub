<!-- InspectionTermsModal.vue -->
<template>
  <div class="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Terms &amp; Conditions</h3>
          <p class="text-sm text-medium-gray">Terms Version: {{ version }}</p>
        </div>
        <button type="button" class="text-2xl text-gray-400" @click="$emit('close')">×</button>
      </div>

      <div class="prose prose-sm text-sm space-y-3 text-medium-gray">
        <p><strong>1. Inspection scope</strong> — Visual assessment of observable conditions at the time of visit.</p>
        <p><strong>2. Limitations</strong> — No destructive testing; hidden defects may not be visible.</p>
        <p><strong>3. Observable-condition disclaimer</strong> — Report reflects condition observed during the inspection only.</p>
        <p><strong>4. Customer responsibilities</strong> — Provide access and accurate information.</p>
        <p><strong>5. Payment terms</strong> — Fee is due after inspection completion to unlock the full report.</p>
        <p><strong>6. Cancellation policy</strong> — As per LodgeNext cancellation rules for scheduled inspections.</p>
        <p><strong>7. Report usage</strong> — For property assessment; not a warranty or structural guarantee.</p>
        <p><strong>8. Liability limitations</strong> — LodgeNext and agents are not liable beyond the scope of the visual inspection.</p>
        <p><strong>9. Privacy / data handling</strong> — Data processed per LodgeNext privacy policy.</p>
        <p><strong>10. Dispute process</strong> — Contact support within the stated window for review.</p>
      </div>

      <button
        type="button"
        class="w-full mt-6 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold"
        @click="$emit('accept')"
      >
        I Accept These Terms
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ version: { type: String, default: 'v1.0' } })
defineEmits(['close', 'accept'])
</script>