<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import Dialog from "./Dialog.vue";
import AppCrud from "@/components/app-crud/AppCrud.vue";
import { columns, filters } from "..";
import { Material, QueryKeys, Permissions } from "../types";
import { useQuery } from "@tanstack/vue-query";
import { Client } from "@/api/client";
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";
import { useStore } from "../stores";
import { URL } from "..";
import { useTableStore } from "@/stores/table";
import CanPage from "@/components/auth/CanPage.vue";
import Can from "@/components/auth/Can.vue";
const route = useRoute();
const deletedOnly = ref(false);
const store = useStore();
const tableStore = useTableStore();
const visibleCoulmns = computed(() => {
  if (
    (columns.at(-1) as any).accessorKey == "actions" &&
    !tableStore.viewActions(Permissions)
  ) {
    columns.pop();
  }
  return columns;
});
const getData = async () => {
  return await Client.get<Material>(
    URL + (deletedOnly.value == true ? "/deleted" : ""),
    tableStore.options,
    route.query
  );
};

const { data, isLoading, refetch } = useQuery({
  queryKey: [QueryKeys.getAll],
  queryFn: getData,
});
</script>
<template>
  <CanPage :permission="Permissions.getAll">
    <AppCrud :mainFilter="filters[0]" :filters="filters" :fetchFn="refetch">
      <template #actions>
        <Can :permission="Permissions.getDeleted">
          <Button
            @click="
              () => {
                deletedOnly = !deletedOnly;
                refetch();
              }
            "
            :variant="deletedOnly ? 'destructive' : 'secondary'"
          >
            {{ $t("Deleted Only") }}
            <icon icon="tabler-trash" />
          </Button>
        </Can>
        <Can :permission="Permissions.create">
          <Button @click="store.openCreateDialog()">
            {{ $t("Add") }}
            <icon icon="tabler-circle-plus" />
          </Button>
        </Can>
      </template>
      <Table
        @options="() => refetch()"
        :columns="visibleCoulmns"
        :current-page="data?.currentPage ?? 1"
        :total-pages="data?.totalPages ?? 1"
        :total-count="data?.totalCount ?? 0"
        :data="data?.items"
        :isLoading
      />
      <Dialog />
    </AppCrud>
  </CanPage>
</template>
