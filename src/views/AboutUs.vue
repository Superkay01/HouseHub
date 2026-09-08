<template>
  <div class="about-page bg-[var(--white)] text-[var(--steel-blue)] overflow-x-hidden">
    <!-- ========== 1. HERO ========== -->
    <section class="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center scale-105 hero-bg"
        style="background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80')"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-[var(--royal-blue)]/85 via-[var(--medium-blue)]/75 to-[var(--royal-blue)]/80" />

      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white py-20">
        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 sm:mb-6 animate-hero-1"
        >
          Finding a Home Shouldn’t Be This Difficult.
        </h1>
        <p
          class="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-hero-2"
        >
          LODGENEXT was created to make finding a home simpler, safer and more transparent for
          people searching for properties in Ilorin and Ijebu Ode.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-hero-3">
          <router-link
            to="/customer/browse"
            class="px-6 sm:px-8 py-3.5 rounded-2xl bg-white text-[var(--royal-blue)] font-semibold text-sm sm:text-base hover:bg-[var(--light-blue)] transition-colors"
          >
            Explore Properties
          </router-link>
          <router-link
            to="/signup"
            class="px-6 sm:px-8 py-3.5 rounded-2xl border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Find a Trusted Agent
          </router-link>
        </div>
      </div>
    </section>

    <!-- ========== 2. THE STORY ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-[var(--light-blue)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-6 sm:mb-8 reveal"
        >
          Why We Created LODGENEXT
        </h2>

        <div class="max-w-3xl mx-auto space-y-5 text-sm sm:text-base md:text-lg leading-relaxed text-[var(--steel-blue)] reveal">
          <p>
            Finding a house can be stressful, especially when you are moving to a new city where you
            don’t know anyone. Imagine gaining admission into a school in another state and having to
            travel to a completely unfamiliar environment. You need accommodation, but you don’t know
            where to start, who to trust, or which agent is genuine.
          </p>
          <p>
            At the same time, many people looking for accommodation face
            <span class="font-semibold text-[var(--royal-blue)]">high and sometimes inconvenient agent charges</span>.
          </p>
          <p>
            We saw this gap and decided to build a platform that makes the process easier.
            <span class="font-semibold text-[var(--royal-blue)]">LODGENEXT</span> connects people
            looking for homes with property agents, helping customers discover available properties
            and connect with agents in a more organised and transparent way.
          </p>
        </div>

        <!-- Timeline -->
        <div class="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="(step, i) in storySteps"
            :key="step.title"
            class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-white/60 reveal"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div
              class="w-10 h-10 rounded-xl bg-[var(--royal-blue)]/10 text-[var(--royal-blue)] flex items-center justify-center font-bold text-sm mb-4"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </div>
            <h3 class="font-semibold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
              {{ step.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 3. THE PROBLEM ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-4 reveal"
        >
          House Hunting Shouldn’t Feel Like a Struggle.
        </h2>
        <p class="text-center text-[var(--steel-blue)] text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-14 reveal">
          These are some of the challenges people face when searching for a place to live.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div
            v-for="(problem, i) in problems"
            :key="problem.title"
            class="group bg-[var(--light-blue)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-transparent hover:border-[var(--royal-blue)]/20 hover:shadow-md transition-all duration-300 reveal"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="text-3xl mb-4">{{ problem.icon }}</div>
            <p class="text-xs font-semibold text-[var(--periwinkle)] mb-2">
              {{ String(i + 1).padStart(2, '0') }}
            </p>
            <h3 class="text-lg sm:text-xl font-semibold text-[var(--royal-blue)] mb-2">
              {{ problem.title }}
            </h3>
            <p class="text-sm sm:text-base text-[var(--steel-blue)] leading-relaxed">
              {{ problem.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 4. WHAT WE DO ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[var(--royal-blue)] to-[var(--medium-blue)] text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 reveal">
          We Are Bridging the Gap.
        </h2>
        <p class="text-center text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-12 reveal">
          LODGENEXT connects customers, properties and agents in one organised place.
        </p>

        <div class="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 reveal">
          <div
            v-for="(node, i) in connectionNodes"
            :key="node.title"
            class="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 w-full lg:w-auto"
          >
            <div
              class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 text-center w-full max-w-xs hover:bg-white/15 transition-colors"
            >
              <div class="text-3xl mb-3">{{ node.icon }}</div>
              <h3 class="font-semibold text-lg mb-2">{{ node.title }}</h3>
              <p class="text-sm text-white/80 leading-relaxed">{{ node.text }}</p>
            </div>
            <div
              v-if="i < connectionNodes.length - 1"
              class="hidden lg:block text-2xl text-white/50 px-2"
            >
              →
            </div>
            <div
              v-if="i < connectionNodes.length - 1"
              class="lg:hidden text-xl text-white/50 rotate-90"
            >
              →
            </div>
          </div>
        </div>

        <p class="text-center text-white/90 text-sm sm:text-base max-w-2xl mx-auto mt-12 leading-relaxed reveal">
          Our goal is simple: help people find suitable homes more easily while creating a better
          way for customers and property agents to connect.
        </p>
      </div>
    </section>

    <!-- ========== 5. TRUST & SAFETY ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-[var(--light-blue)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-4 reveal"
        >
          Building Trust into the Process
        </h2>
        <p class="text-center text-[var(--steel-blue)] text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-12 reveal">
          We are building processes that help customers make more informed decisions.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="(item, i) in trustFeatures"
            :key="item.title"
            class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow reveal"
            :style="{ transitionDelay: `${i * 70}ms` }"
          >
            <div
              class="w-10 h-10 rounded-xl bg-[var(--bright-green)]/15 text-[var(--bright-green)] flex items-center justify-center text-lg mb-4"
            >
              ✓
            </div>
            <h3 class="font-semibold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
              {{ item.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
              {{ item.text }}
            </p>
          </div>
        </div>

        <p
          class="mt-8 sm:mt-10 text-xs sm:text-sm text-center text-[var(--steel-blue)] max-w-3xl mx-auto leading-relaxed bg-white/60 rounded-2xl px-4 py-3 reveal"
        >
          LODGENEXT encourages customers to review property information carefully and use the
          available inspection and verification processes before making decisions. These features
          support informed choices — they are not a guarantee that a property or agent is completely
          risk-free.
        </p>
      </div>
    </section>

    <!-- ========== 6. HOW IT WORKS ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-10 sm:mb-14 reveal"
        >
          How LODGENEXT Works
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div
            v-for="(step, i) in howSteps"
            :key="step.title"
            class="relative text-center reveal"
            :style="{ transitionDelay: `${i * 90}ms` }"
          >
            <div
              class="w-14 h-14 mx-auto rounded-full bg-[var(--royal-blue)] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-[var(--royal-blue)]/20"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </div>
            <h3 class="font-semibold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed px-2">
              {{ step.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 7. LOCATIONS ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-[var(--light-blue)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-4 reveal"
        >
          Starting Where We Can Make the Biggest Difference.
        </h2>
        <p class="text-center text-[var(--steel-blue)] text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-12 reveal">
          LODGENEXT is currently focused on two locations in Nigeria:
          <strong class="text-[var(--royal-blue)]">Ilorin, Kwara State</strong> and
          <strong class="text-[var(--royal-blue)]">Ijebu Ode, Ogun State</strong>.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div
            v-for="loc in locations"
            :key="loc.city"
            class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-50 hover:shadow-md transition-shadow reveal"
          >
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl">📍</span>
              <div>
                <h3 class="text-xl sm:text-2xl font-bold text-[var(--royal-blue)]">
                  {{ loc.city }}
                </h3>
                <p class="text-sm text-[var(--steel-blue)]">{{ loc.state }}</p>
              </div>
            </div>
            <ul class="space-y-2 text-sm text-[var(--steel-blue)]">
              <li v-for="point in loc.points" :key="point" class="flex items-center gap-2">
                <span class="text-[var(--bright-green)]">•</span>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>

        <p class="text-center text-sm sm:text-base text-[var(--steel-blue)] mt-8 sm:mt-10 reveal">
          As we grow, our vision is to make this easier for more communities across Nigeria.
        </p>
      </div>
    </section>

    <!-- ========== 8. WHO WE BUILD FOR ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-10 sm:mb-14 reveal"
        >
          Who We Are Building For
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="(audience, i) in audiences"
            :key="audience.title"
            class="bg-[var(--light-blue)] rounded-2xl sm:rounded-3xl p-6 text-center hover:-translate-y-1 transition-transform duration-300 reveal"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="text-3xl sm:text-4xl mb-4">{{ audience.icon }}</div>
            <h3 class="font-semibold text-[var(--royal-blue)] text-base sm:text-lg mb-2">
              {{ audience.title }}
            </h3>
            <p class="text-xs sm:text-sm text-[var(--steel-blue)] leading-relaxed">
              {{ audience.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 9. VISION ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[var(--royal-blue)] via-[var(--medium-blue)] to-[var(--royal-blue)] text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p class="text-sm font-semibold tracking-widest uppercase text-white/70 mb-4 reveal">
          Our Vision
        </p>
        <h2
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8 reveal"
        >
          To make finding a home easier, more transparent and more connected.
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto reveal">
          We envision a future where someone moving to a new city does not have to depend entirely
          on word-of-mouth recommendations or spend days searching for someone they can trust.
          Instead, they can open LODGENEXT, explore available properties, connect with agents and
          make better-informed decisions.
        </p>
        <div class="mt-10 text-5xl sm:text-6xl opacity-80 reveal">🏠</div>
      </div>
    </section>

    <!-- ========== 10. MISSION ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-[var(--light-blue)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--royal-blue)] text-center mb-10 sm:mb-14 reveal"
        >
          Our Mission
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div
            v-for="(pillar, i) in missionPillars"
            :key="pillar.title"
            class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow reveal"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div class="text-3xl mb-4">{{ pillar.icon }}</div>
            <h3 class="text-lg sm:text-xl font-bold text-[var(--royal-blue)] mb-3 tracking-wide">
              {{ pillar.title }}
            </h3>
            <p class="text-sm text-[var(--steel-blue)] leading-relaxed">
              {{ pillar.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== 11. CTA ========== -->
    <section class="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--hover-blue)] text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
        <div class="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
      </div>

      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 reveal">
          Your Next Home Could Be Closer Than You Think.
        </h2>
        <p class="text-sm sm:text-base text-white/85 mb-8 sm:mb-10 leading-relaxed reveal">
          Whether you’re looking for a home or you’re an agent with a property to list, LODGENEXT
          is here to help make the connection easier.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center reveal">
          <router-link
            to="/customer/browse"
            class="px-6 sm:px-8 py-3.5 rounded-2xl bg-white text-[var(--royal-blue)] font-semibold text-sm sm:text-base hover:bg-[var(--light-blue)] transition-colors"
          >
            Find a Property
          </router-link>
          <router-link
            to="/signup"
            class="px-6 sm:px-8 py-3.5 rounded-2xl border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Become an Agent
          </router-link>
        </div>
      </div>
    </section>

    <!-- ========== 12. FOOTER NOTE (use your existing Footer component) ========== -->
    <div class="bg-[var(--royal-blue)] text-white/80 text-center text-xs sm:text-sm py-4 px-4">
      Focused Locations: Ilorin, Kwara State &amp; Ijebu Ode, Ogun State, Nigeria
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const storySteps = [
  { title: 'The Problem', text: 'Finding homes in a new city is stressful, unclear and often expensive.' },
  { title: 'The Idea', text: 'Build a platform that organises property discovery and agent connections.' },
  { title: 'The Platform', text: 'LODGENEXT links customers with listed properties and local agents.' },
  { title: 'The Vision', text: 'Make finding a home easier, more transparent and more connected.' },
]

const problems = [
  {
    icon: '🤝',
    title: 'Finding the Right Agent',
    text: 'People may struggle to know which agents they can trust.',
  },
  {
    icon: '🧳',
    title: 'Moving to a New City',
    text: 'Students, workers and families relocating may not know where to begin.',
  },
  {
    icon: '📋',
    title: 'Limited Property Information',
    text: 'People often need better information about properties before deciding to inspect them.',
  },
  {
    icon: '💰',
    title: 'Unclear Costs',
    text: 'Unexpected or inconvenient charges can make the rental process more difficult.',
  },
]

const connectionNodes = [
  {
    icon: '👤',
    title: 'Customers',
    text: 'People looking for apartments, houses and other properties.',
  },
  {
    icon: '🏡',
    title: 'Properties',
    text: 'Available properties listed by agents on the platform.',
  },
  {
    icon: '🧑‍💼',
    title: 'Agents',
    text: 'Property agents who list properties and connect with potential customers.',
  },
]

const trustFeatures = [
  {
    title: 'Agent Verification',
    text: 'Agents can go through a verification process so the platform can distinguish verified agents.',
  },
  {
    title: 'Property Review',
    text: 'Property listings can go through an administrative review process before being approved.',
  },
  {
    title: 'Property Information',
    text: 'Listings can include type, location, address, price, bedrooms, bathrooms, toilets, amenities, condition, photos and video.',
  },
  {
    title: 'Inspection Process',
    text: 'Customers can request inspections with status, date/time, agent, customer, property, outcome, condition, feedback, reports and media.',
  },
  {
    title: 'Inspection Acknowledgement',
    text: 'Customers can acknowledge that they reviewed the property and understood relevant inspection terms and observations.',
  },
  {
    title: 'Customer Reports',
    text: 'Customers can submit reports and feedback related to an inspection.',
  },
]

const howSteps = [
  {
    title: 'Browse Properties',
    text: 'Explore available properties based on your preferred location and requirements.',
  },
  {
    title: 'Choose a Property',
    text: 'Review property information, photos, videos, amenities and other available details.',
  },
  {
    title: 'Connect & Inspect',
    text: 'Connect with the relevant agent and arrange an inspection where applicable.',
  },
  {
    title: 'Make an Informed Decision',
    text: 'Review the property and inspection information before proceeding.',
  },
]

const locations = [
  {
    city: 'Ilorin',
    state: 'Kwara State',
    points: ['Property discovery', 'Local agents', 'Home seekers'],
  },
  {
    city: 'Ijebu Ode',
    state: 'Ogun State',
    points: ['Property discovery', 'Local agents', 'Home seekers'],
  },
]

const audiences = [
  {
    icon: '🎓',
    title: 'Students',
    text: 'Helping students relocating to another city find accommodation more easily.',
  },
  {
    icon: '💼',
    title: 'Workers & Professionals',
    text: 'Helping people moving for work discover properties in unfamiliar locations.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Families',
    text: 'Helping families explore suitable homes without unnecessary stress.',
  },
  {
    icon: '🔑',
    title: 'Property Agents',
    text: 'Giving agents a structured platform to showcase properties and connect with customers.',
  },
]

const missionPillars = [
  {
    icon: '🔗',
    title: 'CONNECT',
    text: 'Connect home seekers with property agents and available properties.',
  },
  {
    icon: '✨',
    title: 'SIMPLIFY',
    text: 'Reduce the stress and confusion involved in finding accommodation.',
  },
  {
    icon: '🛡️',
    title: 'BUILD TRUST',
    text: 'Create structured processes that help customers and agents interact with greater transparency.',
  },
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* Hero load animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}

.animate-hero-1 {
  animation: fadeUp 0.8s ease-out both;
}
.animate-hero-2 {
  animation: fadeUp 0.8s ease-out 0.15s both;
}
.animate-hero-3 {
  animation: fadeUp 0.8s ease-out 0.3s both;
}

.hero-bg {
  animation: slowZoom 18s ease-out forwards;
}

/* Scroll reveals */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.65s ease,
    transform 0.65s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-1,
  .animate-hero-2,
  .animate-hero-3,
  .hero-bg {
    animation: none !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>