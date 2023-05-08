<script setup lang="ts">
import CpNarBar from "../../components/cp-nav-bar.vue";
import { mobileCheck, codeCheck, passwordCheck } from "../../utils/rules";
import { reactive, ref } from "vue";
import userStore from "../../Store/user";
import { FormInstance, showToast } from "vant";
import {
  loginByPassword,
  sendMobileCode,
  loginByMobile,
} from "../../services/user";
import { useRoute, useRouter } from "vue-router";
import { onUnmounted } from "vue";

interface Ilogin {
  mobile: string | null;
  password: string;
  code?: string | null;
}
const loginData = reactive<Ilogin>({
  mobile: "13230000005",
  password: "abc12345",
  code: null,
});

const user = userStore();
const agree = ref(true); //同意
const route = useRoute();
const router = useRouter();
//短信或者密码登录控制数据
const isPass = ref(true);
let step = ref(0); //秒数
let timer = null; //定时器
// vant的form实例
const form = ref<FormInstance>();
const Onsubmit = async () => {
  if (!agree.value) {
    return showToast("请勾选协议");
  }
  let res = null;

  if (isPass) {
    res = await loginByPassword(loginData);
  } else {
    res = await loginByMobile(loginData.mobile, loginData.code);
  }

  user.setUser(res?.data);
  showToast("登录成功");
  router.replace((route.query.returnUrl as string) || "/user");
};

// 发送短信验证码
const sendCode = async function () {
  if (step.value > 0) return;
  await form.value?.validate("mobile");
  const result = await sendMobileCode(loginData.mobile, "login");
  showToast("发送成功");
  loginData.code = result.data.code.toString();
  step.value = 60;
  if (timer) return clearInterval(timer);
  timer = setInterval(() => {
    if (step.value <= 0) {
      return clearInterval(timer);
    }
    step.value--;
  }, 1000);
};

// 密码显示隐藏
const isShow = ref(false);

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="login-page">
    <CpNarBar
      title="登陆"
      rigthText="注册"
      @click-right="$router.push('/register')"
    ></CpNarBar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? "密码登录" : "短信登录" }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{
          isPass ? "密码登录" : "短信验证码登录"
        }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="Onsubmit" ref="form">
      <van-field
        name="mobile"
        v-model="loginData.mobile"
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileCheck"
      ></van-field>
      <van-field
        v-if="!isPass"
        v-model="loginData.code"
        placeholder="请输入验证码"
        type="text"
        :rules="codeCheck"
        center
        clearable
      >
        <template #button>
          <span
            class="btn-send"
            :class="{ active: step > 0 }"
            @click="sendCode"
            >{{ step === 0 ? "发送验证码" : `${step}s后重新发送` }}</span
          >
        </template>
      </van-field>
      <van-field
        v-else
        v-model="loginData.password"
        placeholder="请输入密码"
        :type="!isShow ? 'password' : 'text'"
        :rules="passwordCheck"
      >
        <template #button>
          <cp-icon
            :name="`login-eye-${!isShow ? 'off' : 'on'}`"
            @click="isShow = !isShow"
            style="margin-right: 10px"
          ></cp-icon>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
