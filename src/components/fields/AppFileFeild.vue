<script setup lang="ts">
import { FileInputProps } from '@/components/fields/types';
import { useFileDialog } from '@vueuse/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const props = defineProps<FileInputProps>()

const imageSrcs = ref<Record<string, string>>({});
const files = ref<File[]>([]);

const { files: _files, open, onChange } = useFileDialog({
  accept: props.accept ?? 'image/*',
  multiple: props.multiple
})

onChange((_files) => {
  if (!_files) return
  for (let i = 0; i < _files.length; i++) {
    imageSrcs.value[_files[i].name] = URL.createObjectURL(_files[i])
  }
  if (props.multiple)
    files.value = [...files.value, ...Array.from(_files)]
  else
    files.value = Array.from(_files)
})

const removeFile = (file: number) => {
  if (!files.value) return;
  files.value.splice(file, 1)
}

const editFile = (file: number) => {
  removeFile(file)
  open()
}
const modal = defineModel<File | File[]>()

watch(files, () => {
  if (props.multiple)
    modal.value = files.value
  else
    modal.value = files.value[0]
})
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $t(label) }}</CardTitle>
    </CardHeader>
    <CardContent class="flex gap-5 justify-center flex-wrap h-[250px]">
      <template v-if="files?.length">
        <div v-for="(file, i) in files" class="w-1/4 h-full flex flex-col py-2 px-4 gap-2 border rounded-md">
          <img class="w-full h-1/2 object-cover rounded-md" :src="imageSrcs[file.name]" />
          <Button @click="editFile(i)">{{ $t('Edit') }}</Button>
          <Button @click="removeFile(i)" variant="destructive">{{ $t('Remove') }}</Button>
        </div>
        <div v-if="multiple"
          class="w-1/4 h-full flex justify-center items-center flex-col py-2 px-4 gap-2 border rounded-md">
          <Button @click="open">{{ $t('Add') }}</Button>
        </div>
      </template>
      <template v-else>
        <div class="w-full h-full flex justify-center items-center">
          <Button @click="open">{{ $t("Add") }}</Button>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
