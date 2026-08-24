<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-12 md:pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--royal-blue)]">
          Help & Support
        </h1>
        <p class="text-sm sm:text-base text-[var(--steel-blue)] mt-1">
          Get answers or contact the LodgeNext support team
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <!-- Contact cards -->
        <div class="space-y-4">
          <!-- Ilorin -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Ilorin Support
            </h2>
            <div class="space-y-3 text-sm">
              <a
                href="tel:09030031328"
                class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">📞</span>
                <div>
                  <p class="font-medium text-gray-900">Phone</p>
                  <p class="text-gray-500">0903 003 1328</p>
                </div>
              </a>
              <a
                href="https://wa.me/2349030031328"
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">💬</span>
                <div>
                  <p class="font-medium text-gray-900">WhatsApp</p>
                  <p class="text-gray-500">Chat with Ilorin support</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Ijebu Ode -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Ijebu Ode Support
            </h2>
            <div class="space-y-3 text-sm">
              <a
                href="tel:07059537201"
                class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">📞</span>
                <div>
                  <p class="font-medium text-gray-900">Phone</p>
                  <p class="text-gray-500">0705 953 7201</p>
                </div>
              </a>
              <a
                href="https://wa.me/2347059537201"
                target="_blank"
                class="flex items-center gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">💬</span>
                <div>
                  <p class="font-medium text-gray-900">WhatsApp</p>
                  <p class="text-gray-500">Chat with Ijebu Ode support</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Email -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-3">
              Email Support
            </h2>
            <div class="space-y-3 text-sm">
              <a
                href="mailto:adegbesanoluwakayode52@gmail.com"
                class="flex items-start gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">📧</span>
                <div class="min-w-0">
                  <p class="font-medium text-gray-900">Primary</p>
                  <p class="text-gray-500 break-all">adegbesanoluwakayode52@gmail.com</p>
                </div>
              </a>
              <a
                href="mailto:adegbesansamuel9@gmail.com"
                class="flex items-start gap-3 p-3 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition"
              >
                <span class="text-lg">📧</span>
                <div class="min-w-0">
                  <p class="font-medium text-gray-900">Secondary</p>
                  <p class="text-gray-500 break-all">adegbesansamuel9@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-2">
              Support Hours
            </h2>
            <p class="text-sm text-gray-600">Monday – Saturday</p>
            <p class="text-sm text-gray-600">9:00 AM – 6:00 PM (WAT)</p>
          </div>
        </div>

        <!-- FAQ + Form -->
        <div class="lg:col-span-2 space-y-5 sm:space-y-6">
          <!-- FAQ -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-4">
              Frequently Asked Questions
            </h2>

            <div class="space-y-3">
              <div
                v-for="(item, index) in faqs"
                :key="index"
                class="border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <span class="text-sm font-medium text-gray-900">{{ item.q }}</span>
                  <span class="text-gray-400 text-base">{{ openFaq === index ? '−' : '+' }}</span>
                </button>
                <div v-if="openFaq === index" class="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {{ item.a }}
                </div>
              </div>
            </div>
          </div>

          <!-- Support form -->
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 class="text-base sm:text-lg font-semibold text-[var(--royal-blue)] mb-1">
              Send a Support Request
            </h2>
            <p class="text-sm text-gray-500 mb-5">
              Tell us what you need help with and we will respond as soon as possible
            </p>

            <form @submit.prevent="submitSupport" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                >
                  <option value="">Select category</option>
                  <option value="account">Account / Profile</option>
                  <option value="property">Property Search</option>
                  <option value="inspection">Inspection Request</option>
                  <option value="payment">Payment</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Preferred Location</label>
                <select
                  v-model="form.location"
                  required
                  class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                >
                  <option value="">Select location</option>
                  <option value="Ilorin">Ilorin</option>
                  <option value="Ijebu Ode">Ijebu Ode</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  maxlength="120"
                  class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)]"
                  placeholder="Brief summary of your issue"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  maxlength="1000"
                  class="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:border-[var(--royal-blue)] resize-y"
                  placeholder="Describe your issue in detail..."
                ></textarea>
                <p class="text-xs text-gray-400 mt-1">{{ form.message.length }}/1000</p>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="w-full py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-[var(--royal-blue)] hover:bg-[#001fa3]
                  disabled:bg-gray-400 text-white font-semibold transition"
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

const form = ref({
  category: '',
  location: '',
  subject: '',
  message: '',
})

const faqs = [
  {
    q: 'How do I request a property inspection?',
    a: 'Open a property listing, click Request Inspection, choose your preferred date and time, pay the inspection fee if required, then submit.',
  },
  {
    q: 'How long does it take to confirm an inspection?',
    a: 'Once your request is submitted, an agent reviews it. You will receive a notification when it is accepted, scheduled, or updated.',
  },
  {
    q: 'Can I cancel or reschedule an inspection?',
    a: 'Yes. Go to My Requests or My Inspections and open the item to cancel or respond to a reschedule proposal, depending on the current status.',
  },
  {
    q: 'Where can I see my payments?',
    a: 'Go to Activity History to view your requests, inspections, and payment records in one place.',
  },
  {
    q: 'I paid but my request is still pending',
    a: 'Payment confirmation can take a short time. Refresh the page or check Activity History. If it remains pending, contact support with your payment reference.',
  },
  {
    q: 'I am not receiving notifications',
    a: 'Open Settings and ensure notification sound and preferences are enabled. Also confirm you are logged in with a stable internet connection.',
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

    const { error } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      role: 'customer',
      category: form.value.category,
      subject: `[${form.value.location}] ${form.value.subject.trim()}`,
      message: form.value.message.trim(),
      status: 'open',
    })

    if (error) throw error

    successMessage.value = 'Support request submitted successfully. Our team will respond soon.'
    form.value = { category: '', location: '', subject: '', message: '' }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to submit support request'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) router.push('/login')
})
</script>