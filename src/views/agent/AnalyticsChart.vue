<template>
  <div class="w-full">
    <div v-if="loading" class="h-64 flex items-center justify-center text-sm text-gray-400">
      Loading chart...
    </div>

    <div v-else-if="!hasData" class="h-64 flex items-center justify-center text-sm text-gray-400">
      No activity data yet
    </div>

    <div v-else>
      <!-- Legend -->
      <div class="flex flex-wrap gap-4 mb-4 text-xs sm:text-sm">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--royal-blue)]"></span>
          <span class="text-gray-600">Properties listed</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[var(--bright-green)]"></span>
          <span class="text-gray-600">Requests received</span>
        </div>
      </div>

      <!-- Bars -->
      <div class="flex items-end gap-2 sm:gap-3 h-56 sm:h-64">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="flex-1 flex flex-col items-center gap-2 h-full justify-end"
        >
          <div class="w-full flex items-end justify-center gap-1 h-48 sm:h-52">
            <div
              class="w-3 sm:w-4 rounded-t-lg bg-[var(--royal-blue)] transition-all"
              :style="{ height: barHeight(item.properties) }"
              :title="`${item.properties} properties`"
            ></div>
            <div
              class="w-3 sm:w-4 rounded-t-lg bg-[var(--bright-green)] transition-all"
              :style="{ height: barHeight(item.requests) }"
              :title="`${item.requests} requests`"
            ></div>
          </div>
          <span class="text-[10px] sm:text-xs text-gray-500">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabaseClient.js'

const loading = ref(true)
const chartData = ref([])

const maxValue = computed(() => {
  const values = chartData.value.flatMap((i) => [i.properties, i.requests])
  return Math.max(...values, 1)
})

const hasData = computed(() =>
  chartData.value.some((i) => i.properties > 0 || i.requests > 0)
)

const barHeight = (value) => {
  const pct = Math.round((value / maxValue.value) * 100)
  return `${Math.max(pct, value > 0 ? 6 : 0)}%`
}

const monthKey = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-NG', {
    month: 'short',
  })
}

const buildLast6Months = () => {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push(key)
  }
  return months
}

const loadChart = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const months = buildLast6Months()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 5)
    startDate.setDate(1)

    const [{ data: properties }, { data: requests }] = await Promise.all([
      supabase
        .from('properties')
        .select('id, created_at')
        .eq('agent_id', user.id)
        .gte('created_at', startDate.toISOString()),
      supabase
        .from('property_requests')
        .select('id, created_at')
        .eq('agent_id', user.id)
        .gte('created_at', startDate.toISOString()),
    ])

    chartData.value = months.map((key) => {
      const propsCount = (properties || []).filter((p) => monthKey(p.created_at) === key).length
      const reqCount = (requests || []).filter((r) => monthKey(r.created_at) === key).length
      return {
        key,
        label: monthLabel(key),
        properties: propsCount,
        requests: reqCount,
      }
    })
  } catch (err) {
    console.error('Analytics chart error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadChart)
</script>