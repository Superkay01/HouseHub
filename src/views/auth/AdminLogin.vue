<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-5 px-2">
    <div class="max-w-7xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">
      <!-- Left Column - Image & Welcome -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]"></div>
       
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="md:text-3xl text-2xl font-bold mb-4">ArtiSmart Admin Portal</h2>
          <p class="md:text-lg text-sm text-light-blue mb-8">
            Secure Access for State Administrators
          </p>
        </div>
      </div>

      <!-- Right Column - Login Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8">
          <h1 class="md:text-3xl text-2xl font-bold text-[var(--royal-blue)] text-center">Admin Login</h1>
          <p class="text-[var(--royal-blue)] md:text-[15px] text-sm mt-2 text-center">Sign in to your state dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)] hover:text-[var(--medium-blue)]"
              >
                <Eye v-if="showPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>

          <div class="text-center pt-4">
            <router-link 
              to="/admin/signup"
              class="text-[var(--royal-blue)] hover:underline text-sm">
              Don't have an account? Create one
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import { Eye, EyeClosed } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password
    })

    if (error) throw error

    // Check if user is state admin
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role, state, city')
      .eq('id', data.user.id)
      .single()

    if (!profile || profile.role !== 'state_admin') {
      await supabase.auth.signOut()
      alert("❌ Access Denied. This account is not a State Admin.")
      return
    }

    alert(`✅ Welcome back, ${profile.state} Admin!`)
    router.push('/admin/dashboard')

  } catch (error) {
    console.error(error)
    alert("❌ Login Failed: " + (error.message || "Invalid credentials"))
  } finally {
    loading.value = false
  }
}
</script>