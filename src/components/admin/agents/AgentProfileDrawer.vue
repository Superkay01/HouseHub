<template>
  <Transition name="slide">
    <div v-if="visible" class="fixed inset-0 z-50 flex">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60" @click="$emit('close')"></div>

      <!-- Drawer -->
      <div class="relative ml-auto w-full max-w-3xl bg-white h-full shadow-2xl overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b z-10 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-[var(--royal-blue)]">Agent Profile</h2>
            <p class="text-medium-gray text-sm text-[var(--steel-blue)]">{{ agent.full_name }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="p-3 hover:bg-gray-100 rounded-2xl transition-colors font-extrabold text-[var(--steel-blue)]"
          >
            ✕
          </button>
        </div>

        <div class="p-8 space-y-12">
          <!-- Profile Header -->
          <div class="flex gap-6">
            <img 
              :src="agent.avatar_url || `https://ui-avatars.com/api/?name=${agent.full_name}`" 
              class="md:w-28 md:h-28 w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-lg"
            />
            <div class="flex-1 pt-2">
              <div class="flex items-center gap-3">
                <h1 class="md:text-3xl text-xl font-bold text-[var(--royal-blue)]">{{ agent.full_name }}</h1>
                <span :class="getStatusClass(agent.verification_status)" class="px-4 py-1 rounded-2xl text-sm font-medium">
                  {{ formatStatus(agent.verification_status) }}
                </span>
              </div>
              <p class="text-sm md:text-lg text-[var(--steel-blue)]">{{ agent.agency_name }}</p>
              <p class="text-sm md:text-lg text-[var(--steel-blue)] mt-1">{{ agent.state }} • {{ agent.city }}</p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-3xl p-5 text-center">
              <p class="text-3xl font-bold text-[var(--royal-blue)]">{{ agent.properties?.count || 0 }}</p>
              <p class="text-xs text-medium-gray mt-1">LISTINGS</p>
            </div>
            <div class="bg-gray-50 rounded-3xl p-5 text-center">
              <p class="text-3xl font-bold text-[var(--royal-blue)]">4.8</p>
              <p class="text-xs text-medium-gray mt-1">RATING</p>
            </div>
            <div class="bg-gray-50 rounded-3xl p-5 text-center">
              <p class="text-3xl font-bold text-emerald-600">87%</p>
              <p class="text-xs text-medium-gray mt-1">APPROVAL RATE</p>
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="font-semibold mb-4">Contact Information</h3>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">📞</div>
                <div>
                  <p class="text-sm text-[var(--steel-blue)]">Phone Number</p>
                  <p class="font-medium text-[var(--royal-blue)]">{{ agent.phone }}</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">@</div>
                <div>
                  <p class="text-sm text-[var(--steel-blue)]">Email Address</p>
                  <p class="font-medium text-[var(--royal-blue)]">{{ agent.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div>
            <h3 class="font-semibold mb-4 text-[var(--steel-blue)]">Verification Documents</h3>
            <div class="grid grid-cols-2 gap-4">
              <VerificationDocCard title="CAC Certificate" :verified="true" />
              <VerificationDocCard title="Government ID" :verified="true" />
              <VerificationDocCard title="Office Photo" :verified="false" />
              <VerificationDocCard title="Utility Bill" :verified="true" />
            </div>
          </div>

          <!-- Quick Actions -->
          <div>
            <h3 class="font-semibold mb-4 text-[var(--steel-blue)]">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              <button @click="approveAgent" class="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-medium">Approve Agent</button>
              <button @click="suspendAgent" class="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-medium">Suspend Agent</button>
              <button class="border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium text-[var(--royal-blue)]">Reset Password</button>
              <button class="border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium text-[var(--royal-blue)]">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  agent: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'refresh'])

const getStatusClass = (status) => {
  switch(status) {
    case 'verified': return 'bg-emerald-100 text-emerald-700'
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const formatStatus = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
}

const approveAgent = () => {
  alert("Agent approved successfully!")
  emit('refresh')
}

const suspendAgent = () => {
  if (confirm("Suspend this agent?")) {
    alert("Agent has been suspended.")
    emit('refresh')
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>