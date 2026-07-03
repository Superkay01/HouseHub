<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[var(--light-blue)] group">
    <div class="flex items-start justify-between">
      <!-- Icon -->
     <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
         :class="`bg-[var(--${color})]/10 text-[var(--${color})]`">
        <component :is="icon" class="w-7 h-7" v-if="typeof icon !=='string'"/>
        <span v-else>{{ icon }}</span>
    </div>

      <!-- Trend -->
      <div v-if="trend" 
           class="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center gap-1">
        ↑ {{ trend }}
      </div>
    </div>

    <!-- Value -->
    <div class="text-4xl font-bold text-[var(--royal-blue)] mb-1 tracking-tighter">
      {{ value.toLocaleString() }}
    </div>

    <!-- Title -->
    <div class="text-[var(--royal-blue)] font-medium">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { defineProps } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: [String, Object], required: true },
  color: { type: String, default: 'royal-blue' },
  trend: { type: String, default: null }
})

const value = ref(0)

const iconComponent = computed(() => {
  return typeof props.icon === 'object' ? props.icon : null
})

const fetchStats = async () => {
  try {
    console.log(`Fetching stats for: ${props.title}`)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let result

    switch (props.title) {
      case 'Total Properties':
        result = await supabase.from('properties').select('*', { count: 'exact', head: true })
        break

      case 'Active Agents':
        result = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'agent')
        break

      case 'Pending Verifications':
        result = await supabase
          .from('agent_verifications')
          .select('*', { count: 'exact', head: true })
          .eq('verification_status', 'pending')
        break

      case 'Customers':
        result = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'customer')
        break

      default:
        value.value = 0
        return
    }

    const { count, error } = result

    if (error) {
      console.error(`Error fetching ${props.title}:`, error)
      value.value = 0
    } else {
      value.value = count || 0
      console.log(`${props.title} count:`, value.value)
    }

  } catch (err) {
    console.error(`Unexpected error fetching ${props.title}:`, err)
    value.value = 0
  }
}

onMounted(() => {
  fetchStats()
})
</script>