<script setup lang="ts">
import { QueryKeys, Material, Permissions } from "../types";
import GlobalTableActions from "@/components/table/GlobalTableActions.vue";
import { useDelete } from "@/composable/useDelete";
import { useStore } from "../stores";
import { useQueryClient } from "@tanstack/vue-query";
import { URL } from "..";
import { useI18n } from "vue-i18n";

const props = defineProps<Material>();
const { t } = useI18n();
const store = useStore();
const deleteDialog = useDelete();
const queryClient = useQueryClient();
const deleteCallback = (item: Material) => {
  deleteDialog.showDialog(
    URL,
    item.id,
    () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getAll] });
    },
    t("Are you sure you want to delete material : ") + item.name
  );
};
const editCallback = (item: Material) => {
  store.openEditDialog(item.id);
};
</script>

<template>
  <GlobalTableActions
    :permissions="Permissions"
    :item="props"
    :editCallback="editCallback"
    :deleteCallback="deleteCallback"
  />
</template>
