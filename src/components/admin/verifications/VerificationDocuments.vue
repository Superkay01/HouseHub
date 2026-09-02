<template>
  <div class="space-y-4">
    <h4 class="font-semibold text-lg text-[var(--royal-blue)] mb-4">Submitted Documents</h4>

    <div v-for="doc in documentsList" 
         :key="doc.key"
         class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-[var(--periwinkle)] transition">
      
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl border">
          📄
        </div>
        <div>
          <p class="font-medium">{{ doc.label }}</p>
          <p class="text-xs text-[var(--steel-blue)]">{{ doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—' }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="previewDocument(doc.url)"
          class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">
          Preview
        </button>
        
        <button 
          @click="downloadDocument(doc.url, doc.label)"
          class="px-4 py-2 text-sm bg-[var(--royal-blue)] text-white rounded-xl hover:bg-[var(--medium-blue)] transition">
          Download
        </button>

        <!-- Review Actions -->
        <select 
          v-model="doc.reviewStatus"
          @change="reviewDocument(doc.key, doc.reviewStatus)"
          class="px-4 py-2 text-sm border rounded-xl bg-white focus:border-[var(--royal-blue)]">
          <option value="">Mark as...</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="needs_replacement">Needs Replacement</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  documents: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['document-reviewed'])

const documentsList = computed(() => {
  const docs = props.documents || {}
  return [
    { 
      key: 'government_id_url', 
      label: 'Government ID', 
      url: docs.government_id_url,
      uploadedAt: docs.submitted_at 
    },
    { 
      key: 'passport_photo_url', 
      label: 'Passport Photo', 
      url: docs.passport_photo_url,
      uploadedAt: docs.submitted_at 
    },
    { 
      key: 'proof_of_address_url', 
      label: 'Proof of Address', 
      url: docs.proof_of_address_url,
      uploadedAt: docs.submitted_at 
    },
    { 
      key: 'national_identity_number_url', 
      label: 'National ID', 
      url: docs.national_identity_number_url,
      uploadedAt: docs.submitted_at 
    }
    // Add more document fields as needed
  ].filter(doc => doc.url)
})

const previewDocument = (url) => {
  if (!url) return
  window.open(url, '_blank')
}

const downloadDocument = (url, label) => {
  if (!url) return
  const link = document.createElement('a')
  link.href = url
  link.download = label || 'document'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const reviewDocument = (key, status) => {
  if (!status) return
  emit('document-reviewed', key, status)
}
</script>