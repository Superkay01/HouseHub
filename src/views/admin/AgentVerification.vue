<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-[var(--royal-blue)] mb-2">Agent Verification</h1>
      <p class="text-medium-gray">State: {{ adminProfile.state || 'Loading...' }}</p>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-medium-gray">Total</p>
          <p class="text-4xl font-bold">{{ stats.total }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-medium-gray">Pending</p>
          <p class="text-4xl font-bold text-yellow-600">{{ stats.pending }}</p>
        </div>
      </div>

      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search agents..."
        class="w-full mt-8 px-5 py-4 rounded-2xl border focus:border-[var(--royal-blue)]"
      />

      <!-- Table -->
      <div class="bg-white rounded-3xl mt-6 overflow-hidden">
        <VerificationTable 
          :verifications="filteredVerifications"
          @view="selected = $event"
        />
      </div>
    </div>

    <VerificationDetailsDrawer
      v-if="selected"
      :verification="selected"
      @close="selected = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import StatsCard from '@/components/admin/StatsCard.vue'
import VerificationTable from '@/components/admin/verifications/VerificationTable.vue'
import VerificationDetailsDrawer from '@/components/admin/verifications/VerificationDetailsDrawer.vue'

const searchQuery = ref('')
const adminProfile = ref({ state: '' })
const verifications = ref([])
const selected = ref(null)

const stats = ref({ total: 0, pending: 0 })

const fetchData = async () => {
  // Get Admin Profile
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('state')
    .eq('id', user.id)
    .single()

  if (profile) adminProfile.value = profile

  // Get Verifications (Simple - No Join First)
  const { data } = await supabase
    .from('agent_verifications')
    .select('*')
    .eq('state', profile?.state)
    .order('submitted_at', { ascending: false })

  verifications.value = data || []

  stats.value.total = verifications.value.length
  stats.value.pending = verifications.value.filter(v => v.status === 'pending').length
}

const filteredVerifications = computed(() => {
  if (!searchQuery.value) return verifications.value
  const term = searchQuery.value.toLowerCase()
  return verifications.value.filter(v => 
    v.agency_name?.toLowerCase().includes(term)
  )
})

onMounted(fetchData)
</script>