<template>
  <div class="min-h-screen bg-[var(--light-blue)]">
    <div class="max-w-7xl mx-auto p-4 md:p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-[var(--royal-blue)]">My Inspections</h1>
          <p class="text-medium-gray mt-2">
            Manage assignments, confirmations, check-ins, and inspection reports.
          </p>
          <p class="mt-2 text-sm font-medium text-[var(--royal-blue)]">
            📍 {{ agentProfile.city || '—' }}, {{ normalizeState(agentProfile.state) || '—' }}
          </p>
        </div>
        <button
          type="button"
          @click="refreshData"
          class="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-2xl hover:bg-[var(--medium-blue)] transition"
        >
          Refresh
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Total Inspections</p>
          <p class="text-3xl md:text-4xl font-bold mt-2">{{ stats.total }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Action Required</p>
          <p class="text-3xl md:text-4xl font-bold text-red-600 mt-2">{{ stats.actionRequired }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Today</p>
          <p class="text-3xl md:text-4xl font-bold text-amber-600 mt-2">{{ stats.today }}</p>
        </div>
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <p class="text-sm text-medium-gray">Completed</p>
          <p class="text-3xl md:text-4xl font-bold text-green-600 mt-2">{{ stats.completed }}</p>
        </div>
      </div>

      <!-- ACTION REQUIRED SECTION -->
      <div v-if="actionRequiredList.length" class="mb-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide">
            ACTION REQUIRED
          </span>
          <h2 class="text-xl font-semibold text-[var(--royal-blue)]">
            New Assignments & Responses
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="item in actionRequiredList"
            :key="item.id"
            class="bg-white rounded-3xl p-5 shadow-sm border-2 border-red-100"
          >
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <p class="text-xs font-bold text-red-600 tracking-wide">
                  {{ actionBadge(item) }}
                </p>
                <p class="font-semibold text-lg mt-1 line-clamp-1">
                  {{ item.property?.title || 'Property' }}
                </p>
              </div>
              <span class="text-xs px-3 py-1 rounded-2xl font-medium capitalize" :class="statusClass(item.status)">
                {{ displayStatus(item.status) }}
              </span>
            </div>

            <p class="text-sm text-medium-gray">Customer: {{ maskName(item.customer?.full_name) }}</p>
            <p class="text-sm mt-1">
              📅 {{ formatDate(item.inspection_date) }} · ⏰ {{ item.inspection_time || 'TBD' }}
            </p>
            <p class="text-sm text-medium-gray mt-1">
              📍 {{ item.property?.area || item.city }}, {{ item.city || normalizeState(item.state) }}
            </p>

            <div class="flex flex-wrap gap-2 mt-4">
              <template v-if="item.status === 'pending'">
                <button type="button" @click="acceptInspection(item)" class="flex-1 py-2.5 bg-[var(--royal-blue)] text-white rounded-2xl text-sm font-semibold">
                  Accept Inspection
                </button>
                <button type="button" @click="openDecline(item)" class="flex-1 py-2.5 bg-red-50 text-red-700 rounded-2xl text-sm font-semibold">
                  Decline
                </button>
              </template>

              <template v-else-if="item.status === 'scheduled'">
                <button type="button" @click="confirmInspection(item)" class="flex-1 py-2.5 bg-green-600 text-white rounded-2xl text-sm font-semibold">
                  Confirm Inspection
                </button>
                <button type="button" @click="openReschedule(item)" class="flex-1 py-2.5 border rounded-2xl text-sm font-medium">
                  Request Reschedule
                </button>
              </template>

              <template v-else-if="item.status === 'in_progress' && hasIncompleteReport(item)">
                <button type="button" @click="openDrawer(item)" class="w-full py-2.5 bg-amber-500 text-white rounded-2xl text-sm font-semibold">
                  Continue Report
                </button>
              </template>

              <button type="button" @click="openDrawer(item)" class="w-full py-2.5 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          @click="activeTab = tab.value"
          :class="[
            'px-5 py-2.5 rounded-2xl text-sm font-medium transition relative',
            activeTab === tab.value
              ? 'bg-[var(--royal-blue)] text-white'
              : 'bg-white text-medium-gray hover:bg-gray-50'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.value === 'action' && stats.actionRequired"
            class="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-red-500 text-white text-[10px]"
          >
            {{ stats.actionRequired }}
          </span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-3xl p-5 shadow-sm mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search property, inspection ID, area, city..."
            class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none"
          />
          <select v-model="statusFilter" class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="reschedule_requested">Reschedule Requested</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
            <option value="declined">Declined</option>
          </select>
          <select v-model="dateFilter" class="px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[var(--royal-blue)] outline-none">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-3xl h-32 animate-pulse" />
      </div>

      <!-- Empty states -->
      <div v-else-if="inspections.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm">
        <div class="text-6xl mb-4">🏠</div>
        <h3 class="text-2xl font-semibold text-[var(--royal-blue)]">No Inspections Assigned</h3>
        <p class="text-medium-gray mt-2 max-w-md mx-auto">
          You have no inspections assigned. New assignments from your State Admin will appear here automatically.
        </p>
      </div>

      <div v-else-if="filteredInspections.length === 0" class="bg-white rounded-3xl p-12 text-center shadow-sm">
        <h3 class="text-xl font-semibold text-[var(--royal-blue)]">{{ emptyTitle }}</h3>
        <p class="text-medium-gray mt-2">{{ emptyMessage }}</p>
      </div>

      <template v-else>
        <!-- Desktop table -->
        <div class="hidden lg:block bg-white rounded-3xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-sm text-medium-gray">
                <th class="py-4 px-6">Inspection</th>
                <th class="py-4 px-6">Property</th>
                <th class="py-4 px-6">Customer</th>
                <th class="py-4 px-6">Schedule</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Badge</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="item in filteredInspections" :key="item.id" class="hover:bg-gray-50 transition">
                <td class="py-5 px-6 font-medium text-sm">
                  {{ item.inspection_code || item.id.slice(0, 8) }}
                </td>
                <td class="py-5 px-6">
                  <div class="flex items-center gap-3">
                    <img :src="item.property?.cover_image || placeholderImg" class="w-12 h-12 rounded-xl object-cover" />
                    <span class="font-medium line-clamp-1">{{ item.property?.title }}</span>
                  </div>
                </td>
                <td class="py-5 px-6 text-sm">{{ maskName(item.customer?.full_name) }}</td>
                <td class="py-5 px-6 text-sm">
                  {{ formatDate(item.inspection_date) }}<br />
                  <span class="text-medium-gray">{{ item.inspection_time || '—' }}</span>
                </td>
                <td class="py-5 px-6">
                  <span class="text-xs px-3 py-1.5 rounded-2xl font-medium capitalize" :class="statusClass(item.status)">
                    {{ displayStatus(item.status) }}
                  </span>
                </td>
                <td class="py-5 px-6">
                  <span
                    v-if="rowBadge(item)"
                    class="text-[10px] px-2 py-1 rounded-full font-bold tracking-wide"
                    :class="rowBadgeClass(item)"
                  >
                    {{ rowBadge(item) }}
                  </span>
                </td>
                <td class="py-5 px-6 text-right">
                  <button type="button" @click="openDrawer(item)" class="px-4 py-2 bg-[var(--royal-blue)] text-white rounded-2xl text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="lg:hidden space-y-4">
          <div v-for="item in filteredInspections" :key="item.id" class="bg-white rounded-3xl p-5 shadow-sm">
            <div class="flex gap-4">
              <img :src="item.property?.cover_image || placeholderImg" class="w-20 h-20 rounded-2xl object-cover" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold line-clamp-1">{{ item.property?.title }}</p>
                <p class="text-sm mt-1">
                  {{ formatDate(item.inspection_date) }} · {{ item.inspection_time || '—' }}
                </p>
                <span class="inline-block mt-2 text-xs px-3 py-1 rounded-2xl font-medium capitalize" :class="statusClass(item.status)">
                  {{ displayStatus(item.status) }}
                </span>
                <span
                  v-if="rowBadge(item)"
                  class="ml-2 inline-block text-[10px] px-2 py-1 rounded-full font-bold"
                  :class="rowBadgeClass(item)"
                >
                  {{ rowBadge(item) }}
                </span>
              </div>
            </div>
            <button type="button" @click="openDrawer(item)" class="w-full mt-4 py-3 border rounded-2xl text-sm font-medium">
              View Inspection
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- ===================== DRAWER ===================== -->
    <div v-if="selected" class="fixed inset-0 z-50 bg-black/50 flex justify-end" @click.self="selected = null">
      <div class="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 class="text-xl font-bold text-[var(--royal-blue)]">Inspection Details</h2>
            <p class="text-sm text-medium-gray">
              {{ selected.inspection_code || selected.id.slice(0, 8) }}
            </p>
          </div>
          <button type="button" @click="selected = null" class="text-3xl text-gray-400">×</button>
        </div>

        <div class="p-6 space-y-8">
          <div class="rounded-2xl p-4 bg-blue-50 border border-blue-100">
            <p class="text-sm font-semibold text-[var(--royal-blue)]">{{ statusMessage(selected).title }}</p>
            <p class="text-sm text-medium-gray mt-1">{{ statusMessage(selected).body }}</p>
            <p v-if="countdownText(selected)" class="mt-2 text-sm font-medium text-amber-700">
              {{ countdownText(selected) }}
            </p>
          </div>

          <div>
            <img :src="selected.property?.cover_image || placeholderImg" class="w-full h-48 object-cover rounded-3xl mb-4" />
            <h3 class="text-2xl font-semibold">{{ selected.property?.title }}</h3>
            <p class="text-medium-gray mt-1">
              {{ selected.property?.property_type }} ·
              {{ selected.property?.area }}, {{ selected.city }}, {{ normalizeState(selected.state) }}
            </p>
            <p class="text-2xl font-bold text-green-600 mt-3">
              ₦{{ Number(selected.property?.price || 0).toLocaleString() }}
            </p>
          </div>

          <section class="bg-gray-50 rounded-3xl p-5 space-y-3">
            <h4 class="font-semibold text-[var(--royal-blue)]">Inspection Preparation</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div><span class="text-medium-gray">Type</span><p class="font-medium">{{ selected.property?.property_type || '—' }}</p></div>
              <div><span class="text-medium-gray">Beds / Baths</span><p class="font-medium">{{ selected.property?.bedrooms || 0 }} / {{ selected.property?.bathrooms || 0 }}</p></div>
              <div class="col-span-2"><span class="text-medium-gray">Address</span><p class="font-medium">{{ fullAddress(selected) }}</p></div>
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              <button type="button" @click="openMaps(selected)" class="px-4 py-2 bg-[var(--royal-blue)] text-white rounded-2xl text-sm">📍 Get Directions</button>
              <button type="button" @click="copyAddress(selected)" class="px-4 py-2 border rounded-2xl text-sm">Copy Address</button>
            </div>
            <div v-if="selected.admin_notes" class="mt-3 p-3 bg-amber-50 rounded-2xl text-sm">
              <p class="font-semibold text-amber-800">Admin Instructions</p>
              <p class="mt-1 text-amber-900">{{ selected.admin_notes }}</p>
            </div>
          </section>

          <section class="bg-gray-50 rounded-3xl p-5">
            <p class="text-sm text-medium-gray">Customer</p>
            <p class="font-semibold mt-1">{{ maskName(selected.customer?.full_name) }}</p>
            <p class="text-sm mt-2">
              Customer Confirmation:
              <span class="font-medium">{{ customerConfirmationLabel(selected) }}</span>
            </p>
            <div v-if="canContactCustomer" class="flex flex-wrap gap-2 mt-3">
              <a v-if="selected.customer?.phone" :href="`tel:${selected.customer.phone}`" class="px-4 py-2 bg-green-600 text-white rounded-2xl text-sm">Call</a>
              <a v-if="selected.customer?.phone" :href="`https://wa.me/${normalizePhone(selected.customer.phone)}`" target="_blank" class="px-4 py-2 bg-[#25D366] text-white rounded-2xl text-sm">WhatsApp</a>
              <button v-if="selected.customer?.phone" type="button" @click="copyText(selected.customer.phone, 'Phone copied')" class="px-4 py-2 border rounded-2xl text-sm">Copy phone</button>
            </div>
          </section>

          <section>
            <h4 class="font-semibold mb-4">Inspection Timeline</h4>
            <div class="space-y-3">
              <div v-for="(step, i) in buildTimeline(selected)" :key="i" class="flex gap-3 text-sm">
                <div
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    step.done ? 'bg-green-500 text-white' : step.current ? 'bg-[var(--royal-blue)] text-white' : 'bg-gray-200 text-gray-500'
                  ]"
                >
                  {{ step.done ? '✓' : i + 1 }}
                </div>
                <div>
                  <p :class="step.done || step.current ? 'font-medium' : 'text-medium-gray'">{{ step.label }}</p>
                  <p v-if="step.at" class="text-xs text-medium-gray">{{ formatDateTime(step.at) }}</p>
                  <p v-if="step.note" class="text-xs text-medium-gray">{{ step.note }}</p>
                </div>
              </div>
            </div>
          </section>

          <div class="space-y-3 pt-2">
            <template v-if="selected.status === 'pending'">
              <button type="button" @click="acceptInspection(selected)" class="w-full py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold">Accept Inspection</button>
              <button type="button" @click="openDecline(selected)" class="w-full py-4 bg-red-50 text-red-700 rounded-2xl font-semibold">Decline Inspection</button>
            </template>

            <button v-if="selected.status === 'scheduled'" type="button" @click="confirmInspection(selected)" class="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold">
              Confirm Inspection
            </button>

            <button v-if="['accepted','scheduled','confirmed'].includes(selected.status)" type="button" @click="openReschedule(selected)" class="w-full py-4 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl font-semibold">
              Request Reschedule
            </button>

            <button v-if="['confirmed','scheduled'].includes(selected.status) && !selected.checked_in_at" type="button" @click="checkIn(selected)" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold">
              Check In at Property
            </button>
            <p v-if="selected.checked_in_at" class="text-sm text-green-700 font-medium">
              ✓ Checked in at {{ formatDateTime(selected.checked_in_at) }}
            </p>

            <button v-if="canStart(selected)" type="button" @click="openStartConfirm(selected)" class="w-full py-4 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold">
              Start Inspection
            </button>

            <button v-if="selected.status === 'in_progress'" type="button" @click="openReport(selected)" class="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold">
              {{ hasIncompleteReport(selected) ? 'Continue / Submit Report' : 'Complete Inspection Report' }}
            </button>

            <button v-if="['scheduled','confirmed','in_progress'].includes(selected.status)" type="button" @click="openNoShow(selected)" class="w-full py-4 bg-amber-50 text-amber-800 rounded-2xl font-semibold">
              Report Customer No-Show
            </button>

            <button v-if="['scheduled','confirmed','accepted'].includes(selected.status)" type="button" @click="openCancel(selected)" class="w-full py-4 bg-red-50 text-red-700 rounded-2xl font-semibold">
              Cancel Inspection
            </button>

            <button type="button" @click="openIssue(selected)" class="w-full py-4 border rounded-2xl font-medium">Report an Issue</button>
            <button type="button" @click="openProperty" class="w-full py-4 border rounded-2xl font-medium">Open Property</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Start confirm -->
    <div v-if="showStartModal" class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-4">Ready to Start?</h3>
        <div class="space-y-2 text-sm mb-6">
          <p><span class="text-medium-gray">Property:</span> {{ modalTarget?.property?.title }}</p>
          <p><span class="text-medium-gray">Customer:</span> {{ maskName(modalTarget?.customer?.full_name) }}</p>
          <p><span class="text-medium-gray">Scheduled:</span> {{ formatDate(modalTarget?.inspection_date) }} · {{ modalTarget?.inspection_time }}</p>
          <p><span class="text-medium-gray">Location:</span> {{ fullAddress(modalTarget) }}</p>
        </div>
        <div class="flex gap-3">
          <button type="button" @click="showStartModal = false" class="flex-1 py-3 border rounded-2xl">Back</button>
          <button type="button" :disabled="saving" @click="startInspection" class="flex-1 py-3 bg-[var(--royal-blue)] text-white rounded-2xl">
            {{ saving ? 'Starting...' : 'Start Inspection' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===================== INSPECTION REPORT MODAL ===================== -->
    <div v-if="showReportModal" class="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-1">Inspection Report</h3>
        <p class="text-sm text-medium-gray mb-1">
          Quick summary of the visit — photos optional (max 2), video optional.
        </p>
        <p v-if="reportForm.draftSavedAt" class="text-xs text-medium-gray mb-4">
          Draft saved at {{ formatDateTime(reportForm.draftSavedAt) }}
        </p>
        <p v-else class="mb-4"></p>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium">Inspection Outcome *</label>
            <select v-model="reportForm.outcome" class="w-full px-4 py-3 rounded-2xl border mt-1">
              <option value="property_inspected">Property inspected</option>
              <option value="partial_inspection">Partial inspection</option>
              <option value="could_not_access">Could not access property</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">General Condition *</label>
            <select v-model="reportForm.generalCondition" class="w-full px-4 py-3 rounded-2xl border mt-1">
              <option value="">Select</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Property Accessibility *</label>
            <select v-model="reportForm.accessibility" class="w-full px-4 py-3 rounded-2xl border mt-1">
              <option value="">Select</option>
              <option value="accessible">Property accessible</option>
              <option value="locked">Property locked</option>
              <option value="no_access">Could not access property</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Customer Attendance</label>
            <select v-model="reportForm.customerAttended" class="w-full px-4 py-3 rounded-2xl border mt-1">
              <option :value="true">Customer attended</option>
              <option :value="false">Customer did not attend</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Inspection Notes *</label>
            <textarea
              v-model="reportForm.notes"
              rows="3"
              class="w-full px-4 py-3 rounded-2xl border mt-1"
              placeholder="e.g. Property is clean, good location, minor paint issues in bedroom..."
            />
          </div>

          <div>
            <label class="text-sm font-medium">Agent Recommendation *</label>
            <select v-model="reportForm.recommendation" class="w-full px-4 py-3 rounded-2xl border mt-1">
              <option value="">Select</option>
              <option value="highly_recommended">Highly Recommended</option>
              <option value="recommended">Recommended</option>
              <option value="neutral">Neutral</option>
              <option value="not_recommended">Not Recommended</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium">Photos (up to 2)</label>
            <p class="text-xs text-medium-gray mt-0.5 mb-2">Optional proof of visit / condition</p>
            <input
              type="file"
              accept="image/*"
              multiple
              class="block w-full text-sm"
              :disabled="reportForm.photos.length >= 2"
              @change="onPhotosSelected"
            />
            <div class="flex flex-wrap gap-2 mt-3">
              <div v-for="(p, idx) in reportForm.photos" :key="idx" class="relative">
                <img :src="p.preview || p.url" class="w-20 h-20 object-cover rounded-xl" alt="" />
                <button
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                  @click="removePhoto(Number(idx))"
                >
                  ×
                </button>
              </div>
            </div>
            <p v-if="reportForm.photos.length >= 2" class="text-xs text-medium-gray mt-2">
              Maximum 2 photos reached
            </p>
          </div>

          <div>
            <label class="text-sm font-medium">Video (optional)</label>
            <p class="text-xs text-medium-gray mt-0.5 mb-2">One short clip, max 40MB</p>
            <input
              type="file"
              accept="video/*"
              class="block w-full text-sm"
              :disabled="!!reportForm.video"
              @change="onVideoSelected"
            />
            <div v-if="reportForm.video" class="mt-2 flex items-center gap-3">
              <span class="text-sm truncate">
                {{ reportForm.video.name || reportForm.video.url || 'Video attached' }}
              </span>
              <button type="button" class="text-red-600 text-sm shrink-0" @click="clearVideo">
                Remove
              </button>
            </div>
          </div>

          <p v-if="uploadProgress" class="text-xs text-medium-gray">{{ uploadProgress }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-6">
          <button type="button" @click="showReportModal = false" class="flex-1 py-3 border rounded-2xl">
            Close
          </button>
          <button
            type="button"
            :disabled="saving"
            @click="saveDraftReport"
            class="flex-1 py-3 border border-[var(--royal-blue)] text-[var(--royal-blue)] rounded-2xl disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </button>
          <button
            type="button"
            :disabled="saving || !canSubmitReport"
            @click="submitReport"
            class="flex-1 py-3 bg-green-600 text-white rounded-2xl disabled:opacity-50"
          >
            {{ saving ? 'Submitting...' : 'Submit Report' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===================== AGENT APP REVIEW MODAL ===================== -->
    <div v-if="showAgentReviewModal" class="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold text-[var(--royal-blue)] mb-2">Rate Your Experience</h3>
        <p class="text-sm text-medium-gray mb-6">
          Thank you for submitting the report! How was your experience using LodgeNext?
        </p>

        <div class="flex justify-center gap-2 mb-6">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="agentReviewForm.rating = star"
            class="text-4xl transition-transform hover:scale-110"
            :class="star <= agentReviewForm.rating ? 'text-yellow-400' : 'text-gray-300'"
          >
            ★
          </button>
        </div>

        <textarea
          v-model="agentReviewForm.review"
          rows="4"
          class="w-full px-4 py-3 rounded-2xl border resize-none mb-6"
          placeholder="Write a short review (optional)..."
        ></textarea>

        <div class="flex gap-3">
          <button type="button" class="flex-1 py-3 border rounded-2xl" @click="skipAgentReview">
            Skip
          </button>
          <button
            type="button"
            class="flex-1 py-3 bg-[var(--royal-blue)] text-white rounded-2xl font-semibold disabled:opacity-50"
            :disabled="!agentReviewForm.rating || savingAgentReview"
            @click="submitAgentReview"
          >
            {{ savingAgentReview ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-2xl shadow-lg text-sm font-medium text-white"
      :class="toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient.js'

const STATE_MAP: Record<string, string> = {
  'Kwara': 'Kwara State', 'Ogun': 'Ogun State', 'Lagos': 'Lagos State', 'Oyo': 'Oyo State',
  'Osun': 'Osun State', 'Ondo': 'Ondo State', 'Ekiti': 'Ekiti State', 'Edo': 'Edo State',
  'Delta': 'Delta State', 'Rivers': 'Rivers State', 'FCT': 'Federal Capital Territory', 'Abuja': 'Federal Capital Territory'
}

const normalizeState = (state?: string | null) => {
  if (!state) return state || ''
  const trimmed = String(state).trim()
  if (trimmed.endsWith(' State') || trimmed === 'Federal Capital Territory') return trimmed
  return STATE_MAP[trimmed] || trimmed
}

type InspectionStatus =
  | 'pending' | 'accepted' | 'declined' | 'scheduled' | 'confirmed'
  | 'reschedule_requested' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

interface InspectionRow {
  id: string
  inspection_code?: string
  status: InspectionStatus
  agent_id?: string
  customer_id?: string
  property_id?: string
  state?: string
  city?: string
  inspection_date?: string
  inspection_time?: string
  general_condition?: string
  admin_notes?: string
  agent_notes?: string
  completion_notes?: string
  agent_accepted_at?: string
  agent_confirmed_at?: string
  agent_declined_at?: string
  agent_decline_reason?: string
  reschedule_requested_at?: string
  reschedule_reason?: string
  proposed_inspection_date?: string
  proposed_inspection_time?: string
  checked_in_at?: string
  inspection_started_at?: string
  inspection_completed_at?: string
  customer_confirmation_status?: string
  customer_confirmed_at?: string
  cancelled_by?: string
  cancellation_reason?: string
  report_draft?: any
  report_draft_saved_at?: string
  issue_reports?: any[]
  property?: any
  customer?: { id: string; full_name?: string; phone?: string } | null
}

const router = useRouter()
const placeholderImg = 'https://via.placeholder.com/400x250?text=Property'
const canContactCustomer = true
const MAX_PHOTOS = 2

const agentProfile = ref<{ city?: string; state?: string; id?: string }>({})
const inspections = ref<InspectionRow[]>([])
const selected = ref<InspectionRow | null>(null)
const modalTarget = ref<InspectionRow | null>(null)
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const activeTab = ref('all')
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
const uploadProgress = ref('')

const showDeclineModal = ref(false)
const showRescheduleModal = ref(false)
const showStartModal = ref(false)
const showNoShowModal = ref(false)
const showCancelModal = ref(false)
const showIssueModal = ref(false)
const showReportModal = ref(false)

const showAgentReviewModal = ref(false)
const savingAgentReview = ref(false)
const agentReviewTarget = ref<InspectionRow | null>(null)
const agentReviewForm = ref({ rating: 0, review: '' })

const declineForm = ref({ reason: '', notes: '' })
const rescheduleForm = ref({ date: '', time: '', reason: '', notes: '' })
const noShowForm = ref({ waited: 20, note: '' })
const cancelReason = ref('')
const issueForm = ref({ type: '', note: '' })

const reportForm = ref<any>({
  outcome: 'property_inspected',
  generalCondition: '',
  accessibility: '',
  customerAttended: true,
  notes: '',
  recommendation: '',
  photos: [] as any[],
  video: null as any,
  draftSavedAt: null as string | null
})

let channel: ReturnType<typeof supabase.channel> | null = null

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Action Required', value: 'action' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Today', value: 'today' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3200)
}

const isToday = (d?: string) => d ? new Date(d).toDateString() === new Date().toDateString() : false
const isUpcomingDate = (d?: string) => {
  if (!d) return false
  const date = new Date(d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return date >= now
}

const needsAction = (i: InspectionRow) => {
  if (i.status === 'pending' || i.status === 'scheduled') return true
  if (i.status === 'in_progress' && hasIncompleteReport(i)) return true
  return false
}

const hasIncompleteReport = (i: InspectionRow) => i.status === 'in_progress' && !i.inspection_completed_at

const actionRequiredList = computed(() => inspections.value.filter(needsAction).slice(0, 6))

const stats = computed(() => {
  const list = inspections.value
  return {
    total: list.length,
    actionRequired: list.filter(needsAction).length,
    today: list.filter(i => isToday(i.inspection_date)).length,
    completed: list.filter(i => i.status === 'completed').length
  }
})

const filteredInspections = computed(() => {
  let result = [...inspections.value]

  if (activeTab.value === 'action') result = result.filter(needsAction)
  else if (activeTab.value === 'upcoming') {
    result = result.filter(i => isUpcomingDate(i.inspection_date) && !['completed', 'cancelled', 'no_show', 'declined'].includes(i.status))
  } else if (activeTab.value === 'today') result = result.filter(i => isToday(i.inspection_date))
  else if (activeTab.value === 'in_progress') result = result.filter(i => i.status === 'in_progress')
  else if (activeTab.value === 'completed') result = result.filter(i => i.status === 'completed')
  else if (activeTab.value === 'cancelled') result = result.filter(i => ['cancelled', 'no_show', 'declined'].includes(i.status))

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.property?.title?.toLowerCase().includes(term) ||
      i.inspection_code?.toLowerCase().includes(term) ||
      i.city?.toLowerCase().includes(term) ||
      i.property?.area?.toLowerCase().includes(term) ||
      i.customer?.full_name?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value) result = result.filter(i => i.status === statusFilter.value)

  if (dateFilter.value) {
    const now = new Date()
    result = result.filter(i => {
      if (!i.inspection_date) return false
      const date = new Date(i.inspection_date)
      if (dateFilter.value === 'today') return isToday(i.inspection_date)
      if (dateFilter.value === 'tomorrow') {
        const t = new Date(now)
        t.setDate(t.getDate() + 1)
        return date.toDateString() === t.toDateString()
      }
      if (dateFilter.value === 'week') {
        const week = new Date(now)
        week.setDate(week.getDate() + 7)
        return date >= now && date <= week
      }
      if (dateFilter.value === 'month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      if (dateFilter.value === 'past') return date < now
      return true
    })
  }

  return result
})

const emptyTitle = computed(() => {
  if (searchQuery.value || statusFilter.value || dateFilter.value) return 'No inspections match your search'
  if (activeTab.value === 'action') return "You're all caught up"
  if (activeTab.value === 'upcoming') return 'No upcoming inspections'
  if (activeTab.value === 'completed') return 'No completed inspections'
  return 'No inspections found'
})

const emptyMessage = computed(() => {
  if (activeTab.value === 'action') return 'No assignments need your attention right now.'
  return 'Try adjusting filters or check back later.'
})

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-red-100 text-red-700', accepted: 'bg-cyan-100 text-cyan-700', declined: 'bg-gray-200 text-gray-700',
    scheduled: 'bg-purple-100 text-purple-700', confirmed: 'bg-green-100 text-green-700',
    reschedule_requested: 'bg-indigo-100 text-indigo-700', in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700', no_show: 'bg-gray-100 text-gray-700'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const displayStatus = (status: string) => status?.replace(/_/g, ' ') || '—'

const actionBadge = (item: InspectionRow) => {
  if (item.status === 'pending') return 'NEW ASSIGNMENT'
  if (item.status === 'scheduled') return 'AWAITING CONFIRMATION'
  if (item.status === 'in_progress') return 'REPORT INCOMPLETE'
  return 'ACTION REQUIRED'
}

const rowBadge = (item: InspectionRow) => {
  if (item.status === 'pending') return 'NEW ASSIGNMENT'
  if (item.status === 'scheduled') return 'AWAITING CONFIRMATION'
  if (item.status === 'confirmed' && item.customer_confirmation_status === 'confirmed') return 'CUSTOMER CONFIRMED'
  if (item.status === 'reschedule_requested') return 'RESCHEDULE REQUESTED'
  if (item.status === 'in_progress' && hasIncompleteReport(item)) return 'REPORT INCOMPLETE'
  if (canStart(item)) return 'START NOW'
  if (item.status === 'cancelled') {
    if (item.cancelled_by === 'admin') return 'CANCELLED BY ADMIN'
    if (item.cancelled_by === 'customer') return 'CANCELLED BY CUSTOMER'
    if (item.cancelled_by === 'agent') return 'CANCELLED BY AGENT'
  }
  return ''
}

const rowBadgeClass = (item: InspectionRow) => {
  const b = rowBadge(item)
  if (b.includes('NEW') || b.includes('ACTION')) return 'bg-red-100 text-red-700'
  if (b.includes('AWAITING')) return 'bg-purple-100 text-purple-700'
  if (b.includes('CUSTOMER')) return 'bg-green-100 text-green-700'
  if (b.includes('START')) return 'bg-blue-100 text-blue-700'
  if (b.includes('REPORT')) return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-600'
}

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const formatDateTime = (d?: string) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'

const maskName = (name?: string): string => {
  const trimmed = name?.trim()
  if (!trimmed) return 'Customer'
  const parts = trimmed.split(/\s+/).filter(Boolean)
  const firstName = parts[0] ?? 'Customer'
  if (parts.length === 1) return `${firstName.charAt(0)}.`
  const lastName = parts[parts.length - 1] ?? ''
  return `${firstName} ${lastName.charAt(0)}.`
}

const fullAddress = (item?: InspectionRow | null) => {
  if (!item) return '—'
  return [item.property?.address, item.property?.area, item.city || item.property?.city, normalizeState(item.state || item.property?.state)].filter(Boolean).join(', ') || '—'
}

const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, '').replace(/^0/, '234')

const getInspectionDateTime = (item: InspectionRow) => {
  if (!item.inspection_date) return null
  const time = item.inspection_time || '09:00'
  return new Date(`${item.inspection_date}T${time.length === 5 ? time + ':00' : time}`)
}

const countdownText = (item: InspectionRow) => {
  const dt = getInspectionDateTime(item)
  if (!dt || !['scheduled', 'confirmed'].includes(item.status)) return ''
  const now = new Date()
  const diff = dt.getTime() - now.getTime()
  if (diff <= 0 && Math.abs(diff) < 2 * 60 * 60 * 1000) return 'Inspection Now'
  if (isToday(item.inspection_date) && diff > 0) {
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `Inspection Today · Starts in ${mins} minutes`
    const hrs = Math.floor(mins / 60)
    return `Inspection Today · Starts in ${hrs} hr ${mins % 60} min`
  }
  if (diff > 0) {
    const days = Math.floor(diff / 86400000)
    const hrs = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return `Inspection starts in ${days}d ${hrs}h ${mins}m`
  }
  return ''
}

const statusMessage = (item: InspectionRow) => {
  const map: Record<string, { title: string; body: string }> = {
    pending: { title: 'New Assignment', body: 'Admin assigned this inspection to you. Accept or decline.' },
    accepted: { title: 'Accepted', body: 'You accepted this inspection. Waiting for final schedule confirmation if needed.' },
    scheduled: { title: 'Scheduled', body: 'Inspection has been scheduled. Please confirm your availability.' },
    confirmed: { title: 'Confirmed', body: 'You confirmed this inspection. Please attend at the scheduled date and time.' },
    reschedule_requested: { title: 'Reschedule Requested', body: 'Your reschedule request is with admin for review.' },
    in_progress: { title: 'In Progress', body: 'Inspection started. Complete and submit your report.' },
    completed: { title: 'Completed', body: 'Inspection report submitted.' },
    cancelled: {
      title: item.cancelled_by === 'admin' ? 'Cancelled by Admin' : item.cancelled_by === 'customer' ? 'Cancelled by Customer' : 'Cancelled by Agent',
      body: item.cancellation_reason || 'This inspection was cancelled.'
    },
    no_show: { title: 'Customer No-Show', body: 'Customer did not attend the inspection.' },
    declined: { title: 'Declined', body: item.agent_decline_reason || 'You declined this assignment.' }
  }
  return map[item.status] || { title: displayStatus(item.status), body: '' }
}

const customerConfirmationLabel = (item: InspectionRow) => {
  if (item.customer_confirmation_status === 'confirmed') return '✓ Customer Confirmed'
  if (item.customer_confirmation_status === 'cancelled') return '✕ Customer Cancelled'
  return '⏳ Awaiting Customer Confirmation'
}

const canStart = (item: InspectionRow) => {
  if (!['confirmed', 'scheduled'].includes(item.status)) return false
  if (['cancelled', 'completed', 'declined', 'no_show'].includes(item.status)) return false
  if (!item.inspection_date) return true
  const dt = getInspectionDateTime(item)
  if (!dt) return true
  const now = new Date()
  const earliest = new Date(dt.getTime() - 2 * 60 * 60 * 1000)
  return now >= earliest || isToday(item.inspection_date)
}

const canSubmitReport = computed(() => !!(
  reportForm.value.outcome &&
  reportForm.value.generalCondition &&
  reportForm.value.accessibility &&
  reportForm.value.notes?.trim() &&
  reportForm.value.recommendation
))

const buildTimeline = (item: InspectionRow) => {
  const steps = [
    { key: 'created', label: 'Inspection Assigned', at: (item as any).created_at, done: true, note: 'Inspection has been assigned to an agent.' },
    { key: 'accepted', label: 'Agent Accepted', at: item.agent_accepted_at, done: !!item.agent_accepted_at, note: 'The assigned agent has accepted the inspection.' },
    { key: 'scheduled', label: 'Inspection Scheduled', at: item.inspection_date, done: ['scheduled', 'confirmed', 'reschedule_requested', 'in_progress', 'completed'].includes(item.status), note: 'The inspection has been scheduled.' },
    { key: 'confirmed', label: 'Agent Confirmed', at: item.agent_confirmed_at, done: !!item.agent_confirmed_at, note: 'The assigned agent has confirmed the inspection.' },
    { key: 'customer', label: 'Customer Confirmed', at: item.customer_confirmed_at, done: item.customer_confirmation_status === 'confirmed', note: 'The customer has confirmed the inspection.' },
    { key: 'checkin', label: 'Agent Checked In', at: item.checked_in_at, done: !!item.checked_in_at, note: 'The agent has checked in at the inspection location.' },
    { key: 'started', label: 'Inspection Started', at: item.inspection_started_at, done: !!item.inspection_started_at, note: 'The inspection is currently underway.' },
    { key: 'completed', label: 'Report Submitted', at: item.inspection_completed_at, done: item.status === 'completed', note: 'The inspection report has been submitted.' }
  ]
  return steps.map(s => ({
    ...s,
    current: !s.done && (
      (s.key === 'accepted' && item.status === 'pending') ||
      (s.key === 'confirmed' && item.status === 'scheduled') ||
      (s.key === 'started' && item.status === 'confirmed') ||
      (s.key === 'completed' && item.status === 'in_progress')
    )
  }))
}

/* ---------- data ---------- */
const fetchAgentProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('id, full_name, city, state, role').eq('id', user.id).single()
  if (data) agentProfile.value = { ...data, state: normalizeState(data.state) }
  return user
}

const fetchInspections = async () => {
  loading.value = true
  try {
    const user = await fetchAgentProfile()
    if (!user) { inspections.value = []; return }

    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        property:properties!property_id (id, title, cover_image, area, city, state, address, price, bedrooms, bathrooms, property_type, status),
        customer:profiles!customer_id (id, full_name, phone)
      `)
      .eq('agent_id', user.id)
      .order('inspection_date', { ascending: true, nullsFirst: false })

    if (error) throw error

    inspections.value = (data || []).map((row: any) => ({
      ...row,
      state: normalizeState(row.state),
      property: row.property ? { ...row.property, state: normalizeState(row.property.state) } : null
    })) as InspectionRow[]
  } catch (err: any) {
    console.error(err)
    showToast(err.message || 'Failed to load inspections', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await fetchInspections()
  if (selected.value) selected.value = inspections.value.find(i => i.id === selected.value!.id) || null
}

const openDrawer = (item: InspectionRow) => { selected.value = item }

const updateInspection = async (id: string, payload: Record<string, any>) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  if (payload.state) payload.state = normalizeState(payload.state)

  const { data, error } = await supabase
    .from('inspections')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('agent_id', user.id)
    .select(`
      *,
      property:properties!property_id (id, title, cover_image, area, city, state, address, price, bedrooms, bathrooms, property_type, status),
      customer:profiles!customer_id (id, full_name, phone)
    `)
    .maybeSingle()

  if (error) throw error
  if (data) {
    data.state = normalizeState(data.state)
    if (data.property) data.property.state = normalizeState(data.property.state)
  }
  return data as InspectionRow
}

const applyLocalUpdate = (data: InspectionRow | null) => {
  if (!data) return
  const idx = inspections.value.findIndex(i => i.id === data.id)
  if (idx !== -1) inspections.value[idx] = { ...inspections.value[idx], ...data }
  if (selected.value?.id === data.id) selected.value = { ...selected.value, ...data }
}

/* ---------- actions ---------- */
const acceptInspection = async (item: InspectionRow) => {
  saving.value = true
  try {
    const data = await updateInspection(item.id, { status: 'accepted', agent_accepted_at: new Date().toISOString(), agent_response_at: new Date().toISOString() })
    applyLocalUpdate(data)
    showToast('Inspection accepted successfully.')
    await fetchInspections()
  } catch (e: any) {
    showToast(e.message || 'Failed to accept', 'error')
  } finally { saving.value = false }
}

const openDecline = (item: InspectionRow) => {
  modalTarget.value = item
  declineForm.value = { reason: '', notes: '' }
  showDeclineModal.value = true
}

const confirmInspection = async (item: InspectionRow) => {
  saving.value = true
  try {
    const data = await updateInspection(item.id, { status: 'confirmed', agent_confirmed_at: new Date().toISOString() })
    applyLocalUpdate(data)
    showToast('Inspection confirmed. Customer and admin have been notified.')
    await fetchInspections()
  } catch (e: any) {
    showToast(e.message || 'Failed to confirm', 'error')
  } finally { saving.value = false }
}

const openReschedule = (item: InspectionRow) => {
  modalTarget.value = item
  rescheduleForm.value = { date: '', time: '', reason: '', notes: '' }
  showRescheduleModal.value = true
}

const checkIn = async (item: InspectionRow) => {
  saving.value = true
  try {
    let lat: number | null = null
    let lng: number | null = null
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
        )
        lat = pos.coords.latitude
        lng = pos.coords.longitude
      } catch { /* optional */ }
    }
    const data = await updateInspection(item.id, { checked_in_at: new Date().toISOString(), check_in_latitude: lat, check_in_longitude: lng })
    applyLocalUpdate(data)
    showToast('Checked in at property.')
  } catch (e: any) {
    showToast(e.message || 'Check-in failed', 'error')
  } finally { saving.value = false }
}

const openStartConfirm = (item: InspectionRow) => {
  modalTarget.value = item
  showStartModal.value = true
}

const startInspection = async () => {
  if (!modalTarget.value) return
  saving.value = true
  try {
    const data = await updateInspection(modalTarget.value.id, { status: 'in_progress', inspection_started_at: new Date().toISOString() })
    applyLocalUpdate(data)
    showStartModal.value = false
    showToast('Inspection started')
    await fetchInspections()
  } catch (e: any) {
    showToast(e.message || 'Failed to start', 'error')
  } finally { saving.value = false }
}

const openNoShow = (item: InspectionRow) => {
  modalTarget.value = item
  noShowForm.value = { waited: 20, note: '' }
  showNoShowModal.value = true
}

const openCancel = (item: InspectionRow) => {
  modalTarget.value = item
  cancelReason.value = ''
  showCancelModal.value = true
}

const openIssue = (item: InspectionRow) => {
  modalTarget.value = item
  issueForm.value = { type: '', note: '' }
  showIssueModal.value = true
}

/* ---------- REPORT ---------- */
const openReport = (item: InspectionRow) => {
  modalTarget.value = item
  const draft = item.report_draft || {}
  reportForm.value = {
    outcome: draft.outcome || 'property_inspected',
    generalCondition: draft.generalCondition || item.general_condition || '',
    accessibility: draft.accessibility || '',
    customerAttended: draft.customerAttended ?? true,
    notes: draft.notes || '',
    recommendation: draft.recommendation || '',
    photos: (draft.photos || []).slice(0, MAX_PHOTOS),
    video: draft.video || null,
    draftSavedAt: item.report_draft_saved_at || null
  }
  showReportModal.value = true
}

const onPhotosSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  const remaining = MAX_PHOTOS - reportForm.value.photos.length

  if (remaining <= 0) {
    showToast('You can only upload up to 2 photos', 'error')
    input.value = ''
    return
  }

  for (const file of files.slice(0, remaining)) {
    if (file.size > 8 * 1024 * 1024) {
      showToast(`${file.name} is too large (max 8MB)`, 'error')
      continue
    }
    reportForm.value.photos.push({
      file,
      preview: URL.createObjectURL(file),
      category: 'other'
    })
  }

  if (files.length > remaining) {
    showToast('Only 2 photos allowed — extra files ignored', 'error')
  }
  input.value = ''
}

const removePhoto = (idx: number) => {
  const photo = reportForm.value.photos[idx]
  if (photo?.preview?.startsWith?.('blob:')) {
    URL.revokeObjectURL(photo.preview)
  }
  reportForm.value.photos.splice(idx, 1)
}

const onVideoSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 40 * 1024 * 1024) {
    showToast('Video too large (max 40MB)', 'error')
    input.value = ''
    return
  }

  reportForm.value.video = file
  input.value = ''
}

const clearVideo = () => {
  reportForm.value.video = null
}

const compressImage = async (file: File, maxWidth = 1600, quality = 0.72): Promise<Blob> => {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width * scale
  canvas.height = bitmap.height * scale
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality))
}

const uploadMedia = async (inspectionId: string, agentId: string) => {
  const results: { type: string; url: string; path: string; category: string; file_size?: number }[] = []
  let i = 0
  const SUPABASE_URL = 'https://kmkcrttmchdvnpggqwey.supabase.co'

  for (const photo of reportForm.value.photos) {
    if (photo.url && photo.path) {
      results.push({ type: 'photo', url: photo.url, path: photo.path, category: photo.category || 'other' })
      continue
    }
    if (!photo.file) continue
    i++
    uploadProgress.value = `Uploading photo ${i}/${reportForm.value.photos.length}...`
    const blob = await compressImage(photo.file)
    const path = `${agentId}/${inspectionId}/photo-${Date.now()}-${i}.jpg`
    const { error: uploadError } = await supabase.storage.from('inspection-evidence').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
    const { data: urlData } = supabase.storage.from('inspection-evidence').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/inspection-evidence/${path}`
    results.push({ type: 'photo', url: publicUrl, path, category: photo.category || 'other', file_size: blob.size })
  }

  if (reportForm.value.video && reportForm.value.video instanceof File) {
    uploadProgress.value = 'Uploading video...'
    const path = `${agentId}/${inspectionId}/video-${Date.now()}.mp4`
    const { error: videoError } = await supabase.storage.from('inspection-evidence').upload(path, reportForm.value.video, {
      contentType: reportForm.value.video.type || 'video/mp4', upsert: false
    })
    if (videoError) throw new Error(`Video upload failed: ${videoError.message}`)
    const { data: urlData } = supabase.storage.from('inspection-evidence').getPublicUrl(path)
    const publicUrl = urlData?.publicUrl || `${SUPABASE_URL}/storage/v1/object/public/inspection-evidence/${path}`
    results.push({ type: 'video', url: publicUrl, path, category: 'video', file_size: reportForm.value.video.size })
  }

  uploadProgress.value = ''
  return results
}

const saveDraftReport = async () => {
  if (!modalTarget.value) return
  saving.value = true
  try {
    const draft = {
      outcome: reportForm.value.outcome,
      generalCondition: reportForm.value.generalCondition,
      accessibility: reportForm.value.accessibility,
      customerAttended: reportForm.value.customerAttended,
      notes: reportForm.value.notes,
      recommendation: reportForm.value.recommendation,
      photos: reportForm.value.photos.map((p: any) => ({
        url: p.url,
        path: p.path,
        category: p.category || 'other'
      })),
      video: null
    }
    const now = new Date().toISOString()
    const data = await updateInspection(modalTarget.value.id, {
      report_draft: draft,
      report_draft_saved_at: now
    })
    applyLocalUpdate(data)
    reportForm.value.draftSavedAt = now
    showToast(`Draft saved at ${formatDateTime(now)}`)
  } catch (e: any) {
    showToast(e.message || 'Failed to save draft', 'error')
  } finally {
    saving.value = false
  }
}

const submitReport = async () => {
  if (!modalTarget.value || !canSubmitReport.value) return
  saving.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const media = await uploadMedia(modalTarget.value.id, user.id)

    if (media.length > 0) {
      const rows = media.map((m) => ({
        inspection_id: modalTarget.value!.id,
        agent_id: user.id,
        media_type: m.type,
        category: m.category,
        url: m.url,
        storage_path: m.path,
        file_size: m.file_size || null
      }))
      const { error: mediaError } = await supabase.from('inspection_media').insert(rows)
      if (mediaError) throw new Error(`Could not save media: ${mediaError.message}`)
    }

    const data = await updateInspection(modalTarget.value.id, {
      status: 'completed',
      inspection_completed_at: new Date().toISOString(),
      inspection_outcome: reportForm.value.outcome,
      general_condition: reportForm.value.generalCondition,
      property_accessibility: reportForm.value.accessibility,
      customer_attended: reportForm.value.customerAttended,
      agent_recommendation: reportForm.value.recommendation,
      agent_notes: reportForm.value.notes,
      completion_notes: reportForm.value.notes,
      report_draft: null,
      report_draft_saved_at: null
    })

    applyLocalUpdate(data)
    showReportModal.value = false
    showToast('Inspection report submitted successfully.')

    agentReviewTarget.value = data || modalTarget.value
    agentReviewForm.value = { rating: 0, review: '' }
    showAgentReviewModal.value = true

    await fetchInspections()
  } catch (e: any) {
    console.error(e)
    showToast(e.message || 'Failed to submit report', 'error')
  } finally {
    saving.value = false
    uploadProgress.value = ''
  }
}

/* ---------- AGENT APP REVIEW ---------- */
const submitAgentReview = async () => {
  if (!agentReviewForm.value.rating || !agentReviewTarget.value) return

  savingAgentReview.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Please login')

    const { error } = await supabase.from('app_reviews').insert({
      customer_id: user.id,
      inspection_id: agentReviewTarget.value.id,
      property_id: agentReviewTarget.value.property_id || agentReviewTarget.value.property?.id,
      rating: agentReviewForm.value.rating,
      review: agentReviewForm.value.review || null,
      is_published: false,
      reviewer_type: 'agent'
    })

    if (error) throw error

    showAgentReviewModal.value = false
    showToast('Thank you for your review!')
  } catch (err: any) {
    console.error(err)
    showToast(err.message || 'Failed to submit review', 'error')
  } finally {
    savingAgentReview.value = false
  }
}

const skipAgentReview = () => {
  showAgentReviewModal.value = false
  showToast('You can rate us later')
}

/* ---------- helpers ---------- */
const openMaps = (item: InspectionRow) => {
  const q = encodeURIComponent(fullAddress(item))
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
}

const copyText = async (text: string, msg: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast(msg)
  } catch {
    showToast('Copy failed', 'error')
  }
}

const copyAddress = (item: InspectionRow) => copyText(fullAddress(item), 'Address copied')

const openProperty = () => {
  const id = selected.value?.property?.id || selected.value?.property_id
  if (id) router.push(`/agent/properties/${id}`)
}

const setupRealtime = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return
  if (channel) await supabase.removeChannel(channel)

  channel = supabase
    .channel(`agent-inspections-${session.user.id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'inspections',
      filter: `agent_id=eq.${session.user.id}`
    }, async () => { await refreshData() })
    .subscribe()
}

onMounted(async () => {
  await fetchInspections()
  await setupRealtime()
})

onUnmounted(async () => {
  if (channel) await supabase.removeChannel(channel)
})
</script>