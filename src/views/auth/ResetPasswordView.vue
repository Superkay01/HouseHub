<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-8 px-4">
    <div class="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">

      <!-- Left Column -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]/70"></div>
        
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="text-4xl font-bold mb-4">Create New Password</h2>
          <p class="text-light-blue text-lg">
            Your new password must be different from previously used passwords.
          </p>
        </div>
      </div>

      <!-- Right Column - Reset Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-14 h-14 bg-[var(--royal-blue)] rounded-3xl flex items-center justify-center text-4xl text-white">
              🔐
            </div>
          </div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Reset Your Password</h1>
          <p class="text-medium-gray mt-2">Enter your new password below</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-1">New Password</label>
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                required
                minlength="6"
                class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none pr-12"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--royal-blue)]"
              >
                <Eye v-if="showPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-1">Confirm New Password</label>
            <div class="relative">
              <input 
                v-model="form.confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                required
                class="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] focus:outline-none pr-12"
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--royal-blue)]"
              >
                <Eye v-if="showConfirmPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg transition-all">
            {{ loading ? 'Updating Password...' : 'Update Password' }}
          </button>
        </form>

        <div v-if="message" class="mt-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-center">
          {{ message }}
        </div>

        <div v-if="error" class="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">
          {{ error }}
        </div>

        <div class="text-center mt-8">
          <router-link to="/login" class="text-[var(--royal-blue)] font-medium hover:underline">
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
import { Eye, EyeClosed } from 'lucide-vue-next'

const router = useRouter()

const loading = ref(false)
const message = ref('')
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  password: '',
  confirmPassword: ''
})

const handleResetPassword = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match!"
    return
  }

  if (form.value.password.length < 6) {
    error.value = "Password must be at least 6 characters"
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.value.password
    })

    if (updateError) throw updateError

    message.value = "✅ Your password has been successfully updated!"
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err) {
    error.value = "Failed to update password. Please try again."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>