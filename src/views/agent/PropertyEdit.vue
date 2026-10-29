
<template>
  <div class="min-h-screen bg-[#ebf8ff] pb-12">
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <!-- Header -->
      <div class="flex justify-between items-start gap-4 mb-10">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">
            Edit Property
          </h1>
          <p class="text-[var(--medium-blue)] mt-2 text-base md:text-lg">
            Update your rental, property sale, or land listing.
          </p>
        </div>

        <button
          @click="goBack"
          class="px-5 py-3 text-[var(--royal-blue)] border border-[var(--royal-blue)] rounded-2xl hover:bg-white transition-all"
        >
          Cancel
        </button>
      </div>

      <div
        v-if="pageError"
        class="mb-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm"
        role="alert"
      >
        {{ pageError }}
        <button
          v-if="!loading"
          @click="fetchProperty"
          class="ml-2 underline font-semibold"
        >
          Try again
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-32">
        <div
          class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#0025cc]"
          role="status"
          aria-label="Loading property"
        ></div>
      </div>

      <div v-else-if="propertyNotFound" class="bg-white rounded-3xl p-10 text-center">
        <h2 class="text-2xl font-bold text-[var(--royal-blue)] mb-3">
          Property unavailable
        </h2>
        <p class="text-gray-600 mb-6">
          This property could not be found or you do not have permission to edit it.
        </p>
        <button
          @click="goBack"
          class="px-6 py-3 bg-[#0025cc] text-white rounded-2xl"
        >
          Back to My Properties
        </button>
      </div>

      <template v-else>
        <PropertyStepper
          :steps="steps"
          :current-step="currentStep"
          @step-click="goToStep"
        />

        <div class="mt-10 bg-[var(--white)] rounded-3xl shadow-xl overflow-hidden border border-[var(--hover-blue)]">
          <div class="p-6 md:p-12">
            <!-- STEP 1: Property Information -->
            <div v-if="currentStep === 1">
              <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">
                Property Information
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="field-label">Property Title *</label>
                  <input
                    v-model="form.title"
                    type="text"
                    maxlength="150"
                    required
                    class="field-input"
                    placeholder="e.g. 2 Bedroom Flat in Tanke"
                  />
                </div>

                <div>
                  <label class="field-label">Listing Purpose *</label>
                  <select v-model="form.purpose" class="field-input">
                    <option value="For Rent">For Rent</option>
                    <option value="For Lease">For Lease</option>
                    <option value="For Sale">For Sale</option>
                    <option value="Land for Sale">Land for Sale</option>
                  </select>
                </div>

                <div>
                  <label class="field-label">Property Type *</label>
                  <select v-model="form.property_type" class="field-input">
                    <option value="">Select Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Mini Flat">Mini Flat</option>
                    <option value="Self Contain">Self Contain</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Detached House">Detached House</option>
                    <option value="Terrace House">Terrace House</option>
                    <option value="Commercial Property">Commercial Property</option>
                    <option value="Shop">Shop</option>
                    <option value="Office Space">Office Space</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div>
                  <label class="field-label">State *</label>
                  <select v-model="form.state" class="field-input">
                    <option value="Kwara State">Kwara State</option>
                    <option value="Ogun State">Ogun State</option>
                  </select>
                </div>

                <div>
                  <label class="field-label">City *</label>
                  <select v-model="form.city" class="field-input">
                    <option
                      v-for="city in availableCities"
                      :key="city"
                      :value="city"
                    >
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="field-label">Area / Neighborhood *</label>
                  <input
                    v-model="form.area"
                    list="edit-area-list"
                    type="text"
                    maxlength="150"
                    class="field-input"
                    placeholder="Select or type an area..."
                  />
                  <datalist id="edit-area-list">
                    <option
                      v-for="area in availableAreas"
                      :key="area"
                      :value="area"
                    />
                  </datalist>
                  <p class="mt-1 text-xs text-[var(--royal-blue)]">
                    Select an area or enter a custom neighborhood.
                  </p>
                </div>

                <div class="md:col-span-2">
                  <label class="field-label">Full Address *</label>
                  <input
                    v-model="form.address"
                    type="text"
                    maxlength="300"
                    class="field-input"
                    placeholder="Enter the property's full address"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="field-label">
                    Description
                    <span class="font-normal">
                      ({{ form.description.length }}/800)
                    </span>
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="6"
                    maxlength="800"
                    class="field-input resize-y"
                    placeholder="Describe the property, its location, and important features..."
                  ></textarea>
                </div>

                <!-- Land information -->
                <template v-if="isLand">
                  <div class="md:col-span-2 border-t border-blue-100 pt-6">
                    <h3 class="text-xl font-semibold text-[var(--royal-blue)]">
                      Land Information
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Provide the land details buyers need to assess the listing.
                    </p>
                  </div>

                  <div>
                    <label class="field-label">Land Size</label>
                    <input
                      v-model.number="form.land_size"
                      type="number"
                      min="0"
                      step="any"
                      class="field-input"
                      placeholder="e.g. 600"
                    />
                  </div>

                  <div>
                    <label class="field-label">Measurement Unit</label>
                    <select v-model="form.land_size_unit" class="field-input">
                      <option value="">Select unit</option>
                      <option value="sqm">Square metres (sqm)</option>
                      <option value="plots">Plots</option>
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>

                  <div>
                    <label class="field-label">Intended Land Use</label>
                    <select v-model="form.land_use" class="field-input">
                      <option value="">Select land use</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Agricultural">Agricultural</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Mixed Use">Mixed Use</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label class="field-label">Road Access</label>
                    <select v-model="form.access_road" class="field-input">
                      <option value="">Select access</option>
                      <option value="Tarred Road">Tarred Road</option>
                      <option value="Untarred Road">Untarred Road</option>
                      <option value="Accessible Path">Accessible Path</option>
                      <option value="No Direct Road Access">No Direct Road Access</option>
                    </select>
                  </div>

                  <div class="md:col-span-2">
                    <label class="field-label">Title Document Status</label>
                    <select
                      v-model="form.title_document_status"
                      class="field-input"
                    >
                      <option value="">Select document status</option>
                      <option value="C of O">Certificate of Occupancy (C of O)</option>
                      <option value="Governor's Consent">Governor's Consent</option>
                      <option value="Registered Deed">Registered Deed</option>
                      <option value="Deed of Assignment">Deed of Assignment</option>
                      <option value="Survey Plan">Survey Plan</option>
                      <option value="Family or Community Documents">Family or Community Documents</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Other">Other</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-2">
                      This field records the seller's stated document status. It does not
                      constitute verification of ownership or title.
                    </p>
                  </div>
                </template>
              </div>
            </div>

            <!-- STEP 2: Features and Pricing -->
            <div v-if="currentStep === 2">
              <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">
                {{ isLand ? 'Land Features & Pricing' : 'Property Features & Pricing' }}
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="field-label">
                    {{ priceLabel }} (₦) *
                  </label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="1"
                    step="any"
                    class="field-input"
                    :placeholder="pricePlaceholder"
                  />
                  <p v-if="priceError" class="mt-2 text-sm text-red-500">
                    {{ priceError }}
                  </p>
                  <p class="mt-2 text-xs text-gray-500">
                    Enter the current asking price. For a sale, the final transaction
                    price may be different after negotiation.
                  </p>
                </div>

                <!-- Sale pricing -->
                <div v-if="isSale" class="md:col-span-2">
                  <div class="bg-purple-50 border border-purple-100 rounded-3xl p-6 space-y-4">
                    <h3 class="text-lg font-semibold text-purple-900">
                      Estimated Platform System Charge
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p class="text-sm text-purple-800">Asking Price</p>
                        <p class="text-xl font-bold text-purple-950">
                          {{ formatNaira(form.price) }}
                        </p>
                      </div>

                      <div>
                        <p class="text-sm text-purple-800">Charge Rate</p>
                        <p class="text-xl font-bold text-purple-950">5%</p>
                      </div>

                      <div>
                        <p class="text-sm text-purple-800">Estimated Charge</p>
                        <p class="text-xl font-bold text-purple-950">
                          {{ formatNaira(systemChargeEstimate) }}
                        </p>
                      </div>
                    </div>

                    <p class="text-sm text-purple-800 bg-white/70 rounded-2xl px-4 py-3">
                      This is an estimate based on the asking price, not a final charge.
                      The final 5% charge must be calculated by the platform from the
                      agreed transaction price at completion. It is separate from any
                      inspection fee.
                    </p>
                  </div>
                </div>

                <!-- Rental/inspection fee -->
                <div class="md:col-span-2">
                  <label class="field-label">
                    Inspection Fee (₦) *
                  </label>
                  <input
                    v-model.number="form.inspection_fee"
                    type="number"
                    min="0"
                    step="any"
                    class="field-input"
                    placeholder="e.g. 5000"
                  />
                  <p class="mt-2 text-xs text-gray-500">
                    This is the proposed fee for inspecting the listing. It is not the
                    platform's 5% sale system charge. Ensure the fee follows Lodgenext's
                    applicable inspection-fee rules.
                  </p>
                </div>

                <!-- Residential/commercial features -->
                <template v-if="!isLand">
                  <div>
                    <label class="field-label">Bedrooms</label>
                    <input
                      v-model.number="form.bedrooms"
                      type="number"
                      min="0"
                      class="field-input"
                    />
                  </div>

                  <div>
                    <label class="field-label">Bathrooms</label>
                    <input
                      v-model.number="form.bathrooms"
                      type="number"
                      min="0"
                      class="field-input"
                    />
                  </div>

                  <div>
                    <label class="field-label">Toilets</label>
                    <input
                      v-model.number="form.toilets"
                      type="number"
                      min="0"
                      class="field-input"
                    />
                  </div>

                  <div>
                    <label class="field-label">Parking Spaces</label>
                    <input
                      v-model.number="form.parking_spaces"
                      type="number"
                      min="0"
                      class="field-input"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="field-label mb-4">Amenities</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <label
                        v-for="amenity in amenitiesList"
                        :key="amenity"
                        class="flex text-[var(--royal-blue)] items-center gap-2 cursor-pointer"
                      >
                        <input
                          v-model="form.amenities"
                          type="checkbox"
                          :value="amenity"
                          class="accent-[var(--royal-blue)] w-5 h-5"
                        />
                        <span>{{ amenity }}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label class="field-label">Property Condition</label>
                    <select v-model="form.condition" class="field-input">
                      <option value="Newly Built">Newly Built</option>
                      <option value="Renovated">Renovated</option>
                      <option value="Fairly Used">Fairly Used</option>
                    </select>
                  </div>
                </template>

                <div>
                  <label class="field-label">Availability</label>
                  <select v-model="form.availability" class="field-input">
                    <option value="Available Now">Available Now</option>
                    <option value="Available Soon">Available Soon</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- STEP 3: Media -->
            <div v-if="currentStep === 3">
              <h2 class="text-2xl font-semibold mb-3 text-[#0025cc]">
                Photos & Media
              </h2>
              <p class="text-sm text-gray-500 mb-8">
                Use clear, accurate photos of the property or land. Only upload media
                you are authorised to use.
              </p>

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

            <!-- STEP 4: Review -->
            <div v-if="currentStep === 4">
              <h2 class="text-2xl font-semibold mb-3 text-[var(--royal-blue)]">
                Review Changes
              </h2>
              <p class="text-sm text-gray-500 mb-8">
                Confirm that the details are accurate before saving your changes.
              </p>

              <PropertyReview :form="form" />

              <div class="mt-8 rounded-2xl bg-[#f0f7ff] border border-blue-100 p-5">
                <h3 class="font-semibold text-[var(--royal-blue)] mb-3">
                  Listing Summary
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span class="text-gray-500">Category:</span>
                    <strong class="ml-2">{{ categoryLabel }}</strong>
                  </p>
                  <p>
                    <span class="text-gray-500">Asking price:</span>
                    <strong class="ml-2">{{ formatNaira(form.price) }}</strong>
                  </p>

                  <p v-if="isLand">
                    <span class="text-gray-500">Land size:</span>
                    <strong class="ml-2">{{ formatLandSize() }}</strong>
                  </p>

                  <p v-if="isSale">
                    <span class="text-gray-500">Estimated system charge:</span>
                    <strong class="ml-2">{{ formatNaira(systemChargeEstimate) }}</strong>
                  </p>

                  <p>
                    <span class="text-gray-500">Inspection fee:</span>
                    <strong class="ml-2">{{ formatNaira(form.inspection_fee) }}</strong>
                  </p>
                </div>

                <p v-if="isSale" class="text-xs text-gray-600 mt-4">
                  The sale system charge shown is only an estimate. It is not the final
                  charge until the agreed transaction price is confirmed.
                </p>
              </div>
            </div>

            <p v-if="formError" class="mt-6 text-sm text-red-600" role="alert">
              {{ formError }}
            </p>
          </div>

          <!-- Navigation -->
          <div class="border-t p-5 md:p-8 flex justify-between gap-4 bg-[var(--hover-blue)]">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="px-5 md:px-8 py-3 md:py-4 border border-[var(--steel-blue)] bg-[var(--white)] rounded-2xl font-medium hover:bg-gray-50"
            >
              ← Previous
            </button>
            <div v-else></div>

            <button
              v-if="currentStep < 4"
              @click="nextStep"
              class="px-6 md:px-10 py-3 md:py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[#001da3]"
            >
              Continue →
            </button>

            <button
              v-if="currentStep === 4"
              @click="updateProperty"
              :disabled="isSubmitting"
              class="px-6 md:px-10 py-3 md:py-4 bg-[var(--bright-green)] text-white rounded-2xl font-semibold hover:bg-green-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Updating...' : 'Update Property' }}
            </button>
          </div>
        </div>
      </template>
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

