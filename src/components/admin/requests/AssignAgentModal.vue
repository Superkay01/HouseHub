<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
      <div class="p-6 border-b flex items-center justify-between">
        <h3 class="text-xl font-bold text-[var(--royal-blue)]">Assign Agent</h3>
        <button type="button" @click="$emit('close')" class="text-2xl text-gray-400">×</button>
      </div>

      <div class="p-6">
        <p class="text-sm text-medium-gray mb-4">
          Select a verified agent in {{ request.city }}, {{ request.state }}
        </p>

        <div v-if="loading" class="text-center py-10 text-medium-gray">
          Loading agents...
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="agent in agents"
            :key="agent.id"
            @click="selectAgent(agent.id)"
            :class="[
              'p-4 rounded-2xl border cursor-pointer transition',
              selectedAgentId === agent.id
                ? 'border-[var(--royal-blue)] bg-[var(--light-blue)]'
                : 'border-gray-200 hover:border-[var(--hover-blue)]'
            ]"
          >
            <div class="flex items-center gap-3">
              <img
                :src="agent.avatar_url || 'https://via.placeholder.com/48'"
                class="w-12 h-12 rounded-2xl object-cover"
              />
              <div class="flex-1">
                <p class="font-medium">{{ agent.full_name }}</p>
                <p class="text-sm text-medium-gray">{{ agent.agency_name || 'Independent' }}</p>
                <p class="text-xs text-green-600 mt-1">✓ Verified</p>
              </div>
              <div
                v-if="selectedAgentId === agent.id"
                class="w-6 h-6 rounded-full bg-[var(--royal-blue)] text-white flex items-center justify-center text-sm"
              >
                ✓
              </div>
            </div>
          </div>

          <div v-if="agents.length === 0" class="text-center py-8 text-medium-gray">
            No verified agents found in this location.
          </div>
        </div>
      </div>

      <div class="p-6 border-t flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 py-3.5 border border-gray-200 rounded-2xl"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="assignAgent"
          :disabled="!selectedAgentId || assigning"
          class="flex-1 py-3.5 bg-[var(--royal-blue)] text-white rounded-2xl disabled:opacity-50"
        >
          {{ assigning ? 'Assigning...' : 'Assign Agent' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'assigned'])

const agents = ref([])
const selectedAgentId = ref(null)
const loading = ref(true)
const assigning = ref(false)

const fetchAgents = async () => {
  loading.value = true
  try {
    const requestState = props.request?.state || ''
    const shortState = requestState.replace(' State', '').trim()
    const longState = shortState ? `${shortState} State` : requestState

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, agency_name, phone, avatar_url, verified, state, city, role')
      .or('role.eq.agent,role.eq.Agent,role.eq.property_agent')

    if (error) throw error

    const list = (data || []).filter((agent) => {
      const agentState = (agent.state || '').trim()
      const stateMatch =
        agentState === requestState ||
        agentState === shortState ||
        agentState === longState

      const isVerified = agent.verified === true || agent.is_verified === true
      return stateMatch && isVerified
    })

    agents.value = list.length
      ? list
      : (data || []).filter((a) => {
          const s = (a.state || '').trim()
          return s === requestState || s === shortState || s === longState
        })
  } catch (err) {
    console.error(err)
    agents.value = []
  } finally {
    loading.value = false
  }
}

const selectAgent = (id) => {
  selectedAgentId.value = id
  console.log('Selected agent:', id)
}

const assignAgent = async () => {
  if (!selectedAgentId.value) {
    alert('Please select an agent first')
    return
  }

  if (!props.request?.id) {
    alert('Invalid request')
    return
  }

  assigning.value = true
  try {
    console.log('Assigning agent', selectedAgentId.value, 'to request', props.request.id)

    const { data, error } = await supabase
      .from('property_requests')
      .update({
        agent_id: selectedAgentId.value,
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', props.request.id)
      .select()

    console.log('Assign result:', { data, error })

    if (error) throw error

    alert('✅ Agent assigned successfully!')
    emit('assigned')
    emit('close')
  } catch (err) {
    console.error('Assign error:', err)
    alert(err.message || 'Failed to assign agent')
  } finally {
    assigning.value = false
  }
}

onMounted(fetchAgents)
</script>