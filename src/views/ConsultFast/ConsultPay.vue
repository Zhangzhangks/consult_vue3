<script setup lang="ts">
import { useConsultStore } from "@Store/consult";
import {
  createConsultOrder,
  getConsultOrderPayUrl,
  getConsultOrderPre,
} from "@services/consult";
import { getPatientDetail } from "@services/user";
import { ConsultOrderPreData, PartialConsult } from "@type/consult";
import { Patient } from "@type/user";
import {
  showConfirmDialog,
  showDialog,
  showLoadingToast,
  showToast,
} from "vant";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { onBeforeRouteLeave } from "vue-router";
const store = useConsultStore();
// 支付抽屉
const show = ref(false);
// 预支付信息
const payInfo = ref<ConsultOrderPreData>();
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType,
  });
  payInfo.value = res.data;
  // 设置默认优惠券
  store.setCoupon(payInfo.value.couponId);
};

// 患者详情
const patient = ref<Patient>();
const loadPatient = async () => {
  if (!store.consult.patientId) return;
  const res = await getPatientDetail(store.consult.patientId);
  patient.value = res.data;
};
// 我同意
const agree = ref(true);
const orderID = ref("");
const loading = ref(false);

// 立即支付不是抽屉里面
const submit = async () => {
  if (!agree.value) return showToast("请勾选协议");
  loading.value = true;
  const res = await createConsultOrder(store.consult);
  loading.value = false;
  store.clear();
  orderID.value = res.data.id;
  show.value = true;
};
type Key = keyof PartialConsult;

const router = useRouter();
const beforeClose = () => {
  return showConfirmDialog({
    title: "关闭支付",
    message: "取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？",
    cancelButtonText: "仍要关闭",
    confirmButtonText: "继续支付",
  })
    .then(() => {
      return false;
    })
    .catch(() => {
      orderID.value = "";
      router.push("/user/consult");
      return true;
    });
};

onBeforeRouteLeave(() => {
  if (orderID.value) return false;
});
onMounted(() => {
  const validKeys: Key[] = [
    "type",
    "illnessType",
    "depId",
    "illnessDesc",
    "illnessTime",
    "consultFlag",
    "patientId",
  ];
  const valid = validKeys.every((key) => store.consult[key] !== undefined);
  if (!valid) {
    return showDialog({
      title: "温馨提示",
      message:
        "问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！",
      closeOnPopstate: false,
    }).then(() => {
      router.push("/");
    });
  }

  loadData();
  loadPatient();
});
</script>

<template>
  <div class="consult-pay-page" v-if="patient && payInfo">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-￥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-￥${payInfo.couponDeduction}`" />
      <van-cell
        title="实付款"
        :value="`-￥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} ${patient.age}   ${
          patient.gender == 1 ? '男' : '女'
        }`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />

    <!-- 支付抽屉 -->
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderID"
      :actualPayment="payInfo.actualPayment"
      :onClose="beforeClose"
    />
  </div>

  <div class="consult-pay-page" v-else>
    <cp-nav-bar title="支付"></cp-nav-bar>
    <!-- 骨架 -->
    <van-skeleton title :row="10" style="margin-top: 18px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
