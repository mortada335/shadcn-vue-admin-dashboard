<script setup lang="ts">
import AppFormDialog from "@/components/app-crud/AppFormDialog.vue";
import { useMutation } from "@tanstack/vue-query";
import { useToast } from "@/components/ui/toast";
import $api from "@/api/api";
import AppTextInput from "@/components/fields/AppTextInput.vue";
import { isNumber } from "@/utils/validators";
import { useAuthStore } from "@/stores/auth";

const { toast } = useToast();
const capital = ref(0);
// const { user: { value: { tenant } } } = useAuthStore();

const isDialogOpen = defineModel<boolean>();

const toggleTenant = async () => {
  await $api.put("tenants/capital?Capital=" + capital.value);
  toast({
    title: "Success",
    description: "tenant capital changed",
    variant: "default",
  });
  capital.value = 0;
  isDialogOpen.value = false;
};

const title = computed(() => {
  return "Edit Capital";
});

const { mutate, isPending } = useMutation({
  mutationKey: ["tenant-edit-capital"],
  mutationFn: toggleTenant,
});
</script>
<template>
  <AppFormDialog
    v-model="isDialogOpen"
    @submit="mutate"
    :isLoading="isPending"
    :title
    size="md"
  >
    <div class="flex flex-col gap-5 justify-center items-center">
      <div class="flex text-3xl flex-col gap-5 text-center">
        <p>
          <!-- {{ $t("Capital") }} : {{ tenant?.capital }} -->
        </p>
        <p v-if="capital && capital != 0" class="text-muted-foreground">
          {{ capital > 0 ? "+ " : "- " }}{{ Math.abs(capital) }}
        </p>
      </div>
      <AppTextInput
        label="Capital"
        placeholder="capital"
        v-model="capital"
        type="number"
        name="capital"
        :validation="isNumber().required()"
      />
    </div>
  </AppFormDialog>
</template>
