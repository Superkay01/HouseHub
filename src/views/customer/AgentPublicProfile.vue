<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
    <div class="max-w-4xl mx-auto px-4 pt-8">
      <button
        @click="$router.back()"
        class="text-sm text-[var(--royal-blue)] hover:underline mb-6"
      >
        ← Back
      </button>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadAgent" class="px-5 py-2.5 bg-[var(--royal-blue)] text-white rounded-xl">
          Try Again
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Agent Header -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <img
              :src="agent.avatar_url || 'https://via.placeholder.com/80'"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border"
            />
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)]">
                  {{ agent.full_name }}
                </h1>
                <span
                  v-if="agent.verified"
                  class="text-xs px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-medium"
                >
                  ✓ Verified
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                {{ agent.agency_name || 'Property Agent' }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                📍 {{ [agent.city, agent.state].filter(Boolean).join(', ') || 'Nigeria' }}
              </p>

              <div class="flex flex-wrap gap-4 mt-4 text-sm">
                <div>
                  <span class="font-bold text-[var(--royal-blue)]">{{ averageRating }}</span>
                  <span class="text-gray-500"> / 5 rating</span>
                </div>
                <div>
                  <span class="font-bold text-[var(--royal-blue)]">{{ reviews.length }}</span>
                  <span class="text-gray-500"> reviews</span>
                </div>
              </div>
            </div>
          </div>

          <p v-if="agent.bio" class="text-sm text-gray-600 mt-5 leading-relaxed">
            {{ agent.bio }}
          </p>
        </div>

        <!-- Reviews -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-[var(--royal-blue)] mb-4">
            Customer Reviews
          </h2>

          <div v-if="reviews.length === 0" class="text-center py-10 text-gray-500 text-sm">
            No reviews yet for this agent
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in reviews"
              :key="item.id"
              class="border border-gray-100 rounded-2xl p-4"
            >
              <div class="flex items-center justify-between gap-3 mb-2">
                <div class="flex items-center gap-1 text-amber-500 text-sm">
                  <span v-for="n in 5" :key="n">{{ n <= item.rating ? '★' : '☆' }}</span>
                  <span class="text-gray-700 font-medium ml-1">{{ item.rating }}/5</span>
                </div>
                <span class="text-xs text-gray-400">
                  {{ formatDate(item.created_at) }}
                </span>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed">
                {{ item.review || 'No written review provided.' }}
              </p>

              <div class="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                <span v-if="item.punctuality_rating">
                  Punctuality: {{ item.punctuality_rating }}/5
                </span>
                <span v-if="item.professionalism_rating">
                  Professionalism: {{ item.professionalism_rating }}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const agent = ref({})
const reviews = ref([])

const averageRating = computed(() => {
  if (!reviews.value.length) return '0.0'
  const total = reviews.value.reduce((sum, r) => sum + Number(r.rating || 0), 0)
  return (total / reviews.value.length).toFixed(1)
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const loadAgent = async () => {
  loading.value = true
  error.value = ''

  try {
    const agentId = route.params.id

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, agency_name, bio, verified, state, city, role')
      .eq('id', agentId)
      .eq('role', 'agent')
      .single()

    if (profileError) throw profileError
    agent.value = profile

    const { data: reviewData, error: reviewError } = await supabase
      .from('agent_reviews')
      .select('*')
      .eq('agent_id', agentId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (reviewError) throw reviewError
    reviews.value = reviewData || []
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load agent profile'
  } finally {
    loading.value = false
  }
}

onMounted(loadAgent)
</script>