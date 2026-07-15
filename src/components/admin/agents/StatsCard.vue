<template>
  <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100 group">
    <div class="flex items-start justify-between">
      <div 
        :class="[
          'w-14 h-14 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110',
          `bg-${color}-100 text-${color}-600`
        ]"
      >
        <component :is="iconComponent" class="w-7 h-7" />
      </div>

      <div class="text-right">
        <p class="text-4xl font-bold text-dark-gray tracking-tighter">{{ formattedValue }}</p>
        <p v-if="loading" class="text-xs text-medium-gray mt-1">loading...</p>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-medium-gray font-medium">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { Users, CheckCircle, Clock, Ban, Home, Calendar } from 'lucide-vue-next'

const props = defineProps({
  type: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, default: 'blue' }
})

const value = ref(0)
const loading = ref(true)

const iconComponent = computed(() => {
  switch (props.type) {
    case 'total': return Users
    case 'verified': return CheckCircle
    case 'pending': return Clock
    case 'suspended': return Ban
    case 'listings': return Home
    case 'new': return Calendar
    default: return Users
  }
})

const fetchStats = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()

    // Get admin's assigned state
    const { data: admin } = await supabase
      .from('admin_profiles')
      .select('assigned_state')
      .eq('id', user.id)
      .single()

    const state = admin?.assigned_state

    if (!state) {
      console.warn("No assigned state found for admin")
      return
    }

    let result = 0

    switch (props.type) {
      case 'total':
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
          .eq('state', state)
        result = count || 0
        break

      case 'verified':
        const { count: verifiedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
          .eq('state', state)
          .eq('verification_status', 'verified')   // Adjust if your column name is different
        result = verifiedCount || 0
        break

      case 'pending':
        const { count: pendingCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
          .eq('state', state)
          .eq('verification_status', 'pending')
        result = pendingCount || 0
        break

      case 'suspended':
        const { count: suspendedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
          .eq('state', state)
          .eq('verification_status', 'suspended')
        result = suspendedCount || 0
        break

      case 'listings':
        const { count: listingsCount } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
        result = listingsCount || 0
        break

      case 'new':
        const firstDayOfMonth = new Date()
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0, 0, 0, 0)

        const { count: newCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
          .eq('state', state)
          .gte('created_at', firstDayOfMonth.toISOString())
        result = newCount || 0
        break
    }

    value.value = result
  } catch (error) {
    console.error(`Error fetching ${props.type} stats:`, error)
  } finally {
    loading.value = false
  }
}

const formattedValue = computed(() => value.value.toLocaleString())

onMounted(fetchStats)
</script>