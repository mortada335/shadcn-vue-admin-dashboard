import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "./auth";

export const useTableStore = defineStore('table-store', () => {
  const query = useRoute().query;
  const pageSize = ref(parseInt(query.pageSize as string ?? '10'));
  const pageNumber = ref(parseInt(query.pageNumber as string ?? '1'));
  const options = computed(() => {
    return {
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
    }
  });
  const viewActions = (permissions: any) => {
    return true;
    // const authStore = useAuthStore();
    // const newPermissions = JSON.parse(JSON.stringify(permissions));
    // delete (newPermissions.get)
    // delete (newPermissions.getAll)
    // delete (newPermissions.getDeleted)
    // delete (newPermissions.getByToken)
    // const arr = Object.keys(permissions).map((key) => permissions[key]);
    // return arr.find((a) => authStore.can(a)) != null;
  }
  const reset = () => {
    pageSize.value = 10;
    pageNumber.value = 1;
  }
  const resetNumber = () => {
    pageNumber.value = 1;
  }

  const set = (size: number, number: number) => {
    pageSize.value = size;
    pageNumber.value = number;
  }

  return {
    pageSize,
    pageNumber,
    options,
    reset,
    viewActions,
    resetNumber,
    set
  }
})
