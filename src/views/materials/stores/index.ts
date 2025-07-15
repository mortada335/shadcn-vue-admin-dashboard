import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore('materials-page', () => {
  const isCreateDialogOpen = ref(false);
  const isEditDialogOpen = ref(false);
  const selectedId = ref();

  const openCreateDialog = () => {
    isCreateDialogOpen.value = true;
  }

  const openEditDialog = (id: string) => {
    selectedId.value = id;
    isEditDialogOpen.value = true;
  }

  return {
    isCreateDialogOpen,
    isEditDialogOpen,
    openEditDialog,
    openCreateDialog,
    selectedId
  }
})
