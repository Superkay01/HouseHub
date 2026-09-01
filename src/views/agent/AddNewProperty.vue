<template>
  <div class="min-h-screen bg-[#ebf8ff] pb-12">
    <div class="max-w-5xl mx-auto px-4 pt-8">
      <!-- Header -->
      <div class="flex justify-between items-start mb-10">
        <div>
          <h1 class="md:text-4xl text-xl font-bold text-[var(--royal-blue)]">Add New Property</h1>
          <p class="text-[var(--medium-blue)] mt-2 md:text-xl text-sm">
            List your property and connect with potential tenants
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm flex items-center gap-2 text-[var(--periwinkle)]">
            <span v-if="saveStatus === 'saving'" class="animate-pulse">Saving...</span>
            <span v-else-if="saveStatus === 'saved'" class="text-[var(--bright-green)] flex items-center gap-1">
              ✓ Saved
            </span>
            <span v-if="lastSaved">• {{ lastSaved }}</span>
          </div>

          <button 
            @click="manualSaveDraft"
            class="px-6 py-3 text-[var(--royal-blue)] border border-[var(--royal-blue)] rounded-2xl hover:bg-[var(--white)] transition-all flex items-center gap-2">
            <span><Save class="w-5 h-5"/></span> Save as Draft
          </button>
        </div>
      </div>

      <!-- Stepper -->
      <PropertyStepper 
        :steps="steps" 
        :current-step="currentStep" 
        @step-click="goToStep" 
      />

      <div class="mt-10 bg-[var(--white)] rounded-3xl shadow-xl overflow-hidden border border-[var(--hover-blue)]">
        <!-- Step Content -->
        <div class="p-8 md:p-12">
          
          <!-- STEP 1: Property Information -->
          <div v-if="currentStep === 1">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Title</label>
                <input v-model="form.title" type="text" 
                       class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl focus:border-[var(--royal-blue)] outline-none"
                       placeholder="e.g. 2 Bedroom Flat in Tanke" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Type</label>
                <select v-model="form.property_type" class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl">
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
  <label class="block text-sm font-medium mb-2 text-[var(--royal-blue)]">State</label>
  <select
    v-model="form.state"
    class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl"
  >
    <option value="Kwara State">Kwara State</option>
    <option value="Ogun State">Ogun State</option>
  </select>
</div>

<!-- City (auto-updates based on State) -->
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
    <option v-for="area in availableAreas" :key="area" :value="area" class="text-[var(--royal-blue)]" />
  </datalist>
  <p class="mt-1 text-xs text-[var(--royal-blue)]">
    You can select from the list or type a custom area if it’s not listed.
  </p>
