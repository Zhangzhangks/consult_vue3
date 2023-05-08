<script setup lang="ts">
import { MsgType } from "@/enums";
import userStore from "@Store/user";

import { Image } from "@type/consult";
import { Message } from "@type/room";

import { showImagePreview } from "vant";
import evaluateCard from "./evaluateCard.vue";
const props = defineProps<{ item: Message }>();
// console.log(props, "sss");
import dayjs from "dayjs";
import { useshowPrescription } from "@/composables";
import { getIllnessTimeText ,getConsultFlagText} from "@utils/filter";

// 预览图片
const previewImg = (pictures?: Image[]) => {
  if (pictures && pictures.length) {
    showImagePreview(pictures.map((item) => item.url));
  }
};

const store = userStore();
// 查看处方
const { showPrescription } = useshowPrescription();
const formatTime = (time: string) => dayjs(time).format("HH:mm");
</script>

<template>
  <!-- 患者卡片 -->
  <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
    <div class="patient van-hairline--bottom">
      <p>
        {{ item.msg.consultRecord?.patientInfo.name }}
        {{ item.msg.consultRecord?.patientInfo.genderValue }}
        {{ item.msg.consultRecord?.patientInfo.age }}岁
      </p>
      <p v-if="item.msg.consultRecord">
        {{ getIllnessTimeText(item.msg.consultRecord.illnessTime) }} |
        {{ getConsultFlagText(item.msg.consultRecord.consultFlag) }}
      </p>
    </div>
    <van-row>
      <van-col span="6">病情描述</van-col>
      <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
      <van-col span="6">图片</van-col>
      <van-col span="18" @click="previewImg(item.msg.consultRecord?.pictures)">
        点击查看
      </van-col>
    </van-row>
  </div>
  <!-- 通用通知 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 文体新提示 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
    <div class="content">
      <span class="green">温馨提示：</span>
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 结束消息 -->
  <div
    class="msg msg-tip ms-tip-cancel"
    v-if="item.msgType === MsgType.NotifyCancel"
  >
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>

  <!-- 我发的消息 -->
  <div
    class="msg msg-to"
    v-if="item.msgType === MsgType.MsgText && store.user?.id === item.from"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
    <van-image :src="store.user?.avatar" />
  </div>
  <!-- 发送图 -->
  <div
    class="msg msg-to"
    v-if="item.msgType === MsgType.MsgImage && store.user?.id === item.from"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
    <van-image :src="store.user?.avatar" />
  </div>

  <!-- 医生发的消息 -->
  <div
    class="msg msg-from"
    v-if="item.msgType === MsgType.MsgText && store.user?.id !== item.from"
  >
    <van-image :src="item.fromAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
  </div>
  <!-- 接收图片 -->
  <div
    class="msg msg-from"
    v-if="item.msgType === MsgType.MsgImage && store.user?.id !== item.from"
  >
    <van-image :src="item.fromAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
  </div>
  <!-- 处方卡片 -->
  <!-- 处方 -->
  <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
    <div class="content" v-if="item.msg.prescription">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p @click="showPrescription(item.msg.prescription?.id)">
            原始处方 <van-icon name="arrow"></van-icon>
          </p>
        </div>
        <p>
          {{ item.msg.prescription.name }}
          {{ item.msg.prescription.genderValue }}
          {{ item.msg.prescription.age }}岁
          {{ item.msg.prescription.diagnosis }}
        </p>
        <p>开方时间：{{ item.msg.prescription.createTime }}</p>
      </div>
      <div class="body">
        <div
          class="body-item"
          v-for="med in item.msg.prescription.medicines"
          :key="med.id"
        >
          <div class="durg">
            <p>{{ med.name }} {{ med.specs }}</p>
            <p>{{ med.usageDosag }}</p>
          </div>
          <div class="num">x{{ med.quantity }}</div>
        </div>
      </div>
      <div class="foot">
        <span>购买药品</span>
      </div>
    </div>
  </div>

  <!-- 评价卡片，后期实现 -->

  <div
    class="msg msg-comment"
    v-if="
      item.msgType === MsgType.CardEva || item.msgType === MsgType.CardEvaForm
    "
  >
    <evaluate-card :evaluateDoc="item.msg.evaluateDoc" />
  </div>
</template>

<style lang="scss" scoped>
@import "../../../Style/room.scss";
</style>
