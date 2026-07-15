<template>
  <div class="min-h-screen bg-[var(--light-blue)] py-10">
    <div class="max-w-2xl mx-auto px-6">
      <!-- Back Button -->
      <button 
        @click="$router.back()"
        class="flex items-center gap-2 text-medium-gray hover:text-[var(--royal-blue)] mb-8 transition">
        ← Back to Property
      </button>

      <div class="bg-white rounded-3xl shadow-sm p-8 md:p-10">
        <h1 class="text-4xl font-bold text-[var(--royal-blue)] mb-2">Request Property Inspection</h1>
        <p class="text-[var(--royal-blue)] mb-8">Schedule an inspection for this property</p>

        <!-- Property Summary -->
        <div v-if="property" class="bg-gray-50 p-5 rounded-2xl mb-8 flex gap-4">
          <img 
            :src="property.cover_image || 'https://via.placeholder.com/300x200'" 
            class="w-24 h-24 object-cover rounded-2xl"
          />
          <div>
            <h3 class="font-semibold text-lg">{{ property.title }}</h3>
            <p class="text-medium-gray text-sm">📍 {{ property.area }}, {{ property.city }}</p>
            <p class="text-[var(--bright-green)] font-medium mt-1">
              ₦{{ Number(property.price).toLocaleString() }} / year
            </p>
          </div>
        </div>

        <form @submit.prevent="submitRequest" class="space-y-6">
          <!-- Inspection Date -->
          <div>
            <label class="block text-sm font-medium text-medium-gray mb-2">
              Preferred Inspection Date & Time <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="form.inspectionDate"
              type="datetime-local"
              class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--royal-blue)]"
              required
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-[var(--royal-blue)] mb-2">Additional Notes</label>
            <textarea 
              v-model="form.notes"
              rows="5"
              class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-[var(--royal-blue)]"
              placeholder="Special instructions, time preferences, etc."
            ></textarea>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-[var(--royal-blue)] hover:bg-[var(--mediumBlue)] disabled:bg-gray-400 text-white font-medium py-4 rounded-3xl transition-all text-lg">
            {{ loading ? 'Submitting Request...' : 'Submit Inspection Request' }}
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

const propertyId = route.params.id
const loading = ref(false)
const property = ref(null)

const form = ref({
  inspectionDate: '',
  notes: ''
})

onMounted(async () => {
  if (!propertyId) {
    router.push('/properties')
    return
  }

  // Fetch property details
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, 
      title, 
      cover_image, 
      area, 
      city, 
      price,
      bedrooms,
      bathrooms
    `)
    .eq('id', propertyId)
    .single()

  if (error) {
    console.error("Failed to load property:", error)
    alert("Property not found")
    router.push('/properties')
  } else {
    property.value = data
  }
})

const submitRequest = async () => {
  if (!form.value.inspectionDate) {
    alert("Please select an inspection date")
    return
  }

  loading.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('property_requests')
      .insert({
        customer_id: user?.id,
        property_id: propertyId,
        inspection_date: form.value.inspectionDate,
        status: 'pending',
        notes: form.value.notes || null
      })

    if (error) throw error

    alert("✅ Inspection request submitted successfully!")
    router.push('/my-inspections')

  } catch (err) {
    console.error(err)
    alert("Failed to submit inspection request. Please try again.")
  } finally {
    loading.value = false
  }
}
</script>