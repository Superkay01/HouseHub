<template>
  <div
    role="button"
    tabindex="0"
    class="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0025cc]"
    @click="viewDetails"
    @keydown.enter="viewDetails"
    @keydown.space.prevent="viewDetails"
  >
    <!-- Image Section -->
    <div class="relative h-48 sm:h-56 overflow-hidden">
      <img
        :src="property.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'"
        :alt="property.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Verified Badge -->
      <div
        v-if="property.profiles?.verified || property.profiles?.is_verified"
        class="absolute top-3 left-3 bg-white/95 text-[#0025cc] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow"
      >
        <span class="text-green-500">✓</span> Verified
      </div>

      <!-- Save Button — stop so it doesn't open details -->
      <button
        type="button"
        @click.stop="toggleSave"
        :disabled="saving"
        class="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center shadow transition-all hover:scale-110 disabled:opacity-50"
      >
        <Heart
          :class="[isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600']"
          class="w-4 h-4 transition-colors"
        />
      </button>

      <!-- Purpose Badge -->
      <div class="absolute bottom-3 left-3 bg-[var(--light-blue)] text-[var(--royal-blue)] text-[10px] sm:text-xs font-medium px-3 py-1 rounded-xl">
        {{ property.purpose }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col">
      <!-- Title + Price -->
      <div class="flex justify-between items-start gap-3 mb-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm sm:text-base leading-snug text-gray-900 line-clamp-2">
            {{ property.title }}
          </h3>
          <p class="text-xs text-[var(--royal-blue)] mt-1 flex items-center gap-1 truncate">
            📍 {{ property.area }}, {{ property.city }}
          </p>
        </div>

        <div class="text-right flex-shrink-0">
          <p class="font-bold text-base sm:text-lg text-[#0025cc] leading-tight">
            ₦{{ Number(property.price || 0).toLocaleString() }}
          </p>
          <p class="text-[10px] sm:text-xs text-[var(--hover-blue)]">per year</p>
        </div>
      </div>

      <div class="mb-2">
        <p class="text-xs sm:text-sm font-medium text-gray-700">
          {{
            property.inspection_fee
              ? `Inspection Fee: ₦${Number(property.inspection_fee).toLocaleString()}`
              : 'No Inspection Fee'
          }}
        </p>
      </div>

      <!-- Views -->
      <div class="flex items-center gap-1.5 text-[var(--royal-blue)] text-xs mb-3">
        <span>👁️</span>
        <span>{{ formatViews(viewCount) }} views</span>
      </div>

      <!-- Features -->
      <div class="flex flex-wrap gap-3 sm:gap-4 text-xs mb-3">
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🛏️</span>
          <span class="font-medium">{{ property.bedrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚿</span>
          <span class="font-medium">{{ property.bathrooms || 0 }}</span>
        </div>
        <div v-if="property.toilets" class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚽</span>
          <span class="font-medium">{{ property.toilets }}</span>
        </div>
      </div>

      <!-- Amenities Preview -->
      <div v-if="property.amenities?.length" class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="(amenity, i) in property.amenities.slice(0, 3)"
          :key="i"
          class="text-[10px] sm:text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-xl"
        >
          {{ amenity }}
        </span>
        <span
          v-if="property.amenities.length > 3"
          class="text-[10px] sm:text-xs text-gray-400 self-center"
        >
          +{{ property.amenities.length - 3 }}
        </span>
      </div>

      <!-- Agent Info + Button -->
      <div class="mt-auto pt-3 border-t flex items-center gap-2.5">
        <button
          type="button"
          @click.stop="viewAgentProfile"
          class="flex items-center gap-2.5 flex-1 min-w-0 text-left hover:bg-gray-50 rounded-xl p-1 -m-1 transition disabled:opacity-60"
          :disabled="!agentId"
          title="View agent profile & reviews"
        >
          <img
            :src="property.profiles?.avatar_url || 'https://via.placeholder.com/40'"
            class="w-7 h-7 rounded-full object-cover border border-gray-200 flex-shrink-0"
            alt=""
          />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-900 truncate">
              {{ property.profiles?.full_name || 'Agent' }}
            </p>
            <p class="text-[10px] text-[#0025cc] truncate">
              {{ property.profiles?.agency_name || 'View reviews' }}
            </p>
          </div>
        </button>

        <button
          type="button"
          @click.stop="viewDetails"
          class="bg-[#0025cc] hover:bg-[#001fa3] text-white text-[10px] sm:text-xs font-medium px-3.5 sm:px-4 py-2 rounded-xl transition-all flex-shrink-0"
        >
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const PENDING_SAVES_KEY = 'lodgenext_pending_saves'

const props = withDefaults(
  defineProps<{
    property: any
    detailRouteName?: string
  }>(),
  {
    detailRouteName: 'CustomerPropertyDetail'
  }
)

const emit = defineEmits<{
  (e: 'view-details', id: string): void
}>()

const router = useRouter()
const viewCount = ref(0)
const isSaved = ref(false)
const saving = ref(false)

const agentId = computed(() => {
  return props.property?.agent_id || props.property?.profiles?.id || null
})

const formatViews = (count: number) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 10000) return Math.floor(count / 1000) + 'K'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toLocaleString()
}

const getPendingSaves = (): string[] => {
  try {
    const raw = localStorage.getItem(PENDING_SAVES_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.map(String) : []
  } catch {
    return []
  }
}

const setPendingSaves = (ids: string[]) => {
  localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify([...new Set(ids)]))
}

const addPendingSave = (propertyId: string) => {
  const list = getPendingSaves()
  if (!list.includes(propertyId)) {
    list.push(propertyId)
    setPendingSaves(list)
  }
}

const removePendingSave = (propertyId: string) => {
  setPendingSaves(getPendingSaves().filter((id) => id !== propertyId))
}

const toggleSave = async () => {
  if (saving.value) return
  if (!props.property?.id) return

  const propertyId = String(props.property.id)
  const { data: { user } } = await supabase.auth.getUser()

  // Guest: keep save in localStorage so it remains after login
  if (!user) {
    if (isSaved.value) {
      removePendingSave(propertyId)
      isSaved.value = false
    } else {
      addPendingSave(propertyId)
      isSaved.value = true
      router.push({
        path: '/login',
        query: {
          redirect:
            props.detailRouteName === 'PublicPropertyDetail'
              ? `/properties/${propertyId}`
              : `/customer/properties/${propertyId}`
        }
      })
    }
    return
  }

  saving.value = true
  try {
    if (isSaved.value) {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)

      if (error) throw error
      removePendingSave(propertyId)
      isSaved.value = false
    } else {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId
        })

      if (error) throw error
      removePendingSave(propertyId)
      isSaved.value = true
    }
  } catch (err: any) {
    console.error('Save error:', err)
    alert(err.message || 'Failed to save property')
  } finally {
    saving.value = false
  }
}

