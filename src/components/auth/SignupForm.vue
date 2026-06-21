<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label class="block text-sm font-medium mb-1">Full Name</label>
      <input v-model="form.fullName" type="text" required
             class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Email Address</label>
      <input v-model="form.email" type="email" required
             class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Phone Number</label>
      <input v-model="form.phone" type="tel" required
             class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
    </div>

    <!-- Agent Only -->
    <template v-if="role === 'agent'">
      <div>
        <label class="block text-sm font-medium mb-1">Agency Name</label>
        <input v-model="form.agencyName" type="text" required
               class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Office Address</label>
        <input v-model="form.officeAddress" type="text" required
               class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
      </div>
    </template>

    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <input v-model="form.password" type="password" required
             class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Confirm Password</label>
      <input v-model="form.confirmPassword" type="password" required
             class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none" />
    </div>

    <button
      type="submit"
      class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white font-semibold py-4 rounded-2xl text-lg transition-all">
      Create {{ role === 'agent' ? 'Agent' : 'Customer' }} Account
    </button>
  </form>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  role: String
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
  console.log(`${props.role} Signup:`, form.value)
  alert(`✅ ${props.role === 'agent' ? 'Agent' : 'Customer'} account created successfully!`)
}
</script>