type ListingCategory = 'rental' | 'property_sale' | 'land_sale'

interface PropertyForm {
  id: string
  title: string
  property_type: string
  purpose: string
  listing_category: ListingCategory
  state: string
  city: string
  area: string
  address: string
  description: string
  price: number | null
  service_charge: number | null
  inspection_fee: number | null
  bedrooms: number | null
  bathrooms: number | null
  toilets: number | null
  parking_spaces: number | null
  amenities: string[]
  condition: string
  availability: string
  cover_image: string
  image_1: string
  image_2: string
  image_3: string
  image_4: string
  image_5: string
  video_url: string
  land_size: number | null
  land_size_unit: string
  land_use: string
  access_road: string
  title_document_status: string
}

interface LocationGroup {
  cities: string[]
  areas: Record<string, string[]>
}

interface PropertyRecord {
  id: string
  agent_id: string
  title?: string | null
  property_type?: string | null
  purpose?: string | null
  listing_category?: string | null
  state?: string | null
  city?: string | null
  area?: string | null
  address?: string | null
  description?: string | null
  price?: number | string | null
  service_charge?: number | string | null
  inspection_fee?: number | string | null
  bedrooms?: number | null
  bathrooms?: number | null
  toilets?: number | null
  parking_spaces?: number | null
  amenities?: unknown
  condition?: string | null
  availability?: string | null
  cover_image?: string | null
  image_1?: string | null
  image_2?: string | null
  image_3?: string | null
  image_4?: string | null
  image_5?: string | null
  video_url?: string | null
  land_size?: number | string | null
  land_size_unit?: string | null
  land_use?: string | null
  access_road?: string | null
  title_document_status?: string | null
}