const loadViewCount = async () => {
  if (!props.property?.id) return

  const { count, error } = await supabase
    .from('property_views')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', props.property.id)

  if (!error) {
    viewCount.value = count || 0
  }
}

const syncPendingSaves = async (userId: string) => {
  const pending = getPendingSaves()
  if (!pending.length) return

  for (const propertyId of pending) {
    const { error } = await supabase
      .from('saved_properties')
      .upsert(
        {
          user_id: userId,
          property_id: propertyId
        },
        { onConflict: 'user_id,property_id', ignoreDuplicates: true }
      )

    if (!error) {
      removePendingSave(propertyId)
    }
  }
}

const checkIfSaved = async () => {
  if (!props.property?.id) return

  const propertyId = String(props.property.id)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    isSaved.value = getPendingSaves().includes(propertyId)
    return
  }

  await syncPendingSaves(user.id)

  const { data } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .limit(1)

  isSaved.value = !!(data && data.length > 0)
}

const viewDetails = async () => {
  if (!props.property?.id) return

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('property_views')
      .upsert(
        {
          property_id: props.property.id,
          user_id: user.id
        },
        { onConflict: 'property_id,user_id' }
      )

    await loadViewCount()
  }

  const id = String(props.property.id)
  emit('view-details', id)

  router.push({
    name: props.detailRouteName || 'CustomerPropertyDetail',
    params: { id }
  })
}

const viewAgentProfile = () => {
  if (!agentId.value) {
    alert('Agent profile not available')
    return
  }

  // Public pages may not have agent profile route — fall back to login if needed
  if (props.detailRouteName === 'PublicPropertyDetail') {
    router.push({
      path: '/login',
      query: { redirect: `/customer/agents/${agentId.value}` }
    })
    return
  }

  router.push({
    name: 'CustomerAgentProfile',
    params: { id: agentId.value }
  })
}

onMounted(async () => {
  await Promise.all([
    loadViewCount(),
    checkIfSaved()
  ])
})
</script>