<<<<<<< Updated upstream
<template>
  <div class="home">
    <h1>home</h1>
=======
<script setup lang="ts">
import { ref } from "vue";
import KnowledgeList from "./components/KnowledgeList.vue";
import followDoctor from "./components/followDoctor.vue";
const active = ref(0);
import { useConsultStore } from "@Store/consult";
import { ConsultType } from "@/enums";
const ConsultStore = useConsultStore();
</script>

<template>
  <div class="home-page">
    <!-- 头部 -->
    <div class="home-header">
      <div class="con">
        <h1>优医</h1>
        <div class="search">
          <cp-icon name="home-search" /> 搜一搜：疾病/症状/医生/健康知识
        </div>
      </div>
    </div>
    <!-- 导航 -->
    <div class="home-navs">
      <van-row>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">问医生</p>
            <p class="desc">按科室查问医生</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link
            to="/consult/fast"
            class="nav"
            @click="ConsultStore.setType(ConsultType.Fast)"
          >
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">极速问诊</p>
            <p class="desc">20s医生极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">开药门诊</p>
            <p class="desc">线上买药更方便</p>
          </router-link>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-order"></cp-icon>
            <p class="title">药品订单</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-docs"></cp-icon>
            <p class="title">健康档案</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-rp"></cp-icon>
            <p class="title">我的处方</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-find"></cp-icon>
            <p class="title">疾病查询</p>
          </router-link>
        </van-col>
      </van-row>
    </div>
    <!-- 轮播图 -->
    <div class="home-banner">
      <van-swipe indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- tab -->
    <van-tabs shrink sticky v-model:active="active">
      <van-tab title="关注">
        <followDoctor />
        <KnowledgeList type="like" />
      </van-tab>
      <van-tab title="推荐">
        <KnowledgeList type="recommend" />
      </van-tab>
      <van-tab title="减脂"> <KnowledgeList type="fatReduction" /></van-tab>
      <van-tab title="饮食"> <KnowledgeList type="food" />4</van-tab>
    </van-tabs>
>>>>>>> Stashed changes
  </div>
</template>

<script lang="ts" setup></script>

<style lang="" scoped></style>
