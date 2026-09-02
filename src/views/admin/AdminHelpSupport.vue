<template>
  <div class="min-h-screen bg-gray-50 pb-12 md:pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          Help & Support
        </h1>
        <p class="text-sm sm:text-base text-gray-500 mt-1">
          Internal contacts and guidance for administrators
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div class="space-y-4">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Ilorin Desk
            </h2>
            <div class="space-y-3 text-sm">
              <a href="tel:09030031328" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>📞</span>
                <div>
                  <p class="font-medium text-[var(--steel-blue)]">Phone</p>
                  <p class="text-[var(--steel-blue)]">0903 003 1328</p>
                </div>
              </a>
              <a href="https://wa.me/2349030031328" target="_blank" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>💬</span>
                <div>
                  <p class="font-medium text-[var(--royal-blue)]">WhatsApp</p>
                  <p class="text-[var(--steel-blue)]">Ilorin support line</p>
                </div>
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Ijebu Ode Desk
            </h2>
            <div class="space-y-3 text-sm">
              <a href="tel:07059537201" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>📞</span>
                <div>
                  <p class="font-medium text-[var(--steel-blue)]">Phone</p>
                  <p class="text-[var(--steel-blue)]">0705 953 7201</p>
                </div>
              </a>
              <a href="https://wa.me/2347059537201" target="_blank" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>💬</span>
                <div>
                  <p class="font-medium text-[var(--royal-blue)]">WhatsApp</p>
                  <p class="text-[var(--steel-blue)]">Ijebu Ode support line</p>
                </div>
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Email
            </h2>
            <div class="space-y-3 text-sm">
              <a href="mailto:adegbesanoluwakayode52@gmail.com" class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>📧</span>
                <div class="min-w-0">
                  <p class="font-medium text-[var(--royal-blue)]">Primary</p>
                  <p class="text-[var(--steel-blue)] break-all">adegbesanoluwakayode52@gmail.com</p>
                </div>
              </a>
              <a href="mailto:salamilukman100@gmail.com" class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50">
                <span>📧</span>
                <div class="min-w-0">
                  <p class="font-medium text-[var(--royal-blue)]">Secondary</p>
                  <p class="text-[var(--steel-blue)] break-all">salamilukman100@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Admin Guidelines
            </h2>
            <div class="space-y-3">
              <div
                v-for="(item, index) in guidelines"
                :key="index"
                class="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  @click="openIndex = openIndex === index ? null : index"
                  class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <span class="text-sm font-medium text-[var(--steel-blue)]">{{ item.q }}</span>
                  <span class="text-gray-400">{{ openIndex === index ? '−' : '+' }}</span>
                </button>
                <div v-if="openIndex === index" class="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {{ item.a }}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-2">
              Operational Notes
            </h2>
            <ul class="list-disc pl-5 space-y-2 text-sm text-[var(--steel-blue)]">
              <li>Review property listings before approval.</li>
              <li>Monitor pending inspection requests daily.</li>
              <li>Verify agent documents carefully before approval.</li>
              <li>Escalate payment disputes with reference numbers.</li>
              <li>Keep customer and agent communication professional.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const guidelines = [
  {
    q: 'How should pending properties be reviewed?',
    a: 'Check photos, pricing, location accuracy, and description quality before approving or rejecting a listing.',
  },
  {
    q: 'What if an inspection payment is delayed?',
    a: 'Confirm the Paystack reference, verify the payments table status, then update the related request if payment is confirmed.',
  },
  {
    q: 'How are state admins expected to work?',
    a: 'State admins should focus on activity within their assigned state and escalate cross-state issues to a super admin.',
  },
  {
    q: 'How do I handle support tickets?',
    a: 'Respond promptly, mark tickets in progress, and close them only after the issue is resolved and documented.',
  },
]
</script>