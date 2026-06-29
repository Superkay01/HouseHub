<template>
  <div class="max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      
      <!-- Header -->
      <div class="px-6 py-8 border-b text-center">
        <h1 class="md:text-3xl text-xl font-bold text-[var(--royal-blue)]">Agent Verification</h1>
        <p class="text-[var(--royal-blue)] mt-2 md:text-xl text-xs">Complete all steps to get verified</p>
      </div>

      <!-- Progress -->
      <div v-if="!isSubmitted" class="px-8 pt-8 flex justify-between gap-4">
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
        
        <!-- Success Screen -->
        <div v-if="isSubmitted" class="text-center py-12">
          <div class="text-6xl mb-6">🎉</div>
          <h2 class="md:text-2xl text-xl font-bold text-green-600 mb-4">Verification Submitted Successfully!</h2>
          <p class="text-[var(--royal-blue)] md:text-xl text-xs max-w-md mx-auto">
            You have successfully submitted your verification.<br>
            You will be verified within <strong>12-24 hours</strong>.
          </p>
          <button 
            @click="goToDashboard"
            class="mt-10 px-10 py-4 bg-[var(--royal-blue)] text-white rounded-3xl font-semibold md:text-xl text-xs">
            Return to Dashboard
          </button>
        </div>

        <!-- Step 1: Personal Information -->
        <div v-else-if="currentStep === 1">
          <h2 class="md:text-2xl text-xl font-semibold mb-6 text-[var(--royal-blue)]">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Full Name</label>
              <p class="bg-gray-50 px-4 py-3 rounded-2xl text-[var(--royal-blue)]">{{ profile.full_name || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Phone Number</label>
              <p class="bg-gray-50 px-4 py-3 rounded-2xl text-[var(--royal-blue)]">{{ profile.phone || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Agency Info -->
        <div v-else-if="currentStep === 2">
          <h2 class="md:text-2xl text-xl font-semibold mb-6 text-[var(--royal-blue)]">Agency & Verification Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Agency Name</label>
              <input v-model="form.agency_name" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Office Address</label>
              <input v-model="form.office_address" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Date of Birth</label>
              <input v-model="form.date_of_birth" type="date" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Years of Experience</label>
              <input v-model="form.years_of_experience" type="number" min="0" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">State</label> 
              <input v-model="form.state" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">City</label>
              <input v-model="form.city" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Local Government Area (LGA)</label>
              <input v-model="form.lga" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Business Registration Number</label>
              <input v-model="form.business_registration_number" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-2xl text-[var(--royal-blue)]">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-[var(--royal-blue)]">Areas of Operation</label>
              <input 
                v-model="areasInput" 
                placeholder="e.g. Lagos, Abuja, Port Harcourt (comma separated)"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-2xl">
              <p class="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Documents -->
        <div v-else-if="currentStep === 3">
          <h2 class="md:text-2xl text-xl font-semibold mb-6 text-[var(--royal-blue)]">Upload Verification Documents</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[var(--royal-blue)] cursor-pointer"
                 @click="triggerFileInput('government_id')" @drop.prevent="handleDrop($event, 'government_id')" @dragover.prevent>
              <div class="text-5xl mb-4">🪪</div>
              <h4 class="font-semibold text-[var(--royal-blue)]">Government Issued ID</h4>
              <p class="text-sm text-[var(--royal-blue)] mt-1">National ID, Driver's License, Passport</p>
              <div v-if="uploadedFiles.government_id" class="mt-4 text-green-600 text-sm font-medium">✅ Uploaded</div>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[var(--royal-blue)] cursor-pointer"
                 @click="triggerFileInput('passport_photo')" @drop.prevent="handleDrop($event, 'passport_photo')" @dragover.prevent>
              <div class="text-5xl mb-4">📸</div>
              <h4 class="font-semibold text-[var(--royal-blue)]">Passport Photograph</h4>
              <p class="text-sm text-[var(--royal-blue)] mt-1">Recent clear passport size photo</p>
              <div v-if="uploadedFiles.passport_photo" class="mt-4 text-green-600 text-sm font-medium">✅ Uploaded</div>
            </div>

            <div class="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-[var(--royal-blue)] cursor-pointer md:col-span-2"
                 @click="triggerFileInput('proof_of_address')" @drop.prevent="handleDrop($event, 'proof_of_address')" @dragover.prevent>
              <div class="text-5xl mb-4">📍</div>
              <h4 class="font-semibold text-[var(--royal-blue)]">Proof of Address</h4>
              <p class="text-sm text-[var(--royal-blue)] mt-1">Utility bill, Bank statement, etc.</p>
              <div v-if="uploadedFiles.proof_of_address" class="mt-4 text-green-600 text-sm font-medium">✅ Uploaded</div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div v-else-if="currentStep === 4">
          <h2 class="md:text-2xl text-xl font-semibold mb-6 text-[var(--royal-blue)]">Review & Submit</h2>
          <div class="bg-gray-50 p-6 rounded-2xl space-y-6">
            <div>
              <h3 class="font-semibold mb-3">Agency Information</h3>
              <p><strong>Agency Name:</strong> {{ form.agency_name || 'N/A' }}</p>
              <p><strong>Office Address:</strong> {{ form.office_address || 'N/A' }}</p>
              <p><strong>Date of Birth:</strong> {{ form.date_of_birth || 'N/A' }}</p>
              <p><strong>Experience:</strong> {{ form.years_of_experience }} years</p>
              <p><strong>State:</strong> {{ form.state || 'N/A' }}</p>
              <p><strong>City:</strong> {{ form.city || 'N/A' }}</p>
              <p><strong>LGA:</strong> {{ form.lga || 'N/A' }}</p>
              <p><strong>Business Reg No:</strong> {{ form.business_registration_number || 'N/A' }}</p>
              <p><strong>Areas of Operation:</strong> {{ form.areas_of_operation?.join(', ') || 'N/A' }}</p>
            </div>

            <div>
              <h3 class="font-semibold mb-3">Documents</h3>
              <p>Government ID: {{ uploadedFiles.government_id ? 'Uploaded' : 'Missing' }}</p>
              <p>Passport Photo: {{ uploadedFiles.passport_photo ? 'Uploaded' : 'Missing' }}</p>
              <p>Proof of Address: {{ uploadedFiles.proof_of_address ? 'Uploaded' : 'Missing' }}</p>
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
      <div v-if="!isSubmitted" class="flex justify-between p-6 border-t bg-gray-50">
        <button v-if="currentStep > 1" @click="prevStep" class="px-8 py-3 border border-gray-300 rounded-2xl">Previous</button>
        <button v-if="currentStep < 4" @click="nextStep" class="px-10 py-3 bg-[var(--royal-blue)] text-white rounded-2xl">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabaseClient'
import { useRouter } from 'vue-router'   // ← Added for navigation

const router = useRouter()

const currentStep = ref<number>(1)
const isSubmitting = ref<boolean>(false)
const isSubmitted = ref<boolean>(false)   // ← New state

const profile = ref<any>({})

const form = ref({
  agency_name: '',
  office_address: '',
  date_of_birth: '',
  years_of_experience: null as number | null,
  state: '',
  city: '',
  lga: '',
  business_registration_number: '',
  areas_of_operation: [] as string[],
})

const uploadedFiles = ref({
  government_id: null as File | null,
  passport_photo: null as File | null,
  proof_of_address: null as File | null,
})

const areasInput = ref('')

const steps = ['Personal Info', 'Agency Info', 'Documents', 'Review']

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (pData) profile.value = pData

  const { data: verif } = await supabase
    .from('agent_verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (verif) {
    currentStep.value = verif.current_step || 1
    isSubmitted.value = verif.verification_status === 'pending' || verif.verification_status === 'approved'

    form.value = {
      agency_name: verif.agency_name || '',
      office_address: verif.office_address || '',
      date_of_birth: verif.date_of_birth || '',
      years_of_experience: verif.years_of_experience,
      state: verif.state || '',
      city: verif.city || '',
      lga: verif.lga || '',
      business_registration_number: verif.business_registration_number || '',
      areas_of_operation: verif.areas_of_operation || [],
    }
    areasInput.value = form.value.areas_of_operation.join(', ')
  }
})

watch(areasInput, (val: string) => {
  form.value.areas_of_operation = val
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)
})

const nextStep = () => { if (currentStep.value < 4) currentStep.value++ }
const prevStep = () => { if (currentStep.value > 1) currentStep.value-- }

const submitVerification = async () => {
  isSubmitting.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('agent_verifications').upsert({
      user_id: user.id,
      ...form.value,
      verification_status: 'pending',
      current_step: 4,
    }, { onConflict: 'user_id' })

    if (error) throw error

    isSubmitted.value = true
    // Optional: You can also show a toast instead of alert
    alert("✅ Verification submitted successfully!")

  } catch (error: any) {
    console.error(error)
    alert("Submission failed: " + error.message)
  } finally {
    isSubmitting.value = false
  }
}

