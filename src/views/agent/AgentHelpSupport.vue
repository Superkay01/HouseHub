<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
    <div class="max-w-4xl mx-auto px-4 pt-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Help & Support</h1>
        <p class="text-[var(--steel-blue)] mt-1">
          Find answers quickly or contact the LodgeNext support team
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Quick contacts -->
        <div class="space-y-4">
          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="font-semibold text-[var(--royal-blue)] mb-3">Contact Us</h2>

            <div class="space-y-3 text-sm">
              <a
                href="mailto:support@lodgenext.com"
                class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-xl">📧</span>
                <div>
                  <p class="font-medium text-[var(--royal-blue)]">Email</p>
                  <p class="text-[var(--steel-blue)]">support@lodgenext.com</p>
                </div>
              </a>

              <a
                href="tel:+2349030031328"
                class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-xl">📞</span>
                <div>
                  <p class="font-medium text-[var(--royal-blue)]">Phone</p>
                  <p class="text-[var(--steel-blue)]">+234 903 003 1328</p>
                </div>
              </a>

              <a
                href="https://wa.me/2349030031328"
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-xl text-[var(--bright-green)]">💬</span>
                <div>
                  <p class="font-medium text-[var(--bright-green)]">WhatsApp</p>
                  <p class="text-[var(--bright-green)]">Chat with support</p>
                </div>
              </a>
            </div>
          </div>

          <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="font-semibold text-[var(--royal-blue)] mb-2">Support Hours</h2>
            <p class="md:text-sm text-xs text-[var(--steel-blue)]">Monday – Saturday</p>
            <p class="md:text-sm text-xs text-[var(--steel-blue)]">9:00 AM – 6:00 PM (WAT)</p>
          </div>
        </div>

        <!-- Right: FAQ + Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- FAQ -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Frequently Asked Questions
            </h2>

            <div class="space-y-3">
              <div
                v-for="(item, index) in faqs"
                :key="index"
                class="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <span class="font-medium text-[var(--royal-blue)] text-sm">{{ item.q }}</span>
                  <span class="text-gray-400">{{ openFaq === index ? '−' : '+' }}</span>
                </button>
                <div v-if="openFaq === index" class="px-4 pb-4 text-sm text-[var(--steel-blue)]">
                  {{ item.a }}
                </div>
              </div>
            </div>
          </div>

          <!-- Support Form -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-[var(--royal-blue)] mb-1">
              Send a Support Request
            </h2>
            <p class="text-sm text-[var(--steel-blue)] mb-5">
              Describe your issue and our team will get back to you
            </p>

            <form @submit.prevent="submitSupport" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Category</label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
                >
                  <option value="">Select category</option>
                  <option value="account">Account / Profile</option>
                  <option value="property">Property Listing</option>
                  <option value="inspection">Inspection / Request</option>
                  <option value="payment">Payment / Payout</option>
                  <option value="verification">Agent Verification</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Subject</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  maxlength="120"
                  class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)]"
                  placeholder="Brief summary of your issue"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">Message</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  maxlength="1000"
                  class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-[var(--royal-blue)] text-[var(--royal-blue)] resize-y"
                  placeholder="Explain what happened and what you need help with..."
                ></textarea>
                <p class="text-xs text-[var(--steel-blue)] mt-1">{{ form.message.length }}/1000</p>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="w-full py-3.5 rounded-2xl bg-[var(--royal-blue)] hover:bg-[#001fa3] disabled:bg-gray-400 text-white font-semibold transition"
              >
                {{ submitting ? 'Sending...' : 'Submit Request' }}
              </button>

              <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
              <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const router = useRouter()

const openFaq = ref(null)
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const agentId = ref(null)

const form = ref({
  category: '',
  subject: '',
  message: '',
})

const faqs = [
  {
    q: 'How do I list a new property?',
    a: 'Go to Properties - Add New Property, fill in the details, upload photos, and submit for review. Once approved, it becomes visible to customers.',
  },
  {
    q: 'Why is my property still pending?',
    a: 'New listings are reviewed by the admin team. This usually takes a short time. You will get a notification when it is approved or rejected.',
  },
  {
    q: 'How do inspection requests work?',
    a: 'When a customer requests an inspection on your property, you will receive a notification. You can accept, decline, or propose a new time from your Requests/Inspections page.',
  },
  {
    q: 'When do I receive inspection fees?',
    a: 'Inspection fee payments are processed according to LodgeNext payout rules. Check your payment/payout section or contact support for settlement timelines.',
  },
  {
    q: 'How do I complete agent verification?',
    a: 'Open Verification in your agent dashboard, upload the required documents, and submit. Admin will review and notify you of approval or rejection.',
  },
  {
    q: 'I am not receiving notifications',
    a: 'Go to Settings and confirm Notification Sound and preferences are enabled. Also ensure you are logged in on this device and have a stable internet connection.',
  },
]

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const submitSupport = async () => {
  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const payload = {
      user_id: user.id,
      role: 'agent',
      category: form.value.category,
      subject: form.value.subject.trim(),
      message: form.value.message.trim(),
      status: 'open',
    }

    // Requires support_tickets table (SQL below)
    const { error } = await supabase
      .from('support_tickets')
      .insert(payload)

    if (error) throw error

    successMessage.value = 'Support request submitted successfully. Our team will respond soon.'
    form.value = { category: '', subject: '', message: '' }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to submit support request'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }
  agentId.value = user.id
})
</script>