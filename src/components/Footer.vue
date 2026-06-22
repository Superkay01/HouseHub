<script setup lang="ts">
import { Camera, Phone, X } from 'lucide-vue-next';
import { Facebook, Instagram } from 'lucide-vue-next'

</script>

<template>
  <footer class="bg-[var(--royal-blue)] text-white">
    <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        
        <!-- Brand Column -->
        <div class="lg:col-span-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-50 h-10 mb-5  rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              <img
              src="/Lodgenext_logo__3_-removebg-preview.png"
              alt="Lodgenext logo"
              class="w-50 h-35 object-cover"
            />
            </div>
            <!-- <span class="font-bold text-3xl tracking-tight">LodgeNext</span> -->
          </div>
          
          <p class="text-[var(--light-blue)] text-lg mb-6">
            Find Homes • Across Ilorin & Ijebu Ode
          </p>
          
          <p class="text-white/70 max-w-sm mb-8">
            LodgeNext helps renters discover verified homes and apartments while connecting them with trusted property agents.
          </p>

          <!-- Contact Info -->
          <div class="space-y-3 text-white/80">
            <div class="flex items-center gap-3">
              <span>📍</span>
              <span>Ilorin & Ijebu Ode, Nigeria</span>
            </div>
            <div class="flex items-center gap-3">
              <span>✉️</span>
              <a href="mailto:support@nestfinder.ng" class="hover:text-[var(--light-blue)] transition-colors">
                support@LodgeNext.com
              </a>
            </div>
            <div class="flex items-center gap-3">
              <span>📞</span>
              <span>+234 903 003 1328</span>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-2">
          <h3 class="font-semibold text-lg mb-5 text-white">Quick Links</h3>
          <ul class="space-y-3 text-white/80">
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Home</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Browse Properties</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Featured Homes</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">How It Works</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">FAQ</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="lg:col-span-2">
          <h3 class="font-semibold text-lg mb-5 text-white">Company</h3>
          <ul class="space-y-3 text-white/80">
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">About Us</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Contact Us</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>

        <!-- For Agents -->
        <div class="lg:col-span-3">
          <h3 class="font-semibold text-lg mb-5 text-white">For Agents</h3>
          <ul class="space-y-3 text-white/80 mb-8">
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Become an Agent</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">List a Property</a></li>
            <li><a href="#" class="hover:text-[var(--light-blue)] transition-colors">Agent Support</a></li>
          </ul>

          <!-- CTA Button -->
          <button 
            class="bg-white text-[var(--royal-blue)] font-semibold px-8 py-4 rounded-2xl hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all w-full sm:w-auto">
            Become an Agent
          </button>
        </div>
      </div>

      <!-- Social Media + Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex gap-4">
          <a href="#" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all">
            <Phone class="w-5 h-5"/>
          </a>
          <a href="#" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all">
            <Camera class="w-5 h-5"/>
          </a>
          <a href="#" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all">
            <X class="w-5 h-5"/>
          </a>
          <a href="#" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all">
           <Facebook class="w-5 h-5" />
          </a>
          <a href="#" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[var(--light-blue)] hover:text-[var(--royal-blue)] transition-all">
           <Instagram class="w-5 h-5" />
          </a>
        </div>

        <div class="text-white/60 text-sm text-center md:text-right">
          © 2026 LodgeNext. All Rights Reserved.<br class="md:hidden">
          Built for renters and agents in Ilorin & Ijebu Ode.
        </div>
      </div>
    </div>
  </footer>
</template>