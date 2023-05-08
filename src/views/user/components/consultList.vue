<script setup lang="ts">
import { getConsultOrderList } from "@services/consult";
import ConsultItem from "./Item.vue";
import { onMounted, ref } from "vue";
import {
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage,
  PageParams,
} from "@type/consult";

const props = defineProps<{
  type: number;
}>();
const params = ref<ConsultOrderListParams>({
  current: 1,
  pageSize: 5,
  type: props.type,
});

const loading = ref(false);
const finished = ref(false);
const list = ref<ConsultOrderItem[]>([]);
const onLoad = async function () {
  const res = await getConsultOrderList(params.value);

  list.value.push(...res.data.rows);
  // console.log(res);
  if (params.value.current > res.data.pageTotal) {
    finished.value = true;
  } else {
    params.value.current++;
  }
  // console.log(list.value);

  loading.value = false;
};

const deleteVal = function (id: string) {
  list.value = list.value.filter((item) => item.id !== id);
  if (!list.value.length)  onLoad();
};
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <div v-for="item in 100 ">{{ item }}</div> -->
      <consult-item
        @on-delete="deleteVal"
        v-for="item in list"
        :key="item.id"
        :item="item"
      />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
