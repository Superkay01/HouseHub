<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-[#ebf8ff] text-[#0025cc] px-6 py-2 rounded-full text-sm font-medium mb-4">
          <i class="fas fa-star"></i>
          <span>PREMIUM SELECTION</span>
        </div>
        <h2 class="text-5xl md:text-6xl font-bold text-[#424242] tracking-tight mb-4 heading-font">
          Featured Homes
        </h2>
        <p class="max-w-2xl mx-auto text-xl text-[#707070]">
          Explore some of the most sought-after rental properties within Ilorin and Ijebu Ode. 
          Verified listings, trusted agents, and premium locations.
        </p>
      </div>

      <!-- Properties Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="property in properties" 
          :key="property.id"
          class="property-card bg-white rounded-3xl overflow-hidden border border-gray-100 group"
        >
          <!-- Image -->
          <div class="relative h-72 overflow-hidden">
            <img 
              :src="property.image" 
              class="property-image w-full h-full object-cover"
              alt="Property image"
            >
            
            <!-- Price -->
            <div class="price-tag absolute top-6 left-6 text-white px-5 py-2 rounded-2xl font-semibold shadow-lg">
              <span class="text-2xl">₦{{ property.price }}</span>
              <span class="text-sm opacity-75">/{{ property.period }}</span>
            </div>

            <!-- Verified Badge -->
            <div v-if="property.verified" 
                 class="verification-badge absolute top-6 right-6 bg-[#00db00] text-white text-xs font-bold px-4 py-1.5 rounded-2xl flex items-center gap-1 shadow-md">
              <i class="fas fa-shield-alt"></i>
              <span>VERIFIED</span>
            </div>

            <!-- Favorite -->
            <button 
              @click.stop="toggleFavorite(property.id)"
              class="absolute bottom-6 right-6 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md transition-all hover:scale-110"
            >
              <i class="fas fa-heart text-xl text-gray-400 group-hover:text-red-500 transition-colors"></i>
            </button>

            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-2xl font-semibold text-[#424242]">{{ property.title }}</h3>
                <div class="flex items-center gap-1.5 text-[#707070] mt-2">
                  <i class="fas fa-map-marker-alt text-[#546cdd]"></i>
                  <span>{{ property.location }}</span>
                </div>
              </div>
              <span class="inline-block bg-[#ebf8ff] text-[#0025cc] text-xs font-medium px-3 py-1 rounded-2xl">
                {{ property.type }}
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
                  <div class="font-semibold text-lg">{{ property.beds }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-[#ebf8ff] rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Bath class="w-5 h-5"/>
                </div>
                <div>
                  <div class="text-xs text-gray-500">BATHROOMS</div>
                  <div class="font-semibold text-lg">{{ property.baths }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 bg-[#ebf8ff] rounded-2xl flex items-center justify-center text-[#0025cc]">
                  <Car class="w-5 h-5"/>
                </div>
                <div>
                  <div class="text-xs text-gray-500">PARKING</div>
                  <div class="font-semibold text-lg">{{ property.parking }}</div>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <button 
                @click="viewDetails(property.id)"
                class="py-4 border border-[#0025cc] text-[#0025cc] hover:bg-[#0025cc] hover:text-white font-medium rounded-2xl transition-all"
              >
                View Details
              </button>
              <button 
                @click="contactAgent(property.id)"
                class="py-4 bg-[#0025cc] hover:bg-[#546cdd] text-white font-medium rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Phone class="w-5 h-5"/>
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-20 text-center">
        <button 
          class="group inline-flex items-center gap-3 bg-[#0025cc] hover:bg-[#9faffa] text-white font-semibold text-lg px-10 py-5 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0025cc]/30"
        >
          Browse All Properties
          <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1"></ArrowRight>
        </button>
        <p class="text-sm text-[#707070] mt-4">Over 12,450 verified homes in 36 states</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRight, Bath, Bed, Car, Phone } from 'lucide-vue-next'
import { ref } from 'vue'

const properties = ref([
  {
    id: 1,
    price: "3.5M",
    period: "year",
    title: "4 Bedroom Duplex",
    location: "Lekki, Lagos",
    beds: 4,
    baths: 5,
    parking: 3,
    image: "https://picsum.photos/id/1015/800/600",
    verified: true,
    type: "Duplex"
  },
  {
    id: 2,
    price: "1.2M",
    period: "year",
    title: "2 Bedroom Flat",
    location: "Tanke, Ilorin",
    beds: 2,
    baths: 2,
    parking: 1,
    image: "https://picsum.photos/id/201/800/600",
    verified: true,
    type: "Flat"
  },
  {
    id: 3,
    price: "2.8M",
    period: "year",
    title: "3 Bedroom Apartment",
    location: "Wuse, Abuja",
    beds: 3,
    baths: 3,
    parking: 2,
    image: "https://picsum.photos/id/133/800/600",
    verified: true,
    type: "Apartment"
  }
])

const toggleFavorite = (id) => {
  // Add your favorite logic here
  console.log('Toggled favorite for property:', id)
}

const viewDetails = (id) => {
  console.log('View details for property:', id)
  // router.push(`/property/${id}`) in real app
}

const contactAgent = (id) => {
  console.log('Contact agent for property:', id)
}
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
  transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.property-card:hover .property-image {
  transform: scale(1.08);
}

.price-tag {
  background: linear-gradient(135deg, #0025cc, #2e4cd5);
}

.verification-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
</style>