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

          <div>
            <label class="block text-sm font-medium mb-2">Message to Agent (Optional)</label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="I would like to inspect the property with my family..."
              class="w-full px-4 py-3 rounded-3xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] resize-y"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--medium-blue)] disabled:bg-gray-400 text-white py-4 rounded-3xl text-lg font-semibold transition-all mt-6"
          >
            {{ isSubmitting ? 'Submitting Request...' : 'Submit Inspection Request' }}
          </button>
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
    console.log('✅ Property loaded:', property.value)
  } catch (error) {
    console.error('Error fetching property:', error)
    alert('Failed to load property details. Please try again.')
    router.back()
  }
}

const submitRequest = async () => {
  if (!form.value.inspection_date || !form.value.inspection_time) {
    alert("Please select both date and time")
    return
  }

  isSubmitting.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Please login to submit a request")
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('property_requests')
      .insert({
        customer_id: user.id,
        property_id: route.params.id,
        agent_id: property.value.agent_id,
        request_type: 'inspection',
        inspection_date: form.value.inspection_date,
        inspection_time: form.value.inspection_time,
        message: form.value.message
      })

    if (error) throw error

    alert("✅ Inspection request submitted successfully!")
    router.push('/customer/request')

  } catch (error) {
    console.error(error)
    alert(error.message || "Failed to submit request. Please try again.")
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchProperty)
</script>