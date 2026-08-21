<template>
  <div class="min-h-screen bg-[var(--light-blue)] p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Reviews & Ratings</h1>
          <p class="text-medium-gray mt-1">
            Manage customer reviews. Only published reviews will appear publicly.
          </p>
        </div>
        <button
          @click="fetchReviews"
          class="px-5 py-3 bg-[var(--royal-blue)] text-white rounded-2xl font-medium hover:bg-[var(--medium-blue)]"
        >
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <div class="bg-white p-5 rounded-3xl shadow-sm">
          <p class="text-sm text-medium-gray">Total Reviews</p>
          <p class="text-3xl font-bold text-[var(--royal-blue)]">{{ reviews.length }}</p>
        </div>
        <div class="bg-white p-5 rounded-3xl shadow-sm">
          <p class="text-sm text-medium-gray">Published</p>
          <p class="text-3xl font-bold text-green-600">{{ publishedCount }}</p>
        </div>
        <div class="bg-white p-5 rounded-3xl shadow-sm">
          <p class="text-sm text-medium-gray">Pending</p>
          <p class="text-3xl font-bold text-amber-600">{{ pendingCount }}</p>
        </div>
        <div class="bg-white p-5 rounded-3xl shadow-sm">
          <p class="text-sm text-medium-gray">Average Rating</p>
          <p class="text-3xl font-bold text-yellow-500">
            {{ averageRating }} ★
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-3 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="filter = tab.value"
          :class="[
            'px-4 py-2.5 rounded-2xl text-sm font-medium transition',
            filter === tab.value
              ? 'bg-[var(--royal-blue)] text-white'
              : 'bg-white text-medium-gray border'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-medium-gray">
        Loading reviews...
      </div>

      <!-- Empty -->
      <div v-else-if="filteredReviews.length === 0" class="bg-white rounded-3xl p-12 text-center text-medium-gray">
        No reviews found.
      </div>

      <!-- Reviews List -->
      <div v-else class="space-y-5">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="flex-1">
              <!-- Stars -->
              <div class="flex items-center gap-1 mb-2">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-xl"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>
                <span class="ml-2 text-sm font-medium text-[var(--royal-blue)]">
                  {{ review.rating }}/5
                </span>
              </div>

              <!-- Review text -->
              <p class="text-gray-800 mb-3 whitespace-pre-wrap">
                {{ review.review || 'No written review' }}
              </p>

              <!-- Meta -->
              <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm text-medium-gray">
                <span>
                  Customer: 
                  <span class="font-medium text-gray-700">
                    {{ review.customer?.full_name || 'Anonymous' }}
                  </span>
                </span>
                <span v-if="review.property">
                  Property: 
                  <span class="font-medium text-gray-700">
                    {{ review.property.title }}
                  </span>
                </span>
                <span>{{ formatDate(review.created_at) }}</span>
              </div>
            </div>
            <span class="text-xs font-medium px-2 py-1 rounded-full"
  :class="review.reviewer_type === 'agent' 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-blue-100 text-blue-700'">
  {{ review.reviewer_type === 'agent' ? 'Agent' : 'Customer' }}
</span>

            <!-- Actions -->
            <div class="flex flex-col gap-2 min-w-[140px]">
              <span
                :class="[
                  'text-xs font-bold px-3 py-1 rounded-full text-center',
                  review.is_published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                ]"
              >
                {{ review.is_published ? 'Published' : 'Pending' }}
              </span>

              <button
                v-if="!review.is_published"
                @click="publishReview(review)"
                :disabled="savingId === review.id"
                class="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {{ savingId === review.id ? '...' : 'Publish' }}
              </button>

              <button
                v-else
                @click="unpublishReview(review)"
                :disabled="savingId === review.id"
                class="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
              >
                {{ savingId === review.id ? '...' : 'Unpublish' }}
              </button>

              <button
                @click="deleteReview(review)"
                :disabled="savingId === review.id"
                class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const reviews = ref([])
const loading = ref(true)
const savingId = ref(null)
const filter = ref('all')



const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Pending', value: 'pending' },
  { label: 'Customers', value: 'customer' },
  { label: 'Agents', value: 'agent' }
]

const filteredReviews = computed(() => {
  let list = reviews.value

  if (filter.value === 'published') list = list.filter(r => r.is_published)
  else if (filter.value === 'pending') list = list.filter(r => !r.is_published)
  else if (filter.value === 'customer') list = list.filter(r => r.reviewer_type === 'customer')
  else if (filter.value === 'agent') list = list.filter(r => r.reviewer_type === 'agent')

  return list
})
const publishedCount = computed(() => reviews.value.filter(r => r.is_published).length)
const pendingCount = computed(() => reviews.value.filter(r => !r.is_published).length)

const averageRating = computed(() => {
  if (!reviews.value.length) return '0.0'
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0)
  return (sum / reviews.value.length).toFixed(1)
})


const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const fetchReviews = async () => {
  loading.value = true
  try {
    // 1. Fetch reviews + property
    const { data: reviewsData, error } = await supabase
      .from('app_reviews')
      .select(`
        *,
        property:properties (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!reviewsData || reviewsData.length === 0) {
      reviews.value = []
      return
    }

    // 2. Get unique customer IDs
    const customerIds = [...new Set(reviewsData.map(r => r.customer_id).filter(Boolean))]

    // 3. Fetch customer profiles separately
    let profilesMap = {}
    if (customerIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', customerIds)

      if (!profilesError && profilesData) {
        profilesMap = Object.fromEntries(profilesData.map(p => [p.id, p]))
      }
    }

    // 4. Merge the data
    reviews.value = reviewsData.map(review => ({
      ...review,
      customer: profilesMap[review.customer_id] || null
    }))

  } catch (err) {
    console.error('Error fetching reviews:', err)
    alert('Failed to load reviews: ' + (err.message || 'Unknown error'))
  } finally {
    loading.value = false
  }
}

const publishReview = async (review) => {
  savingId.value = review.id
  try {
    const { error } = await supabase
      .from('app_reviews')
      .update({ is_published: true })
      .eq('id', review.id)

    if (error) throw error
    review.is_published = true
  } catch (err) {
    console.error(err)
    alert('Failed to publish review')
  } finally {
    savingId.value = null
  }
}

const unpublishReview = async (review) => {
  savingId.value = review.id
  try {
    const { error } = await supabase
      .from('app_reviews')
      .update({ is_published: false })
      .eq('id', review.id)

    if (error) throw error
    review.is_published = false
  } catch (err) {
    console.error(err)
    alert('Failed to unpublish review')
  } finally {
    savingId.value = null
  }
}

const deleteReview = async (review) => {
  if (!confirm('Are you sure you want to permanently remove this review?')) return

  savingId.value = review.id
  try {
    const { error } = await supabase
      .from('app_reviews')
      .delete()
      .eq('id', review.id)

    if (error) throw error
    reviews.value = reviews.value.filter(r => r.id !== review.id)
  } catch (err) {
    console.error(err)
    alert('Failed to delete review')
  } finally {
    savingId.value = null
  }
}

onMounted(fetchReviews)
</script>