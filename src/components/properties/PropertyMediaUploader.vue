<template>
  <div>
    <h3 class="text-xl font-semibold mb-6 text-[#0025cc]">Upload Property Images</h3>
    
    <div 
      class="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-[#0025cc] transition-all cursor-pointer mb-8"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="mx-auto w-16 h-16 bg-[#ebf8ff] rounded-2xl flex items-center justify-center mb-4 text-4xl">
        📸
      </div>
      <p class="font-medium text-lg">Drag & drop images here</p>
      <p class="text-gray-500 mt-1">or click to browse</p>
    </div>

    <input 
      ref="fileInput" 
      type="file" 
      multiple 
      accept="image/*" 
      class="hidden" 
      @change="handleFiles"
    >

    <!-- Images Grid -->
    <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(image, index) in images" :key="index" class="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
        <img :src="image" class="w-full h-full object-cover" />
        
        <div v-if="image === coverImage" class="absolute top-2 left-2 bg-[#00db00] text-white text-xs font-bold px-3 py-1 rounded-xl">★ Cover</div>

        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
          <button @click.stop="setAsCover(image)" class="bg-white text-[#0025cc] px-4 py-1.5 rounded-xl text-sm">Set Cover</button>
          <button @click.stop="removeImage(index)" class="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm">Remove</button>
        </div>
      </div>
    </div>

    <p class="text-xs text-gray-500 mt-4 text-center">{{ images.length }}/15 images</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'

const images = defineModel<string[]>('images', { default: () => [] })
const coverImage = defineModel<string>('cover', { default: '' })

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => fileInput.value?.click()

const onDragOver = (e: DragEvent) => {
  (e.currentTarget as HTMLElement)?.classList.add('border-[#0025cc]', 'bg-[#ebf8ff]')
}

const onDragLeave = (e: DragEvent) => {
  (e.currentTarget as HTMLElement)?.classList.remove('border-[#0025cc]', 'bg-[#ebf8ff]')
}

const onDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files) handleFiles({ target: { files } } as any)
}

const handleFiles = async (e: any) => {
  const files = Array.from(e.target.files || []) as File[]

  for (const file of files) {
    if (images.value.length >= 15) {
      alert("Maximum 15 images allowed")
      break
    }
    if (!file.type.startsWith('image/')) continue

    const url = await uploadImage(file)
    if (url) {
      images.value.push(url)
      if (!coverImage.value) coverImage.value = url
    }
  }

  if (fileInput.value) fileInput.value.value = ''
}

const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `properties/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (err: any) {
    console.error(err)
    alert(`Failed to upload image: ${err.message}`)
    return null
  }
}

const removeImage = (index: number) => {
  const removed = images.value[index]
  images.value.splice(index, 1)
  if (coverImage.value === removed) coverImage.value = images.value[0] || ''
}

const setAsCover = (url: string) => {
  coverImage.value = url
}
</script>