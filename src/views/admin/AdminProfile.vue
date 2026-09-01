<template>
  <div class="min-h-screen bg-gray-50 pb-12 md:pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          Admin Profile
        </h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">
          Manage your administrator account details
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16 sm:py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <form v-else @submit.prevent="saveProfile" class="space-y-5 sm:space-y-6">
        <!-- Profile Image -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
            Profile Photo
          </h2>

          <div class="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <!-- Avatar Preview -->
            <div class="relative">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[var(--royal-blue)]/20 bg-gray-100 flex items-center justify-center">
                <img
                  v-if="previewUrl || form.avatar_url"
                  :src="previewUrl || form.avatar_url"
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-4xl text-gray-400 font-medium">
                  {{ form.full_name?.charAt(0)?.toUpperCase() || 'A' }}
                </span>
              </div>

              <!-- Camera button -->
              <button
                type="button"
                @click="triggerFileInput"
                class="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[var(--royal-blue)] text-white flex items-center justify-center shadow-md hover:opacity-90 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <div class="flex-1 text-center sm:text-left">
              <p class="text-sm text-gray-600 mb-3">
                Upload a clear photo of yourself. JPG or PNG, max 2MB.
              </p>

              <div class="flex flex-wrap justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-4 py-2 text-sm rounded-xl border border-[var(--royal-blue)] text-[var(--royal-blue)] hover:bg-[var(--royal-blue)] hover:text-white transition"
                >
                  Choose Photo
                </button>

                <button
                  v-if="previewUrl || form.avatar_url"
                  type="button"
                  @click="removeAvatar"
                  class="px-4 py-2 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>

              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onFileSelected"
              />
            </div>
          </div>
        </section>

        <!-- Basic Information -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
            Basic Information
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
                Email cannot be changed here
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Residential Address
            </label>
            <input
              v-model="form.residential_address"
              type="text"
              class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
              placeholder="Your residential address"
            />
          </div>
        </section>

        <!-- Location -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)]">
            Assigned Location
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

        <!-- Account info (read-only) -->
        <section class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
          <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3 sm:mb-4">
            Account Details
          </h2>

          <div class="flex flex-wrap gap-2 sm:gap-3 mb-4">
            <span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs sm:text-sm capitalize">
              Role: <strong>{{ formatRole(form.role) }}</strong>
            </span>
            <span
              class="px-3 py-1.5 rounded-xl text-xs sm:text-sm"
              :class="form.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ form.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div class="p-3 rounded-xl bg-gray-50">
              <p class="text-gray-500 text-xs mb-1">Last Login</p>
              <p class="text-gray-800 font-medium">
                {{ formatDate(form.last_login) }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-gray-50">
              <p class="text-gray-500 text-xs mb-1">Account Created</p>
              <p class="text-gray-800 font-medium">
                {{ formatDate(form.created_at) }}
              </p>
            </div>
          </div>

          <div v-if="form.permissions?.length" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Permissions</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="perm in form.permissions"
                :key="perm"
                class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs"
              >
                {{ perm }}
              </span>
            </div>
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
            :disabled="saving || uploading"
            class="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl
              bg-[var(--royal-blue)] hover:bg-[#001fa3] disabled:bg-gray-400
              text-white font-semibold transition"
          >
            {{ saving || uploading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <p v-if="message" class="text-sm text-green-600 sm:text-right">{{ message }}</p>
        <p v-if="errorMessage" class="text-sm text-red-500 sm:text-right">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const message = ref('')
const errorMessage = ref('')

const fileInput = ref(null)
const previewUrl = ref(null)
const selectedFile = ref(null)

const form = ref({
  id: '',
  full_name: '',
  email: '',
  phone: '',
  role: 'state_admin',
  residential_address: '',
  state: '',
  city: '',
  lga: '',
  avatar_url: '',
  permissions: [],
  is_active: true,
  last_login: null,
  created_at: null,
})

const formatRole = (role) => {
  if (!role) return 'Admin'
  return role.replaceAll('_', ' ')
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Image must be less than 2MB'
    return
  }

  // Validate type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'Only JPG, PNG or WebP images are allowed'
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  errorMessage.value = ''
}

const removeAvatar = () => {
  selectedFile.value = null
  previewUrl.value = null
  form.value.avatar_url = ''
  if (fileInput.value) fileInput.value.value = ''
}

const uploadAvatar = async (userId) => {
  if (!selectedFile.value) return form.value.avatar_url || null

  uploading.value = true
  try {
    const file = selectedFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    const filePath = `admins/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars') // ← Make sure this bucket exists
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // overwrite previous avatar
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (err) {
    console.error('Upload error:', err)
    throw new Error('Failed to upload profile image')
  } finally {
    uploading.value = false
  }
}

const loadProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  message.value = ''
  previewUrl.value = null
  selectedFile.value = null

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    form.value = {
      id: data.id,
      full_name: data.full_name || '',
      email: data.email || user.email || '',
      phone: data.phone || '',
      role: data.role || 'state_admin',
      residential_address: data.residential_address || '',
      state: data.state || '',
      city: data.city || '',
      lga: data.lga || '',
      avatar_url: data.avatar_url || '',
      permissions: data.permissions || [],
      is_active: data.is_active ?? true,
      last_login: data.last_login,
      created_at: data.created_at,
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to load admin profile'
  } finally {
    loading.value = false
  }
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

    // Upload new avatar if selected
    let avatarUrl = form.value.avatar_url
    if (selectedFile.value) {
      avatarUrl = await uploadAvatar(user.id)
    }

    const phone = form.value.phone?.trim() || null

    // Phone uniqueness check
    if (phone) {
      const { data: existing } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('phone', phone)
        .neq('id', user.id)
        .maybeSingle()

      if (existing) {
        errorMessage.value = 'This phone number is already registered to another admin.'
        return
      }
    }

    const payload = {
      full_name: form.value.full_name.trim(),
      phone,
      residential_address: form.value.residential_address?.trim() || null,
      state: form.value.state || null,
      city: form.value.city || null,
      lga: form.value.lga || null,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('admin_profiles')
      .update(payload)
      .eq('id', user.id)

    if (error) {
      if (error.code === '23505' && error.message?.includes('admin_profiles_phone_key')) {
        errorMessage.value = 'This phone number is already registered to another admin.'
      } else {
        throw error
      }
      return
    }

    // Update local form
    form.value.avatar_url = avatarUrl
    selectedFile.value = null
    previewUrl.value = null

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