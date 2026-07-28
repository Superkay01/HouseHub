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
    if (!user) return

    const { data: admin } = await supabase
      .from('admin_profiles')
      .select('state')
      .eq('id', user.id)
      .single()

    const state = admin?.state
    if (!state) return

    let result = 0

    switch (props.type) {
      case 'total':
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer')
          .eq('state', state)
        result = count || 0
        break

      case 'active':
        const { count: activeCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer')
          .eq('state', state)
        result = activeCount || 0
        break

      case 'new':
        const firstDay = new Date()
        firstDay.setDate(1)
        firstDay.setHours(0, 0, 0, 0)

        const { count: newCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer')
          .eq('state', state)
          .gte('created_at', firstDay.toISOString())
        result = newCount || 0
        break

      case 'requests':
        const { count: requestCount } = await supabase
          .from('property_requests')
          .select('*', { count: 'exact', head: true })
          .eq('state', state)
        result = requestCount || 0
        break
    }

    value.value = result
  } catch (error) {
    console.error(`Error fetching ${props.type}:`, error)
  } finally {
    loading.value = false
  }
}

const formattedValue = computed(() => value.value.toLocaleString())

onMounted(fetchStats)
</script>