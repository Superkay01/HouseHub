<template>
  <div class="min-h-screen bg-[#ebf8ff] pb-12">
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <!-- Header -->
      <div class="flex justify-between items-start mb-10">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Edit Property</h1>
          <p class="text-[var(--medium-blue)] mt-2 text-lg">
            Update your property listing
          </p>
        </div>

        <button
          @click="goBack"
          class="px-6 py-3 text-[var(--royal-blue)] border border-[var(--royal-blue)] rounded-2xl hover:bg-white transition-all"
        >
          Cancel
        </button>
      </div>

      <!-- Stepper -->
      <PropertyStepper
        :steps="steps"
        :current-step="currentStep"
        @step-click="goToStep"
      />

      <div class="mt-10 bg-[var(--white)] rounded-3xl shadow-xl overflow-hidden border border-[var(--hover-blue)]">
        <div class="p-8 md:p-12">

          <!-- ==================== STEP 1: Property Information ==================== -->
          <div v-if="currentStep === 1">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Title</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl focus:border-[var(--royal-blue)] outline-none"
                  placeholder="e.g. 2 Bedroom Flat in Tanke"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Type</label>
                <select
                  v-model="form.property_type"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                >
                  <option value="">Select Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Mini Flat">Mini Flat</option>
                  <option value="Self Contain">Self Contain</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Shop">Shop</option>
                  <option value="Office Space">Office Space</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Purpose</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <input type="radio" v-model="form.purpose" value="For Rent" class="accent-[var(--royal-blue)]" />
                    <span class="text-[var(--royal-blue)]">For Rent</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" v-model="form.purpose" value="For Lease" class="accent-[var(--royal-blue)]" />
                    <span class="text-[var(--royal-blue)]">For Lease</span>
                  </label>
                </div>
              </div>

              <!-- State -->
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">State</label>
                <select
                  v-model="form.state"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                >
                  <option value="Kwara">Kwara State</option>
                  <option value="Ogun">Ogun State</option>
                </select>
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">City</label>
                <select
                  v-model="form.city"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                >
                  <option v-for="city in availableCities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </div>

              <!-- Area / Neighborhood – dropdown + free typing -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">
                  Area / Neighborhood
                </label>
                <input
                  v-model="form.area"
                  list="area-list"
                  type="text"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                  placeholder="Select or type area..."
                />
                <datalist id="area-list">
                  <option v-for="area in availableAreas" :key="area" :value="area" />
                </datalist>
                <p class="mt-1 text-xs text-[var(--royal-blue)]">
                  You can select from the list or type a custom area if it’s not listed.
                </p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Full Address</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">
                  Description
                  <span class="text-[var(--royal-blue)]">({{ (form.description || '').length }}/800)</span>
                </label>
                <textarea
                  v-model="form.description"
                  rows="6"
                  maxlength="800"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl resize-none"
                  placeholder="Describe the property..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 2: Property Features & Pricing ==================== -->
          <div v-if="currentStep === 2">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Features & Pricing</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Price -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">
                  Actual Transaction / Rent Price (₦ per year) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="1"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl focus:border-[var(--royal-blue)] outline-none"
                  placeholder="e.g. 800000"
                />
                <p v-if="priceError" class="mt-2 text-sm text-red-500">{{ priceError }}</p>
              </div>

              <!-- Pricing Summary -->
              <div class="md:col-span-2">
                <div class="bg-[#f0f7ff] border border-[var(--hover-blue)] rounded-3xl p-6 space-y-4">
                  <h3 class="text-lg font-semibold text-[var(--royal-blue)]">Pricing Summary</h3>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p class="text-sm text-[var(--steel-blue)]">Actual Transaction Price</p>
                      <p class="text-xl font-bold text-[var(--royal-blue)]">
                        ₦{{ formatNaira(form.price) }}
                      </p>
                      <p class="text-xs text-[var(--royal-blue)]">/ year</p>
                    </div>

                    <div>
                      <p class="text-sm text-[var(--steel-blue)]">System Charge Rate</p>
                      <p class="text-xl font-bold text-[var(--royal-blue)]">5%</p>
                    </div>

                    <div>
                      <p class="text-sm text-[var(--steel-blue)]">Platform System Charge</p>
                      <p class="text-xl font-bold text-green-600">
                        ₦{{ formatNaira(systemChargeAmount) }}
                      </p>
                    </div>
                  </div>

                  <p class="text-sm text-[var(--steel-blue)] bg-white/70 rounded-2xl px-4 py-3">
                    The platform system charge is automatically calculated from the transaction price.
                    You do not need to enter this amount manually. It is a platform charge and is
                    <strong>not</strong> added to the customer’s inspection payment.
                  </p>
                </div>
              </div>

              <!-- Inspection Fee -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">
                  Inspection Fee (₦) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.inspection_fee"
                  type="number"
                  min="0"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl focus:border-[var(--royal-blue)] outline-none"
                  placeholder="e.g. 5000"
                />
                <p class="mt-1 text-xs text-[var(--royal-blue)]">
                  This is the amount the customer will pay to inspect the property.
                </p>
              </div>

              <!-- Features -->
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Bedrooms</label>
                <input
                  v-model.number="form.bedrooms"
                  type="number"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Bathrooms</label>
                <input
                  v-model.number="form.bathrooms"
                  type="number"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Toilets</label>
                <input
                  v-model.number="form.toilets"
                  type="number"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Parking Spaces</label>
                <input
                  v-model.number="form.parking_spaces"
                  type="number"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-4 text-[var(--steel-blue)]">Amenities</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label
                    v-for="amenity in amenitiesList"
                    :key="amenity"
                    class="flex text-[var(--royal-blue)] items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="amenity"
                      v-model="form.amenities"
                      class="accent-[var(--royal-blue)] w-5 h-5"
                    />
                    <span>{{ amenity }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Condition</label>
                <select
                  v-model="form.condition"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                >
                  <option value="Newly Built">Newly Built</option>
                  <option value="Renovated">Renovated</option>
                  <option value="Fairly Used">Fairly Used</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Availability</label>
                <select
                  v-model="form.availability"
                  class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
                >
                  <option value="Available Now">Available Now</option>
                  <option value="Available Soon">Available Soon</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ==================== STEP 3: Photos & Media ==================== -->
          <div v-if="currentStep === 3">
            <h2 class="text-2xl font-semibold mb-8 text-[#0025cc]">Photos & Media</h2>
            <PropertyMediaUploader
              v-model:cover="form.cover_image"
              v-model:image1="form.image_1"
              v-model:image2="form.image_2"
              v-model:image3="form.image_3"
              v-model:image4="form.image_4"
              v-model:image5="form.image_5"
              v-model:video="form.video_url"
            />
          </div>

          <!-- ==================== STEP 4: Review ==================== -->
          <div v-if="currentStep === 4">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Review Changes</h2>
            <PropertyReview :form="form" />
          </div>
        </div>

        <!-- Navigation -->
        <div class="border-t p-8 flex justify-between bg-[var(--hover-blue)]">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="px-8 py-4 border border-[var(--steel-blue)] bg-[var(--white)] rounded-2xl font-medium hover:bg-gray-50"
          >
            ← Previous
          </button>

          <button
            v-if="currentStep < 4"
            @click="nextStep"
            class="px-10 py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[#001da3]"
          >
            Continue →
          </button>

          <button
            v-if="currentStep === 4"
            @click="updateProperty"
            :disabled="isSubmitting"
            class="px-10 py-4 bg-[var(--bright-green)] text-white rounded-2xl font-semibold hover:bg-green-600 transition-all disabled:opacity-60"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Property' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

import PropertyStepper from '@/components/properties/PropertyStepper.vue'
import PropertyMediaUploader from '@/components/properties/PropertyMediaUploader.vue'
import PropertyReview from '@/components/properties/PropertyReview.vue'
import { calculateSystemCharge, formatNaira } from '@/utils/systemCharge'

const route = useRoute()
const router = useRouter()

const currentStep = ref(1)
const isSubmitting = ref(false)
const propertyId = ref(route.params.id as string)
const priceError = ref('')
const loading = ref(true)

const form = ref({
  id: '' as string,
  title: '',
  property_type: '',
  purpose: 'For Rent',
  state: 'Kwara',
  city: 'Ilorin',
  area: '',
  address: '',
  description: '',
  price: null as number | null,
  service_charge: null as number | null,
  inspection_fee: null as number | null,
  bedrooms: null as number | null,
  bathrooms: null as number | null,
  toilets: null as number | null,
  parking_spaces: null as number | null,
  amenities: [] as string[],
  condition: 'Newly Built',
  availability: 'Available Now',
  cover_image: '',
  image_1: '',
  image_2: '',
  image_3: '',
  image_4: '',
  image_5: '',
  video_url: ''
})

const steps = [
  'Property Information',
  'Property Features & Pricing',
  'Photos & Media',
  'Review'
]

const amenitiesList = [
  'Borehole', 'Running Water', 'Security', 'Fenced Compound',
  'POP Ceiling', 'Balcony', 'Air Conditioning', 'Prepaid Meter',
  'Wi-Fi', 'Generator'
]

// Same location data as Add page
const locationData: Record<string, { cities: string[]; areas: Record<string, string[]> }> = {
  Kwara: {
    cities: ['Ilorin'],
    areas: {
      Ilorin: [
        'Tanke', 'Fate', 'GRA', 'Oke-Ose', 'Adewole', 'Basin',
        'Gambari', 'Oko-Erin', 'Pakata', 'Sabo-Oke', 'Surulere',
        'Taiwo', 'Unity', 'Challenge', 'Agbo-Oba', 'Post Office',
        'Maraba', 'Kulende', 'Oyun', 'Apata Yakuba'
      ]
    }
  },
  Ogun: {
    cities: ['Ijebu Ode'],
    areas: {
      'Ijebu Ode': [
        'Molipa', 'Oke-Aje', 'Porogun', 'Obalende', 'Imagbon',
        'Ita-Aladan', 'Ita-Merin', 'Ita-Osun', 'Ijasi', 'Odo-Nla',
        'Isoku', 'Oke-Sopen', 'Ayetoro', 'Folagbade', 'Degun',
        'Ososa', 'Imowo'
      ]
    }
  }
}

const availableCities = computed(() => {
  return locationData[form.value.state]?.cities || []
})

const availableAreas = computed(() => {
  const city = form.value.city
  return locationData[form.value.state]?.areas[city] || []
})

const systemChargeAmount = computed(() => calculateSystemCharge(form.value.price))

// When state changes → reset city & area
watch(
  () => form.value.state,
  (newState) => {
    const cities = locationData[newState]?.cities ?? []
    if (cities.length && !cities.includes(form.value.city)) {
      form.value.city = cities[0]!
    }
  }
)

// When city changes → clear area if it doesn’t belong
watch(
  () => form.value.city,
  () => {
    const areas = availableAreas.value
    if (form.value.area && !areas.includes(form.value.area)) {
      // keep custom typed areas – only clear if you want strict list
      // form.value.area = ''
    }
  }
)

const fetchProperty = async () => {
  if (!propertyId.value) return
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId.value)
      .single()

    if (error) throw error

    if (data) {
      // Normalize state values (DB may have "Kwara State" or "Kwara")
      let state = data.state || 'Kwara'
      if (state.includes('Kwara')) state = 'Kwara'
      if (state.includes('Ogun')) state = 'Ogun'

      form.value = {
        id: data.id,
        title: data.title || '',
        property_type: data.property_type || '',
        purpose: data.purpose || 'For Rent',
        state,
        city: data.city || 'Ilorin',
        area: data.area || '',
        address: data.address || '',
        description: data.description || '',
        price: data.price != null ? Number(data.price) : null,
        service_charge: data.service_charge != null ? Number(data.service_charge) : null,
        inspection_fee: data.inspection_fee != null ? Number(data.inspection_fee) : null,
        bedrooms: data.bedrooms != null ? Number(data.bedrooms) : null,
        bathrooms: data.bathrooms != null ? Number(data.bathrooms) : null,
        toilets: data.toilets != null ? Number(data.toilets) : null,
        parking_spaces: data.parking_spaces != null ? Number(data.parking_spaces) : null,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        condition: data.condition || 'Newly Built',
        availability: data.availability || 'Available Now',
        cover_image: data.cover_image || '',
        image_1: data.image_1 || '',
        image_2: data.image_2 || '',
        image_3: data.image_3 || '',
        image_4: data.image_4 || '',
        image_5: data.image_5 || '',
        video_url: data.video_url || ''
      }
    }
  } catch (err) {
    console.error(err)
    alert('Failed to load property')
  } finally {
    loading.value = false
  }
}

