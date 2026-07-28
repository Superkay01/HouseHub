<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex justify-end bg-black/50">
    <div class="w-full max-w-lg bg-white h-full overflow-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-[var(--royal-blue)]">Customer Details</h2>
        <button @click="$emit('close')" class="text-3xl text-gray-400 hover:text-gray-600">×</button>
      </div>

      <div class="p-6">
        <!-- Profile -->
        <div class="flex flex-col items-center text-center mb-8">
          <img 
            :src="customer.avatar_url || '/default-avatar.png'" 
            class="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-md mb-4"
          >
          <h3 class="text-2xl font-semibold">{{ customer.full_name }}</h3>
          <p class="text-medium-gray">{{ customer.email }}</p>
        </div>

        <div class="space-y-6">
          <div>
            <p class="text-sm text-medium-gray mb-1">Phone Number</p>
            <p class="font-medium">{{ customer.phone }}</p>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-medium-gray mb-1">State</p>
              <p class="font-medium">{{ customer.state }}</p>
            </div>
            <div>
              <p class="text-sm text-medium-gray mb-1">City</p>
              <p class="font-medium">{{ customer.city }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm text-medium-gray mb-1">Joined</p>
            <p class="font-medium">{{ new Date(customer.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          </div>

          <div class="pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-[var(--royal-blue)]">{{ customer.property_requests || 0 }}</p>
              <p class="text-xs text-medium-gray">Saved Properties</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--royal-blue)]">{{ customer.inspections || 0 }}</p>
              <p class="text-xs text-medium-gray">Inspections</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-[var(--bright-green)]">Active</p>
              <p class="text-xs text-medium-gray">Status</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 border-t mt-auto">
        <button class="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium">
          Suspend Customer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  customer: { type: Object, required: true }
})

defineEmits(['close'])
</script>