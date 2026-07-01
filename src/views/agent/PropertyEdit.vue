<template>
  <div class="min-h-screen bg-[#ebf8ff] pb-12">
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <div class="flex justify-between items-start mb-10">
        <div>
          <h1 class="text-4xl font-bold text-[var(--royal-blue)]">Edit Property</h1>
          <p class="text-[var(--medium-blue)] mt-2 text-lg">Update your property listing</p>
        </div>
        <button @click="goBack" class="px-6 py-3 text-[var(--royal-blue)] border border-[var(--royal-blue)] rounded-2xl hover:bg-white">
          Cancel
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--hover-blue)]">
        <div class="p-8 md:p-12">
          <PropertyStepper 
            :steps="steps" 
            :current-step="currentStep" 
            @step-click="goToStep" 
          />

          <div class="mt-10">
            <!-- STEP 1: Property Information -->
            <div v-if="currentStep === 1">
              <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Title</label>
                  <input v-model="form.title" type="text" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" />
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Type</label>
                  <select v-model="form.property_type" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl">
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
                      <input type="radio" v-model="form.purpose" value="For Rent" />
                      <span>For Rent</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input type="radio" v-model="form.purpose" value="For Lease" />
                      <span>For Lease</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">State</label>
                  <select v-model="form.state" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" disabled>
                    <option value="Kwara">Kwara</option>
                    <option value="Ogun">Ogun</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">City</label>
                  <select v-model="form.city" @change="onCityChange" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl">
                    <option value="Ilorin">Ilorin</option>
                    <option value="Ijebu Ode">Ijebu Ode</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Area / Neighborhood</label>
                  <select v-model="form.area" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl">
                    <option value="">Select Area</option>
                    <option v-for="area in currentAreas" :key="area" :value="area">
                      {{ area }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Full Address</label>
                  <input v-model="form.address" type="text" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Description</label>
                  <textarea v-model="form.description" rows="5" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl"></textarea>
                </div>
              </div>
            </div>

            <!-- STEP 2: Features (unchanged) -->
            <div v-if="currentStep === 2">
              <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Features</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">Price (₦ per year)</label>
                  <input v-model="form.price" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Service Charge</label>
                  <input v-model="form.service_charge" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" />
                </div>

                <div><label class="block text-sm font-medium mb-2">Bedrooms</label><input v-model="form.bedrooms" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" /></div>
                <div><label class="block text-sm font-medium mb-2">Bathrooms</label><input v-model="form.bathrooms" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" /></div>
                <div><label class="block text-sm font-medium mb-2">Toilets</label><input v-model="form.toilets" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" /></div>
                <div><label class="block text-sm font-medium mb-2">Parking Spaces</label><input v-model="form.parking_spaces" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl" /></div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium mb-4">Amenities</label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label v-for="amenity in amenitiesList" :key="amenity" class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" :value="amenity" v-model="form.amenities" class="accent-[var(--royal-blue)]" />
                      <span>{{ amenity }}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Condition</label>
                  <select v-model="form.condition" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl">
                    <option value="Newly Built">Newly Built</option>
                    <option value="Renovated">Renovated</option>
                    <option value="Fairly Used">Fairly Used</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Availability</label>
                  <select v-model="form.availability" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl">
                    <option value="Available Now">Available Now</option>
                    <option value="Available Soon">Available Soon</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- STEP 3 & 4 remain the same -->
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

            <div v-if="currentStep === 4">
              <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Review Changes</h2>
              <PropertyReview :form="form" />
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="border-t p-8 flex justify-between bg-gray-50">
          <button v-if="currentStep > 1" @click="prevStep" class="px-8 py-4 border border-gray-300 rounded-2xl">← Previous</button>
          
          <button v-if="currentStep < 4" @click="nextStep" class="px-10 py-4 bg-[#0025cc] text-white rounded-2xl">Continue →</button>

          <button v-if="currentStep === 4" @click="updateProperty" :disabled="isSubmitting"
                  class="px-10 py-4 bg-green-600 text-white rounded-2xl font-semibold">
            {{ isSubmitting ? 'Updating...' : 'Update Property' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

import PropertyStepper from '@/components/properties/PropertyStepper.vue'
import PropertyMediaUploader from '@/components/properties/PropertyMediaUploader.vue'
import PropertyReview from '@/components/properties/PropertyReview.vue'

const route = useRoute()
const router = useRouter()

const currentStep = ref(1)
const isSubmitting = ref(false)
const propertyId = ref(route.params.id as string)

const form = ref({
  id: '',
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
  bedrooms: null as number | null,
  bathrooms: null as number | null,
  toilets: null as number | null,
  parking_spaces: null as number | null,
  amenities: [] as string[],
  condition: 'Newly Built',
  availability: 'Available Now',
  cover_image: '',
  images: [] as string[],
  video_url: '',
  image_1: '',
  image_2: '',
  image_3: '',
  image_4: '',
  image_5: '',
  // Added these fields to fix the error
  search_vector: null as string | null,
  created_at: '',
  updated_at: ''
})

const steps = ['Property Information', 'Features', 'Media', 'Review']

const amenitiesList = [
  'Borehole', 'Running Water', 'Security', 'Fenced Compound',
  'POP Ceiling', 'Balcony', 'Air Conditioning', 'Prepaid Meter',
  'Wi-Fi', 'Generator'
]

const ijebuOdeAreas = [
  "GRA", "Ijasi", "Oke-Aje", "Porogun", "Imoru", "Molipa", "Igbeba", "Oke-Owa",
  "Odo-Esa", "Oke-Agbo", "Olisa", "Itoro", "Ayesan", "Awa", "Imagbon", "Ososa",
  "Isiwo", "Itele", "Oke-Sopin", "New Road"
]

const ilorinAreas = [
  "Tanke", "Fate", "GRA", "Pipeline", "Oke-Odo", "Oko-Olowo", "Sango", "Taiwo Road",
  "Offa Garage", "Asa Dam", "Kulende", "Unity Road", "Challenge", "Adewole Estate",
  "Agbo Oba", "Gerin Alimi", "Irewolede", "Mandate", "Eyenkorin", "Tipper Garage"
]

const currentAreas = computed(() => {
  return form.value.city === 'Ijebu Ode' ? ijebuOdeAreas : ilorinAreas
})

const fetchProperty = async () => {
  if (!propertyId.value) return

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId.value)
    .single()

  if (error) {
    alert('Failed to load property')
    console.error(error)
  } else if (data) {
    form.value = { ...data }
  }
}

onMounted(fetchProperty)

const onCityChange = () => {
  if (form.value.city === 'Ilorin') form.value.state = 'Kwara'
  else if (form.value.city === 'Ijebu Ode') form.value.state = 'Ogun'

  if (!currentAreas.value.includes(form.value.area)) {
    form.value.area = ''
  }
}

const goToStep = (step: number) => currentStep.value = step
const nextStep = () => { if (currentStep.value < 4) currentStep.value++ }
const prevStep = () => { if (currentStep.value > 1) currentStep.value-- }
const goBack = () => router.push('/my-properties')

const updateProperty = async () => {
  isSubmitting.value = true

  try {
    const { 
      search_vector, 
      created_at, 
      updated_at, 
      ...updateData 
    } = form.value

    const payload = {
      ...updateData,
      price: updateData.price ? Number(updateData.price) : null,
      service_charge: updateData.service_charge ? Number(updateData.service_charge) : null,
      bedrooms: updateData.bedrooms ? Number(updateData.bedrooms) : null,
      bathrooms: updateData.bathrooms ? Number(updateData.bathrooms) : null,
      toilets: updateData.toilets ? Number(updateData.toilets) : null,
      parking_spaces: updateData.parking_spaces ? Number(updateData.parking_spaces) : null,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', propertyId.value)

    if (error) throw error

    alert('✅ Property updated successfully!')
    router.push('/agent/properties')

  } catch (err: any) {
    console.error(err)
    alert('Update failed: ' + (err.message || err))
  } finally {
    isSubmitting.value = false
  }
}
</script>