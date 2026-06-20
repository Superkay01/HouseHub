<script setup lang="ts">

const states = [
  {
    name: "Abia",
    slug: "abia",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Adamawa",
    slug: "adamawa",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Akwa Ibom",
    slug: "akwa ibom",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Anambra",
    slug: "anambra",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Bauchi",
    slug: "bauchi",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Bayelsa",
    slug: "bayelsa",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "Benue",
    slug: "benue",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Borno",
    slug: "borno",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Cross River",
    slug: "cross river",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Delta",
    slug: "delta",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Ebonyi",
    slug: "ebonyi",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Edo",
    slug: "edo",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "Ekiti",
    slug: "ekiti",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Enugu",
    slug: "enugu",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Gombe",
    slug: "gombe",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Imo",
    slug: "imo",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Jigawa",
    slug: "jigawa",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Kaduna",
    slug: "kaduna",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "Kano",
    slug: "kano",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Katsina",
    slug: "katsina",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Kebbi",
    slug: "kebbi",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Koggi",
    slug: "kogi",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Kwara",
    slug: "kwara",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Lagos",
    slug: "lagos",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "Nasarawa",
    slug: "nasarawa",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Niger",
    slug: "niger",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Ogun",
    slug: "ogun",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Ondo",
    slug: "ondo",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Osun",
    slug: "osun",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Oyo",
    slug: "oyo",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "Plateau",
    slug: "plateau",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
  {
    name: "Rivers",
    slug: "Rivers",
    listings: 3800,
    image: "/wes-fischer-g39p1kDjvSY-unsplash.jpg"
  },
  {
    name: "Sokoto",
    slug: "sokoto",
    listings: 1900,
    image: "/zac-gudakov-wwqZ8CM21gg-unsplash.jpg"
  },
  {
    name: "Taraba",
    slug: "taraba",
    listings: 850,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
  },
  {
    name: "Yobe",
    slug: "yobe",
    listings: 1300,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80"
  },
  {
    name: "Zamfara",
    slug: "zamfara",
    listings: 1100,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    name: "FCT Abuja",
    slug: "fct abuja",
    listings: 500,
    image: "/dillon-kydd-2keCPb73aQY-unsplash.jpg"
    
  },
]

</script>

<template>
  <section class="min-h-screen bg-slate-50 py-20">
    <div class="max-w-7xl mx-auto px-4">

      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-slate-900">
          Browse All States
        </h1>

        <p class="text-slate-600 mt-3">
          Find rental properties across all states in Nigeria
        </p>
      </div>
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
    </div>
  </section>
</template>