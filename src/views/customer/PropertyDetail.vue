<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-6xl mx-auto px-4 pt-8">
      
      <!-- Back Button -->
      <button 
        @click="$router.back()" 
        class="flex items-center gap-2 text-[var(--royal-blue)] hover:text-[var(--medium-blue)] mb-8 font-medium"
      >
        ← Back
      </button>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-xl mb-4">{{ error }}</p>
        <button 
          @click="fetchProperty"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl"
        >
          Try Again
        </button>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Images -->
        <div class="lg:col-span-7 space-y-6">
          <div
            class="relative rounded-3xl overflow-hidden shadow-2xl bg-white cursor-pointer" 
            @click="showLightbox = true"
          >
            <img 
              :src="mainImage" 
              class="w-full h-[520px] object-cover"
              alt="Main Image"
            />

            <!-- Heart Button -->
            <button
              @click.stop="toggleSave"
              class="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
              :title="isSaved ? 'Unsave property' : 'Save property'"
            >
              <span class="text-2xl">
                {{ isSaved ? '❤️' : '🤍' }}
              </span>
            </button>
          </div>

          <!-- Thumbnails -->
          <div v-if="allImages.length > 1" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="(url, index) in allImages" 
              :key="index"
              class="rounded-3xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105"
              :class="{ 'border-[var(--royal-blue)] ring-2 ring-offset-2 ring-[var(--royal-blue)]': mainImage === url }"
              @click="mainImage = url"
            >
              <img :src="url" class="w-full h-28 object-cover" />
            </div>
          </div>

          <div v-if="property.video_url" class="rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video :src="property.video_url" controls class="w-full aspect-video"></video>
          </div>
        </div>

        <!-- Details -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
            
            <div class="flex justify-between items-start mb-6">
              <span class="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-2xl capitalize">
                {{ property.status || 'pending' }}
              </span>
              <div class="text-right">
                <p class="text-4xl font-bold text-[var(--royal-blue)]">
                  ₦{{ Number(property.price || 0).toLocaleString() }}
                </p>
                <p class="text-sm text-[var(--royal-blue)]">{{ property.purpose }}</p>
              </div>
            </div>

            <h1 class="text-3xl font-bold leading-tight mb-2 text-[var(--royal-blue)]">
              {{ property.title }}
            </h1>
            
            <p class="text-[var(--royal-blue)] mb-4">
              📍 {{ property.area }}, {{ property.city }}, {{ property.state }}
            </p>

            <p class="text-[var(--royal-blue)] mb-6">
              {{
                property.inspection_fee
                  ? `Inspection Fee: ₦${Number(property.inspection_fee).toLocaleString()}`
                  : 'No Inspection Fee'
              }}
            </p>

            <!-- Unique View Count -->
            <div class="flex items-center gap-2 text-medium-gray text-sm mb-6">
              <span>👁️</span>
              <span>
                {{ uniqueViewCount }}
                {{ uniqueViewCount === 1 ? 'person' : 'people' }} viewed this property
              </span>
            </div>

            <!-- PRIMARY CTA: Request Inspection -->
            <button
              @click="requestInspection"
              class="w-full mb-3 py-4 rounded-2xl font-semibold text-lg text-white bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] transition shadow-md"
            >
              Request Inspection
            </button>

            <p class="text-xs text-center text-gray-500 mb-6">
              Choose a date & time{{ property.inspection_fee ? ', pay the inspection fee,' : '' }} then submit your request
            </p>

            <!-- Save Button -->
            <button
              @click="toggleSave"
              class="w-full mb-6 py-3.5 rounded-2xl font-medium transition flex items-center justify-center gap-2"
              :class="isSaved 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-[var(--light-blue)] text-[var(--royal-blue)] border border-[var(--light-blue)]'"
            >
              <span>{{ isSaved ? '❤️ Saved' : '🤍 Save Property' }}</span>
            </button>

            <div class="border-t border-b py-6 my-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-semibold">{{ property.bedrooms || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">BEDROOMS</div>
              </div>
              <div>
                <div class="text-2xl font-semibold">{{ property.bathrooms || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">BATHROOMS</div>
              </div>
              <div>
                <div class="text-2xl font-semibold">{{ property.parking_spaces || 0 }}</div>
                <div class="text-xs text-[var(--royal-blue)]">PARKING</div>
              </div>
            </div>

            <div class="space-y-4 text-sm">
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Property Type</span>
                <strong>{{ property.property_type || '—' }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Condition</span>
                <strong>{{ property.condition || '—' }}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--royal-blue)]">Availability</span>
                <strong>{{ property.availability || '—' }}</strong>
              </div>
            </div>

            <div v-if="property.amenities?.length" class="mt-8">
              <h4 class="font-semibold mb-4">Amenities</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="amenity in property.amenities" 
                  :key="amenity"
                  class="bg-[var(--hover-blue)] px-4 py-2 rounded-2xl text-sm"
                >
                  {{ amenity }}
                </span>
              </div>
            </div>

            <div v-if="property.description" class="mt-10 pt-8 border-t">
              <h4 class="font-semibold mb-3">Description</h4>
              <p class="leading-relaxed text-[var(--royal-blue)] whitespace-pre-wrap">
                {{ property.description }}
              </p>
            </div>

            <!-- Secondary CTA -->
            <div class="mt-10 pt-8 border-t space-y-3">
              <button
                @click="requestInspection"
                class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] text-white py-4 rounded-2xl font-semibold text-lg transition"
              >
                Request Inspection
              </button>

              <button
                @click="goToHelp"
                class="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[var(--royal-blue)] py-3.5 rounded-2xl font-medium transition"
              >
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="showLightbox" 
      class="fixed inset-0 z-[100] bg-black flex items-center justify-center" 
      @click.self="showLightbox = false"
    >
      <div class="relative max-w-6xl w-full p-8">
        <img :src="mainImage" class="max-h-[90vh] mx-auto rounded-3xl shadow-2xl" />
        <button @click="showLightbox = false" class="absolute top-8 right-8 text-white text-5xl">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const route = useRoute()
const router = useRouter()

const property = ref<any>({})
const loading = ref(true)
const error = ref('')
const mainImage = ref('')
const showLightbox = ref(false)

const uniqueViewCount = ref(0)
const isSaved = ref(false)
const saving = ref(false)

const fetchProperty = async () => {
  const id = route.params.id as string
  if (!id) {
    error.value = 'No Property ID found in URL'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  const { data, error: fetchError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error(fetchError)
    error.value = 'Property not found or access denied'
  } else {
    property.value = data || {}
  }

  loading.value = false
}

const recordUniqueView = async () => {
  if (!property.value?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error: insertError } = await supabase
    .from('property_views')
    .upsert(
      {
        property_id: property.value.id,
        user_id: user.id
      },
      {
        onConflict: 'property_id,user_id',
        ignoreDuplicates: true
      }
    )

  if (insertError) {
    console.error('View insert error:', insertError)
  }

  const { count, error: countError } = await supabase
    .from('property_views')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', property.value.id)

  if (countError) {
    console.error('View count error:', countError)
    return
  }

  uniqueViewCount.value = count || 0
}

const checkIfSaved = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !property.value?.id) {
    isSaved.value = false
    return
  }

  const { data, error } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', property.value.id)
    .maybeSingle()

  if (error) {
    console.error('Check saved error:', error)
    return
  }

  isSaved.value = !!data
}

const toggleSave = async () => {
  if (saving.value) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to save properties')
    router.push('/login')
    return
  }

  if (!property.value?.id) return

  saving.value = true
  try {
    if (isSaved.value) {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', property.value.id)

      if (error) throw error
      isSaved.value = false
    } else {
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: property.value.id
        })

      if (error) throw error
      isSaved.value = true
    }
  } catch (err: any) {
    console.error('Save error:', err)
    alert(err.message || 'Failed to save property')
  } finally {
    saving.value = false
  }
}

const requestInspection = async () => {
  if (!property.value?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to request an inspection')
    router.push('/login')
    return
  }

  // Easy customer journey → request inspection page
  router.push(`/customer/request-inspection/${property.value.id}`)
}

const goToHelp = () => {
  router.push('/customer/help-support')
}

const allImages = computed(() => {
  const imgs: string[] = []
  if (property.value.cover_image) imgs.push(property.value.cover_image)
  if (property.value.image_1) imgs.push(property.value.image_1)
  if (property.value.image_2) imgs.push(property.value.image_2)
  if (property.value.image_3) imgs.push(property.value.image_3)
  if (property.value.image_4) imgs.push(property.value.image_4)
  if (property.value.image_5) imgs.push(property.value.image_5)
  return imgs
})

watch(property, (newProp) => {
  if (newProp?.cover_image) mainImage.value = newProp.cover_image
}, { immediate: true })

onMounted(async () => {
  await fetchProperty()
  if (property.value?.id) {
    await Promise.all([
      recordUniqueView(),
      checkIfSaved()
    ])
  }
})
</script>