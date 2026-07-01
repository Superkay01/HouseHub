<template>
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-5 px-2">
    <div class="max-w-7xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">

      <!-- Left Column -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]"></div>
        
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="md:text-3xl text-2xl font-bold mb-4">State Admin Portal</h2>
          <p class="md:text-lg text-sm text-light-blue mb-8">
            Manage properties, agents, and verifications in your assigned state.
          </p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="p-8 md:p-12">
        <div class="mb-8">
          <h1 class="md:text-3xl text-2xl font-bold text-[var(--royal-blue)] text-center">Create State Admin Account</h1>
          <p class="text-[var(--royal-blue)] md:text-[15px] text-sm mt-2 text-center">Ilorin & Ijebu Ode</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Full Name</label>
            <input v-model="form.fullName" type="text" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Email Address</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Phone Number</label>
            <input v-model="form.phone" type="tel" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Password</label>
            <div class="relative">
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                minlength="6"
                class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)] hover:text-[var(--royal-blue)]"
              >
                <Eye v-if="showPassword" class="w-4 h-4" />
                <EyeClosed v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">State</label>
            <select v-model="form.state" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors">
              <option value="Kwara">Kwara State</option>
              <option value="Ogun">Ogun State</option>
            </select>
          </div>

          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">City</label>
            <select v-model="form.city" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors">
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <!-- Single Admin Code -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Admin Code</label>
            <input v-model="form.adminCode" type="text" required 
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors font-mono" />
            <!-- <p class="text-xs text-medium-gray mt-1">Use code: <strong>LODGENEXT_090300</strong></p> -->
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all">
            {{ loading ? 'Creating Account...' : 'Create State Admin Account' }}
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
  fullName: '',
  email: '',
  phone: '',
  password: '',
  state: 'Kwara',
  city: 'Ilorin',
  adminCode: ''
})

const cities = ['Ilorin', 'Ijebu Ode']
const MASTER_ADMIN_CODE = 'LODGENEXT_090300'

const handleSubmit = async () => {
  if (form.value.adminCode !== MASTER_ADMIN_CODE) {
    alert("❌ Invalid Admin Code. Please use LODGENEXT_090300")
    return
  }

  loading.value = true

  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: { full_name: form.value.fullName }
      }
    })

    if (authError) throw authError
    if (!data.user) throw new Error("Failed to create user")

    // Insert into admin_profiles
    const { error: profileError } = await supabase.from('admin_profiles').insert({
      id: data.user.id,
      full_name: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      state: form.value.state,
      city: form.value.city,
      admin_code: form.value.adminCode
    })

    if (profileError) throw profileError

    alert(`✅ Account created successfully!\n\nWelcome ${form.value.fullName}!\n\nYou can now login.`)

    router.push('/admin/login')   // or /admin/dashboard

  } catch (error) {
    console.error("Full Error:", error)
    alert("❌ Error: " + (error.message || JSON.stringify(error)))
  } finally {
    loading.value = false
  }
}
</script>