</div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Full Address</label>
                <input v-model="form.address" type="text" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Description <span class="text-[var(--royal-blue)]">({{ form.description.length }}/800)</span></label>
                <textarea v-model="form.description" rows="6"
                          class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl resize-none"
                          placeholder="Describe the property..."></textarea>
              </div>
            </div>
          </div>

          <!-- STEP 2: Property Features & Pricing -->
          <div v-if="currentStep === 2">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Property Features & Pricing</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Price Input -->
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

              <!-- Pricing Summary Card (System Charge) -->
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

              <!-- Remaining feature fields -->
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Bedrooms</label>
                <input v-model.number="form.bedrooms" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Bathrooms</label>
                <input v-model.number="form.bathrooms" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Toilets</label>
                <input v-model.number="form.toilets" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Parking Spaces</label>
                <input v-model.number="form.parking_spaces" type="number" class="w-full px-5 py-4 border border-[var(--hover-blue)] rounded-2xl text-[var(--royal-blue)]" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-4 text-[var(--steel-blue)]">Amenities</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label v-for="amenity in amenitiesList" :key="amenity" class="flex text-[var(--royal-blue)] items-center gap-2 cursor-pointer">
                    <input type="checkbox" :value="amenity" v-model="form.amenities" class="accent-[var(--royal-blue)] w-5 h-5" />
                    <span class="text-[var(--royal-blue)]">{{ amenity }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Property Condition</label>
                <select v-model="form.condition" class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl">
                  <option value="Newly Built">Newly Built</option>
                  <option value="Renovated">Renovated</option>
                  <option value="Fairly Used">Fairly Used</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2 text-[var(--steel-blue)]">Availability</label>
                <select v-model="form.availability" class="w-full px-5 py-4 border border-[var(--hover-blue)] text-[var(--royal-blue)] rounded-2xl">
                  <option value="Available Now">Available Now</option>
                  <option value="Available Soon">Available Soon</option>
                </select>
              </div>
            </div>
          </div>

          <!-- STEP 3: Photos & Media -->
          <div v-if="currentStep === 3">
            <h2 class="text-2xl font-semibold mb-8 text-[#0025cc]">Photos & Media</h2>
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

          <!-- STEP 4: Review -->
          <div v-if="currentStep === 4">
            <h2 class="text-2xl font-semibold mb-8 text-[var(--royal-blue)]">Review & Submit</h2>
            <PropertyReview :form="form" />
          </div>
        </div>

        <!-- Navigation -->
        <div class="border-t p-8 flex justify-between bg-[var(--hover-blue)]">
          <button v-if="currentStep > 1" @click="prevStep"
                  class="px-8 py-4 border border-[var(--steel-blue)] bg-[var(--white)] rounded-2xl font-medium hover:bg-gray-50">
            ← Previous
          </button>
          
          <button v-if="currentStep < 4" @click="nextStep"
                  class="px-10 py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold hover:bg-[#001da3]">
            Continue →
          </button>

          <button v-if="currentStep === 4" @click="submitProperty"
                  :disabled="isSubmitting"
                  class="px-10 py-4 bg-[var(--bright-green)] text-white rounded-2xl font-semibold hover:bg-green-600 transition-all">
            {{ isSubmitting ? 'Submitting...' : 'Submit Property' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import PropertyStepper from '@/components/properties/PropertyStepper.vue'
import PropertyMediaUploader from '@/components/properties/PropertyMediaUploader.vue'
import PropertyReview from '@/components/properties/PropertyReview.vue'
import { Save } from 'lucide-vue-next'
import { calculateSystemCharge, formatNaira, SYSTEM_CHARGE_RATE } from '@/utils/systemCharge'

// Debounce helper
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T
}

const currentStep = ref(1)
const isSubmitting = ref(false)
const saveStatus = ref<'idle' | 'saving' | 'saved'>('idle')
const lastSaved = ref<string>('')
const priceError = ref('')

// 1. Declare form FIRST
const form = ref({
  id: null as string | null,
  title: '',
  property_type: '',
  purpose: 'For Rent',
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
  cover_image: '',
  image_1: '',
  image_2: '',
  image_3: '',
  image_4: '',
  image_5: '',
  video_url: ''
})

// 2. Location data
const locationData: Record<string, { cities: string[]; areas: Record<string, string[]> }> = {
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

// 3. Computed helpers (now form exists)
const availableCities = computed(() => {
  return locationData[form.value.state]?.cities || []
})

const availableAreas = computed(() => {
  const city = form.value.city
  return locationData[form.value.state]?.areas[city] || []
})

// 4. Watchers (now form exists)
watch(
  () => form.value.state,
  (newState) => {
    const cities = locationData[newState]?.cities ?? []
    if (cities.length) {
      form.value.city = cities[0]!
    }
    form.value.area = ''
  }
)

watch(
  () => form.value.city,
  () => {
    form.value.area = ''
  }
)

// ---------- rest of your code stays the same ----------
const steps = [
  'Property Information',
  'Property Features & Pricing',
  'Photos & Media',
  'Review & Submit'
]

const amenitiesList = [
  'Borehole', 'Running Water', 'Security', 'Fenced Compound',
  'POP Ceiling', 'Balcony', 'Air Conditioning', 'Prepaid Meter',
  'Wi-Fi', 'Generator'
]


// Computed system charge – always derived from form.price
const systemChargeAmount = computed(() => calculateSystemCharge(form.value.price))

// Auto Save (no longer treats service_charge as platform fee)
const autoSave = debounce(async () => {
  if (!form.value.title?.trim()) return

  saveStatus.value = 'saving'

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { id, ...data } = form.value

    const payload = {
      agent_id: user.id,
      ...data,
      price: data.price ? Number(data.price) : null,
      // Do NOT write a platform fee into service_charge
      service_charge: data.service_charge ? Number(data.service_charge) : null,
      status: 'draft' as const
      // If your schema already has these columns, you can also include:
      // system_charge_rate: 5,
      // system_charge_amount: calculateSystemCharge(data.price)
    }

    let result
    if (form.value.id) {
      result = await supabase
        .from('properties')
        .update(payload)
        .eq('id', form.value.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('properties')
        .insert(payload)
        .select()
        .single()
    }

    if (result.data && !form.value.id) {
      form.value.id = result.data.id
    }

    saveStatus.value = 'saved'
    lastSaved.value = 'Just now'
  } catch (err) {
    console.error('Auto-save failed:', err)
    saveStatus.value = 'idle'
  }
}, 1200)

watch(form, autoSave, { deep: true })

const manualSaveDraft = () => autoSave()

// const validatePrice = (): boolean => {
//   const price = Number(form.value.price || 0)
//   if (!price || price <= 0) {
//     priceError.value = 'Please enter the actual transaction price before continuing.'
//     return false
//   }
//   priceError.value = ''
//   return true
// }

const validatePrice = (): boolean => {
  const price = Number(form.value.price || 0)
  if (!price || price <= 0) {
    priceError.value = 'Please enter the actual transaction price before continuing.'
    return false
  }

  // Optional: require inspection fee
  const fee = Number(form.value.inspection_fee || 0)
  if (fee === null || fee < 0) {
    priceError.value = 'Please enter a valid inspection fee.'
    return false
  }

  priceError.value = ''
  return true
}
const nextStep = () => {
  if (currentStep.value === 2 && !validatePrice()) {
    return
  }
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const goToStep = (step: number) => {
  currentStep.value = step
}

const submitProperty = async () => {
  if (!validatePrice()) {
    currentStep.value = 2
    return
  }

  isSubmitting.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { id, ...data } = form.value
    const price = Number(data.price || 0)
    const systemCharge = calculateSystemCharge(price)

    const cleanPayload: Record<string, any> = {
      agent_id: user.id,
      ...data,
      price,
      service_charge: data.service_charge ? Number(data.service_charge) : null, // only if still a genuine landlord charge
      bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
      toilets: data.toilets ? Number(data.toilets) : null,
      parking_spaces: data.parking_spaces ? Number(data.parking_spaces) : null,
      status: 'pending' as const
    }

    // Only include these if the columns exist in your `properties` table
    // cleanPayload.system_charge_rate = 5
    // cleanPayload.system_charge_amount = systemCharge

    let error
    if (form.value.id) {
      const { error: e } = await supabase.from('properties').update(cleanPayload).eq('id', form.value.id)
      error = e
    } else {
      const { error: e } = await supabase.from('properties').insert(cleanPayload)
      error = e
    }

    if (error) throw error

    alert('🎉 Property submitted successfully! Our team will review it soon.')
  } catch (err: any) {
    alert('Submission failed: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>