<template>
  <div v-if="verification" class="fixed inset-0 z-[100] bg-black/60 flex justify-end">
    <div class="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between z-10">
        <div>
          <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Verification Request</h2>
          <p class="text-medium-gray">{{ verification.full_name || verification.profiles?.full_name }}</p>
        </div>
        <button @click="$emit('close')" class="text-4xl text-gray-400 hover:text-black">×</button>
      </div>

      <div class="p-8 space-y-10">

        <!-- Agent Info -->
        <div class="flex gap-6">
          <img 
            :src="verification.avatar_url || 'https://via.placeholder.com/80'" 
            class="w-20 h-20 rounded-2xl object-cover border"
          />
          <div>
            <h3 class="text-2xl font-semibold">{{ verification.full_name || verification.profiles?.full_name }}</h3>
            <p class="text-medium-gray">{{ verification.agency_name }}</p>
            <p class="text-sm text-medium-gray">📍 {{ verification.city }}, {{ verification.state }}</p>
          </div>
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-medium-gray text-sm">Phone</p>
            <p class="font-medium">{{ verification.phone || verification.profiles?.phone }}</p>
          </div>
          <div>
            <p class="text-medium-gray text-sm">Email</p>
            <p class="font-medium">{{ verification.email || verification.profiles?.email }}</p>
          </div>
        </div>

        <!-- Documents -->
        <div>
          <h4 class="font-semibold mb-4 text-[var(--royal-blue)]">Documents</h4>
          <div class="space-y-4">
            <div v-if="verification.government_id_url" class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <span>Government ID</span>
              <a :href="verification.government_id_url" target="_blank" class="text-blue-600 hover:underline">View</a>
            </div>
            <div v-if="verification.passport_photo_url" class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <span>Passport Photo</span>
              <a :href="verification.passport_photo_url" target="_blank" class="text-blue-600 hover:underline">View</a>
            </div>
            <div v-if="verification.proof_of_address_url" class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
              <span>Proof of Address</span>
              <a :href="verification.proof_of_address_url" target="_blank" class="text-blue-600 hover:underline">View</a>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-6 border-t space-y-3">
          <button 
            @click="$emit('approve', verification.id)"
            class="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold">
            Approve Agent
          </button>
          <button 
            @click="$emit('reject', verification.id)"
            class="w-full py-4 bg-red-100 text-red-700 rounded-2xl font-semibold">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  verification: { type: Object, required: true }
})

defineEmits(['close', 'approve', 'reject'])
</script>