<template>
  <section class="py-16 bg-light-blue">
    <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-dark-gray tracking-tight mb-3">
          Browse Homes with Ilorin and Ijebu Ode
        </h2>
        <p class="text-lg text-medium-gray max-w-2xl mx-auto">
          Explore verified rental properties across Nigeria's most popular states and cities.
        </p>
      </div>

      <!-- States Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <router-link
          v-for="state in states"
          :key="state.name"
          :to="`/states/${state.slug}`"
          class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div class="relative h-64 overflow-hidden">
            <!-- State Image -->
            <img
              :src="state.image"
              :alt="state.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <!-- Content on Image -->
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">📍</span>
                <span class="font-semibold text-xl tracking-tight">{{ state.name }}</span>
              </div>
              <p class="text-sm opacity-90">
                {{ state.listings.toLocaleString() }} verified listings
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- View All States Button -->
      <div class="text-center mt-12">
        <router-link
          to="/states"
          class="inline-flex items-center gap-3 bg-mediumBlue hover:bg-steel-blue text-royal-blue px-8 py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95 shadow-lg hover:shadow-xl"
        >
          View All States
          <span class="text-xl text-royal-blue"> →</span>
        </router-link>
        
      </div>
    </div>
  </section>
</template>

<script setup>
const states = [
  {
    name: "Lagos",
    slug: "lagos",
    listings: 5200,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Abuja",
    slug: "abuja",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Oyo",
    slug: "oyo",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Kwara",
    slug: "kwara",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Kano",
    slug: "kano",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Enugu",
    slug: "enugu",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  }
]
</script>