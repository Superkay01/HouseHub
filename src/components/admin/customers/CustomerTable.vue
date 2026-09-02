<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">Customer</th>
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">Contact</th>
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">City</th>
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">Joined</th>
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">Requests</th>
          <th class="text-left py-5 px-6 font-medium text-[var(--royal-blue)]">Status</th>
          <th class="w-32"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id" 
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="py-5 px-6">
            <div class="flex items-center gap-4">
              <img 
                :src="customer.avatar_url || '/default-avatar.png'" 
                class="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                alt="Profile"
              >
              <div>
                <p class="font-semibold text-[var(--royal-blue)] text-sm md:text-[15px]">{{ customer.full_name }}</p>
                <p class="text-sm text-[var(--steel-blue)] text-sm md:text-[15px]">{{ customer.email }}</p>
              </div>
            </div>
          </td>
          <td class="py-5 px-6">
            <p class="font-medium text-[var(--steel-blue)] text-sm md:text-[15px]">{{ customer.phone }}</p>
          </td>
          <td class="py-5 px-6 text-[var(--steel-blue)] text-sm md:text-[15px]">{{ customer.city || '—' }}</td>
          <td class="py-5 px-6 text-[var(--steel-blue)] text-sm md:text-[15px]">
            {{ new Date(customer.created_at).toLocaleDateString() }}
          </td>
          <td class="py-5 px-6">
            <span class="font-semibold text-[var(--royal-blue)]">{{ customer.property_requests || 0 }}</span>
          </td>
          <td class="py-5 px-6">
            <span :class="[
              'px-4 py-1.5 rounded-2xl text-xs font-medium',
              customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            ]">
              {{ customer.status || 'Active' }}
            </span>
          </td>
          <td class="py-5 px-6 text-right">
            <button 
              @click="$emit('view', customer)"
              class="text-[var(--royal-blue)] hover:bg-[var(--hover-blue)] text-sm md:text-[15px]  px-5 py-2 rounded-2xl transition-all">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="customers.length === 0" class="text-center py-20 text-medium-gray">
      No customers found in your state.
    </div>
  </div>
</template>

<script setup>
defineProps({
  customers: { type: Array, default: () => [] }
})

defineEmits(['view'])
</script>