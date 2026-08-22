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
          <p class="text-[var(--royal-blue)] md:text-[15px] text-sm mt-2 text-center">
            Sign up as {{ role === 'agent' ? 'Property Agent' : 'Customer' }}
          </p>
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
          <!-- Email -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">
              Email Address <span class="text-red-500 text-xs">(Gmail Only)</span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              placeholder="yourname@gmail.com"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            />
            <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Full Name</label>
            <input 
              v-model="form.fullName" 
              type="text" 
              required 
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Phone Number</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              required 
              placeholder="+234"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
            />
            <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
          </div>

          <!-- State -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">State</label>
            <select 
              v-model="form.state" 
              required
              @change="onStateChange"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors"
            >
              <option value="" disabled>Select State</option>
              <option value="Kwara State">Kwara State</option>
              <option value="Ogun State">Ogun State</option>
            </select>
          </div>

          <!-- City -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">City</label>
            <select 
              v-model="form.city" 
              required
              :disabled="!form.state"
              @change="onCityChange"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors disabled:bg-gray-100"
            >
              <option value="" disabled>{{ form.state ? 'Select City' : 'Select State first' }}</option>
              <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <!-- LGA -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">LGA</label>
            <select 
              v-model="form.lga" 
              required
              :disabled="!form.city"
              class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors disabled:bg-gray-100"
            >
              <option value="" disabled>{{ form.city ? 'Select LGA' : 'Select City first' }}</option>
              <option v-for="lga in availableLgas" :key="lga" :value="lga">{{ lga }}</option>
            </select>
          </div>

          <!-- Agent Fields -->
          <template v-if="role === 'agent'">
            <div>
              <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Agency Name</label>
              <input 
                v-model="form.agencyName" 
                type="text" 
                required 
                class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
              />
            </div>
            <div>
              <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Office Address</label>
              <input 
                v-model="form.officeAddress" 
                type="text" 
                required 
                class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
              />
            </div>
          </template>

          <!-- Password -->
          <div>
            <label class="block relative md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Password</label>
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
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)]"
              >
                <Eye v-if="showPassword" class="w-4 h-4" /> 
                <EyeClosed v-else class="w-4 h-4" /> 
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block md:text-sm text-xs font-medium text-[var(--royal-blue)] mb-1">Confirm Password</label>
            <div class="relative">
              <input 
                v-model="form.confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'"  
                required 
                class="w-full px-3 py-1 rounded-2xl border md:text-sm text-xs border-[var(--light-blue)] text-[var(--royal-blue)] focus:border-[var(--royal-blue)] focus:outline-none transition-colors" 
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--royal-blue)]"
              >
                <Eye v-if="showConfirmPassword" class="w-5 h-5" />
                <EyeClosed v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] md:text-sm text-xs hover:bg-[var(--medium-blue)] disabled:opacity-70 text-white font-semibold py-4 rounded-2xl cursor-pointer transition-all"
          >
            {{ loading ? 'Creating Account...' : `Create ${role === 'agent' ? 'Agent' : 'Customer'} Account` }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../supabaseClient.ts'
import { Eye, EyeClosed } from 'lucide-vue-next'

const props = defineProps({
  role: { type: String, required: true }
})

const router = useRouter()
const loading = ref(false)
const emailError = ref('')
const phoneError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  state: '',
  city: '',
  lga: '',
  agencyName: '',
  officeAddress: '',
  password: '',
  confirmPassword: ''
})

