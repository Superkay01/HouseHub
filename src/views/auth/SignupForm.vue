<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <!-- Common Fields -->
    <div>
      <label class="block text-sm font-medium text-dark-gray mb-1">Full Name</label>
      <input 
        v-model="form.fullName" 
        type="text" 
        required
        class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-dark-gray mb-1">Email Address</label>
      <input 
        v-model="form.email" 
        type="email" 
        required
        class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-dark-gray mb-1">Phone Number</label>
      <input 
        v-model="form.phone" 
        type="tel" 
        required
        placeholder="+234"
        class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
      />
    </div>

    <!-- Agent Only Fields -->
    <template v-if="role === 'agent'">
      <div>
        <label class="block text-sm font-medium text-dark-gray mb-1">Agency Name</label>
        <input 
          v-model="form.agencyName" 
          type="text" 
          required
          class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-dark-gray mb-1">Office Address</label>
        <input 
          v-model="form.officeAddress" 
          type="text" 
          required
          class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
        />
      </div>
    </template>

    <!-- Password Fields -->
    <div>
      <label class="block text-sm font-medium text-dark-gray mb-1">Password</label>
      <input 
        v-model="form.password" 
        type="password" 
        required
        class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-dark-gray mb-1">Confirm Password</label>
      <input 
        v-model="form.confirmPassword" 
        type="password" 
        required
        class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
      />
    </div>

    <button
      type="submit"
      class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white font-semibold py-4 rounded-2xl text-lg transition-all mt-6">
      Create {{ role === 'agent' ? 'Agent' : 'Customer' }} Account
    </button>
  </form>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  role: { type: String, required: true }
})

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  agencyName: '',
  officeAddress: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("❌ Passwords do not match!")
    return
  }
  
  console.log(`${props.role.toUpperCase()} SIGNUP DATA:`, form.value)
  alert(`✅ ${props.role === 'agent' ? 'Agent' : 'Customer'} Account Created Successfully! (Demo)`)
}
</script>