const route = useRoute()
const router = useRouter()

const currentStep = ref(1)
const isSubmitting = ref(false)
const propertyId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : ''
})
const priceError = ref('')
const formError = ref('')
const pageError = ref('')
const loading = ref(true)
const propertyNotFound = ref(false)
const ownerId = ref('')

const form = ref<PropertyForm>({
  id: '',
  title: '',
  property_type: '',
  purpose: 'For Rent',
  listing_category: 'rental',
  state: 'Kwara State',
  city: 'Ilorin',
  area: '',
  address: '',
  description: '',
  price: null,
  service_charge: null,
  inspection_fee: null,
  bedrooms: null,
  bathrooms: null,
  toilets: null,
  parking_spaces: null,
  amenities: [],
  condition: 'Newly Built',
  availability: 'Available Now',
  cover_image: '',
  image_1: '',
  image_2: '',
  image_3: '',
  image_4: '',
  image_5: '',
  video_url: '',
  land_size: null,
  land_size_unit: '',
  land_use: '',
  access_road: '',
  title_document_status: '',
})

const steps = [
  'Property Information',
  'Property Features & Pricing',
  'Photos & Media',
  'Review',
]

const amenitiesList = [
  'Borehole',
  'Running Water',
  'Security',
  'Fenced Compound',
  'POP Ceiling',
  'Balcony',
  'Air Conditioning',
  'Prepaid Meter',
  'Wi-Fi',
  'Generator',
]

