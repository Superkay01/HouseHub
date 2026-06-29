<template>
  <div class="space-y-10">
    <h2 class="text-2xl font-semibold text-[#0025cc]">Review Your Property Listing</h2>

    <!-- Property Summary -->
    <div class="bg-gray-50 rounded-3xl p-8">
      <!-- Main Info -->
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Cover Image -->
        <div v-if="form.cover_image" class="md:w-80 flex-shrink-0">
          <img 
            :src="form.cover_image" 
            class="w-full h-64 object-cover rounded-2xl shadow-md"
          />
          <p class="text-xs text-gray-500 mt-2 text-center">Cover Image</p>
        </div>

        <!-- Details -->
        <div class="flex-1 space-y-6">
          <div>
            <h3 class="text-2xl font-bold">{{ form.title || 'Untitled Property' }}</h3>
            <p class="text-[#546cdd] mt-1">
              {{ form.property_type }} • {{ form.purpose }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <span class="text-gray-500">Location:</span><br>
              <strong>{{ form.area }}, {{ form.city }}, {{ form.state }}</strong>
            </div>
            <div>
              <span class="text-gray-500">Full Address:</span><br>
              <strong>{{ form.address || 'Not provided' }}</strong>
            </div>
            <div>
              <span class="text-gray-500">Price:</span><br>
              <strong class="text-2xl text-green-600">₦{{ form.price?.toLocaleString() || '0' }}</strong>
              <span class="text-sm text-gray-500">/ year</span>
            </div>
            <div>
              <span class="text-gray-500">Service Charge:</span><br>
              <strong>₦{{ form.service_charge?.toLocaleString() || '0' }}</strong>
            </div>
          </div>

          <div>
            <span class="text-gray-500 block mb-1">Key Features</span>
            <div class="flex flex-wrap gap-2">
              <span v-if="form.bedrooms" class="bg-white px-4 py-2 rounded-2xl text-sm">
                🛏️ {{ form.bedrooms }} Bedroom{{ form.bedrooms > 1 ? 's' : '' }}
              </span>
              <span v-if="form.bathrooms" class="bg-white px-4 py-2 rounded-2xl text-sm">
                🛁 {{ form.bathrooms }} Bathroom{{ form.bathrooms > 1 ? 's' : '' }}
              </span>
              <span v-if="form.toilets" class="bg-white px-4 py-2 rounded-2xl text-sm">
                🚽 {{ form.toilets }} Toilet{{ form.toilets > 1 ? 's' : '' }}
              </span>
              <span v-if="form.parking_spaces" class="bg-white px-4 py-2 rounded-2xl text-sm">
                🅿️ {{ form.parking_spaces }} Parking
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Amenities -->
      <div v-if="form.amenities && form.amenities.length" class="mt-8 pt-8 border-t">
        <h4 class="font-semibold mb-3">Amenities</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="amenity in form.amenities" 
            :key="amenity"
            class="bg-white px-5 py-2 rounded-2xl text-sm border"
          >
            ✅ {{ amenity }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="form.description" class="mt-8 pt-8 border-t">
        <h4 class="font-semibold mb-3">Description</h4>
        <p class="leading-relaxed text-gray-700 whitespace-pre-wrap">
          {{ form.description }}
        </p>
      </div>
    </div>

    <!-- Status & Tips -->
    <div class="bg-blue-50 border border-blue-100 rounded-3xl p-6">
      <div class="flex items-start gap-4">
        <div class="text-3xl">ℹ️</div>
        <div>
          <p class="font-medium text-[#0025cc]">Your property will be reviewed by our admin team.</p>
          <p class="text-sm text-gray-600 mt-1">
            Once approved, it will be visible to potential tenants. This usually takes 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: any
}>()
</script>