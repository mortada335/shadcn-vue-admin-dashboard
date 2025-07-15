import { ref } from "vue";

export const isDeleteDialogOpen = ref<boolean>(false);
const _url = ref<string>();
const _id = ref<string>();
const _caption = ref<string>();
const _callback = ref<() => void>(() => { });
export const useDelete = () => {

  const showDialog = (url: string, id: string, callback: () => void, caption?: string) => {
    isDeleteDialogOpen.value = true;
    _id.value = id;
    _url.value = url;
    _caption.value = caption;
    _callback.value = callback
  }

  return {
    showDialog,
    isDeleteDialogOpen,
    url: _url,
    id: _id,
    caption: _caption,
    callback: _callback,
  }
}