const locationData: Record<string, LocationGroup> = {
  'Kwara State': {
    cities: ['Ilorin'],
    areas: {
      Ilorin: [
        'Tanke', 'Fate', 'GRA', 'Oke-Ose', 'Adewole', 'Basin',
        'Gambari', 'Oko-Erin', 'Pakata', 'Sabo-Oke', 'Surulere',
        'Taiwo', 'Unity', 'Challenge', 'Agbo-Oba', 'Post Office',
        'Maraba', 'Kulende', 'Oyun', 'Apata Yakuba',
      ],
    },
  },
  'Ogun State': {
    cities: ['Ijebu Ode'],
    areas: {
      'Ijebu Ode': [
        'Molipa', 'Oke-Aje', 'Porogun', 'Obalende', 'Imagbon',
        'Ita-Aladan', 'Ita-Merin', 'Ita-Osun', 'Ijasi', 'Odo-Nla',
        'Isoku', 'Oke-Sopen', 'Ayetoro', 'Folagbade', 'Degun',
        'Ososa', 'Imowo',
      ],
    },
  },
}

const availableCities = computed(
  () => locationData[form.value.state]?.cities ?? [],
)

const availableAreas = computed(
  () => locationData[form.value.state]?.areas[form.value.city] ?? [],
)

const isLand = computed(() =>
  form.value.purpose === 'Land for Sale' ||
  form.value.listing_category === 'land_sale' ||
  form.value.property_type.toLowerCase() === 'land',
)

