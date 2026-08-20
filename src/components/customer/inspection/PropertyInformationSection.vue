<!-- PropertyInformationSection.vue -->
<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <h3 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">
      Property Information
    </h3>

    <div v-if="loading" class="text-sm text-medium-gray">Loading property...</div>

    <template v-else-if="prop">
      <!-- Gallery from cover_image + image_1..image_5 -->
      <div class="mb-4">
        <img
          :src="activeImage || placeholder"
          class="w-full h-48 object-cover rounded-2xl bg-gray-100"
          alt=""
        />
        <div v-if="gallery.length > 1" class="flex gap-2 mt-2 overflow-x-auto">
          <button
            v-for="(img, i) in gallery"
            :key="i"
            type="button"
            class="w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0"
            :class="activeImage === img ? 'border-[var(--royal-blue)]' : 'border-transparent'"
            @click="activeImage = img"
          >
            <img :src="img" class="w-full h-full object-cover" alt="" />
          </button>
        </div>
      </div>

      <h4 class="text-xl font-semibold">{{ prop.title }}</h4>
      <p class="text-sm text-medium-gray mt-1">
        {{ prop.property_type }}
        <span v-if="prop.purpose"> · {{ prop.purpose }}</span>
        · {{ prop.area }}, {{ prop.city }}, {{ prop.state }}
      </p>

      <!-- Listing price from properties.price (NOT inspection fee) -->
      <p class="text-2xl font-bold text-green-600 mt-2">
        ₦{{ formatMoney(prop.price) }}
        <span v-if="prop.purpose === 'For Rent'" class="text-sm font-medium text-medium-gray">
          / rent
        </span>
      </p>
      <p v-if="prop.service_charge" class="text-sm text-medium-gray">
        Service charge: ₦{{ formatMoney(prop.service_charge) }}
      </p>

      <div class="grid grid-cols-2 gap-2 mt-4 text-sm">
        <p><span class="text-medium-gray">Bedrooms:</span> {{ prop.bedrooms ?? '—' }}</p>
        <p><span class="text-medium-gray">Bathrooms:</span> {{ prop.bathrooms ?? '—' }}</p>
        <p v-if="prop.toilets != null">
          <span class="text-medium-gray">Toilets:</span> {{ prop.toilets }}
        </p>
        <p v-if="prop.condition">
          <span class="text-medium-gray">Condition:</span> {{ prop.condition }}
        </p>
        <p class="col-span-2">
          <span class="text-medium-gray">Address:</span> {{ prop.address || '—' }}
        </p>
      </div>

      <p v-if="prop.description" class="text-sm mt-3 text-medium-gray">
        {{ prop.description }}
      </p>

      <div v-if="amenitiesList.length" class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="a in amenitiesList"
          :key="a"
          class="px-2 py-1 bg-[var(--light-blue)] rounded-full text-xs"
        >
          {{ a }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2 mt-5">
        <a
          v-if="prop.id"
          :href="`/properties/${prop.id}`"
          class="px-4 py-2.5 bg-[var(--royal-blue)] text-white rounded-2xl text-sm font-semibold"
        >
          View Property
        </a>
        <button
          type="button"
          class="px-4 py-2.5 border rounded-2xl text-sm font-medium"
          @click="downloadPropertyInfo"
        >
          Download Property Information
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/supabaseClient.js'

const props = defineProps({
  propertyId: { type: String, default: null },
  property: { type: Object, default: null }
})

const prop = ref(null)
const loading = ref(false)
const activeImage = ref(null)
const placeholder = 'https://via.placeholder.com/400x250?text=Property'

const formatMoney = (n) => Number(n || 0).toLocaleString()

/** Build gallery from your real columns */
const gallery = computed(() => {
  if (!prop.value) return []
  const keys = ['cover_image', 'image_1', 'image_2', 'image_3', 'image_4', 'image_5']
  const urls = []
  for (const k of keys) {
    const u = prop.value[k]
    if (u && String(u).trim() && !urls.includes(u)) urls.push(u)
  }
  return urls
})

const amenitiesList = computed(() => {
  const a = prop.value?.amenities
  if (Array.isArray(a)) return a
  if (typeof a === 'string') {
    try {
      const p = JSON.parse(a)
      return Array.isArray(p) ? p : []
    } catch {
      return a.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
})

const PROPERTY_SELECT = `
  id, title, property_type, purpose, state, city, area, address,
  description, price, service_charge, bedrooms, bathrooms, toilets,
  parking_spaces, condition, availability, amenities,
  cover_image, image_1, image_2, image_3, image_4, image_5, video_url, status
`

const load = async () => {
  const id = props.propertyId || props.property?.id
  if (!id && props.property) {
    prop.value = props.property
    activeImage.value = gallery.value[0] || null
    return
  }
  if (!id) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(PROPERTY_SELECT)
      .eq('id', id)
      .single()

    if (error) throw error
    prop.value = data
    activeImage.value = gallery.value[0] || null
  } catch (e) {
    console.error(e)
    // Fallback to whatever parent passed
    if (props.property) prop.value = props.property
  } finally {
    loading.value = false
  }
}

const downloadPropertyInfo = () => {
  if (!prop.value) return
  const p = prop.value
  const lines = [
    'LodgeNext — Property Information',
    '(Does not include private inspection report)',
    '',
    `Title: ${p.title}`,
    `Type: ${p.property_type}`,
    `Purpose: ${p.purpose || '—'}`,
    `Price: NGN ${formatMoney(p.price)}`,
    p.service_charge != null ? `Service charge: NGN ${formatMoney(p.service_charge)}` : null,
    `Location: ${p.area}, ${p.city}, ${p.state}`,
    `Address: ${p.address || '—'}`,
    `Bedrooms: ${p.bedrooms ?? '—'}`,
    `Bathrooms: ${p.bathrooms ?? '—'}`,
    `Condition: ${p.condition || '—'}`,
    '',
    p.description || '',
    '',
    `Amenities: ${amenitiesList.value.join(', ')}`
  ].filter(Boolean)

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `property-info-${p.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

watch(() => [props.propertyId, props.property], load, { deep: true })
onMounted(load)
</script>