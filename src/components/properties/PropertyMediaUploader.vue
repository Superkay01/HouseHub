<template>
  <div>
    <h3 class="text-xl font-semibold mb-6 text-[#0025cc]">Upload Media</h3>
    
    <div 
      class="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-[#0025cc] transition-all cursor-pointer mb-8"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="mx-auto w-16 h-16 bg-[#ebf8ff] rounded-2xl flex items-center justify-center mb-4 text-4xl">📤</div>
      <p class="font-medium text-lg">Drag & drop images or video</p>
      <p class="text-gray-500 mt-1">JPG, PNG, MP4 supported (Max 5 images)</p>
    </div>

    <input ref="fileInput" type="file" multiple accept="image/*,video/*" class="hidden" @change="handleFiles">

    <!-- Progress -->
    <div v-if="uploadingFiles.length" class="mb-8 space-y-4">
      <div v-for="(item, i) in uploadingFiles" :key="i" class="bg-gray-50 p-4 rounded-2xl">
        <div class="flex justify-between text-sm mb-2">
          <span class="truncate">{{ item.name }}</span>
          <span class="font-medium">{{ item.progress }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-[#0025cc] transition-all" :style="{ width: item.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Previews -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(url, index) in imageUrls" :key="index" 
           class="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video">
        <img :src="url" class="w-full h-full object-cover" />
        <div v-if="url === coverImage" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-xl font-bold">★ COVER</div>
        
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3">
          <button @click.stop="setAsCover(url)" class="bg-white px-4 py-2 rounded-xl text-sm">Set Cover</button>
          <button @click.stop="removeImage(index)" class="bg-red-500 text-white px-4 py-2 rounded-xl text-sm">Remove</button>
        </div>
      </div>

      <div v-if="videoUrl" class="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-video bg-black">
        <video :src="videoUrl" controls class="w-full h-full object-cover"></video>
        <button @click="removeVideo" class="absolute bottom-3 right-3 bg-red-500 text-white px-4 py-2 rounded-xl text-sm">Remove Video</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '@/supabaseClient'

const props = defineProps<{
  cover?: string
  video?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
  image5?: string
}>()

const emit = defineEmits<{
  'update:cover': [value: string]
  'update:video': [value: string]
  'update:image1': [value: string]
  'update:image2': [value: string]
  'update:image3': [value: string]
  'update:image4': [value: string]
  'update:image5': [value: string]
}>()

const coverImage = ref(props.cover || '')
const videoUrl = ref(props.video || '')
const imageUrls = ref<string[]>([
  props.image1 || '', props.image2 || '', props.image3 || '',
  props.image4 || '', props.image5 || ''
].filter(Boolean))

const fileInput = ref<HTMLInputElement | null>(null)
const uploadingFiles = ref<Array<{name: string, progress: number, id: number}>>([])

let uploadCounter = 0

// Sync from parent
watch(() => props.cover, val => coverImage.value = val || '')
watch(() => props.video, val => videoUrl.value = val || '')

// Upload handler
const triggerFileInput = () => fileInput.value?.click()

const onDragOver = (e: DragEvent) => (e.currentTarget as HTMLElement)?.classList.add('!border-[#0025cc]', '!bg-[#ebf8ff]')
const onDragLeave = (e: DragEvent) => (e.currentTarget as HTMLElement)?.classList.remove('!border-[#0025cc]', '!bg-[#ebf8ff]')

const onDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files) handleFiles({ target: { files: e.dataTransfer.files } } as any)
}

const handleFiles = async (e: any) => {
  const files = Array.from(e.target.files || []) as File[]

  for (const file of files) {
    if (file.type.startsWith('image/') && imageUrls.value.length < 5) {
      await uploadFile(file, 'image')
    } else if (file.type.startsWith('video/') && !videoUrl.value) {
      await uploadFile(file, 'video')
    }
  }
  if (fileInput.value) fileInput.value.value = ''
}

const uploadFile = async (file: File, type: 'image' | 'video') => {
  const uploadId = ++uploadCounter
  const uploadItem = { name: file.name, progress: 0, id: uploadId }
  uploadingFiles.value.push(uploadItem)

  try {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `properties/${fileName}`

    const { error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, { cacheControl: '3600' })

    if (error) throw error

    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    if (type === 'image') {
      imageUrls.value.push(publicUrl)

      // Emit to individual columns
      const index = imageUrls.value.length - 1
      if (index === 0) emit('update:image1', publicUrl)
      else if (index === 1) emit('update:image2', publicUrl)
      else if (index === 2) emit('update:image3', publicUrl)
      else if (index === 3) emit('update:image4', publicUrl)
      else if (index === 4) emit('update:image5', publicUrl)

      if (!coverImage.value) {
        coverImage.value = publicUrl
        emit('update:cover', publicUrl)
      }
    } else {
      videoUrl.value = publicUrl
      emit('update:video', publicUrl)
    }

  } catch (err: any) {
    console.error(err)
    alert(`Failed to upload ${file.name}`)
  } finally {
    setTimeout(() => uploadingFiles.value = uploadingFiles.value.filter(i => i.id !== uploadId), 800)
  }
}

const removeImage = (index: number) => {
  const removed = imageUrls.value[index]
  imageUrls.value.splice(index, 1)

  // Shift remaining images
  emit('update:image1', imageUrls.value[0] || '')
  emit('update:image2', imageUrls.value[1] || '')
  emit('update:image3', imageUrls.value[2] || '')
  emit('update:image4', imageUrls.value[3] || '')
  emit('update:image5', imageUrls.value[4] || '')

  if (coverImage.value === removed) {
    coverImage.value = imageUrls.value[0] || ''
    emit('update:cover', coverImage.value)
  }
}

const removeVideo = () => {
  videoUrl.value = ''
  emit('update:video', '')
}

const setAsCover = (url: string) => {
  coverImage.value = url
  emit('update:cover', url)
}
</script>