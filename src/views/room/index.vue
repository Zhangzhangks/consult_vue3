<script lang="ts" setup>
import roomState from "./components/RoomState.vue";
import RoomAction from "./components/RoomAction.vue";
import RoomMessage from "./components/RoomMessage.vue";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { baseURL } from "@utils/request";
import io, { Socket } from "socket.io-client";
import userStore from "@Store/user";
import { useRoute } from "vue-router";
import { Message, TimeMessages } from "@type/room";
import { ConsultType, MsgType, OrderType } from "@/enums";
import { ConsultOrderItem } from "@type/consult";
import { getConsultOrderDetail } from "@services/consult";
import { useConsultStore } from "@Store/consult";
import type { Image } from "@type/consult";
import dayjs from "dayjs";
import { showToast } from "vant";
import { provide } from "vue";
const store = userStore();
const route = useRoute();
const consultStore = useConsultStore();
const consult = ref<ConsultOrderItem>();
const loadConsult = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string);
  consult.value = res.data;
};
const list = ref<Message[]>([]);
let socket: Socket;
// 发送文字
const onSendText = function (text: string) {
  // console.log(e);
  socket.emit("sendChatMsg", {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text },
  });
};
// 第一次渲染最新消息
const initMsg = ref(true);

// 发送图片
const onSendImg = (img: Image) => {
  socket.emit("sendChatMsg", {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img },
  });
};
// 下拉刷新
const loading = ref(false);
// 记录每段消息的开始时间，作为下一次请求的开始时间
// ts
const time = ref(dayjs().format("YYYY-MM-DD HH:mm:ss"));
const onRefresh = function () {
  console.log(time.value);

  socket.emit("getChatMsgList", 20, time.value, route.query.orderId);
};

// ...
provide("consult", consult);
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm);
  if (item) {
    item.msg.evaluateDoc = { score };
    item.msgType = MsgType.CardEva;
  }
};
provide("completeEva", completeEva);
onMounted(() => {
  loadConsult();
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`,
    },
    query: {
      orderId: route.query.orderId,
    },
  });
  socket.on("connect", () => {
    // console.log("链接成功");
    // 拿取聊天记录
    socket.on("chatMsgList", async ({ data }: { data: TimeMessages[] }) => {
      const arr: Message[] = [];
      // console.log(data);

      data.forEach((item, i) => {
        if (i === 0) {
          time.value = item.createTime;
        }
        arr.push({
          msgType: MsgType.Notify,
          msg: { content: item.createTime },
          createTime: item.createTime,
          id: item.createTime,
        });
        arr.push(...item.items);
      });

      // // 追加到聊天消息列表
      list.value.unshift(...arr);
      // console.log(list.value);
      loading.value = false;
      if (!data.length) {
        return showToast("没有聊天记录了");
      }

      await nextTick(() => {
        if (initMsg.value) {
          socket.emit("updateMsgStatus", arr[arr.length - 1].id);
          window.scrollTo(0, document.body.clientHeight);
        }
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("链接关闭");
  });
  socket.on("error", (err) => {
    console.log(err);
  });
  // 更新订单状态 在onMounted注册
  socket.on("statusChange", () => loadConsult());
  // 接受服务其消息
  // 接收消息 在onMounted注册
  socket.on("receiveChatMsg", async (event) => {
    list.value.push(event);
    if (initMsg.value) {
      socket.emit("updateMsgStatus", event.id);
      await nextTick();
      window.scrollTo(0, document.body.clientHeight);
    }
  });
});
onUnmounted(() => {
  socket.close();
});
</script>
<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室"></cp-nav-bar>
    <roomState :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <RoomMessage
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></RoomMessage>
    </van-pull-refresh>
    <RoomAction
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="onSendText"
      @send-image="onSendImg"
    ></RoomAction>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
