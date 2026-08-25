<template>
  <div class="min-h-screen bg-[var(--light-blue)] py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <button 
        @click="$router.back()"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        ← Back to Property
      </button>

      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Property Summary -->
        <div class="p-6 sm:p-8 border-b bg-gradient-to-r from-[#f5f8ff] to-white" v-if="property">
          <div class="flex gap-4 sm:gap-5">
            <img 
              :src="property.cover_image || placeholderImg" 
              class="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl flex-shrink-0 shadow-sm"
              alt=""
            />
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl font-bold leading-tight text-[var(--royal-blue)]">
                {{ property.title }}
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                📍 {{ property.area }}, {{ property.city }}, {{ property.state }}
              </p>
              
              <div class="flex flex-wrap items-center gap-3 sm:gap-5 mt-3 text-xs sm:text-sm text-gray-600">
                <span>🛏️ {{ property.bedrooms ?? '—' }} Beds</span>
                <span>🚿 {{ property.bathrooms ?? '—' }} Baths</span>
                <span>🚗 {{ property.parking_spaces ?? 0 }} Parking</span>
              </div>

              <p class="mt-3 text-xl sm:text-2xl font-bold text-[var(--bright-green)]">
                ₦{{ formatMoney(property.price) }}
                <span class="text-sm font-normal text-gray-500">/ year</span>
              </p>
            </div>
          </div>
        </div>

        <div v-else class="p-12 text-center text-gray-500">
          Loading property details...
        </div>

        <!-- Form -->
        <div class="p-6 sm:p-8" v-if="property">
          <div class="mb-8">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)]">
              Request Property Inspection
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              Choose a convenient date and time frame for your visit
            </p>
          </div>

          <form @submit.prevent="submitRequest" class="space-y-8">
            <!-- Preferred Date -->
            <div class="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-gray-100">
              <label class="block text-sm font-semibold text-gray-800 mb-3">
                Preferred Date
              </label>
              <input
                v-model="form.inspection_date"
                type="date"
                class="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white
                  focus:outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/10
                  text-[var(--royal-blue)]"
                :min="today"
                required
              />
            </div>

            <!-- Preferred Time Frame -->
            <div class="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-gray-100">
              <label class="block text-sm font-semibold text-gray-800 mb-2">
                Preferred Time Frame
              </label>
              <p class="text-xs text-gray-500 mb-4">
                Select a 1-hour window that works best for you
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="slot in timeSlots"
                  :key="slot.value"
                  type="button"
                  @click="form.inspection_time = slot.value"
                  :class="[
                    'py-3.5 px-4 rounded-2xl text-sm font-medium transition-all border text-left',
                    form.inspection_time === slot.value 
                      ? 'bg-[var(--royal-blue)] text-white border-[var(--royal-blue)] shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--royal-blue)] hover:bg-[#f5f8ff]'
                  ]"
                >
                  <span class="block font-semibold">{{ slot.label }}</span>
                  <span
                    class="block text-xs mt-0.5"
                    :class="form.inspection_time === slot.value ? 'text-white/80' : 'text-gray-400'"
                  >
                    1 hour window
                  </span>
                </button>
              </div>
            </div>

            <!-- Message -->
            <div class="bg-gray-50 rounded-3xl p-5 sm:p-6 border border-gray-100">
              <label class="block text-sm font-semibold text-gray-800 mb-3">
                Message to Agent
                <span class="font-normal text-gray-400">(Optional)</span>
              </label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="I would like to inspect the property with my family..."
                class="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white
                  focus:outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue)]/10
                  resize-y text-sm text-gray-700"
              ></textarea>
            </div>

            <!-- Inspection Fee Payment -->
            <div class="rounded-3xl p-5 sm:p-6 border border-[var(--hover-blue)] bg-gradient-to-br from-[#f0f7ff] to-white">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                <div>
                  <h3 class="font-semibold text-[var(--royal-blue)]">Inspection Fee</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Payment is required before you can submit the request
                  </p>
                </div>
                <p class="text-2xl font-bold text-[var(--royal-blue)]">
                  ₦{{ formatMoney(property.inspection_fee) }}
                </p>
              </div>

              <div
                v-if="hasPaid"
                class="flex items-center gap-2 text-green-600 font-medium mb-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-3"
              >
                <span class="text-xl">✓</span>
                <span>Payment successful — you can submit your request</span>
              </div>

              <button
                v-else
                type="button"
                @click="payInspectionFee"
                :disabled="isPaying || isVerifying || !canPay"
                class="w-full bg-[var(--bright-green)] hover:bg-green-600 disabled:bg-gray-400 text-white py-3.5 rounded-2xl font-semibold transition-all"
              >
                <span v-if="isPaying">Opening Paystack...</span>
                <span v-else-if="isVerifying">Verifying Payment...</span>
                <span v-else>Pay Inspection Fee</span>
              </button>

              <p v-if="!canPay" class="mt-3 text-sm text-red-500">
                This property has no valid inspection fee set.
              </p>
            </div>

            <!-- Submit -->
            <div>
              <button
                type="submit"
                :disabled="isSubmitting || !hasPaid || !form.inspection_date || !form.inspection_time"
                class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all shadow-md"
              >
                {{ isSubmitting ? 'Submitting Request...' : 'Submit Inspection Request' }}
              </button>

              <p v-if="!hasPaid" class="text-center text-sm text-gray-500 mt-3">
                Complete payment to activate the submit button
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const route = useRoute()
const router = useRouter()

