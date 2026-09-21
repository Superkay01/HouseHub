<template>
  <Navbar />

  <section class="min-h-screen relative overflow-hidden pb-16 md:pb-24"
           style="background: linear-gradient(135deg, #ebf8ff 0%, #f8fbff 100%);">
    <!-- Decorative Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-10 left-10 w-72 h-72 bg-[#ebf8ff] rounded-full blur-3xl opacity-60"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-[#697fe1] rounded-full blur-3xl opacity-20"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-[#546cdd] rounded-full blur-3xl opacity-10"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#0025cc] px-5 py-2 rounded-full text-sm font-medium mb-5 shadow-sm border border-[#0025cc]/10">
          <HelpCircle class="w-4 h-4" />
          <span>AGENT SUPPORT</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--royal-blue)] tracking-tight mb-4 heading-font">
          Help & Support
        </h1>
        <p class="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[var(--steel-blue)]">
          Find answers quickly or contact the LodgeNext support team. We're available Monday – Saturday.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Left Column – Contact -->
        <div class="space-y-5">
          <!-- Contact Card -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-2xl bg-[#ebf8ff] flex items-center justify-center text-[#0025cc]">
                <Headphones class="w-5 h-5" />
              </div>
              <h2 class="text-lg font-semibold text-[var(--royal-blue)]">Contact Us</h2>
            </div>

            <div class="space-y-2">
              <a href="mailto:support@lodgenext.com"
                 class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer group">
                <div class="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#ebf8ff] flex items-center justify-center text-[#0025cc] transition">
                  <Mail class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-medium text-[var(--royal-blue)]">Email</p>
                  <p class="text-sm text-[var(--steel-blue)]">support@lodgenext.com</p>
                </div>
              </a>

              <a href="tel:+2349030031328"
                 class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer group">
                <div class="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#ebf8ff] flex items-center justify-center text-[#0025cc] transition">
                  <Phone class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-medium text-[var(--royal-blue)]">Phone</p>
                  <p class="text-sm text-[var(--steel-blue)]">+234 903 003 1328</p>
                </div>
              </a>

              <a href="https://wa.me/2349030031328" target="_blank" rel="noopener noreferrer"
                 class="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer group">
                <div class="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#ebf8ff] flex items-center justify-center text-[#0025cc] transition">
                  <MessageCircle class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-medium text-[var(--royal-blue)]">WhatsApp</p>
                  <p class="text-sm text-[var(--steel-blue)]">Chat with support</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Support Hours -->
          <div class="bg-[#0025cc] rounded-3xl p-6 text-white shadow-lg shadow-[#0025cc]/20">
            <div class="flex items-center gap-3 mb-3">
              <Clock class="w-5 h-5 opacity-90" />
              <h2 class="text-lg font-semibold">Support Hours</h2>
            </div>
            <p class="text-sm text-white/90">Monday – Saturday</p>
            <p class="text-sm text-white/90">9:00 AM – 6:00 PM (WAT)</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- My Tickets (only when logged in) -->
          <div
            v-if="isLoggedIn"
            class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-[var(--royal-blue)]">My Support Tickets</h2>
              <button
                @click="fetchMyTickets"
                class="text-sm text-[#0025cc] hover:underline cursor-pointer font-medium"
              >
                Refresh
              </button>
            </div>

            <div v-if="loadingTickets" class="text-sm text-[var(--steel-blue)] py-10 text-center">
              Loading your tickets...
            </div>

            <div v-else-if="myTickets.length === 0" class="text-sm text-[var(--steel-blue)] py-10 text-center">
              You haven’t submitted any support tickets yet.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="ticket in myTickets"
                :key="ticket.id"
                class="border border-gray-100 rounded-2xl p-5 hover:border-[#697fe1]/40 hover:shadow-sm transition"
              >
                <div class="flex justify-between items-start gap-3">
                  <div class="min-w-0">
                    <p class="font-medium text-[var(--royal-blue)] line-clamp-1">
                      {{ ticket.subject }}
                    </p>
                    <p class="text-xs text-[var(--steel-blue)] mt-1 capitalize">
                      {{ ticket.category }} • {{ formatDate(ticket.created_at) }}
                    </p>
                  </div>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0"
                    :class="statusClass(ticket.status)"
                  >
                    {{ ticket.status?.replace('_', ' ') }}
                  </span>
                </div>

                <p class="text-sm text-[var(--steel-blue)] mt-3 line-clamp-2">
                  {{ ticket.message }}
                </p>

                <div
                  v-if="ticket.admin_notes"
                  class="mt-4 p-4 bg-[#ebf8ff] rounded-2xl"
                >
                  <p class="text-xs font-semibold text-[#0025cc] mb-1">Admin Response</p>
                  <p class="text-sm text-[var(--steel-blue)]">
                    {{ ticket.admin_notes }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ (always visible) -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 class="text-xl font-semibold text-[var(--royal-blue)] mb-6">
              Frequently Asked Questions
            </h2>

            <div class="space-y-3">
              <div
                v-for="(item, index) in faqs"
                :key="index"
                class="border border-gray-100 rounded-2xl overflow-hidden transition-all"
                :class="openFaq === index ? 'border-[#697fe1]/40 shadow-sm' : ''"
              >
                <button
                  type="button"
                  @click="toggleFaq(index)"
                  class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/80 cursor-pointer"
                >
                  <span class="text-sm sm:text-base font-medium text-[var(--royal-blue)]">
                    {{ item.q }}
                  </span>
                  <span
                    class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition"
                    :class="openFaq === index
                      ? 'bg-[#0025cc] text-white'
                      : 'bg-gray-100 text-[var(--steel-blue)]'"
                  >
                    {{ openFaq === index ? '−' : '+' }}
                  </span>
                </button>
                <div
                  v-if="openFaq === index"
                  class="px-5 pb-5 text-sm text-[var(--steel-blue)] leading-relaxed border-t border-gray-50"
                >
                  {{ item.a }}
                </div>
              </div>
            </div>
          </div>

          <!-- Support Form -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h2 class="text-xl font-semibold text-[var(--royal-blue)] mb-1">
              Send a Support Request
            </h2>
            <p class="text-sm text-[var(--steel-blue)] mb-6">
              Describe your issue and our team will get back to you as soon as possible.
            </p>

            <!-- Not logged in message -->
            <div
              v-if="!isLoggedIn"
              class="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-800 flex items-start gap-3"
            >
              <Info class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Please
                <router-link to="/login" class="font-semibold underline cursor-pointer">
                  log in
                </router-link>
                to submit a support ticket so we can track and reply to your request.
              </p>
            </div>

            <form @submit.prevent="submitSupport" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">
                  Category
                </label>
                <select
                  v-model="form.category"
                  required
                  :disabled="!isLoggedIn"
                  class="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:ring-2 focus:ring-[#0025cc]/20 focus:border-[#0025cc]
                    cursor-pointer disabled:opacity-60 bg-white"
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
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">
                  Subject
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  required
                  maxlength="120"
                  :disabled="!isLoggedIn"
                  class="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:ring-2 focus:ring-[#0025cc]/20 focus:border-[#0025cc]
                    disabled:opacity-60"
                  placeholder="Brief summary of your issue"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-[var(--steel-blue)] mb-2">
                  Message
                </label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  required
                  maxlength="1000"
                  :disabled="!isLoggedIn"
                  class="w-full px-4 py-3 text-sm rounded-2xl border border-gray-200
                    text-[var(--royal-blue)] focus:outline-none focus:ring-2 focus:ring-[#0025cc]/20 focus:border-[#0025cc]
                    resize-y disabled:opacity-60"
                  placeholder="Explain what happened and what you need help with..."
                ></textarea>
                <p class="text-xs text-[var(--steel-blue)] mt-1.5">{{ form.message.length }}/1000</p>
              </div>

              <button
                type="submit"
                :disabled="submitting || !isLoggedIn"
                class="w-full py-3.5 text-sm sm:text-base rounded-2xl bg-[#0025cc]
                  hover:bg-[#001a99] disabled:opacity-50 text-white font-semibold
                  transition-all duration-300 hover:shadow-lg hover:shadow-[#0025cc]/25
                  active:scale-[0.98] cursor-pointer"
              >
                {{ submitting ? 'Sending...' : 'Submit Request' }}
              </button>

              <p v-if="successMessage" class="text-sm text-green-600 font-medium">{{ successMessage }}</p>
              <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'
import {
  HelpCircle,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Info
} from 'lucide-vue-next'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const openFaq = ref(null)
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const myTickets = ref([])
const loadingTickets = ref(false)
const isLoggedIn = ref(false)
const currentUser = ref(null)

const form = ref({
  category: '',
  subject: '',
  message: '',
})

const faqs = [
  {
    q: 'How do I list a new property?',
    a: 'Go to Properties → Add New Property, fill in the details, upload photos, and submit for review. Once approved, it becomes visible to customers.',
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

const statusClass = (status) => {
  const map = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const fetchMyTickets = async () => {
  if (!currentUser.value) return

  loadingTickets.value = true
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', currentUser.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    myTickets.value = data || []
  } catch (err) {
    console.error('Failed to load tickets:', err)
  } finally {
    loadingTickets.value = false
  }
}

const submitSupport = async () => {
  if (!isLoggedIn.value || !currentUser.value) {
    errorMessage.value = 'Please log in to submit a support request.'
    return
  }

  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const payload = {
      user_id: currentUser.value.id,
      role: 'agent',
      category: form.value.category,
      subject: form.value.subject.trim(),
      message: form.value.message.trim(),
      status: 'open',
    }

    const { error } = await supabase
      .from('support_tickets')
      .insert(payload)

    if (error) throw error

    successMessage.value = 'Support request submitted successfully. Our team will respond soon.'
    form.value = { category: '', subject: '', message: '' }

    await fetchMyTickets()
  } catch (err) {
    console.error(err)
    errorMessage.value = err.message || 'Failed to submit support request'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    isLoggedIn.value = true
    currentUser.value = user
    await fetchMyTickets()
  }
})
</script>

<style scoped>
.heading-font {
  font-family: 'Playfair Display', sans-serif;
}
</style>