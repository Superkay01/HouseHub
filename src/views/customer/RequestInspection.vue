<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <button 
      @click="$router.back()"
      class="flex items-center gap-2 text-medium-gray hover:text-gray-900 mb-6 transition-colors"
    >
      ← Back to Property
    </button>

    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Property Summary -->
      <div class="p-6 border-b" v-if="property">
        <div class="flex gap-4">
          <img 
            :src="property.cover_image" 
            class="w-24 h-24 object-cover rounded-2xl flex-shrink-0"
          />
          <div class="flex-1">
            <h1 class="text-2xl font-semibold leading-tight">{{ property.title }}</h1>
            <p class="text-medium-gray mt-1">
              📍 {{ property.area }}, {{ property.city }}, {{ property.state }}
            </p>
            
            <div class="flex items-center gap-6 mt-3 text-sm">
              <div>🛏️ {{ property.bedrooms }} Bedrooms</div>
              <div>🚿 {{ property.bathrooms }} Bathrooms</div>
              <div>🚗 {{ property.parking_spaces || 0 }} Parking</div>
            </div>

            <p class="mt-3 text-2xl font-bold text-[var(--bright-green)]">
              ₦{{ Number(property.price).toLocaleString() }} 
              <span class="text-sm font-normal text-medium-gray">per year</span>
            </p>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-medium-gray">
        Loading property details...
      </div>

      <!-- Form -->
      <div class="p-8" v-if="property">
        <h2 class="text-xl font-semibold mb-6">Request Property Inspection</h2>

        <form @submit.prevent="submitRequest" class="space-y-8">
          <!-- Preferred Date -->
          <div>
            <label class="block text-sm font-medium mb-2">Preferred Date</label>
            <input
              v-model="form.inspection_date"
              type="date"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)]"
              :min="today"
              required
            />
          </div>

          <!-- Preferred Time -->
          <div>
            <label class="block text-sm font-medium mb-2">Preferred Time</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="time in timeSlots"
                :key="time"
                type="button"
                @click="form.inspection_time = time"
                :class="[
                  'py-3 px-4 rounded-2xl text-sm font-medium transition-all',
                  form.inspection_time === time 
                    ? 'bg-[var(--royal-blue)] text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                ]"
              >
                {{ time }}
              </button>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium mb-2">Message to Agent (Optional)</label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="I would like to inspect the property with my family..."
              class="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] resize-y"
            ></textarea>
          </div>

          <!-- ==================== INSPECTION FEE PAYMENT ==================== -->
          <div class="bg-[#f0f7ff] border border-[var(--hover-blue)] rounded-3xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-[var(--royal-blue)]">Inspection Fee</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Payment is required before you can submit the request
                </p>
              </div>
              <p class="text-2xl font-bold text-[var(--royal-blue)]">
                ₦{{ Number(property.inspection_fee || 0).toLocaleString() }}
              </p>
            </div>

            <!-- Payment Success -->
            <div v-if="hasPaid" class="flex items-center gap-2 text-green-600 font-medium mb-4">
              <span class="text-xl">✓</span>
              <span>Payment Successful</span>
            </div>

            <!-- Pay Button -->
            <button
  v-else
  type="button"
  @click="payInspectionFee"
  :disabled="isPaying || isVerifying || !property.inspection_fee"
  class="w-full bg-[var(--bright-green)] hover:bg-green-600 disabled:bg-gray-400 text-white py-3.5 rounded-2xl font-semibold transition-all"
>
  <span v-if="isPaying">Opening Paystack...</span>
  <span v-else-if="isVerifying">Verifying Payment...</span>
  <span v-else>Pay Inspection Fee</span>
</button>

            <p v-if="!property.inspection_fee" class="mt-3 text-sm text-red-500">
              This property has no inspection fee set.
            </p>
          </div>

          <!-- Submit Button (only active after payment) -->
          <button
            type="submit"
            :disabled="isSubmitting || !hasPaid || !form.inspection_date || !form.inspection_time"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-3xl text-lg font-semibold transition-all mt-6"
          >
            {{ isSubmitting ? 'Submitting Request...' : 'Submit Inspection Request' }}
          </button>

          <p v-if="!hasPaid" class="text-center text-sm text-gray-500">
            Please complete the inspection fee payment to activate the submit button.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const route = useRoute()
const router = useRouter()

const property = ref(null)
const isSubmitting = ref(false)
const isPaying = ref(false)
const hasPaid = ref(false)
const paymentReference = ref('')
const isVerifying = ref(false)

const form = ref({
  inspection_date: '',
  inspection_time: '',
  message: ''
})

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
]

const today = new Date().toISOString().split('T')[0]

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

// ==================== VERIFY PAYMENT WITH BACKEND ====================
const verifyAndSavePayment = async (reference) => {
  isVerifying.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('No active session. Please login again.')
    }

    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-paystack-payment`

    console.log('Calling URL:', functionUrl)
    console.log('Reference:', reference)
    console.log('Property ID:', property.value.id)

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        reference: reference,
        property_id: property.value.id
      })
    })

    const responseText = await response.text()
    console.log('Status Code:', response.status)
    console.log('Raw Response:', responseText)

    if (!responseText) {
      throw new Error(`Empty response from server (Status: ${response.status})`)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON (Status ${response.status}): ${responseText}`)
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || result.error || 'Verification failed')
    }

    // Success
    paymentReference.value = reference
    hasPaid.value = true
    alert('✅ Payment successful and verified!')

  } catch (error) {
    console.error('Full error:', error)
    hasPaid.value = false
    alert('Payment verification failed: ' + error.message)
  } finally {
    isVerifying.value = false
    isPaying.value = false
  }
}
// ==================== PAYSTACK ====================
const payInspectionFee = async () => {
  if (!property.value?.inspection_fee || property.value.inspection_fee <= 0) {
    alert('No inspection fee set for this property')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Please login to pay')
    router.push('/login')
    return
  }

  if (!window.PaystackPop) {
    alert('Paystack failed to load. Please refresh the page.')
    return
  }

  isPaying.value = true

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: Number(property.value.inspection_fee) * 100, // kobo
    currency: 'NGN',
    ref: `insp_${property.value.id}_${Date.now()}`,
    metadata: {
      property_id: property.value.id,
      customer_id: user.id,
      type: 'inspection_fee'
    },
    callback: function (response) {          // ← Must be a normal function (not async)
      // We call an async function inside
      savePayment(response.reference, user.id)
    },
    onClose: function () {
      isPaying.value = false
      alert('Payment was cancelled')
    }
  })

  handler.openIframe()
}

// Separate async function to save the payment
const savePayment = async (reference, customerId) => {
  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        reference: reference,
        customer_id: customerId,
        property_id: property.value.id,
        amount: property.value.inspection_fee,
        currency: 'NGN',
        status: 'success',
        payment_type: 'inspection_fee',
        paid_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving payment:', error)
      alert('Payment was successful but failed to save. Please contact support with reference: ' + reference)
      isPaying.value = false
      return
    }

    // Success
    paymentReference.value = reference
    hasPaid.value = true
    alert('✅ Payment successful! You can now submit your inspection request.')
  } catch (err) {
    console.error(err)
    alert('Something went wrong while saving the payment.')
  } finally {
    isPaying.value = false
  }
}

const submitRequest = async () => {
  if (!hasPaid.value) {
    alert('Please pay the inspection fee first')
    return
  }

  if (!form.value.inspection_date || !form.value.inspection_time) {
    alert('Please select both date and time')
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
      inspection_time: form.value.inspection_time,
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