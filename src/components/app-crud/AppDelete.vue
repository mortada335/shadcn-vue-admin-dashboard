<script setup lang="ts">
import { useDelete } from '@/composable/useDelete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Client } from '@/api/client';

const deleteDialog = useDelete();


const isDeleteDialogOpen = computed({
  get: () => deleteDialog.isDeleteDialogOpen,
  set: (v: boolean) => deleteDialog.isDeleteDialogOpen.value = v
})

const deleteItem = async () => {
  if (deleteDialog.url.value && deleteDialog.id.value)
    await Client.delete(deleteDialog.url.value, deleteDialog.id.value)
  isDeleteDialogOpen.value = false;
  deleteDialog.callback.value();
}
</script>
<template>
  <Dialog v-model:open="isDeleteDialogOpen.value">
    <DialogContent class="p-5 max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ $t("Delete") }}</DialogTitle>
        <DialogDescription class="text-xl text-center font-bold my-5">
          {{ $t(deleteDialog.caption.value ?? "Are you sure you want to delete this item") }}
        </DialogDescription>
        <img src="@/assets/trash.gif" class="w-40 mx-auto" />
        <DialogFooter>
          <Button variant="destructive" @click="deleteItem">
            {{ $t("Submit") }}
          </Button>
        </DialogFooter>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
