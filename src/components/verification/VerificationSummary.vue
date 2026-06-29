<template>
  <div>
    <h3 class="text-2xl font-semibold mb-8 text-dark-gray">Review Your Information</h3>
    
    <div class="space-y-10">
      
      <!-- Personal Information -->
      <div class="bg-gray-50 rounded-3xl p-8">
        <h4 class="font-semibold text-[var(--royal-blue)] mb-5 flex items-center gap-2">
          👤 Personal Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
          <div>
            <span class="text-medium-gray block">Full Name</span>
            <span class="font-medium">{{ form.fullName || '—' }}</span>
          </div>
          <div>
            <span class="text-medium-gray block">Email Address</span>
            <span class="font-medium">{{ form.email || '—' }}</span>
          </div>
          <div>
            <span class="text-medium-gray block">Phone Number</span>
            <span class="font-medium">{{ form.phone || '—' }}</span>
          </div>
          <div>
            <span class="text-medium-gray block">Date of Birth</span>
            <span class="font-medium">{{ form.dob || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Business Information -->
      <div v-if="form.agencyName" class="bg-gray-50 rounded-3xl p-8">
        <h4 class="font-semibold text-[var(--royal-blue)] mb-5 flex items-center gap-2">
          🏢 Business Information
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
          <div>
            <span class="text-medium-gray block">Agency Name</span>
            <span class="font-medium">{{ form.agencyName }}</span>
          </div>
          <div>
            <span class="text-medium-gray block">Years of Experience</span>
            <span class="font-medium">{{ form.experience }} years</span>
          </div>
          <div class="md:col-span-2">
            <span class="text-medium-gray block">Office Address</span>
            <span class="font-medium">{{ form.officeAddress }}</span>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="bg-gray-50 rounded-3xl p-8">
        <h4 class="font-semibold text-[var(--royal-blue)] mb-5">📄 Uploaded Documents</h4>
        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white rounded-2xl p-4">
            <div class="text-3xl">🪪</div>
            <div class="flex-1">
              <p class="font-medium">Government Issued ID</p>
              <p class="text-xs text-medium-gray">Uploaded</p>
            </div>
            <span class="text-[var(--bright-green)] text-sm font-medium">✓ Verified</span>
          </div>
          
          <div class="flex items-center gap-4 bg-white rounded-2xl p-4">
            <div class="text-3xl">📸</div>
            <div class="flex-1">
              <p class="font-medium">Passport Photograph</p>
              <p class="text-xs text-medium-gray">Uploaded</p>
            </div>
            <span class="text-[var(--bright-green)] text-sm font-medium">✓ Verified</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms -->
    <div class="mt-10 flex items-start gap-3 bg-[var(--light-blue)] p-5 rounded-2xl">
      <input type="checkbox" class="mt-1 accent-[var(--bright-green)] w-5 h-5" v-model="agreed" />
      <p class="text-sm text-medium-gray leading-relaxed">
        I certify that all information provided is accurate and true. I understand that providing false information may result in account suspension.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  form: Object
})

const agreed = ref(false)
</script>