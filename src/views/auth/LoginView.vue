<template>
    <Navbar/>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-8 px-4">
    <div class="max-w-4xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">

      <!-- Left Column - Image & Welcome -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]/70"></div>
        
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="text-4xl font-bold mb-4">Welcome Back</h2>
          <p class="text-lg text-light-blue">
            Sign in to continue your journey with LodgeNext
          </p>
        </div>
      </div>

      <!-- Right Column - Login Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-40 h-12  flex items-center justify-center ">
            <img
              src="/Lodgenext_logo__2_-removebg-preview.png"
              alt="Lodgenext logo"
              class="w-50 h-25 object-cover"
            />
            </div>
          </div>
          <h1 class="md:text-2xl text-xl font-bold text-[var(--royal-blue)]">Sign In</h1>
          <p class="text-[var(--medium-blue)] md:text-sm text-xs mt-2">Access your LodgeNext account</p>
        </div>

        <!-- Google Login -->
        <button
          @click="signInWithGoogle"
          class="w-full flex items-center justify-center gap-3 bg-[var(--white)] border border-[var(--light-blue)] hover:border-[var(--steel-blue)] py-2 rounded-2xl font-medium text-[var(--royal-blue)] transition-all hover:shadow-md mb-4"
        >
          <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_24dp.png" alt="Google" class="w-4 h-4">
          Continue with Google
        </button>

        <div class="relative text-center my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <span class="relative bg-white px-4 text-medium-gray text-sm">OR</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block md:text-sm text-xs  font-medium text-[var(--royal-blue)] mb-1">Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              placeholder="yourname@gmail.com"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block md:text-sm text-xs  font-medium text-[var(--royal-blue)] mb-1">Password</label>
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                required
                class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--white)] hover:text-[var(--royal-blue)]"
              >
                <Eye v-if="showPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex justify-end">
            <a href="/forgot-password" class="text-sm text-[var(--royal-blue)] hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-[var(--white)] font-semibold py-3 rounded-2xl text-lg transition-all">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-[var(--medium-gray)] mt-8">
          Don't have an account? 
          <router-link to="/signup" class="text-[var(--royal-blue)] font-semibold hover:underline">
            Sign up here
          </router-link>
        </p>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabaseClient.js'
import { Eye, EyeClosed } from 'lucide-vue-next'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'

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
      email: form.value.email,
      password: form.value.password
    })

    if (error) throw error

    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role || 'customer'

    // Redirect based on role
    if (role === 'agent') {
      router.push('/agent/dashboard')
    } else {
      router.push('/customer/dashboard')
    }

  } catch (error) {
    alert("❌ Login Failed: " + error.message)
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  try {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  } catch (err) {
    alert("Google Sign In failed. Please try again.")
  }
}
</script>