<script setup lang="ts">
import AppFormDialog from "@/components/app-crud/AppFormDialog.vue";
import { useStore } from "../stores";
import { MaterialBreakage } from "@/utils/enums";
import { QueryKeys, Material } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import AppFormTextInput from "@/components/form/AppFormTextInput.vue";
import AppFormAutocompleteInput from "@/components/form/AppFormAutocompleteInput.vue";
import { boolean, string } from "yup";
import { Client } from "@/api/client";
import { useToast } from "@/components/ui/toast";
import { URL } from "..";

const material = ref<Partial<Material>>({});
const { toast } = useToast();

const store = useStore();
const queryClient = useQueryClient();

const isDialogOpen = computed({
  get: () => store.isEditDialogOpen || store.isCreateDialogOpen,
  set: (v: boolean) => {
    material.value = {};
    store.isEditDialogOpen = v;
    store.isCreateDialogOpen = v;
  },
});

const getData = async () => {
  const data = await Client.getSingle<Material>(URL, store.selectedId);
  material.value = data;
  return data;
};

const cleanup = () => {
  material.value = {};
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.getAll],
  });
  isDialogOpen.value = false;
};

const create = async () => {
  await Client.create<Material>(URL, material.value as Material);
  toast({
    title: "Success",
    description: "material created successfully",
    variant: "default",
  });
  cleanup();
  return material.value;
};

const update = async () => {
  await Client.update<Material>(URL, material.value as Material);
  toast({
    title: "Success",
    description: "material updated successfully",
    variant: "default",
  });
  cleanup();
  return material.value;
};

const isEdit = computed(() => store.isEditDialogOpen);

const title = computed(() => {
  return (store.isEditDialogOpen ? "Edit" : "Create") + " Material";
});

const { mutate: updateMutation, isPending: updatePending } = useMutation({
  mutationKey: [QueryKeys.update],
  mutationFn: update,
});

const { mutate: createMutation, isPending: createPending } = useMutation({
  mutationKey: [QueryKeys.create],
  mutationFn: create,
});

const { isFetching: getPending } = useQuery({
  queryKey: [QueryKeys.getSingle, store.selectedId ?? ""],
  queryFn: getData,
  enabled: isEdit,
});

const onSubmit = () => {
  if (isEdit.value) updateMutation();
  else createMutation();
};
</script>
<template>
  <AppFormDialog
    v-model="isDialogOpen"
    :isLoading="createPending || updatePending || getPending"
    :title
    size="md"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
      <AppFormTextInput
        v-model="material.name"
        name="name"
        type="text"
        label="Name"
        placeholder="Enter Material Name"
        :validation="string().required()"
      />
      <AppFormAutocompleteInput
        v-model="material.isBreakable"
        name="isBreakable"
        label="Breakable"
        placeholder="is Material Breakable"
        :items="MaterialBreakage"
        item-label="name"
        item-value="value"
        :validation="string().required()"
      />
    </div>
  </AppFormDialog>
</template>
