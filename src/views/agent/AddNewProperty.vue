
<template>
  <div class="min-h-screen bg-[#ebf8ff] pb-12">
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-5 mb-10">
        <div>
          <h1 class="md:text-4xl text-xl font-bold text-[var(--royal-blue)]">
            Add New Listing
          </h1>
          <p class="text-[var(--medium-blue)] mt-2 md:text-xl text-sm">
            List a property for rent, lease or sale.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="text-sm flex items-center gap-2 text-[var(--periwinkle)]">
            <span v-if="saveStatus === 'saving'" class="animate-pulse">
              Saving...
            </span>

            <span
              v-else-if="saveStatus === 'saved'"
              class="text-[var(--bright-green)]"
            >
              ✓ Saved
            </span>

            <span v-if="lastSaved">• {{ lastSaved }}</span>
          </div>

          <button
            type="button"
            @click="manualSaveDraft"
            :disabled="isSubmitting || saveStatus === 'saving'"
            class="px-5 py-3 text-[var(--royal-blue)] border border-[var(--royal-blue)] rounded-2xl hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save class="w-5 h-5" />
            Save as Draft
          </button>
        </div>
      </div>

      <PropertyStepper
        :steps="steps"
        :current-step="currentStep"
        @step-click="goToStep"
      />

      <div class="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--hover-blue)]">
        <div class="p-6 md:p-12">
          <!-- STEP 1 -->
          <div v-if="currentStep === 1">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">
              Listing Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="field-label">What would you like to list?</label>

                <select
                  v-model="form.purpose"
                  class="field-input"
                >
                  <option value="For Rent">Property for Rent</option>
                  <option value="For Lease">Property for Lease</option>
                  <option value="For Sale">Property for Sale</option>
                  <option value="Land for Sale">Land for Sale</option>
                </select>

                <p class="mt-2 text-sm text-[var(--steel-blue)]">
                  Choose the listing purpose to display the appropriate
                  property fields and pricing information.
                </p>
              </div>

              <div class="md:col-span-2">
                <label class="field-label">Listing Title *</label>
                <input
                  v-model="form.title"
                  type="text"
                  maxlength="150"
                  required
                  class="field-input"
                  :placeholder="
                    isLandSale
                      ? 'e.g. Residential Plot in Ijebu Ode'
                      : isPropertySale
                        ? 'e.g. 4 Bedroom Duplex for Sale in Ilorin'
                        : 'e.g. 2 Bedroom Flat in Tanke'
                  "
                />
              </div>

              <div>
                <label class="field-label">Property Type *</label>
                <select
                  v-model="form.property_type"
                  class="field-input"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Land" v-if="isLandSale">Land</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Mini Flat">Mini Flat</option>
                  <option value="Self Contain">Self Contain</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Detached House">Detached House</option>
                  <option value="Terrace House">Terrace House</option>
                  <option value="Shop">Shop</option>
                  <option value="Office Space">Office Space</option>
                  <option value="Commercial Property">Commercial Property</option>
                </select>
              </div>

              <div>
                <label class="field-label">State *</label>
                <select v-model="form.state" class="field-input" required>
                  <option value="Kwara State">Kwara State</option>
                  <option value="Ogun State">Ogun State</option>
                </select>
              </div>

              <div>
                <label class="field-label">City *</label>
                <select v-model="form.city" class="field-input" required>
                  <option
                    v-for="city in availableCities"
                    :key="city"
                    :value="city"
                  >
                    {{ city }}
                  </option>
                </select>
              </div>

              <div>
                <label class="field-label">Area / Neighborhood *</label>
                <input
                  v-model="form.area"
                  list="area-list"
                  type="text"
                  required
                  class="field-input"
                  placeholder="Select or type an area"
                />
                <datalist id="area-list">
                  <option
                    v-for="area in availableAreas"
                    :key="area"
                    :value="area"
                  />
                </datalist>
              </div>

              <div class="md:col-span-2">
                <label class="field-label">Full Address / Location *</label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  class="field-input"
                  placeholder="Enter the property address or identifiable location"
                />
              </div>

              <!-- Land-specific information -->
              <template v-if="isLandSale">
                <div class="md:col-span-2 border-t border-[var(--hover-blue)] pt-6">
                  <h3 class="text-lg font-semibold text-[var(--royal-blue)]">
                    Land Information
                  </h3>
                  <p class="text-sm text-[var(--steel-blue)] mt-1">
                    Provide accurate details about the plot and its location.
                  </p>
                </div>

                <div>
                  <label class="field-label">Land Size *</label>
                  <input
                    v-model.number="form.land_size"
                    type="number"
                    min="0.01"
                    step="any"
                    class="field-input"
                    placeholder="e.g. 500"
                    required
                  />
                </div>

                <div>
                  <label class="field-label">Measurement Unit *</label>
                  <select
                    v-model="form.land_size_unit"
                    class="field-input"
                    required
                  >
                    <option value="sqm">Square metres (sqm)</option>
                    <option value="plots">Plots</option>
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>

                <div>
                  <label class="field-label">Intended Land Use *</label>
                  <select v-model="form.land_use" class="field-input" required>
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
                    <option value="">Select access type</option>
                    <option value="Tarred Road">Tarred Road</option>
                    <option value="Untarred Road">Untarred Road</option>
                    <option value="Accessible Path">Accessible Path</option>
                    <option value="Access Not Confirmed">Not Confirmed</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="field-label">
                    Ownership Documents Availability
                  </label>
                  <select
                    v-model="form.title_document_status"
                    class="field-input"
                  >
                    <option value="Not provided">Not provided</option>
                    <option value="Available for review">
                      Available for review
                    </option>
                  </select>
                  <p class="mt-2 text-xs text-[var(--steel-blue)]">
                    This records the seller's declaration only. It does not
                    mean Lodgenext has verified ownership or legal title.
                  </p>
                </div>
              </template>

              <div class="md:col-span-2">
                <label class="field-label">
                  Description
                  <span>({{ form.description.length }}/800)</span>
                </label>
                <textarea
                  v-model="form.description"
                  rows="6"
                  maxlength="800"
                  class="field-input resize-y"
                  :placeholder="
                    isLandSale
                      ? 'Describe the land, surroundings, access, landmarks and other relevant details...'
                      : 'Describe the property, features, location and other relevant details...'
                  "
                />
              </div>
            </div>
          </div>

          <!-- STEP 2 -->
          <div v-if="currentStep === 2">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">
              {{ isLandSale ? 'Land & Pricing' : 'Property Features & Pricing' }}
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
                  required
                  class="field-input"
                  :placeholder="isSale ? 'e.g. 50000000' : 'e.g. 800000'"
                />

                <p v-if="priceError" class="mt-2 text-sm text-red-500">
                  {{ priceError }}
                </p>

                <p class="mt-2 text-xs text-[var(--steel-blue)]">
                  {{
                    isSale
                      ? 'Enter the current asking price. The final system charge is based on the confirmed actual sale price.'
                      : 'Enter the advertised rental or lease amount. Confirm the applicable payment period.'
                  }}
                </p>
              </div>

              <!-- Sale charge preview -->
              <div v-if="isSale" class="md:col-span-2">
                <div class="bg-[#f0f7ff] border border-[var(--hover-blue)] rounded-3xl p-6 space-y-4">
                  <h3 class="text-lg font-semibold text-[var(--royal-blue)]">
                    Estimated Sale Charge
                  </h3>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <p class="text-sm text-[var(--steel-blue)]">
                        Asking Price
                      </p>
                      <p class="text-xl font-bold text-[var(--royal-blue)]">
                        ₦{{ formatNaira(form.price) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-sm text-[var(--steel-blue)]">
                        Estimated 5% System Charge
                      </p>
                      <p class="text-xl font-bold text-green-600">
                        ₦{{ formatNaira(systemChargeAmount) }}
                      </p>
                    </div>
                  </div>

                  <p class="text-sm text-[var(--steel-blue)] bg-white/70 rounded-2xl px-4 py-3">
                    This is an estimate based on the asking price, not a
                    confirmed charge. The final charge is calculated from the
                    agreed actual sale price when the sale is completed under
                    Lodgenext's agreed fee terms.
                  </p>
                </div>
              </div>

              <!-- Inspection fee -->
              <div class="md:col-span-2">
                <label class="field-label">
                  Inspection Fee (₦) *
                </label>
                <input
                  v-model.number="form.inspection_fee"
                  type="number"
                  min="0"
                  step="any"
                  required
                  class="field-input"
                  placeholder="e.g. 5000"
                />
                <p class="mt-2 text-xs text-[var(--steel-blue)]">
                  Enter the approved inspection fee for this listing. Customers
                  should see the fee before requesting an inspection.
                </p>
              </div>

              <!-- Residential/commercial building fields -->
              <template v-if="!isLandSale">
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
                      class="flex items-center gap-2 cursor-pointer text-[var(--royal-blue)]"
                    >
                      <input
                        type="checkbox"
                        :value="amenity"
                        v-model="form.amenities"
                        class="accent-[var(--royal-blue)] w-5 h-5"
                      />
                      {{ amenity }}
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

          <!-- STEP 3 -->
          <div v-if="currentStep === 3">
            <h2 class="text-2xl font-semibold mb-4 text-[var(--royal-blue)]">
              Photos & Media
            </h2>
            <p class="text-sm text-[var(--steel-blue)] mb-8">
              Upload genuine photos of the property or land. Make sure the
              images accurately represent the listing.
            </p>

            <PropertyMediaUploader
              v-model:image1="form.image_1"
              v-model:image2="form.image_2"
              v-model:image3="form.image_3"
              v-model:image4="form.image_4"
              v-model:image5="form.image_5"
              v-model:cover="form.cover_image"
              v-model:video="form.video_url"
            />
          </div>

          <!-- STEP 4 -->
          <div v-if="currentStep === 4">
            <h2 class="text-2xl font-semibold mb-4 text-[var(--royal-blue)]">
              Review & Submit
            </h2>

            <div class="mb-6 rounded-2xl bg-[#f0f7ff] p-5 text-sm text-[var(--steel-blue)]">
              <p>
                <strong>Listing type:</strong> {{ form.purpose }}
              </p>
              <p class="mt-2">
                <strong>Property:</strong> {{ form.title || 'Not entered' }}
              </p>
              <p class="mt-2">
                <strong>Location:</strong>
                {{ [form.area, form.city, form.state].filter(Boolean).join(', ') }}
              </p>
              <p class="mt-2">
                <strong>{{ priceLabel }}:</strong>
                ₦{{ formatNaira(form.price) }}
              </p>
              <p v-if="isLandSale" class="mt-2">
                <strong>Land size:</strong>
                {{ form.land_size || 'Not entered' }}
                {{ form.land_size_unit }}
              </p>
              <p v-if="isSale" class="mt-2">
                <strong>Estimated 5% charge:</strong>
                ₦{{ formatNaira(systemChargeAmount) }}
              </p>
              <p class="mt-2">
                <strong>Inspection fee:</strong>
                ₦{{ formatNaira(form.inspection_fee) }}
              </p>
            </div>

            <PropertyReview :form="form" />
          </div>
        </div>

        <!-- Navigation -->
        <div class="border-t p-5 md:p-8 flex justify-between gap-3 bg-[var(--hover-blue)]">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="px-5 md:px-8 py-4 border border-[var(--steel-blue)] bg-white rounded-2xl font-medium hover:bg-gray-50"
          >
            ← Previous
          </button>

          <div v-else />

          <button
            v-if="currentStep < 4"
            type="button"
            @click="nextStep"
            class="px-6 md:px-10 py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[#001da3]"
          >
            Continue →
          </button>

          <button
            v-if="currentStep === 4"
            type="button"
            @click="submitProperty"
            :disabled="isSubmitting"
            class="px-6 md:px-10 py-4 bg-[var(--bright-green)] text-white rounded-2xl font-semibold hover:bg-green-600 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Listing' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { supabase } from '@/supabaseClient'
import PropertyStepper from '@/components/properties/PropertyStepper.vue'
import PropertyMediaUploader from '@/components/properties/PropertyMediaUploader.vue'
import PropertyReview from '@/components/properties/PropertyReview.vue'
import { Save } from 'lucide-vue-next'
import {
  calculateSystemCharge,
  formatNaira
} from '@/utils/systemCharge'

type ListingCategory = 'rental' | 'property_sale' | 'land_sale'

const currentStep = ref(1)
const isSubmitting = ref(false)
const saveStatus = ref<'idle' | 'saving' | 'saved'>('idle')
const lastSaved = ref('')
const priceError = ref('')
const formError = ref('')

const form = ref({
  id: null as string | null,
  title: '',
  property_type: '',
  purpose: 'For Rent',
  listing_category: 'rental' as ListingCategory,
  state: 'Kwara State',
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
  land_size: null as number | null,
  land_size_unit: 'sqm',
  land_use: '',
  access_road: '',
  title_document_status: 'Not provided',
  cover_image: '',
  image_1: '',
  image_2: '',
  image_3: '',
  image_4: '',
  image_5: '',
  video_url: ''
})

const locationData: Record<
  string,
  { cities: string[]; areas: Record<string, string[]> }
> = {
  'Kwara State': {
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
  'Ogun State': {
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

const availableCities = computed(
  () => locationData[form.value.state]?.cities ?? []
)

const availableAreas = computed(
  () => locationData[form.value.state]?.areas[form.value.city] ?? []
)

const isLandSale = computed(
  () => form.value.purpose === 'Land for Sale'
)

const isPropertySale = computed(
  () => form.value.purpose === 'For Sale'
)

const isSale = computed(
  () => isLandSale.value || isPropertySale.value
)

const priceLabel = computed(() => {
  if (isLandSale.value) return 'Land Asking Price'
  if (isPropertySale.value) return 'Property Asking Price'
  if (form.value.purpose === 'For Lease') return 'Lease Price'
  return 'Annual Rental Price'
})

const systemChargeAmount = computed(() => {
  if (!isSale.value) return 0
  return calculateSystemCharge(form.value.price)
})

const steps = [
  'Listing Information',
  'Features & Pricing',
  'Photos & Media',
  'Review & Submit'
]

const amenitiesList = [
  'Borehole', 'Running Water', 'Security', 'Fenced Compound',
  'POP Ceiling', 'Balcony', 'Air Conditioning', 'Prepaid Meter',
  'Wi-Fi', 'Generator'
]

watch(
  () => form.value.purpose,
  (purpose, previousPurpose) => {
    if (purpose === 'Land for Sale') {
      form.value.listing_category = 'land_sale'
      form.value.property_type = 'Land'
    } else if (purpose === 'For Sale') {
      form.value.listing_category = 'property_sale'
      if (form.value.property_type === 'Land') {
        form.value.property_type = ''
      }
    } else {
      form.value.listing_category = 'rental'
      if (form.value.property_type === 'Land') {
        form.value.property_type = ''
      }
    }

    if (purpose !== previousPurpose) {
      priceError.value = ''
    }
  }
)

watch(
  () => form.value.state,
  (state) => {
    const cities = locationData[state]?.cities ?? []
    form.value.city = cities[0] ?? ''
    form.value.area = ''
  }
)

watch(
  () => form.value.city,
  () => {
    form.value.area = ''
  }
)

let saveTimeout: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => {
  if (saveTimeout) clearTimeout(saveTimeout)
})

function validateCurrentStep(): boolean {
  formError.value = ''
  priceError.value = ''

  if (currentStep.value === 1) {
    if (
      !form.value.title.trim() ||
      !form.value.property_type ||
      !form.value.state ||
      !form.value.city ||
      !form.value.area.trim() ||
      !form.value.address.trim()
    ) {
      formError.value =
        'Complete the required listing title, property type and location fields.'
      return false
    }

    if (
      isLandSale.value &&
      (
        !form.value.land_size ||
        form.value.land_size <= 0 ||
        !form.value.land_size_unit ||
        !form.value.land_use
      )
    ) {
      formError.value =
        'Enter the land size, measurement unit and intended land use.'
      return false
    }
  }

  if (currentStep.value === 2) {
    const price = Number(form.value.price)

    if (!Number.isFinite(price) || price <= 0) {
      priceError.value = 'Enter a valid price greater than zero.'
      return false
    }

    const fee = Number(form.value.inspection_fee)

    if (
      form.value.inspection_fee === null ||
      !Number.isFinite(fee) ||
      fee < 0
    ) {
      priceError.value = 'Enter a valid inspection fee.'
      return false
    }
  }

  return true
}

function buildPayload(status: 'draft' | 'pending') {
  const data = form.value

  return {
    agent_id: undefined as string | undefined,
    title: data.title.trim(),
    property_type: data.property_type,
    purpose: data.purpose,
    listing_category: data.listing_category,
    state: data.state,
    city: data.city,
    area: data.area.trim(),
    address: data.address.trim(),
    description: data.description.trim(),
    price: data.price === null ? null : Number(data.price),

    // Do not use service_charge for the platform system charge.
    service_charge: data.service_charge,

    inspection_fee:
      data.inspection_fee === null
        ? null
        : String(Number(data.inspection_fee)),

    bedrooms: isLandSale.value ? null : data.bedrooms,
    bathrooms: isLandSale.value ? null : data.bathrooms,
    toilets: isLandSale.value ? null : data.toilets,
    parking_spaces: isLandSale.value ? null : data.parking_spaces,
    amenities: isLandSale.value ? [] : data.amenities,
    condition: isLandSale.value ? null : data.condition,
    availability: data.availability,

    land_size: isLandSale.value ? data.land_size : null,
    land_size_unit: isLandSale.value ? data.land_size_unit : null,
    land_use: isLandSale.value ? data.land_use : null,
    access_road: isLandSale.value ? data.access_road || null : null,
    title_document_status: isLandSale.value
      ? data.title_document_status
      : null,

    cover_image: data.cover_image || null,
    image_1: data.image_1 || null,
    image_2: data.image_2 || null,
    image_3: data.image_3 || null,
    image_4: data.image_4 || null,
    image_5: data.image_5 || null,
    video_url: data.video_url || null,
    status
  }
}

async function persistDraft() {
  if (!form.value.title.trim() || isSubmitting.value) return

  saveStatus.value = 'saving'

  try {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser()

    if (authError) throw authError
    if (!user) throw new Error('Please sign in to save your listing.')

    const payload = {
      ...buildPayload('draft'),
      agent_id: user.id
    }

    if (form.value.id) {
      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', form.value.id)
        .eq('agent_id', user.id)

      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert(payload)
        .select('id')
        .single()

      if (error) throw error
      form.value.id = data.id
    }

    saveStatus.value = 'saved'
    lastSaved.value = 'Just now'
  } catch (error: unknown) {
    console.error('Draft save failed:', error)
    saveStatus.value = 'idle'
  }
}

function scheduleAutoSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  if (isSubmitting.value) return

  saveTimeout = setTimeout(() => {
    void persistDraft()
  }, 1200)
}

watch(form, scheduleAutoSave, { deep: true })

async function manualSaveDraft() {
  if (saveTimeout) clearTimeout(saveTimeout)
  await persistDraft()
}

function nextStep() {
  if (!validateCurrentStep()) {
    return
  }

  formError.value = ''

  if (currentStep.value < 4) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    formError.value = ''
    priceError.value = ''
  }
}

function goToStep(step: number) {
  if (step < 1 || step > 4) return

  // Validate the current step before moving forward.
  if (step > currentStep.value && !validateCurrentStep()) {
    return
  }

  currentStep.value = step
  formError.value = ''
  priceError.value = ''
}

async function submitProperty() {
  for (let step = 1; step <= 2; step++) {
    currentStep.value = step

    if (!validateCurrentStep()) {
      return
    }
  }

  if (saveTimeout) clearTimeout(saveTimeout)

  isSubmitting.value = true
  formError.value = ''

  try {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser()

    if (authError) throw authError
    if (!user) throw new Error('Please sign in before submitting.')

    const payload = {
      ...buildPayload('pending'),
      agent_id: user.id
    }

    if (form.value.id) {
      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', form.value.id)
        .eq('agent_id', user.id)

      if (error) throw error
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert(payload)
        .select('id')
        .single()

      if (error) throw error
      form.value.id = data.id
    }

    saveStatus.value = 'saved'
    lastSaved.value = 'Just now'

    window.alert(
      'Listing submitted successfully. It will be reviewed before publication.'
    )
  } catch (error: unknown) {
    console.error('Listing submission failed:', error)

    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred.'

    window.alert(`Submission failed: ${message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--steel-blue);
}

.field-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--hover-blue);
  border-radius: 1rem;
  color: var(--royal-blue);
  background: white;
  outline: none;
}

.field-input:focus {
  border-color: var(--royal-blue);
  box-shadow: 0 0 0 2px rgb(11 57 57 / 8%);
}
</style>
