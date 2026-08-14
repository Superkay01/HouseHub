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
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-medium-gray">Approved</p>
          <p class="text-4xl font-bold text-green-600">{{ stats.approved }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-medium-gray">Rejected</p>
          <p class="text-4xl font-bold text-red-600">{{ stats.rejected }}</p>
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
      @approve="approveAgent"
      @reject="rejectAgent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import VerificationTable from '@/components/admin/verifications/VerificationTable.vue'
import VerificationDetailsDrawer from '@/components/admin/verifications/VerificationDetailsDrawer.vue'

const searchQuery = ref('')
const adminProfile = ref({ state: '' })
const verifications = ref([])
const selected = ref(null)

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

const fetchData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('state')
    .eq('id', user.id)
    .single()

  if (profile) adminProfile.value = profile

  // Match both "Kwara" and "Kwara State" if needed
  const adminState = profile?.state || ''
  const shortState = adminState.replace(' State', '')

  const { data, error } = await supabase
    .from('agent_verifications')
    .select('*')
    .or(`state.eq.${adminState},state.eq.${shortState}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch verifications error:', error)
    return
  }

  verifications.value = data || []

  stats.value = {
    total: verifications.value.length,
    pending: verifications.value.filter(v =>
      v.verification_status === 'pending' || v.status === 'pending'
    ).length,
    approved: verifications.value.filter(v =>
      v.verification_status === 'approved' || v.status === 'approved'
    ).length,
    rejected: verifications.value.filter(v =>
      v.verification_status === 'rejected' || v.status === 'rejected'
    ).length
  }
}

const filteredVerifications = computed(() => {
  if (!searchQuery.value) return verifications.value
  const term = searchQuery.value.toLowerCase()
  return verifications.value.filter(v =>
    v.agency_name?.toLowerCase().includes(term) ||
    v.full_name?.toLowerCase().includes(term)
  )
})

// ✅ APPROVE
const approveAgent = async (verificationId) => {
  if (!confirm('Approve this agent?')) return

  try {
    const { data: verification, error: fetchError } = await supabase
      .from('agent_verifications')
      .select('user_id')
      .eq('id', verificationId)
      .single()

    if (fetchError) throw fetchError

    const { error: verError } = await supabase
      .from('agent_verifications')
      .update({
        verification_status: 'approved',
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', verificationId)

    if (verError) throw verError

    // Mark profile as verified
    if (verification?.user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verified: true })
        .eq('id', verification.user_id)

      if (profileError) {
        console.warn('Profile update warning:', profileError)
        // try alternate column name
        await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('id', verification.user_id)
      }
    }

    alert('✅ Agent approved successfully!')
    selected.value = null
    await fetchData()
  } catch (err) {
    console.error('Approve error:', err)
    alert(err.message || 'Failed to approve agent')
  }
}

// ✅ REJECT
const rejectAgent = async (verificationId) => {
  const reason = prompt('Reason for rejection:')
  if (reason === null) return
  if (!reason.trim()) {
    alert('Please provide a rejection reason')
    return
  }

  try {
    const { error } = await supabase
      .from('agent_verifications')
      .update({
        verification_status: 'rejected',
        status: 'rejected',
        rejection_reason: reason.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', verificationId)

    if (error) throw error

    alert('Application rejected')
    selected.value = null
    await fetchData()
  } catch (err) {
    console.error('Reject error:', err)
    alert(err.message || 'Failed to reject agent')
  }
}

onMounted(fetchData)
</script>