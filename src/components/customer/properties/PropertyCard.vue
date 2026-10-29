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
        :alt="property.title || 'Property image'"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />

      <!-- Verified Badge -->
      <div
        v-if="property.profiles?.verified || property.profiles?.is_verified"
        class="absolute top-3 left-3 bg-white/95 text-[#0025cc] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow"
      >
        <span class="text-green-500">✓</span> Verified
      </div>

      <!-- Share + Save -->
      <div class="absolute top-3 right-3 flex items-center gap-2 z-10">
        <div v-if="enableShare" class="relative" @click.stop>
          <button
            type="button"
            @click="toggleShare"
            class="w-8 h-8 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center shadow transition-all hover:scale-110"
            aria-label="Share property"
            :aria-expanded="showShare"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          <div
            v-if="showShare"
            class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            @click.stop
          >
            <button type="button" class="w-full text-left px-4 py-2.5 text-sm text-[var(--royal-blue)] hover:bg-gray-50" @click="copyLink">
              Copy link
            </button>
            <button type="button" class="w-full text-left px-4 py-2.5 text-sm text-[var(--royal-blue)] hover:bg-gray-50" @click="shareWhatsApp">
              WhatsApp
            </button>
            <button type="button" class="w-full text-left px-4 py-2.5 text-sm text-[var(--royal-blue)] hover:bg-gray-50" @click="shareFacebook">
              Facebook
            </button>
            <button type="button" class="w-full text-left px-4 py-2.5 text-sm text-[var(--royal-blue)] hover:bg-gray-50" @click="shareNative">
              More…
            </button>
          </div>
        </div>

        <button
          type="button"
          @click.stop="toggleSave"
          :disabled="saving"
          :aria-pressed="isSaved"
          :aria-label="isSaved ? 'Remove saved property' : 'Save property'"
          class="w-8 h-8 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center shadow transition-all hover:scale-110 disabled:opacity-50"
        >
          <Heart :class="[isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600']" class="w-4 h-4 transition-colors" />
        </button>
      </div>

      <!-- Listing Purpose Badge -->
      <div class="absolute bottom-3 left-3 bg-[var(--light-blue)] text-[var(--royal-blue)] text-[10px] sm:text-xs font-medium px-3 py-1 rounded-xl">
        {{ listingTypeLabel }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start gap-3 mb-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm sm:text-base leading-snug text-gray-900 line-clamp-2">
            {{ property.title || 'Untitled property' }}
          </h3>
          <p class="text-xs text-[var(--royal-blue)] mt-1 flex items-center gap-1 truncate">
            📍 {{ property.area || 'Area not specified' }}, {{ property.city || 'City not specified' }}
          </p>
        </div>

        <div class="text-right flex-shrink-0">
          <p class="font-bold text-base sm:text-lg text-[#0025cc] leading-tight">
            ₦{{ formatNaira(property.price) }}
          </p>
          <p class="text-[10px] sm:text-xs text-[var(--hover-blue)]">{{ pricePeriodLabel }}</p>
          <p v-if="isSaleListing" class="text-[10px] text-gray-500 mt-1">5% platform fee applies on completed sale</p>
        </div>
      </div>

      <!-- Inspection Fee -->
      <div class="mb-2">
        <p class="text-xs sm:text-sm font-medium text-gray-700">
          {{ inspectionFeeLabel }}
        </p>
      </div>

      <!-- Views -->
      <div class="flex items-center gap-1.5 text-[var(--royal-blue)] text-xs mb-3">
        <span>👁️</span>
        <span>{{ formatViews(viewCount) }} views</span>
      </div>

      <!-- Residential Features -->
      <div v-if="!isLandListing" class="flex items-center gap-1.5 sm:gap-4 text-xs mb-3">
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🛏️</span>
          <span class="font-medium">{{ property.bedrooms ?? 0 }}</span>
          <span class="text-gray-500">beds</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚿</span>
          <span class="font-medium">{{ property.bathrooms ?? 0 }}</span>
          <span class="text-gray-500">baths</span>
        </div>
        <div v-if="property.toilets" class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚽</span>
          <span class="font-medium">{{ property.toilets }}</span>
          <span class="text-gray-500">toilets</span>
        </div>
      </div>

      <!-- Land Details -->
      <div v-else class="mb-3 rounded-xl bg-blue-50/80 border border-blue-100 p-3 space-y-1.5">
        <p v-if="landSizeLabel" class="text-xs text-gray-700">
          <span class="font-semibold text-[#0025cc]">Land size:</span> {{ landSizeLabel }}
        </p>
        <p v-if="property.land_use" class="text-xs text-gray-700">
          <span class="font-semibold text-[#0025cc]">Land use:</span> {{ property.land_use }}
        </p>
        <p v-if="property.access_road" class="text-xs text-gray-700">
          <span class="font-semibold text-[#0025cc]">Road access:</span> {{ property.access_road }}
        </p>
        <p v-if="property.title_document_status" class="text-xs text-gray-700">
          <span class="font-semibold text-[#0025cc]">Title:</span> {{ property.title_document_status }}
        </p>
        <p v-if="!landSizeLabel && !property.land_use && !property.access_road && !property.title_document_status" class="text-xs text-gray-500">
          Land details available on the listing page.
        </p>
      </div>

      <!-- Amenities -->
      <div v-if="property.amenities?.length" class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="(amenity, i) in property.amenities.slice(0, 3)"
          :key="`${amenity}-${i}`"
          class="text-[10px] sm:text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-xl"
        >
          {{ amenity }}
        </span>
        <span v-if="property.amenities.length > 3" class="text-[10px] sm:text-xs text-gray-400 self-center">
          +{{ property.amenities.length - 3 }}
        </span>
      </div>

      <!-- Agent -->
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
            :alt="property.profiles?.full_name ? `${property.profiles.full_name} profile photo` : 'Agent profile photo'"
            loading="lazy"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

type PropertyProfile = {
  id?: string | null
  verified?: boolean | null
  is_verified?: boolean | null
  avatar_url?: string | null
  full_name?: string | null
  agency_name?: string | null
}

type PropertyCardData = {
  id?: string | number | null
  agent_id?: string | null
  title?: string | null
  cover_image?: string | null
  purpose?: string | null
  listing_category?: string | null
  property_type?: string | null
  price?: number | string | null
  inspection_fee?: number | string | null
  area?: string | null
  city?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  toilets?: number | null
  amenities?: string[] | null
  land_size?: number | string | null
  land_size_unit?: string | null
  land_use?: string | null
  access_road?: string | null
  title_document_status?: string | null
  profiles?: PropertyProfile | null
}

const PENDING_SAVES_KEY = 'lodgenext_pending_saves'

const props = withDefaults(
  defineProps<{
    property: PropertyCardData
    detailRouteName?: string
    enableShare?: boolean
  }>(),
  {
    detailRouteName: 'CustomerPropertyDetail',
    enableShare: true,
  }
)

const emit = defineEmits<{
  (e: 'view-details', id: string): void
  (e: 'link-copied'): void
}>()

const router = useRouter()
const viewCount = ref(0)
const isSaved = ref(false)
const saving = ref(false)
const showShare = ref(false)

const normalizedCategory = computed(() => String(props.property?.listing_category || '').toLowerCase().replace(/[\s-]+/g, '_'))
const normalizedPurpose = computed(() => String(props.property?.purpose || '').toLowerCase().trim())

const isLandListing = computed(() =>
  normalizedCategory.value === 'land_sale' ||
  normalizedPurpose.value === 'land for sale' ||
  (normalizedPurpose.value.includes('land') && normalizedPurpose.value.includes('sale'))
)

const isSaleListing = computed(() =>
  isLandListing.value ||
  normalizedCategory.value === 'property_sale' ||
  normalizedPurpose.value === 'for sale' ||
  normalizedPurpose.value.includes('sale')
)

const listingTypeLabel = computed(() => {
  if (isLandListing.value) return 'Land for Sale'
  if (isSaleListing.value) return 'For Sale'
  return props.property?.purpose || 'Property'
})

const pricePeriodLabel = computed(() => {
  if (isLandListing.value) return 'asking price for land'
  if (isSaleListing.value) return 'asking price'
  if (normalizedPurpose.value === 'for lease') return 'per lease term'
  return 'per year'
})

const inspectionFeeLabel = computed(() => {
  const fee = props.property?.inspection_fee
  if (fee === null || fee === undefined || String(fee).trim() === '') return 'No Inspection Fee'
  const numericFee = Number(fee)
  if (Number.isFinite(numericFee)) return `Inspection Fee: ₦${numericFee.toLocaleString()}`
  return `Inspection Fee: ${String(fee)}`
})

const landSizeLabel = computed(() => {
  const size = props.property?.land_size
  if (size === null || size === undefined || String(size).trim() === '') return ''
  const unit = props.property?.land_size_unit ? ` ${props.property.land_size_unit}` : ''
  return `${Number.isFinite(Number(size)) ? Number(size).toLocaleString() : String(size)}${unit}`
})

const agentId = computed(() => props.property?.agent_id || props.property?.profiles?.id || null)

const formatNaira = (value: number | string | null | undefined): string => {
  const amount = Number(value ?? 0)
  return (Number.isFinite(amount) ? amount : 0).toLocaleString('en-NG')
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'An unexpected error occurred.'
}

const getPropertyUrl = (): string => {
  const id = props.property?.id
  try {
    const resolved = router.resolve({ name: props.detailRouteName, params: { id } })
    return `${window.location.origin}${resolved.href}`
  } catch {
    if (props.detailRouteName === 'PublicPropertyDetail') {
      return `${window.location.origin}/properties/${id}`
    }
    return `${window.location.origin}/customer/properties/${id}`
  }
}

const toggleShare = (): void => {
  showShare.value = !showShare.value
}

const closeShare = (): void => {
  showShare.value = false
}

const copyLink = async (): Promise<void> => {
  const url = getPropertyUrl()
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  emit('link-copied')
  closeShare()
}

const shareWhatsApp = (): void => {
  const url = getPropertyUrl()
  const text = `Check out this property on LodgeNext: ${props.property?.title || 'Property'}\n${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  closeShare()
}

const shareFacebook = (): void => {
  const url = getPropertyUrl()
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
  closeShare()
}

const shareNative = async (): Promise<void> => {
  const url = getPropertyUrl()
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.property?.title || 'LodgeNext Property',
        text: 'Check out this property on LodgeNext',
        url,
      })
    } catch {
      // The share dialog may be dismissed by the user.
    }
    closeShare()
    return
  }
  await copyLink()
}

const onDocClick = (): void => {
  closeShare()
}

const formatViews = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 10_000) return `${Math.floor(count / 1_000)}K`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toLocaleString()
}

const getPendingSaves = (): string[] => {
  try {
    const raw = localStorage.getItem(PENDING_SAVES_KEY)
    const list: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.map(String) : []
  } catch {
    return []
  }
}

const setPendingSaves = (ids: string[]): void => {
  try {
    localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify([...new Set(ids)]))
  } catch (error: unknown) {
    console.error('Could not update pending saves:', getErrorMessage(error))
  }
}

const addPendingSave = (propertyId: string): void => {
  const list = getPendingSaves()
  if (!list.includes(propertyId)) {
    list.push(propertyId)
    setPendingSaves(list)
  }
}

const removePendingSave = (propertyId: string): void => {
  setPendingSaves(getPendingSaves().filter((id) => id !== propertyId))
}

const toggleSave = async (): Promise<void> => {
  if (saving.value || !props.property?.id) return

  const propertyId = String(props.property.id)
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) {
    alert('Unable to check your login status. Please try again.')
    return
  }

  if (!user) {
    if (isSaved.value) {
      removePendingSave(propertyId)
      isSaved.value = false
    } else {
      addPendingSave(propertyId)
      isSaved.value = true
      await router.push({
        path: '/login',
        query: {
          redirect: props.detailRouteName === 'PublicPropertyDetail'
            ? `/properties/${propertyId}`
            : `/customer/properties/${propertyId}`,
        },
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
        .insert({ user_id: user.id, property_id: propertyId })
      if (error) throw error
      removePendingSave(propertyId)
      isSaved.value = true
    }
  } catch (error: unknown) {
    console.error('Save error:', error)
    alert(getErrorMessage(error) || 'Failed to save property')
  } finally {
    saving.value = false
  }
}

const loadViewCount = async (): Promise<void> => {
  if (!props.property?.id) return
  const { count, error } = await supabase
    .from('property_views')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', props.property.id)

  if (!error) viewCount.value = count || 0
}

const syncPendingSaves = async (userId: string): Promise<void> => {
  const pending = getPendingSaves()
  if (!pending.length) return

  for (const propertyId of pending) {
    const { error } = await supabase
      .from('saved_properties')
      .upsert(
        { user_id: userId, property_id: propertyId },
        { onConflict: 'user_id,property_id', ignoreDuplicates: true }
      )

    if (!error) removePendingSave(propertyId)
  }
}

const checkIfSaved = async (): Promise<void> => {
  if (!props.property?.id) return
  const propertyId = String(props.property.id)
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('Could not check saved property status:', userError.message)
    return
  }

  if (!user) {
    isSaved.value = getPendingSaves().includes(propertyId)
    return
  }

  await syncPendingSaves(user.id)
  const { data, error } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .limit(1)

  if (!error) isSaved.value = Boolean(data?.length)
}

const viewDetails = async (): Promise<void> => {
  if (!props.property?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase
      .from('property_views')
      .upsert(
        { property_id: props.property.id, user_id: user.id },
        { onConflict: 'property_id,user_id' }
      )
    await loadViewCount()
  }

  const id = String(props.property.id)
  emit('view-details', id)
  await router.push({
    name: props.detailRouteName || 'CustomerPropertyDetail',
    params: { id },
  })
}

const viewAgentProfile = async (): Promise<void> => {
  if (!agentId.value) {
    alert('Agent profile not available')
    return
  }

  if (props.detailRouteName === 'PublicPropertyDetail') {
    await router.push({
      path: '/login',
      query: { redirect: `/customer/agents/${agentId.value}` },
    })
    return
  }

  await router.push({
    name: 'CustomerAgentProfile',
    params: { id: agentId.value },
  })
}

onMounted(async () => {
  document.addEventListener('click', onDocClick)
  await Promise.all([loadViewCount(), checkIfSaved()])
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
