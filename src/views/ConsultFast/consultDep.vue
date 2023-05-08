<script setup lang="ts">
import { TopDep } from "@type/consult";
import { onMounted } from "vue";
import { ref } from "vue";
import { getAllDep } from "@services/consult";
import { computed } from "vue";
import { useConsultStore } from "@Store/consult";
const allDep = ref<TopDep[]>();

const active = ref(0);

const store=useConsultStore();
const subDep = computed(() => {
  return allDep.value[active.value]?.child;
});
onMounted(async () => {
  const res = await getAllDep();
  allDep.value = res.data;
  console.log(res.data);
});
</script>

<template>
  <div class="consult-dep-page" v-if="allDep">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          :title="item.name"
          v-for="item in allDep"
          :key="item.id"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
          @click="store.setDep(sub.id)"
          >{{ sub.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
