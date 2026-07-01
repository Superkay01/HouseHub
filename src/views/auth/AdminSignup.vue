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
            Restricted Access • Platform Management
          </p>
        </div>
      </div>

      <!-- Right Column - Signup Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8">
          <h1 class="md:text-3xl text-2xl font-bold text-[var(--royal-blue)] text-center">Create Admin Account</h1>
          <p class="text-[var(--royal-blue)] md:text-[15px] text-sm mt-2 text-center">Secure &amp; Formal Registration</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Secret Code -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Secret Admin Code</label>
            <input
              v-model="form.secretCode"
              type="text"
              required
              placeholder="Enter Secret Code"
              class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors font-mono"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Full Name</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

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
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Phone Number</label>
            <input
              v-model="form.phone"
              type="tel"
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
                minlength="6"
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

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Residential Address</label>
            <input
              v-model="form.address"
              type="text"
              required
              class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">State</label>
              <select v-model="form.state" required 
                      class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors">
                <option value="">Select State</option>
                <option value="Kwara">Kwara</option>
                <option value="Ogun">Ogun</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Federal Capital Territory</option>
              </select>
            </div>
            <div>
              <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">City</label>
              <input
                v-model="form.city"
                type="text"
                required
                class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">LGA</label>
            <input
              v-model="form.lga"
              type="text"
              required
              class="w-full px-3 py-3 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all">
            {{ loading ? 'Creating Account...' : 'Create Admin Account' }}
          </button>
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
  secretCode: '',
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  state: '',
  city: '',
  lga: ''
})

const ADMIN_SECRET_CODE = 'LODGENEXT_2026'

const handleSubmit = async () => {
  if (form.value.secretCode.trim() !== ADMIN_SECRET_CODE) {
    alert("❌ Invalid Secret Admin Code.")
    return
  }

  loading.value = true
  console.log("Starting signup...")

  try {
    // 1. Auth Signup
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
      options: {
        data: { 
          role: 'state_admin',
          full_name: form.value.fullName 
        }
      }
    })

    if (authError) {
      console.error("Auth Error:", authError)
      throw authError
    }

    console.log("Auth successful, user ID:", data.user?.id)

    // 2. Insert Profile
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({
        id: data.user.id,
        full_name: form.value.fullName.trim(),
        email: form.value.email.trim().toLowerCase(),
        phone: form.value.phone.trim(),
        state: form.value.state,
        city: form.value.city.trim(),
        lga: form.value.lga.trim(),
        residential_address: form.value.address.trim(),
        secret_code: form.value.secretCode.trim(),
        role: 'state_admin'
      })

    if (profileError) {
      console.error("Profile Insert Error:", profileError)
      throw profileError
    }

    console.log("✅ Signup completed successfully!")
    alert(`✅ Account created successfully for ${form.value.fullName}!`)
    router.push('/AdminLogin')

  } catch (error) {
    console.error("Full Error Object:", error)
    console.error("Error Message:", error.message)
    console.error("Error Code:", error.code)
    console.error("Error Details:", error.details)

    let msg = "Unknown error occurred"

    if (error.message) msg = error.message
    else if (error.error_description) msg = error.error_description
    else if (error.code) msg = `Code: ${error.code}`

    alert(`❌ Signup Failed: ${msg}`)
  } finally {
    loading.value = false
  }
}
</script>