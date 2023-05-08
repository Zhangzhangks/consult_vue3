<template>
  <van-nav-bar
    :title="title"
    :right-text="rigthText"
    left-arrow
    fixed
    @click-right="onClickRight"
    @click-left="onClickLeft"
  />
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps<{
  title?: string;
  rigthText?: string;
  back?: () => void;
}>();

const emit = defineEmits<{
  (e: "click-right"): void;
}>();
const onClickRight = function () {
  emit("click-right");
};

const onClickLeft = function () {
  if (props.back) return props.back();
  if (history.state?.back) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  .van-nav-bar {
    &__arrow {
      color: var(--cp-text1);
      font-size: 18px;
    }
    &__title {
      font-size: 15px;
    }
  }
}
</style>
