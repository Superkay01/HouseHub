<template>
  <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-5 border-b">
      <div class="flex items-center gap-3">
        <button
          @click="prevMonth"
          class="w-10 h-10 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xl"
        >
          ‹
        </button>
        <h3 class="text-lg font-semibold text-[var(--royal-blue)] min-w-[180px] text-center">
          {{ currentMonthLabel }}
        </h3>
        <button
          @click="nextMonth"
          class="w-10 h-10 rounded-2xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xl"
        >
          ›
        </button>
      </div>

      <button
        @click="goToToday"
        class="px-4 py-2 text-sm rounded-2xl border border-[var(--light-blue)] text-[var(--royal-blue)] hover:bg-[var(--light-blue)]"
      >
        Today
      </button>
    </div>

    <!-- Weekdays -->
    <div class="grid grid-cols-7 border-b bg-gray-50">
      <div
        v-for="day in weekDays"
        :key="day"
        class="py-3 text-center text-xs font-medium text-medium-gray uppercase"
      >
        {{ day }}
      </div>
    </div>

    <!-- Days -->
    <div class="grid grid-cols-7">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-[120px] border-b border-r border-gray-100 p-2"
        :class="{
          'bg-gray-50 text-gray-400': !day.isCurrentMonth,
          'bg-[var(--light-blue)]/20': day.isToday
        }"
      >
        <div class="flex items-center justify-between mb-1">
          <button
            @click="emitDay(day)"
            :class="[
              'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
              day.isToday ? 'bg-[var(--royal-blue)] text-white' : 'text-[var(--royal-blue)]'
            ]"
          >
            {{ day.date }}
          </button>
        </div>

        <div class="space-y-1">
          <button
            v-for="event in day.events.slice(0, 3)"
            :key="event.id"
            @click="$emit('view', event)"
            class="w-full text-left px-2 py-1 rounded-xl text-[11px] truncate hover:opacity-90"
            :class="eventColor(event.status)"
          >
            {{ event.inspection_time || '—' }} · {{ event.property?.title || 'Inspection' }}
          </button>

          <button
            v-if="day.events.length > 3"
            class="w-full text-left px-2 text-[11px] text-medium-gray hover:underline"
            @click="emitDay(day)"
          >
            +{{ day.events.length - 3 }} more
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  inspections: { type: Array, default: () => [] }
})

const emit = defineEmits(['view', 'day-click'])

const currentDate = ref(new Date())
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthLabel = computed(() =>
  currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const calendarDays = computed(() => {
  const days = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)

  // previous month filler
  for (let i = start.getDay() - 1; i >= 0; i--) {
    const d = new Date(start)
    d.setDate(d.getDate() - (i + 1))
    days.push(buildDay(d, false))
  }

  // current month
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(buildDay(new Date(year, month, i), true))
  }

  // next month filler
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].fullDate
    const d = new Date(last)
    d.setDate(d.getDate() + 1)
    days.push(buildDay(d, false))
  }

  return days
})

const buildDay = (date, isCurrentMonth) => {
  const key = date.toISOString().slice(0, 10)
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const events = props.inspections.filter(item => {
    if (!item.inspection_date) return false
    const itemDate = String(item.inspection_date).slice(0, 10)
    return itemDate === key
  })

  return {
    date: date.getDate(),
    fullDate: date,
    key,
    isCurrentMonth,
    isToday,
    events
  }
}

const eventColor = (status) => {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    rescheduled: 'bg-purple-100 text-purple-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-600'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const prevMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

const nextMonth = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

const goToToday = () => {
  currentDate.value = new Date()
}

const emitDay = (day) => {
  emit('day-click', {
    dateLabel: day.fullDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    events: day.events
  })
}
</script>