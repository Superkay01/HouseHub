<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-8 px-4">
    <div class="max-w-md w-full">
      
      <!-- Logo -->
      <div class="flex justify-center mb-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-[var(--royal-blue)] rounded-xl flex items-center justify-center text-3xl shadow-xl">
            🏠
          </div>
          <div>
            <span class="font-bold text-3xl tracking-tighter text-[var(--royal-blue)]">LodgeNext</span>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--medium-blue)] px-8 py-3 text-white text-center">
          <h1 class="md:text-2xl text-xl font-bold mb-2">Create Your Account</h1>
          <p class="text-white/80 md:text-md text-sm">Join thousands of renters and agents in Ilorin & Ijebu Ode</p>
        </div>

        <div class="p-8 md:p-10">
          
          <!-- Role Selection -->
          <div v-if="!selectedRole" class="space-y-3">
            <button
              @click="selectRole('customer')"
              class="group w-full bg-white border-2 border-gray-100 hover:border-[var(--royal-blue)] hover:shadow-xl transition-all duration-300 rounded-3xl p-5 text-left"
            >
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-[var(--light-blue)] rounded-2xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110">
                  👤
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold md:text-xl text-lg text-dark-gray mb-1">I'm a Customer</h3>
                  <p class="text-medium-gray md:text-sm text-[12px]">Looking for a house or apartment to rent</p>
                </div>
              </div>
            </button>

            <button
              @click="selectRole('agent')"
              class="group w-full bg-white border-2 border-gray-100 hover:border-[var(--royal-blue)] hover:shadow-xl transition-all duration-300 rounded-3xl p-5 text-left"
            >
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-[var(--light-blue)] rounded-2xl flex items-center justify-center text-4xl transition-transform group-hover:scale-110">
                  🏢
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold md:text-xl text-lg text-dark-gray mb-1">I'm a Property Agent</h3>
                  <p class="text-medium-gray md:text-sm text-[12px]">I want to list properties for rent</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Form Section -->
          <div v-else>
            <div class="flex items-center gap-3 mb-8">
              <button 
                @click="selectedRole = null"
                class="text-[var(--royal-blue)] font-medium flex items-center gap-2 hover:underline">
                ← Back
              </button>
              <h2 class="font-bold text-2xl text-dark-gray">
                {{ selectedRole === 'customer' ? 'Customer Signup' : 'Agent Signup' }}
              </h2>
            </div>

            <SignupForm :role="selectedRole" />
          </div>
        </div>
      </div>

      <!-- Login Link -->
      <p class="text-center mt-8 text-medium-gray">
        Already have an account? 
        <router-link to="/login" class="text-[var(--royal-blue)] font-semibold hover:underline">
          Log in here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SignupForm from './SignupForm.vue'

const selectedRole = ref(null)

const selectRole = (role) => {
  selectedRole.value = role
}
</script>