const goToDashboard = () => {
  router.push('/agent/dashboard')   // Change this path if your dashboard route is different
}

// File Upload Functions (unchanged)
const triggerFileInput = (type: 'government_id' | 'passport_photo' | 'proof_of_address') => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type === 'passport_photo' ? 'image/*' : 'image/*,.pdf'
  input.onchange = (e: any) => handleFileSelect(e, type)
  input.click()
}

const handleFileSelect = async (e: any, type: 'government_id' | 'passport_photo' | 'proof_of_address') => {
  const file = e.target.files[0]
  if (!file) return
  uploadedFiles.value[type] = file
  await uploadToSupabase(file, type)
}

const handleDrop = async (e: any, type: 'government_id' | 'passport_photo' | 'proof_of_address') => {
  const file = e.dataTransfer.files[0]
  if (file) {
    uploadedFiles.value[type] = file
    await uploadToSupabase(file, type)
  }
}

const uploadToSupabase = async (file: File, type: 'government_id' | 'passport_photo' | 'proof_of_address') => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')

    const fileName = `${Date.now()}-${file.name}`
    const filePath = `verification/${user.id}/${type}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('agent-documents')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from('agent-documents').getPublicUrl(filePath)

    const field = type === 'government_id' ? 'government_id_url' :
                  type === 'passport_photo' ? 'passport_photo_url' : 'proof_of_address_url'

    await supabase.from('agent_verifications').upsert({ 
      user_id: user.id, 
      [field]: urlData.publicUrl 
    }, { onConflict: 'user_id' })

  } catch (err: any) {
    console.error('Upload failed:', err)
    alert(`Upload failed: ${err.message}`)
  }
}
</script>