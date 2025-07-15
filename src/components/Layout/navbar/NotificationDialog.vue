<script setup lang="ts">
import AppFormDialog from '@/components/app-crud/AppFormDialog.vue';
import AppFormTextareaInput from '@/components/form/AppFormTextareaInput.vue';
import { string } from 'yup';

const message = ref<string>();
const isDialogOpen = defineModel<boolean>();

const onSubmit = () => {
}

</script>
<template>
  <AppFormDialog v-model="isDialogOpen" :isLoading="false" title="Create Notifications" size="md" @submit="onSubmit">
    <div class="px-1">
      <AppFormTextareaInput v-model="message" name="message" label="Notification" placeholder="Enter Notification"
        :validation="string().required()" />
    </div>
  </AppFormDialog>
</template>
