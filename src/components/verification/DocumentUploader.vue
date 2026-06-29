<template>
  <div class="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      
      <!-- Header -->
      <div class="px-6 py-8 border-b text-center">
        <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Agent Verification</h1>
        <p class="text-[var(--royal-blue)] mt-2">Complete all steps to get verified</p>
      </div>

      <!-- Progress -->
      <div class="px-8 pt-8 flex justify-between gap-4">
        <div v-for="(step, i) in steps" :key="i" class="flex-1 text-center">
          <div :class="[
            'w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 font-semibold transition-all',
            currentStep > i+1 ? 'bg-green-500 border-green-500 text-white' :
            currentStep === i+1 ? 'border-[var(--royal-blue)] text-[var(--royal-blue)]' : 
            'border-gray-300 text-gray-400'
          ]">
            {{ i + 1 }}
          </div>
          <p class="text-sm mt-3 font-medium">{{ step }}</p>
        </div>
      </div>

      <div class="p-8 md:p-10">
        <!-- Step 1: Personal -->
        <div v-if="currentStep === 1">
          <h2 class="text-2xl font-semibold mb-6">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Full Name</label>
              <input v-model="form.full_name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone Number</label>
              <input v-model="form.phone" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
          </div>
        </div>

        <!-- Step 2: Agency Info -->
        <div v-if="currentStep === 2">
          <h2 class="text-2xl font-semibold mb-6">Agency Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Agency Name</label>
              <input v-model="form.agency_name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Office Address</label>
              <input v-model="form.office_address" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Date of Birth</label>
              <input v-model="form.date_of_birth" type="date" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Years of Experience</label>
              <input v-model="form.years_of_experience" type="number" min="0" class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
            </div>
          </div>
        </div>

        <!-- Step 3: Documents -->
        <div v-if="currentStep === 3">
          <h2 class="text-2xl font-semibold mb-6">Upload Verification Documents</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[var(--royal-blue)] cursor-pointer group"
                 @click="triggerFileInput('id')" @drop.prevent="handleDrop($event, 'id')" @dragover.prevent>
              <div class="text-5xl mb-4">🪪</div>
              <h4 class="font-semibold">Government Issued ID</h4>
              <p class="text-sm text-gray-500 mt-1">National ID, Driver's License, Passport</p>
              <div v-if="uploadedFiles.id" class="mt-4 text-green-600 text-sm">✅ Uploaded</div>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[var(--royal-blue)] cursor-pointer group"
                 @click="triggerFileInput('photo')" @drop.prevent="handleDrop($event, 'photo')" @dragover.prevent>
              <div class="text-5xl mb-4">📸</div>
              <h4 class="font-semibold">Passport Photograph</h4>
              <p class="text-sm text-gray-500 mt-1">Recent clear passport size photo</p>
              <div v-if="uploadedFiles.photo" class="mt-4 text-green-600 text-sm">✅ Uploaded</div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div v-if="currentStep === 4">
          <h2 class="text-2xl font-semibold mb-6">Review & Submit</h2>
          <div class="bg-gray-50 p-6 rounded-2xl space-y-6 text-sm">
            <div>
              <h3 class="font-semibold mb-2">Personal Info</h3>
              <p><strong>Name:</strong> {{ form.full_name || '—' }}</p>
              <p><strong>Phone:</strong> {{ form.phone || '—' }}</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Agency Info</h3>
              <p><strong>Agency:</strong> {{ form.agency_name || '—' }}</p>
              <p><strong>Address:</strong> {{ form.office_address || '—' }}</p>
              <p><strong>Experience:</strong> {{ form.years_of_experience || '—' }} years</p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Documents</h3>
              <p>ID Document: <span :class="uploadedFiles.id ? 'text-green-600' : 'text-red-500'">{{ uploadedFiles.id ? 'Uploaded' : 'Missing' }}</span></p>
              <p>Passport Photo: <span :class="uploadedFiles.photo ? 'text-green-600' : 'text-red-500'">{{ uploadedFiles.photo ? 'Uploaded' : 'Missing' }}</span></p>
            </div>
          </div>

          <button 
            @click="submitVerification"
            :disabled="isSubmitting"
            class="w-full mt-10 py-4 bg-[var(--royal-blue)] text-white rounded-3xl font-semibold text-lg disabled:opacity-50">
            {{ isSubmitting ? 'Submitting...' : 'Submit Verification' }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between p-6 border-t bg-gray-50">
        <button v-if="currentStep > 1" @click="prevStep" class="px-8 py-3 border border-gray-300 rounded-2xl">Previous</button>
        <button v-if="currentStep < 4" @click="nextStep" class="px-10 py-3 bg-[var(--royal-blue)] text-white rounded-2xl">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'

interface VerificationForm {
  full_name: string
  phone: string
  agency_name: string
  office_address: string
  date_of_birth: string
  years_of_experience: number | null
}

const currentStep = ref<number>(1)
const isSubmitting = ref<boolean>(false)
const verificationStatus = ref<string | null>(null)

const form = ref<VerificationForm>({
  full_name: '',
  phone: '',
  agency_name: '',
  office_address: '',
  date_of_birth: '',
  years_of_experience: null,
})

const uploadedFiles = ref({
  id: null as File | null,
  photo: null as File | null
})

const steps = ['Personal Info', 'Agency Info', 'Documents', 'Review']

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Load Profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    form.value.full_name = profile.full_name || ''
    form.value.phone = profile.phone || ''
    form.value.agency_name = profile.agency_name || ''
    form.value.office_address = profile.office_address || ''
  }

  // Load existing verification draft
  const { data: verif } = await supabase
    .from('agent_verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (verif) {
    verificationStatus.value = verif.verification_status
    currentStep.value = verif.current_step || 1
    form.value.date_of_birth = verif.date_of_birth || ''
    form.value.years_of_experience = verif.years_of_experience
  }
})

const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitVerification = async () => {
  isSubmitting.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase.from('agent_verifications').upsert({
      user_id: user.id,
      ...form.value,
      verification_status: 'pending'
    })

    if (error) throw error

    verificationStatus.value = 'pending'
    alert("✅ Verification submitted successfully!\n\nIt will be reviewed within 12-24 hours.")

  } catch (error: any) {
    console.error(error)
    alert("Submission failed: " + error.message)
  } finally {
    isSubmitting.value = false
  }
}

// File Upload Functions
const triggerFileInput = (type: 'id' | 'photo') => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type === 'photo' ? 'image/*' : 'image/*,.pdf'
  input.onchange = (e: any) => handleFileSelect(e, type)
  input.click()
}

const handleFileSelect = async (e: any, type: 'id' | 'photo') => {
  const file = e.target.files[0]
  if (!file) return
  uploadedFiles.value[type] = file
  await uploadToSupabase(file, type)
}

const handleDrop = async (e: any, type: 'id' | 'photo') => {
  const file = e.dataTransfer.files[0]
  if (file) {
    uploadedFiles.value[type] = file
    await uploadToSupabase(file, type)
  }
}

const uploadToSupabase = async (file: File, type: 'id' | 'photo') => {
  try {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `verification/${type}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('agent-documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from('agent-documents').getPublicUrl(filePath)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('agent_verifications').upsert({
      user_id: user.id,
      [`${type}_url`]: urlData.publicUrl
    })
  } catch (err) {
    console.error(err)
  }
}
</script>