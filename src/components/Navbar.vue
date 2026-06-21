<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Search, Menu, X } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="bg-white border-b sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-royal-blue rounded-xl flex items-center justify-center text-2xl shadow-md"
          >
            🏠
          </div>

          <div>
            <h1 class="font-bold text-xl md:text-2xl text-royal-blue">
              LodgeNext
            </h1>

            <p class="hidden sm:block text-xs text-medium-gray">
              Find Home • Within Ilorin & Ijebu Ode
            </p>
          </div>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center gap-8 text-sm font-medium">
          <router-link to="/properties" class="hover:text-royal-blue">
            Find Homes
          </router-link>

          <router-link to="/states" class="hover:text-royal-blue">
            All States
          </router-link>

          <router-link to="/for-agents" class="hover:text-royal-blue">
            For Agents
          </router-link>
        </div>

        <!-- Desktop Search -->
        <div class="hidden lg:block flex-1 max-w-md mx-6">
          <div class="relative">
            <Search
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search city, state or area..."
              class="w-full rounded-full border border-gray-200 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-4">

          <!-- Location -->
          <div
            class="hidden md:flex items-center gap-2 text-sm font-medium"
          >
            <MapPin class="w-4 h-4 text-royal-blue" />
            Ilorin
          </div>

          <!-- Desktop Auth -->
          <div class="hidden lg:flex items-center gap-4">
            <router-link
              to="/login"
              class="font-medium hover:text-royal-blue"
            >
              Login
            </router-link>

            <router-link
              to="/signup"
              class="bg-[var(--royal-blue)] text-[var(--white)] px-5 py-2 rounded-xl"
            >
              Sign Up
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden"
          >
            <Menu
              v-if="!mobileMenuOpen"
              class="w-7 h-7"
            />

            <X
              v-else
              class="w-7 h-7"
            />
          </button>

        </div>

      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-3"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-3"
      >
        <div
          v-if="mobileMenuOpen"
          class="lg:hidden py-5 border-t"
        >

          <!-- Mobile Search -->
          <div class="relative mb-5">

            <Search
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search houses..."
              class="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:outline-none"
            />
          </div>

          <!-- Links -->
          <div class="flex flex-col gap-4">

            <router-link
              to="/properties"
              class="font-medium"
            >
              Find Homes
            </router-link>

            <router-link
              to="/states"
              class="font-medium"
            >
              All States
            </router-link>

            <router-link
              to="/for-agents"
              class="font-medium"
            >
              For Agents
            </router-link>

            <div class="flex items-center gap-2 pt-2">
              <MapPin class="w-4 h-4 text-royal-blue" />
              Lagos
            </div>

            <router-link
              to="/login"
              class="w-full text-center border rounded-xl py-3"
            >
              Login
            </router-link>

            <router-link
              to="/signup"
              class="w-full text-center bg-royal-blue text-white rounded-xl py-3"
            >
              Sign Up Free
            </router-link>

          </div>

        </div>
      </transition>

    </div>
  </nav>
</template>