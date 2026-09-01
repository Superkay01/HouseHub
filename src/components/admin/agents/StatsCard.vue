<!-- <template>
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
  console.log(`🚀 Fetching stats for: ${props.type}`)

  try {
    const { data: { user } } = await supabase.auth.getUser()
    console.log("User:", user?.id)

    const { data: admin } = await supabase
      .from('admin_profiles')
      .select('state')
      .eq('id', user.id)
      .single()

    console.log("Admin State:", admin?.state)

    const state = admin?.state
    if (!state) {
      console.warn("No state found")
      return
    }

    let result = 0

    switch (props.type) {
  case 'total':
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'agent')
      .or(`state.eq.${state},state.eq.${state.replace(' State', '')}`)
    result = count || 0
    break

  case 'verified':
    const { count: vCount } = await supabase
      .from('agent_verifications')
      .select('*', { count: 'exact', head: true })
      .or(`state.eq.${state},state.eq.${state.replace(' State', '')}`)
      .eq('verification_status', 'approved')
    result = vCount || 0
    break

  case 'pending':
    const { count: pCount } = await supabase
      .from('agent_verifications')
      .select('*', { count: 'exact', head: true })
      .or(`state.eq.${state},state.eq.${state.replace(' State', '')}`)
      .eq('verification_status', 'pending')
    result = pCount || 0
    break

  case 'listings':
    const { count: lCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .or(`state.eq.${state},state.eq.${state.replace(' State', '')}`)
    result = lCount || 0
    break
}

    value.value = result
    console.log(`✅ ${props.type} = ${result}`)

  } catch (error) {
    console.error("❌ Stats Error:", error)
  } finally {
    loading.value = false
  }
}

const formattedValue = computed(() => value.value.toLocaleString())

onMounted(() => {
  console.log(`Component mounted - Type: ${props.type}`)
  fetchStats()
})
</script> -->

<template>
  <div class="bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100 group">
    <div class="flex items-start justify-between">
      <div 
        :class="[
          'w-9 h-9 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110',
          colorClasses
        ]"
      >
        <component :is="iconComponent" class="w-5 h-5" />
      </div>

      <div class="text-right">
        <p class="text-4xl font-bold text-[var(--royal-blue)] tracking-tighter">{{ formattedValue }}</p>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-[var(--steel-blue)] text-xs md:text-xs font-medium">{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Users, CheckCircle, Clock, Ban, Home, Calendar } from 'lucide-vue-next'

const props = defineProps({
  icon: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  label: { type: String, required: true },
  color: { type: String, default: 'blue' }
})

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'Users': return Users
    case 'CheckCircle': return CheckCircle
    case 'Clock': return Clock
    case 'Ban': return Ban
    case 'Home': return Home
    case 'Calendar': return Calendar
    default: return Users
  }
})

const colorClasses = computed(() => {
  const map = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    royal: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  return map[props.color] || map.blue
})

const formattedValue = computed(() => Number(props.value).toLocaleString())
</script>