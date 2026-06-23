<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-8 px-4">
    <div class="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">

      <!-- Left Column - Image & Message -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]/70"></div>
        
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="text-4xl font-bold mb-4">Forgot Password?</h2>
          <p class="text-light-blue text-lg">
            Don't worry! We'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <!-- Right Column - Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-14 h-14 bg-[var(--royal-blue)] rounded-3xl flex items-center justify-center text-4xl text-white">
              🔑
            </div>
          </div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Reset Password</h1>
          <p class="text-medium-gray mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-1">Email Address</label>
            <input 
              v-model="email"
              type="email" 
              required
              placeholder="yourname@gmail.com"
              class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg transition-all">
            {{ loading ? 'Sending Reset Link...' : 'Send Reset Link' }}
          </button>
        </form>

        <!-- Status Messages -->
        <div v-if="message" class="mt-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-center">
          {{ message }}
        </div>

        <div v-if="error" class="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">
          {{ error }}
        </div>

        <!-- Back to Login -->
        <div class="text-center mt-8">
          <router-link 
            to="/login"
            class="text-[var(--royal-blue)] font-medium hover:underline flex items-center justify-center gap-2">
            ← Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabaseClient.js'

const router = useRouter()

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleReset = async () => {
  if (!email.value) {
    error.value = "Please enter your email address"
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (resetError) throw resetError

    message.value = "✅ Reset link has been sent to your email. Please check your inbox (and spam folder)."

  } catch (err) {
    error.value = "Failed to send reset link. Please try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>