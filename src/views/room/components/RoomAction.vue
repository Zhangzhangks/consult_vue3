<script setup lang="ts">
import { uploadImage } from "@services/consult";
import { Toast, showLoadingToast } from "vant";
import { UploaderAfterRead } from "vant/lib/uploader/types";
import { ref } from "vue";
import { Image } from "@type/consult";
defineProps<{
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "send-text", val: string): void;
  (e: "send-image", val: Image): void;
}>();
const text = ref("");

const sendText = () => {
  emit("send-text", text.value);
  text.value = "";
};

const sendImg: UploaderAfterRead = async (data) => {
  if (Array.isArray(data)) return;
  if (!data.file) return;
  const t = showLoadingToast("正在上传");
  const res = await uploadImage(data.file);
  t.close();
  emit("send-image", res.data);
};
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      v-model="text"
      @keyup.enter="sendText"
      :disabled="disabled"
    ></van-field>
    <van-uploader
      :preview-image="false"
      :after-read="sendImg"
      :disabled="disabled"
    >
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