onMounted(fetchProperty)

const validatePrice = (): boolean => {
  const price = Number(form.value.price || 0)
  if (!price || price <= 0) {
    priceError.value = 'Please enter the actual transaction price before continuing.'
    return false
  }

  const fee = form.value.inspection_fee
  if (fee === null || fee === undefined || Number(fee) < 0) {
    priceError.value = 'Please enter a valid inspection fee.'
    return false
  }

  priceError.value = ''
  return true
}

const goToStep = (step: number) => {
  currentStep.value = step
}

const nextStep = () => {
  if (currentStep.value === 2 && !validatePrice()) return
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const goBack = () => router.push('/agent/properties')

const updateProperty = async () => {
  if (!validatePrice()) {
    currentStep.value = 2
    return
  }

  isSubmitting.value = true

  try {
    const price = Number(form.value.price || 0)

    const payload: Record<string, any> = {
      title: form.value.title,
      property_type: form.value.property_type,
      purpose: form.value.purpose,
      state: form.value.state,
      city: form.value.city,
      area: form.value.area,
      address: form.value.address,
      description: form.value.description,
      price,
      service_charge: form.value.service_charge != null ? Number(form.value.service_charge) : null,
      inspection_fee: form.value.inspection_fee != null ? Number(form.value.inspection_fee) : null,
      bedrooms: form.value.bedrooms != null ? Number(form.value.bedrooms) : null,
      bathrooms: form.value.bathrooms != null ? Number(form.value.bathrooms) : null,
      toilets: form.value.toilets != null ? Number(form.value.toilets) : null,
      parking_spaces: form.value.parking_spaces != null ? Number(form.value.parking_spaces) : null,
      amenities: form.value.amenities || [],
      condition: form.value.condition,
      availability: form.value.availability,
      cover_image: form.value.cover_image || null,
      image_1: form.value.image_1 || null,
      image_2: form.value.image_2 || null,
      image_3: form.value.image_3 || null,
      image_4: form.value.image_4 || null,
      image_5: form.value.image_5 || null,
      video_url: form.value.video_url || null,
      updated_at: new Date().toISOString()
    }

    // Optional – only if columns exist
    // payload.system_charge_rate = 5
    // payload.system_charge_amount = calculateSystemCharge(price)

    const { error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', propertyId.value)

    if (error) throw error

    alert('✅ Property updated successfully!')
    router.push('/agent/properties') // or '/agent/properties' – match your route
  } catch (err: any) {
    console.error(err)
    alert('Update failed: ' + (err.message || err))
  } finally {
    isSubmitting.value = false
  }
}
</script>