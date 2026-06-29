<template>
 
  <div class="min-h-screen bg-[var(--light-blue)] flex items-center justify-center py-5 px-2">
    <div class="max-w-7xl w-full grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden">

      <!-- Left Column - Image & Welcome -->
      <div class="hidden md:flex relative bg-cover bg-center items-center justify-center p-10"
           :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80')` }">
        <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/80 to-[var(--medium-blue)]"></div>
        
        <div class="relative z-10 text-white text-center max-w-sm">
          <h2 class="md:text-3xl text-2xl font-bold mb-4">Welcome to LodgeNext</h2>
          <p class="md:text-lg text-sm text-light-blue mb-8">
            Join thousands of people finding their perfect homes in Ilorin & Ijebu Ode
          </p>
          <div class="space-y-3 text-left text-sm">
            <div class="flex items-center gap-3">
              <span class="text-[var(--bright-green)] md:text-xl text-sm">✓</span>
              <span>Verified Properties</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[var(--bright-green)] md:text-xl text-sm">✓</span>
              <span>Trusted Agents</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[var(--bright-green)] md:text-xl text-sm">✓</span>
              <span>Fast & Secure Process</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Signup Form -->
      <div class="p-8 md:p-12">
        <div class="mb-8">
          <h1 class="md:text-3xl text-2xl font-bold text-[var(--royal-blue)] text-center">Create Account</h1>
          <p class="text-[var(--royal-blue)] md:text-[15px] text-sm mt-2 text-center">Sign up as {{ role === 'agent' ? 'Property Agent' : 'Customer' }}</p>
        </div>

        <!-- Google Button -->
        <button
          type="button"
          @click="signUpWithGoogle"
          class="w-full flex items-center justify-center gap-1 px-1 md:text-[14px] text-[12px] bg-[var(--white)] border border-[var(--light-blue)] hover:border-[var(--steel-blue)] py-4 rounded-2xl font-medium text-[var(--royal-blue)] transition-all hover:shadow-md mb-6"
        >
          <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_24dp.png" alt="Google" class="w-4 h-4">
          Continue with Google
        </button>

        <div class="relative text-center my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[var(--light-blue)]"></div>
          </div>
          <span class="relative bg-white px-4 text-medium-gray text-sm">OR</span>
        </div>

        <!-- Email Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Email Address <span class="text-red-500 text-xs">(Gmail Only)</span></label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              placeholder="yourname@gmail.com"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
            <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
          </div>

          <div>
            <label class="block  md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Full Name</label>
            <input v-model="form.fullName" type="text" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
          </div>

          <div>
            <label class="block  md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Phone Number</label>
            <input v-model="form.phone" type="tel" required placeholder="+234" class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
          </div>

          <!-- Agent Fields -->
          <template v-if="role === 'agent'">
            <div>
              <label class="block  md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Agency Name</label>
              <input v-model="form.agencyName" type="text" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
            </div>
            <div>
              <label class="block  md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Office Address</label>
              <input v-model="form.officeAddress" type="text" required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
            </div>
          </template>

          <div>
            <label class="block relative md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Password</label>
            <div class="relative">
              <input v-model="form.password"  
            :type= "showPassword ? 'text' : 'password'" 
            required 
            minlength="6" 
            class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
            <button type="button" 
          @click= "showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2  text-[var(--royal-blue)] hover:text-[var(--royal-blue)]">
            <Eye v-if = "showPassword" class="w-4 h-4 text-[var(--royal-blue)]"/> 
            <EyeClosed v-else class="w-4 h-4"/> 
          </button>
          </div>
            </div>

          <div>
            <label class="block  md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Confirm Password</label>
            <div class="relative">
              <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"  required class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" />
            <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)] hover:text-[var(--royal-blue)]"
              >
                <Eye v-if="showConfirmPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)]  md:text-sm text-xs hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all">
            {{ loading ? 'Creating Account...' : `Create ${role === 'agent' ? 'Agent' : 'Customer'} Account` }}
          </button>
        </form>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabaseClient.ts'
import { Eye, EyeClosed } from 'lucide-vue-next'


const props = defineProps({
  role: { type: String, required: true }
})

const router = useRouter()
const loading = ref(false)
const emailError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  agencyName: '',
  officeAddress: '',
  password: '',
  confirmPassword: ''
})

// Google Sign Up with Fallback
const signUpWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) {
      alert("Google Sign Up is currently unavailable. Please use Email signup.")
    }
  } catch (err) {
    alert("Google Sign Up is currently unavailable. Please use Email signup.")
  }
}

const handleSubmit = async () => {
  emailError.value = ''

  if (!form.value.email.toLowerCase().endsWith('@gmail.com')) {
    emailError.value = "Only Gmail addresses (@gmail.com) are allowed"
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    alert("❌ Passwords do not match!")
    return
  }

  if (form.value.password.length < 6) {
    alert("❌ Password must be at least 6 characters")
    return
  }

  loading.value = true

  try {
    const { error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName,
          phone: form.value.phone,
          role: props.role,
          agency_name: props.role === 'agent' ? form.value.agencyName : null,
          office_address: props.role === 'agent' ? form.value.officeAddress : null
        }
      }
    })

    if (error) throw error

    alert("✅ Account created successfully!\n\nPlease check your Gmail to verify your account.")
    router.push('/login')

  } catch (error) {
    console.error(error)
    alert("❌ Error: " + error.message)
  } finally {
    loading.value = false
  }
}
</script>