const isSale = computed(() =>
  form.value.purpose === 'For Sale' ||
  form.value.purpose === 'Land for Sale' ||
  form.value.listing_category === 'property_sale' ||
  form.value.listing_category === 'land_sale',
)

const categoryLabel = computed(() => {
  if (isLand.value) return 'Land for Sale'
  if (form.value.purpose === 'For Sale') return 'Property for Sale'
  if (form.value.purpose === 'For Lease') return 'For Lease'
  return 'For Rent'
})

const priceLabel = computed(() => {
  if (isLand.value) return 'Land Asking Price'
  if (isSale.value) return 'Property Asking Price'
  if (form.value.purpose === 'For Lease') return 'Lease Price'
  return 'Rental Price'
})

const pricePlaceholder = computed(() => {
  if (isLand.value) return 'e.g. 15000000'
  if (isSale.value) return 'e.g. 45000000'
  return 'e.g. 800000'
})

const systemChargeEstimate = computed(() => {
  const price = Number(form.value.price ?? 0)
  return Number.isFinite(price) && price > 0 ? price * 0.05 : 0
})

const formatNaira = (value: number | string | null | undefined): string => {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount)) return '₦0'

  return `₦${amount.toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })}`
}

const formatLandSize = (): string => {
  if (form.value.land_size === null || form.value.land_size === undefined) {
    return 'Not specified'
  }

  const size = Number(form.value.land_size)
  if (!Number.isFinite(size)) return 'Not specified'

  return `${size.toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })} ${form.value.land_size_unit}`.trim()
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null

  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

const normalizePurpose = (record: PropertyRecord): string => {
  if (record.purpose) return record.purpose

  if (record.listing_category === 'land_sale') return 'Land for Sale'
  if (record.listing_category === 'property_sale') return 'For Sale'

  return 'For Rent'
}

const normalizeCategory = (purpose: string): ListingCategory => {
  if (purpose === 'Land for Sale') return 'land_sale'
  if (purpose === 'For Sale') return 'property_sale'
  return 'rental'
}

const normalizeState = (state: string | null | undefined): string => {
  if (state?.includes('Kwara')) return 'Kwara State'
  if (state?.includes('Ogun')) return 'Ogun State'
  return 'Kwara State'
}

watch(
  () => form.value.purpose,
  (purpose) => {
    form.value.listing_category = normalizeCategory(purpose)

    if (purpose === 'Land for Sale') {
      form.value.property_type = 'Land'
    } else if (
      form.value.property_type.toLowerCase() === 'land' &&
      purpose !== 'Land for Sale'
    ) {
      form.value.property_type = ''
    }

    priceError.value = ''
    formError.value = ''
  },
)

watch(
  () => form.value.property_type,
  (propertyType) => {
    if (propertyType.toLowerCase() === 'land') {
      form.value.purpose = 'Land for Sale'
    }
  },
)

watch(
  () => form.value.state,
  (newState) => {
    const cities = locationData[newState]?.cities ?? []

    if (cities.length && !cities.includes(form.value.city)) {
      form.value.city = cities[0] ?? ''
    }
  },
)

const fetchProperty = async (): Promise<void> => {
  if (!propertyId.value) {
    propertyNotFound.value = true
    pageError.value = 'No property ID was provided in the page URL.'
    loading.value = false
    return
  }

  loading.value = true
  pageError.value = ''
  propertyNotFound.value = false

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) throw authError

    if (!user) {
      await router.push('/login')
      return
    }

    const agentId =
      typeof user.user_metadata?.agent_id === 'string'
        ? user.user_metadata.agent_id
        : user.id

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId.value)
      .eq('agent_id', agentId)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      propertyNotFound.value = true
      return
    }

    const record = data as PropertyRecord
    ownerId.value = agentId

    const purpose = normalizePurpose(record)
    const state = normalizeState(record.state)

    form.value = {
      id: record.id,
      title: record.title ?? '',
      property_type: record.property_type ?? '',
      purpose,
      listing_category: normalizeCategory(purpose),
      state,
      city: record.city || locationData[state]?.cities[0] || '',
      area: record.area ?? '',
      address: record.address ?? '',
      description: record.description ?? '',
      price: toNullableNumber(record.price),
      service_charge: toNullableNumber(record.service_charge),
      inspection_fee: toNullableNumber(record.inspection_fee),
      bedrooms: toNullableNumber(record.bedrooms),
      bathrooms: toNullableNumber(record.bathrooms),
      toilets: toNullableNumber(record.toilets),
      parking_spaces: toNullableNumber(record.parking_spaces),
      amenities: Array.isArray(record.amenities)
        ? record.amenities.filter((item): item is string => typeof item === 'string')
        : [],
      condition: record.condition ?? 'Newly Built',
      availability: record.availability ?? 'Available Now',
      cover_image: record.cover_image ?? '',
      image_1: record.image_1 ?? '',
      image_2: record.image_2 ?? '',
      image_3: record.image_3 ?? '',
      image_4: record.image_4 ?? '',
      image_5: record.image_5 ?? '',
      video_url: record.video_url ?? '',
      land_size: toNullableNumber(record.land_size),
      land_size_unit: record.land_size_unit ?? '',
      land_use: record.land_use ?? '',
      access_road: record.access_road ?? '',
      title_document_status: record.title_document_status ?? '',
    }
  } catch (error: unknown) {
    console.error('Failed to load property:', error)
    pageError.value = 'Failed to load the property. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProperty)

const validateCurrentStep = (): boolean => {
  formError.value = ''

  if (currentStep.value === 1) {
    if (!form.value.title.trim()) {
      formError.value = 'Please enter a property title.'
      return false
    }

    if (!form.value.property_type) {
      formError.value = 'Please select a property type.'
      return false
    }

    if (!form.value.state || !form.value.city || !form.value.area.trim()) {
      formError.value = 'Please provide the state, city, and area.'
      return false
    }

    if (!form.value.address.trim()) {
      formError.value = 'Please enter the full property address.'
      return false
    }
  }

  if (currentStep.value === 2) {
    const price = Number(form.value.price)

    if (
      form.value.price === null ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      priceError.value = 'Please enter a valid asking price greater than zero.'
      return false
    }

    const inspectionFee = Number(form.value.inspection_fee)

    if (
      form.value.inspection_fee === null ||
      !Number.isFinite(inspectionFee) ||
      inspectionFee < 0
    ) {
      priceError.value = 'Please enter a valid inspection fee of zero or more.'
      return false
    }

    if (
      isLand.value &&
      form.value.land_size !== null &&
      (!Number.isFinite(Number(form.value.land_size)) || Number(form.value.land_size) <= 0)
    ) {
      formError.value = 'Land size must be greater than zero when provided.'
      return false
    }

    priceError.value = ''
  }

  return true
}

const goToStep = (step: number): void => {
  if (step < 1 || step > 4 || step === currentStep.value) return

  if (step > currentStep.value && !validateCurrentStep()) return

  formError.value = ''
  currentStep.value = step
}

const nextStep = (): void => {
  if (!validateCurrentStep()) return

  if (currentStep.value < 4) {
    currentStep.value++
    formError.value = ''
  }
}

const prevStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
    formError.value = ''
    priceError.value = ''
  }
}

