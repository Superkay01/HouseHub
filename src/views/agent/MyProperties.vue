<template>
  <section class="py-10 bg-[#ebf8ff] min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 bg-[var(--royal-blue)] text-[var(--white)] px-6 py-2 rounded-full text-sm font-medium mb-4">
          <i class="fas fa-home"></i>
          <span>MY LISTINGS</span>
        </div> 
      </div>
      <div class="flex items-center justify-between">
            <div class="">
                <h2 class="text-xl md:text-3xl font-bold text-[var(--royal-blue)] tracking-tight mb-4 heading-font">
                My Properties
               </h2>
               <p class="max-w-2xl mx-auto text-xl text-[var(--royal-blue)] opacity-90">
               Manage all your property listings in one place
               </p>
            </div>
            <div class="">
                <!-- Add New Button -->
            <div class="flex justify-end mb-10">
                <button 
                @click="goToAddProperty"
                class="group inline-flex items-center gap-3 bg-[#0025cc] hover:bg-[#546cdd] text-white font-semibold text-lg px-8 py-4 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30"
                >
                <span class="text-2xl leading-none">+</span>
                Add New Property
                </button>
            </div>
            </div>
        </div>
      

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-32">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="properties.length === 0" class="text-center py-32">
        <div class="text-7xl mb-6 opacity-50">🏠</div>
        <h3 class="text-3xl font-semibold text-white mb-3">No Properties Listed Yet</h3>
        <p class="text-xl text-white/70 mb-8">Start building your portfolio by adding your first property</p>
        <button 
          @click="goToAddProperty"
          class="bg-white text-[#0025cc] font-semibold px-10 py-4 rounded-3xl text-lg hover:bg-gray-100 transition"
        >
          Add Your First Property
        </button>
      </div>

      <!-- Properties Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="property in properties" 
          :key="property.id"
          class="property-card bg-white rounded-3xl overflow-hidden border border-gray-100 group cursor-pointer"
        >
          <!-- Image -->
          <div class="relative h-72 overflow-hidden">
            <img 
              v-if="property.cover_image"
              :src="property.cover_image" 
              class="property-image w-full h-full object-cover"
              alt="Property cover"
            >
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-6xl">
              🏠
            </div>

            <!-- Status -->
            <div class="absolute top-6 left-6">
              <span 
                :class="getStatusClass(property.status)"
                class="px-5 py-2 text-sm font-semibold rounded-2xl shadow-lg"
              >
                {{ property.status }}
              </span>
            </div>

            <!-- Price -->
            <div class="price-tag absolute top-6 right-6 text-white px-5 py-2 rounded-2xl font-semibold shadow-lg">
              <span class="text-2xl">₦{{ property.price.toLocaleString() }}</span>
            </div>

            <!-- Favorite -->
            <button 
              @click.stop="toggleFavorite(property.id)"
              class="absolute bottom-6 right-6 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md transition-all hover:scale-110"
            >
              <i class="fas fa-heart text-xl text-gray-400 group-hover:text-red-500 transition-colors"></i>
            </button>

            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-2xl font-semibold text-[#424242] line-clamp-2">{{ property.title }}</h3>
                <div class="flex items-center gap-1.5 text-[#707070] mt-2">
                  <i class="fas fa-map-marker-alt text-[#546cdd]"></i>
                  <span>{{ property.city }}, {{ property.state }}</span>
                </div>
              </div>
              <span class="inline-block bg-[#ebf8ff] text-[#0025cc] text-xs font-medium px-4 py-1.5 rounded-2xl whitespace-nowrap">
                {{ property.property_type }}
              </span>
            </div>

            <!-- Features -->
            <div class="flex justify-between border-t border-b border-gray-100 py-6 my-6">
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-[#ebf8ff] rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Bed class="w-5 h-5"/>
                </div>
                <div>
                  <div class="text-xs text-gray-500">BEDROOMS</div>
                  <div class="font-semibold text-lg">{{ property.bedrooms || 0 }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-[#ebf8ff] rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Bath class="w-5 h-5"/>
                </div>
                <div>
                  <div class="text-xs text-gray-500">BATHROOMS</div>
                  <div class="font-semibold text-lg">{{ property.bathrooms || 0 }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-[#ebf8ff] rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Car class="w-5 h-5"/>
                </div>
                <div>
                  <div class="text-xs text-gray-500">PARKING</div>
                  <div class="font-semibold text-lg">{{ property.parking_spaces || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <button 
                @click.stop="viewProperty(property.id)"
                class="py-4 border border-[#0025cc] text-[#0025cc] hover:bg-[#0025cc] hover:text-white font-medium rounded-2xl transition-all"
              >
                View Details
              </button>
              <button 
                @click.stop="editProperty(property.id)"
                class="py-4 bg-[#0025cc] hover:bg-[#546cdd] text-white font-medium rounded-2xl transition-all"
              >
                Edit Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { Bed, Bath, Car } from 'lucide-vue-next'

const router = useRouter()

const properties = ref<any[]>([])
const loading = ref(true)

const fetchMyProperties = async () => {
  loading.value = true

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }

  const agentId = user.user_metadata?.agent_id || user.id

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  } else {
    properties.value = data || []
  }

  loading.value = false
}

const getStatusClass = (status: string) => {
  if (status === 'published') return 'bg-green-500 text-white'
  if (status === 'pending') return 'bg-yellow-500 text-white'
  return 'bg-gray-500 text-white'
}

const viewProperty = (id: string) => {
  router.push(`/properties/${id}`)
}
const editProperty = (id: string) => router.push(`/properties/edit/${id}`)
const goToAddProperty = () => router.push('/agent/add-property')

const toggleFavorite = (id: string) => {
  console.log('Favorite toggled for:', id)
  // Implement favorite logic if needed
}

onMounted(fetchMyProperties)
</script>

<style scoped>
.property-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px -12px rgb(0 37 204 / 0.15);
}

.property-image {
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.property-card:hover .property-image {
  transform: scale(1.08);
}

.price-tag {
  background: linear-gradient(135deg, #0025cc, #2e4cd5);
}
</style>