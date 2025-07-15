<script setup lang="ts">
import { Base_URL } from '@/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AvatarVariants } from '@/components/ui/avatar'
import { HTMLAttributes } from 'vue';
defineProps<{
  src: string,
  fallback: string,
  alt?: string,
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>()
</script>

<template>
  <Avatar :class :size :shape>
    <AvatarImage :src="Base_URL + 'uploads/' + src" :alt />
    <AvatarFallback>{{ fallback }}</AvatarFallback>
  </Avatar>
</template>
