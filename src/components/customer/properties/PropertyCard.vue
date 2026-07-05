<template>
  <div class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full">
    <!-- Image Section -->
    <div class="relative h-64 overflow-hidden">
      <img
        :src="property.cover_image || 'https://via.placeholder.com/600x400?text=No+Image'"
        :alt="property.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Verified Badge -->
      <div v-if="property.profiles?.is_verified" 
           class="absolute top-4 left-4 bg-white/95 text-[#0025cc] text-xs font-semibold px-3 py-1 rounded-2xl flex items-center gap-1 shadow">
        <span class="text-green-500">✓</span> Verified
      </div>

      <!-- Save Button -->
      <button
        @click.stop="toggleSave"
        class="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-2xl flex items-center justify-center shadow transition-all hover:scale-110"
      >
        <Heart 
          :class="[isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600']" 
        />
      </button>

      <!-- Purpose Badge -->
      <div class="absolute bottom-4 left-4 bg-[var(--light-blue)] text-[var(--royal-blue)] text-xs font-medium px-4 py-1.5 rounded-2xl">
        {{ property.purpose }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-semibold text-lg leading-tight text-gray-900 line-clamp-2 pr-2">
            {{ property.title }}
          </h3>
          <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
            📍 {{ property.area }}, {{ property.city }}
          </p>
        </div>

        <div class="text-right flex-shrink-0">
          <p class="font-bold text-2xl text-[#0025cc]">
            ₦{{ property.price?.toLocaleString() }}
          </p>
          <p class="text-xs text-gray-500">per year</p>
        </div>
      </div>

      <!-- Views -->
      <div class="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
        <span class="text-base">👁️</span>
        <span>{{ formatViews(viewCount) }} views</span>
      </div>

      <!-- Features -->
      <div class="flex gap-5 text-sm mb-5">
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🛏️</span>
          <span class="font-medium">{{ property.bedrooms || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚿</span>
          <span class="font-medium">{{ property.bathrooms || 0 }}</span>
        </div>
        <div v-if="property.toilets" class="flex items-center gap-1">
          <span class="text-[#0025cc]">🚽</span>
          <span class="font-medium">{{ property.toilets }}</span>
        </div>
      </div>

      <!-- Amenities Preview -->
      <div v-if="property.amenities?.length" class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="(amenity, i) in property.amenities.slice(0, 3)"
          :key="i"
          class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-2xl"
        >
          {{ amenity }}
        </span>
        <span v-if="property.amenities.length > 3" class="text-xs text-gray-400 self-center">
          +{{ property.amenities.length - 3 }}
        </span>
      </div>

      <!-- Agent Info -->
      <div class="mt-auto pt-4 border-t flex items-center gap-3">
        <img
          :src="property.profiles?.avatar_url || 'https://via.placeholder.com/40'"
          class="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ property.profiles?.full_name || 'Agent' }}
          </p>
          <p v-if="property.profiles?.agency_name" class="text-xs text-gray-500 truncate">
            {{ property.profiles.agency_name }}
          </p>
        </div>

        <!-- View Details Button -->
        <button
          @click.stop="viewDetails"
          class="bg-[#0025cc] hover:bg-[#001fa3] text-white text-sm font-medium px-6 py-2.5 rounded-2xl transition-all flex items-center gap-1"
        >
          👁️ View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Heart } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabaseClient.js';

const props = defineProps<{
  property: any;
}>();

const router = useRouter();
const viewCount = ref(0);
const isSaved = ref(false);

const formatViews = (count: number) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 10000) return Math.floor(count / 1000) + 'K';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toLocaleString();
};

const toggleSave = () => {
  isSaved.value = !isSaved.value;
  console.log('Toggled save for property:', props.property.id);
};

const loadViewCount = async () => {
  if (!props.property.id) return;

  const { count } = await supabase
    .from('property_views')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', props.property.id);

  viewCount.value = count || 0;
};

const viewDetails = async () => {
  const propertyId = props.property.id;

  // Record unique view
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from('property_views')
      .select('id')
      .eq('property_id', propertyId)
      .eq('user_id', user.id)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase
        .from('property_views')
        .insert({
          property_id: propertyId,
          user_id: user.id
        });
    }
  }

  router.push(`/customer/properties/${propertyId}`);
};

onMounted(() => {
  loadViewCount();
});
</script>