const property = ref(null)
const isSubmitting = ref(false)
const isPaying = ref(false)
const isVerifying = ref(false)
const hasPaid = ref(false)
const paymentReference = ref('')
const placeholderImg = 'https://via.placeholder.com/200x200?text=Property'

const form = ref({
  inspection_date: '',
  inspection_time: '',
  message: ''
})

// Time frames (1-hour windows)
const timeSlots = [
  { label: '9:00 AM – 10:00 AM', value: '9:00 AM – 10:00 AM' },
  { label: '10:00 AM – 11:00 AM', value: '10:00 AM – 11:00 AM' },
  { label: '11:00 AM – 12:00 PM', value: '11:00 AM – 12:00 PM' },
  { label: '12:00 PM – 1:00 PM', value: '12:00 PM – 1:00 PM' },
  { label: '1:00 PM – 2:00 PM', value: '1:00 PM – 2:00 PM' },
  { label: '2:00 PM – 3:00 PM', value: '2:00 PM – 3:00 PM' },
  { label: '3:00 PM – 4:00 PM', value: '3:00 PM – 4:00 PM' },
  { label: '4:00 PM – 5:00 PM', value: '4:00 PM – 5:00 PM' },
]

const today = new Date().toISOString().split('T')[0]

const formatMoney = (value) => {
  if (value == null || value === '') return '0'
  return Number(value).toLocaleString()
}

const canPay = computed(() => {
  const fee = Number(property.value?.inspection_fee || 0)
  return fee > 0
})

const fetchProperty = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error
    property.value = data
  } catch (error) {
    console.error('Error fetching property:', error)
    alert('Failed to load property details. Please try again.')
    router.back()
  }
}

const payInspectionFee = async () => {
  if (!canPay.value) {
    alert('No valid inspection fee set for this property')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    alert('Please login to pay')
    router.push('/login')
    return
  }

  if (!window.PaystackPop) {
    alert('Paystack failed to load. Please refresh the page.')
    return
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
  if (!publicKey || !String(publicKey).startsWith('pk_')) {
    alert('Payment is not configured correctly (invalid public key).')
    return
  }

  const amountInKobo = Math.round(Number(property.value.inspection_fee) * 100)
  if (!amountInKobo || amountInKobo < 100) {
    alert('Invalid inspection fee amount')
    return
  }

  isPaying.value = true

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: user.email,
    amount: amountInKobo,
    currency: 'NGN',
    ref: `insp_${property.value.id}_${Date.now()}`,
    metadata: {
      property_id: property.value.id,
      customer_id: user.id,
      type: 'inspection_fee'
    },
    callback: function (response) {
      savePayment(response.reference, user.id)
    },
    onClose: function () {
      isPaying.value = false
      alert('Payment was cancelled')
    }
  })

  handler.openIframe()
}

const savePayment = async (reference, customerId) => {
  isVerifying.value = true
  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        reference,
        customer_id: customerId,
        property_id: property.value.id,
        amount: Number(property.value.inspection_fee),
        currency: 'NGN',
        status: 'success',
        payment_type: 'inspection_fee',
        paid_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving payment:', error)
      alert('Payment was successful but failed to save. Contact support with ref: ' + reference)
      return
    }

    paymentReference.value = reference
    hasPaid.value = true
    alert('✅ Payment successful! You can now submit your inspection request.')
  } catch (err) {
    console.error(err)
    alert('Something went wrong while saving the payment.')
  } finally {
    isVerifying.value = false
    isPaying.value = false
  }
}

const submitRequest = async () => {
  if (!hasPaid.value) {
    alert('Please pay the inspection fee first')
    return
  }

  if (!form.value.inspection_date || !form.value.inspection_time) {
    alert('Please select both date and time frame')
    return
  }

  isSubmitting.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login to submit a request')
      router.push('/login')
      return
    }

    const payload = {
      customer_id: user.id,
      property_id: property.value.id,
      agent_id: property.value.agent_id,
      request_type: 'inspection',
      inspection_date: form.value.inspection_date,
      inspection_time: form.value.inspection_time, // e.g. "12:00 PM – 1:00 PM"
      message: form.value.message || null,
      state: property.value.state,
      city: property.value.city,
      inspection_fee: property.value.inspection_fee,
      payment_status: 'paid',
      payment_reference: paymentReference.value,
      status: 'pending'
    }

    const { error } = await supabase
      .from('property_requests')
      .insert(payload)

    if (error) throw error

    alert('✅ Inspection request submitted successfully!')
    router.push('/customer/request')
  } catch (error) {
    console.error(error)
    alert(error.message || 'Failed to submit request. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchProperty)
</script>