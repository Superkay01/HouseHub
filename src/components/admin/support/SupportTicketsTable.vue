<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50 text-left">
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">Ticket</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">User</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">Role</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">Category</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">Status</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)]">Date</th>
            <th class="py-4 px-5 text-xs lg:text-sm font-medium text-[var(--steel-blue)] text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ticket in tickets"
            :key="ticket.id"
            class="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
          >
            <td class="py-4 px-5">
              <p class="font-medium text-sm text-[var(--royal-blue)] line-clamp-1">
                {{ ticket.subject }}
              </p>
              <p class="text-xs text-[var(--steel-blue)] mt-0.5 line-clamp-1">
                {{ ticket.message }}
              </p>
            </td>

            <td class="py-4 px-5">
              <p class="text-sm font-medium text-[var(--royal-blue)]">
                {{ ticket.user?.full_name || 'Unknown' }}
              </p>
              <p class="text-xs text-[var(--steel-blue)]">
                {{ ticket.user?.email }}
              </p>
            </td>

            <td class="py-4 px-5">
              <span
                class="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                :class="ticket.role === 'agent' 
                  ? 'bg-blue-50 text-[var(--royal-blue)]' 
                  : 'bg-purple-50 text-purple-700'"
              >
                {{ ticket.role }}
              </span>
            </td>

            <td class="py-4 px-5">
              <span class="text-sm text-[var(--steel-blue)] capitalize">
                {{ ticket.category }}
              </span>
            </td>

            <td class="py-4 px-5">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                :class="statusClass(ticket.status)"
              >
                {{ ticket.status?.replace('_', ' ') }}
              </span>
            </td>

            <td class="py-4 px-5 text-sm text-[var(--steel-blue)]">
              {{ formatDate(ticket.created_at) }}
            </td>

            <td class="py-4 px-5 text-right">
              <button
                @click="$emit('view', ticket)"
                class="px-4 py-2 text-sm font-medium rounded-xl
                       bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]
                       hover:bg-[var(--royal-blue)] hover:text-white transition-colors"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-4 p-4">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="border border-gray-100 rounded-2xl p-4"
      >
        <div class="flex justify-between items-start gap-3 mb-3">
          <div class="min-w-0">
            <p class="font-semibold text-sm text-[var(--royal-blue)] line-clamp-1">
              {{ ticket.subject }}
            </p>
            <p class="text-xs text-[var(--steel-blue)] mt-0.5">
              {{ ticket.user?.full_name }} • {{ ticket.role }}
            </p>
          </div>
          <span
            class="px-2.5 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0"
            :class="statusClass(ticket.status)"
          >
            {{ ticket.status?.replace('_', ' ') }}
          </span>
        </div>

        <p class="text-xs text-[var(--steel-blue)] line-clamp-2 mb-3">
          {{ ticket.message }}
        </p>

        <div class="flex justify-between items-center">
          <span class="text-xs text-[var(--steel-blue)]">
            {{ formatDate(ticket.created_at) }}
          </span>
          <button
            @click="$emit('view', ticket)"
            class="px-4 py-2 text-xs font-medium rounded-xl
                   bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]"
          >
            View
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && tickets.length === 0"
      class="text-center py-16 sm:py-20"
    >
      <p class="text-base sm:text-lg font-medium text-[var(--royal-blue)]">
        No tickets found
      </p>
      <p class="mt-2 text-sm text-[var(--steel-blue)]">
        There are currently no support tickets matching your filters.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tickets: { type: Array, default: () => [] },
  loading: Boolean
})

defineEmits(['view'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const statusClass = (status) => {
  const map = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}
</script>