// ========== LOCATION DATA ==========
const locationData = {
  Kwara: {
    Ilorin: ['Ilorin East', 'Ilorin South', 'Ilorin West', 'Asa'],
    // Offa: ['Offa', 'Oyun'],
    // 'Omu-Aran': ['Irepodun', 'Isin', 'Oke-Ero'],
    // Share: ['Ifelodun'],
    // Lafiagi: ['Edu'],
    // Kaiama: ['Kaiama'],
    // Patigi: ['Patigi'],
    // 'Bode Saadu': ['Moro'],
    // 'Araromi-Opin': ['Ekiti']
  },
  Ogun: {
    // Abeokuta: ['Abeokuta North', 'Abeokuta South', 'Odeda'],
    'Ijebu Ode': ['Ijebu Ode', 'Ijebu East', 'Ijebu North East'],
    // Sagamu: ['Sagamu', 'Remo North', 'Ikenne'],
    // Ota: ['Ado-Odo/Ota'],
    // Ifo: ['Ifo', 'Ewekoro'],
    // Ilaro: ['Yewa South'],
    // Ayetoro: ['Yewa North'],
    // 'Ijebu Igbo': ['Ijebu North'],
    // Owode: ['Obafemi Owode'],
    // Ipokia: ['Ipokia'],
    // Imeko: ['Imeko Afon']
  }
}

const availableCities = computed(() => {
  if (!form.value.state) return []
  return Object.keys(locationData[form.value.state] || {})
})

const availableLgas = computed(() => {
  if (!form.value.state || !form.value.city) return []
  return locationData[form.value.state]?.[form.value.city] || []
})

const onStateChange = () => {
  form.value.city = ''
  form.value.lga = ''
}

const onCityChange = () => {
  form.value.lga = ''
}

// ========== GOOGLE SIGN UP ==========
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

// ========== CHECK IF EMAIL OR PHONE ALREADY EXISTS ==========
const checkExistingUser = async (email, phone) => {
  // Check email
  const { data: emailExists, error: emailErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (emailErr) {
    console.error('Email check error:', emailErr)
  }
  if (emailExists) {
    return { exists: true, field: 'email' }
  }

  // Check phone
  const { data: phoneExists, error: phoneErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .maybeSingle()

  if (phoneErr) {
    console.error('Phone check error:', phoneErr)
  }
  if (phoneExists) {
    return { exists: true, field: 'phone' }
  }

  return { exists: false }
}

// ========== HANDLE SUBMIT ==========
const handleSubmit = async () => {
  emailError.value = ''
  phoneError.value = ''
  loading.value = true

  try {
    // Validation
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

    // ===== CHECK FOR EXISTING EMAIL OR PHONE =====
    const existing = await checkExistingUser(form.value.email, form.value.phone)

    if (existing.exists) {
      if (existing.field === 'email') {
        emailError.value = "This Gmail is already registered. Please use another Gmail address."
      } else {
        phoneError.value = "This phone number is already registered. Please use another phone number."
      }
      alert("❌ This email or phone number is already registered.\nPlease use a different Gmail and phone number.")
      return   // ← DO NOT proceed to auth.signUp or write to database
    }

    // 1. Sign Up (only if email & phone are unique)
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName,
          role: props.role
        }
      }
    })

    if (authError) {
      // Extra safety: catch Supabase's own "already registered" message
      if (authError.message?.toLowerCase().includes('already registered') || 
          authError.message?.toLowerCase().includes('user already exists')) {
        emailError.value = "This Gmail is already registered. Please use another Gmail address."
        alert("❌ This email is already registered. Please use a different Gmail.")
        return
      }
      console.error("Auth Error:", authError)
      throw new Error(authError.message || "Failed to create account")
    }

    if (!data?.user) {
      throw new Error("No user returned from signup")
    }

    // 2. Create Profile (only after successful auth)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: form.value.fullName,
        phone: form.value.phone,
        email: form.value.email.toLowerCase(),
        role: props.role,
        state: form.value.state,
        city: form.value.city,
        lga: form.value.lga,
        agency_name: props.role === 'agent' ? form.value.agencyName : null,
        office_address: props.role === 'agent' ? form.value.officeAddress : null,
      })

    if (profileError) {
      console.error("Profile Error Details:", profileError)
      alert(`Profile creation issue: ${profileError.message || JSON.stringify(profileError)}`)
      // Auth user was created, but profile failed – you may want to handle cleanup later
    }

    alert("✅ Account created successfully!\n\nPlease login to your account.")
    router.push('/login')

  } catch (err) {
    console.error("Full Error Object:", err)
    alert("❌ Error: " + (err.message || JSON.stringify(err) || "Unknown error occurred"))
  } finally {
    loading.value = false
  }
}
</script>