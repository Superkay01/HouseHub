<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-[var(--royal-blue)] mb-2">Agent Verification</h1>
      <p class="text-[var(--royal-blue)]">State: {{ adminProfile.state || 'Loading...' }}</p>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-[var(--royal-blue)]">Total</p>
          <p class="text-4xl font-bold">{{ stats.total }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-[var(--royal-blue)]">Pending</p>
          <p class="text-4xl font-bold text-yellow-600">{{ stats.pending }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-[var(--royal-blue)]">Approved</p>
          <p class="text-4xl font-bold text-green-600">{{ stats.approved }}</p>
        </div>
        <div class="bg-white p-6 rounded-3xl">
          <p class="text-sm text-[var(--royal-blue)]">Rejected</p>
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

  // 1. Get admin state
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('state')
    .eq('id', user.id)
    .single()

  if (profile) adminProfile.value = profile

  const adminState = profile?.state || ''
  const shortState = adminState.replace(' State', '')

  // 2. Fetch verifications
  const { data: verificationsData, error } = await supabase
    .from('agent_verifications')
    .select('*')
    .or(`state.eq.${adminState},state.eq.${shortState}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch verifications error:', error)
    return
  }

  if (!verificationsData || verificationsData.length === 0) {
    verifications.value = []
    stats.value = { total: 0, pending: 0, approved: 0, rejected: 0 }
    return
  }

  // 3. Get all related user_ids
  const userIds = verificationsData.map(v => v.user_id)

  // 4. Fetch profiles for those users
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, phone, email, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    console.error('Fetch profiles error:', profilesError)
  }

  // 5. Merge profiles into verifications
  const profilesMap = {}
  profilesData?.forEach(p => {
    profilesMap[p.id] = p
  })

  verifications.value = verificationsData.map(v => ({
    ...v,
    profiles: profilesMap[v.user_id] || null,
    // Optional: also put the values at the top level for easier access in the drawer
    full_name: profilesMap[v.user_id]?.full_name || null,
    phone: profilesMap[v.user_id]?.phone || null,
    email: profilesMap[v.user_id]?.email || null,
    avatar_url: profilesMap[v.user_id]?.avatar_url || null,
  }))

  // 6. Calculate stats
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
    v.full_name?.toLowerCase().includes(term) ||
    v.profiles?.full_name?.toLowerCase().includes(term)
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