const goBack = (): void => {
  router.push('/agent/properties')
}

const updateProperty = async (): Promise<void> => {
  // Validate all steps before submitting.
  for (const step of [1, 2]) {
    currentStep.value = step

    if (!validateCurrentStep()) return
  }

  if (!propertyId.value || !ownerId.value) {
    formError.value = 'Unable to verify property ownership. Reload the page and try again.'
    return
  }

  isSubmitting.value = true
  formError.value = ''

  try {
    const price = Number(form.value.price)
    const inspectionFee = Number(form.value.inspection_fee)

    const payload = {
      title: form.value.title.trim(),
      property_type: form.value.property_type,
      purpose: form.value.purpose,
      listing_category: form.value.listing_category,
      state: form.value.state,
      city: form.value.city,
      area: form.value.area.trim(),
      address: form.value.address.trim(),
      description: form.value.description.trim(),
      price,
      service_charge:
        form.value.service_charge !== null
          ? Number(form.value.service_charge)
          : null,

      // The database column is TEXT, so store the fee as a string.
      inspection_fee: String(inspectionFee),

      bedrooms: isLand.value ? null : form.value.bedrooms,
      bathrooms: isLand.value ? null : form.value.bathrooms,
      toilets: isLand.value ? null : form.value.toilets,
      parking_spaces: isLand.value ? null : form.value.parking_spaces,
      amenities: isLand.value ? [] : form.value.amenities,
      condition: form.value.condition,
      availability: form.value.availability,

      cover_image: form.value.cover_image || null,
      image_1: form.value.image_1 || null,
      image_2: form.value.image_2 || null,
      image_3: form.value.image_3 || null,
      image_4: form.value.image_4 || null,
      image_5: form.value.image_5 || null,
      video_url: form.value.video_url || null,

      land_size: isLand.value ? form.value.land_size : null,
      land_size_unit: isLand.value ? form.value.land_size_unit || null : null,
      land_use: isLand.value ? form.value.land_use || null : null,
      access_road: isLand.value ? form.value.access_road || null : null,
      title_document_status: isLand.value
        ? form.value.title_document_status || null
        : null,

      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', propertyId.value)
      .eq('agent_id', ownerId.value)
      .select('id')
      .maybeSingle()

    if (error) throw error

    if (!data) {
      throw new Error(
        'The property was not updated. Check your permissions and confirm that you own this listing.',
      )
    }

    window.alert('Property updated successfully.')
    await router.push('/agent/properties')
  } catch (error: unknown) {
    console.error('Failed to update property:', error)

    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while updating the property.'

    formError.value = `Update failed: ${message}`
    currentStep.value = 4
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.field-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--steel-blue);
  font-size: 0.875rem;
  font-weight: 500;
}

.field-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--hover-blue);
  border-radius: 1rem;
  color: var(--royal-blue);
  background: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input:focus {
  border-color: var(--royal-blue);
  box-shadow: 0 0 0 3px rgb(0 37 204 / 0.08);
}

.field-input::placeholder {
  color: #94a3b8;
}

.field-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
