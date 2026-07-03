<template>
  <div class="fixed inset-0 z-50 flex items-center justify-end bg-black/60">
    <div class="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-8 py-5 flex items-center justify-between z-10">
        <div>
          <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Property Details</h2>
          <p class="text-sm text-medium-gray">{{ property.title }}</p>
        </div>
        <button 
          @click="close"
          class="text-4xl leading-none text-medium-gray hover:text-black transition-colors">
          ×
        </button>
      </div>

      <div class="p-8 space-y-8">
        <!-- Cover Image -->
        <img 
          :src="property.cover_image || 'https://via.placeholder.com/800x400/0025cc/ffffff?text=No+Image'" 
          class="w-full h-80 object-cover rounded-3xl"
        />

        <!-- Basic Info -->
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold">{{ property.title }}</h1>
            <p class="text-xl text-medium-gray">{{ property.property_type }} • {{ property.purpose }}</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-[var(--royal-blue)]">₦{{ Number(property.price || 0).toLocaleString() }}</div>
            <div class="text-sm text-medium-gray">{{ property.rent_duration || 'per year' }}</div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <PropertyStatusBadge :status="property.status" />
        </div>

        <!-- Location -->
        <div>
          <h3 class="font-semibold mb-2">Location</h3>
          <p class="text-lg">📍 {{ property.address || property.area }}, {{ property.city }}, {{ property.state }}</p>
        </div>

        <!-- Description -->
        <div>
          <h3 class="font-semibold mb-2">Description</h3>
          <p class="text-medium-gray leading-relaxed">{{ property.description || 'No description provided.' }}</p>
        </div>

        <!-- Specs -->
        <div class="grid grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-medium-gray">Bedrooms</div>
            <div class="text-2xl font-semibold">{{ property.bedrooms || 0 }}</div>
          </div>
          <div>
            <div class="text-sm text-medium-gray">Bathrooms</div>
            <div class="text-2xl font-semibold">{{ property.bathrooms || 0 }}</div>
          </div>
          <div>
            <div class="text-sm text-medium-gray">Toilets</div>
            <div class="text-2xl font-semibold">{{ property.toilets || 0 }}</div>
          </div>
        </div>

        <!-- Amenities -->
        <div v-if="property.amenities && property.amenities.length">
          <h3 class="font-semibold mb-3">Amenities</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(amenity, i) in property.amenities" 
              :key="i"
              class="bg-gray-100 px-4 py-2 rounded-2xl text-sm"
            >
              {{ amenity }}
            </span>
          </div>
        </div>

        <!-- Agent Info -->
        <div v-if="property.profiles" class="bg-gray-50 rounded-3xl p-6">
          <h3 class="font-semibold mb-4">Listed by Agent</h3>
          <div class="flex items-center gap-4">
            <img 
              :src="property.profiles.avatar_url || `https://ui-avatars.com/api/?name=${property.profiles.full_name}`" 
              class="w-16 h-16 rounded-2xl"
            />
            <div>
              <div class="font-semibold">{{ property.profiles.full_name }}</div>
              <div v-if="property.profiles.is_verified" class="text-green-600 text-sm">✓ Verified Agent</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 bg-white border-t p-6 flex gap-4">
        <button 
          @click="close"
          class="flex-1 py-4 border border-gray-300 rounded-2xl font-medium">
          Close
        </button>
        <button 
          v-if="property.status !== 'approved'"
          @click="approve"
          class="flex-1 py-4 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700">
          Approve Property
        </button>
        <button 
          v-if="property.status !== 'rejected'"
          @click="reject"
          class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700">
          Reject Property
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import PropertyStatusBadge from './PropertyStatusBadge.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'approve', 'reject'])

const close = () => emit('close')

const approve = () => emit('approve', props.property.id)

const reject = () => emit('reject', props.property.id)
</script>