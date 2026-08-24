<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-12 md:pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          My Profile
        </h1>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-1">
          Manage your personal information
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16 sm:py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <form v-else @submit.prevent="saveProfile" class="space-y-5 sm:space-y-6">
        <!-- Avatar -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
            Profile Photo
          </h2>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <img
              :src="avatarPreview"
              alt="Profile photo"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200"
            />

            <div class="flex-1 min-w-0">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Upload new photo
              </label>
              <input
                type="file"
                accept="image/*"
                @change="onAvatarChange"
                class="block w-full text-sm text-gray-500
                  file:mr-3 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-medium
                  file:bg-[var(--royal-blue)] file:text-white
                  hover:file:bg-[#001fa3]"
              />
              <p class="text-xs text-gray-400 mt-2">
                JPG or PNG. Max 2MB.
              </p>
            </div>
          </div>
        </section>

        <!-- Personal Information -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
            Personal Information
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Full Name
            </label>
            <input
              v-model="form.full_name"
              type="text"
              required
              class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
              placeholder="Your full name"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                readonly
                class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                  bg-gray-50 text-gray-600"
              />
              <p class="text-xs text-gray-400 mt-1">
                Managed from your login account
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Phone
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                  text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                placeholder="e.g. 08012345678"
              />
            </div>
          </div>
        </section>

        <!-- Location -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
            Location
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                State
              </label>
              <select
                v-model="form.state"
                class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                  text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
              >
                <option value="">Select state</option>
                <option value="Kwara State">Kwara State</option>
                <option value="Ogun State">Ogun State</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                City
              </label>
              <input
                v-model="form.city"
                type="text"
                class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                  text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                placeholder="e.g. Ilorin"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                LGA
              </label>
              <input
                v-model="form.lga"
                type="text"
                class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                  text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                placeholder="Local government"
              />
            </div>
          </div>
        </section>

        <!-- Account status -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            Account
          </h2>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <span class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs sm:text-sm">
              Role: <strong>Customer</strong>
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs sm:text-sm">
              Status: <strong>{{ form.status || 'active' }}</strong>
            </span>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <button
            type="button"
            @click="loadProfile"
            class="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl
              border border-gray-300 text-gray-700 hover:bg-white transition"
          >
            Reset
          </button>

          <button
            type="submit"
            :disabled="saving"
            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl
              bg-[var(--royal-blue)] hover:bg-[#001fa3] disabled:bg-gray-400
              text-white font-semibold transition"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <p v-if="message" class="text-sm text-green-600 sm:text-right">{{ message }}</p>
        <p v-if="errorMessage" class="text-sm text-red-500 sm:text-right">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')
const avatarFile = ref(null)

const form = ref({
  id: '',
  full_name: '',
  email: '',
  phone: '',
  role: 'customer',
  avatar_url: '',
  state: '',
  city: '',
  lga: '',
  status: 'active',
})

const avatarPreview = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value)
  }
  return (
    form.value.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.value.full_name || 'Customer')}&background=0025cc&color=fff`
  )
})

const onAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Image must be less than 2MB'
    return
  }

  avatarFile.value = file
  errorMessage.value = ''
}

const loadProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  message.value = ''
  avatarFile.value = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    form.value = {
      id: data.id,
      full_name: data.full_name || '',
      email: data.email || user.email || '',
      phone: data.phone || '',
      role: data.role || 'customer',
      avatar_url: data.avatar_url || '',
      state: data.state || '',
      city: data.city || '',
      lga: data.lga || '',
      status: data.status || 'active',
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

const uploadAvatar = async (userId) => {
  if (!avatarFile.value) return form.value.avatar_url

  const file = avatarFile.value
  const ext = file.name.split('.').pop()
  const filePath = `avatars/${userId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}

const saveProfile = async () => {
  saving.value = true
  message.value = ''
  errorMessage.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Phone uniqueness check
    const phone = form.value.phone?.trim() || null
    if (phone) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .neq('id', user.id)
        .maybeSingle()

      if (existing) {
        errorMessage.value = 'This phone number is already registered to another account.'
        return
      }
    }

    let avatarUrl = form.value.avatar_url
    if (avatarFile.value) {
      avatarUrl = await uploadAvatar(user.id)
    }

    const payload = {
      full_name: form.value.full_name.trim(),
      phone,
      avatar_url: avatarUrl || null,
      state: form.value.state || null,
      city: form.value.city || null,
      lga: form.value.lga || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)

    if (error) {
      if (error.code === '23505' && error.message?.includes('profiles_phone_key')) {
        errorMessage.value = 'This phone number is already registered to another account.'
      } else {
        throw error
      }
      return
    }

    form.value.avatar_url = avatarUrl
    avatarFile.value = null
    message.value = 'Profile updated successfully'

    setTimeout(() => {
      message.value = ''
    }, 2500)
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to save profile'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>