<template>
  <div>
    <div class="flex justify-between items-center mb-5">
      <h3 class="font-semibold text-[var(--royal-blue)]">Pending Agent Verifications</h3>
      <button 
        @click="fetchPendingAgents"
        class="text-[var(--royal-blue)] text-sm font-medium hover:underline"
      >
        Refresh
      </button>
    </div>

    <div v-if="pendingAgents.length" class="space-y-4">
      <div 
        v-for="agent in pendingAgents" 
        :key="agent.id" 
        class="bg-[var(--light-blue)] rounded-2xl p-5 flex items-center gap-4"
      >
        <img
          :src="agent.passport_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.agency_name)}&background=0025cc&color=fff`"
          class="w-12 h-12 rounded-2xl object-cover"
        />
       
        <div class="flex-1 min-w-0">
          <div class="font-medium text-[var(--royal-blue)]">{{ agent.agency_name }}</div>
          <div class="text-[10px] text-[var(--royal-blue)]">{{ agent.city }}, {{ agent.state }}</div>
          <div class="text-[10px] text-[var(--royal-blue)] mt-1">
            Experience: {{ agent.years_of_experience || 0 }} years
          </div>
        </div>

        <div class="text-right text-[10px]">
          <div class="text-[var(--royal-blue)] mb-1 text-[var(--hover-blue)]">Applied</div>
          <div class="text-[var(--royal-blue)]">{{ formatDate(agent.created_at) }}</div>
        </div>

        <div class="flex gap-2">
          <button
            @click="approveAgent(agent.id)"
            class="bg-green-100 text-green-700 px-3 py-1 rounded-2xl text-xs font-medium hover:bg-green-200 transition-all"
          >
            Approve
          </button>
          <button
            @click="rejectAgent(agent.id)"
            class="bg-red-100 text-red-700 px-3 py-1 rounded-2xl text-xs font-medium hover:bg-red-200 transition-all"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-medium-gray">
      No pending verifications
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const pendingAgents = ref([])

const fetchPendingAgents = async () => {
  const { data, error } = await supabase
    .from('agent_verifications')
    .select('*')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending agents:', error)
  } else {
    pendingAgents.value = data || []
  }
}

const approveAgent = async (id) => {
  if (!confirm('Approve this agent?')) return

  const { error } = await supabase
    .from('agent_verifications')
    .update({ verification_status: 'approved' })
    .eq('id', id)

  if (error) {
    alert('Failed to approve')
    console.error(error)
  } else {
    alert('Agent approved successfully!')
    fetchPendingAgents()
  }
}

const rejectAgent = async (id) => {
  if (!confirm('Reject this agent?')) return

  const { error } = await supabase
    .from('agent_verifications')
    .update({ verification_status: 'rejected' })
    .eq('id', id)

  if (error) {
    alert('Failed to reject')
    console.error(error)
  } else {
    alert('Agent rejected.')
    fetchPendingAgents()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchPendingAgents()
})
</script>