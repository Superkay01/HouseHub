<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
    <div class="max-w-3xl mx-auto px-4 pt-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Profile Settings</h1>
        <p class="text-[var(--steel-blue)] mt-1">
          Update your agent profile information
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <form v-else @submit.prevent="saveProfile" class="space-y-6">
        <!-- Avatar Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">Profile Photo</h2>

          <div class="flex items-center gap-5">
            <img
              :src="avatarPreview"
              alt="Avatar"
              class="w-20 h-20 rounded-2xl object-cover border border-gray-200"
            />

            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Upload new photo
              </label>
              <input
                type="file"
                accept="image/*"
                @change="onAvatarChange"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[var(--royal-blue)] file:text-white hover:file:bg-[#001fa3]"
              />
              <p class="text-xs text-gray-400 mt-2">JPG/PNG recommended. Max 2MB.</p>
            </div>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)]">Basic Information</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="form.full_name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
              placeholder="Your full name"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-600"
                readonly
              />
              <p class="text-xs text-gray-400 mt-1">Email is managed from your account login</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
                placeholder="e.g. 08012345678"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              v-model="form.bio"
              rows="4"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)] resize-y"
              placeholder="Tell clients about yourself..."
            ></textarea>
          </div>
        </div>

        <!-- Agency Info -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)]">Agency Details</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
            <input
              v-model="form.agency_name"
              type="text"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
              placeholder="Your agency name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
            <input
              v-model="form.office_address"
              type="text"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
              placeholder="Office address"
            />
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)]">Location</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select
                v-model="form.state"
                class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
              >
                <option value="">Select state</option>
                <option value="Kwara State">Kwara State</option>
                <option value="Ogun State">Ogun State</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                v-model="form.city"
                type="text"
                class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
                placeholder="e.g. Ilorin"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">LGA</label>
              <input
                v-model="form.lga"
                type="text"
                class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
                placeholder="Local government"
              />
            </div>
          </div>
        </div>

        <!-- Status info (read-only) -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">Account Status</h2>
          <div class="flex flex-wrap gap-3 text-sm">
            <span class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700">
              Role: <strong>{{ form.role || 'agent' }}</strong>
            </span>
            <span
              class="px-3 py-1.5 rounded-xl"
              :class="form.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
            >
              {{ form.verified ? 'Verified Agent' : 'Not Verified' }}
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700">
              Status: <strong>{{ form.status || 'active' }}</strong>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            @click="loadProfile"
            class="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-white transition"
          >
            Reset
          </button>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3 rounded-2xl bg-[var(--royal-blue)] hover:bg-[#001fa3] disabled:bg-gray-400 text-white font-semibold transition"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <p v-if="message" class="text-sm text-green-600 text-right">{{ message }}</p>
        <p v-if="errorMessage" class="text-sm text-red-500 text-right">{{ errorMessage }}</p>
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
  role: 'agent',
  agency_name: '',
  office_address: '',
  avatar_url: '',
  bio: '',
  verified: false,
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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(form.value.full_name || 'Agent')}&background=0025cc&color=fff`
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
      role: data.role || 'agent',
      agency_name: data.agency_name || '',
      office_address: data.office_address || '',
      avatar_url: data.avatar_url || '',
      bio: data.bio || '',
      verified: !!data.verified,
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

    let avatarUrl = form.value.avatar_url
    if (avatarFile.value) {
      avatarUrl = await uploadAvatar(user.id)
    }

    const payload = {
      full_name: form.value.full_name.trim(),
      phone: form.value.phone || null,
      agency_name: form.value.agency_name || null,
      office_address: form.value.office_address || null,
      avatar_url: avatarUrl || null,
      bio: form.value.bio || null,
      state: form.value.state || null,
      city: form.value.city || null,
      lga: form.value.lga || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)

    if (error) throw error

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