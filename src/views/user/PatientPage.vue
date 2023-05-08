<script setup lang="ts">
import { addPatient, getPatientList } from "@services/user";
import { PatientList, Patient } from "@type/user";
import { computed, onMounted } from "vue";
import { ref, reactive } from "vue";
import cpNavBar from "@components/cp-nav-bar.vue";
import { nameRules, idCardRules } from "@utils/rules";
import type { FormInstance } from "vant";
import { showConfirmDialog, showToast, showSuccessToast } from "vant";
import { useRoute } from "vue-router";
import { useConsultStore } from "@Store/consult";
import { useRouter } from "vue-router";
const patientList = ref<PatientList>();

const options = [
  { label: "男", value: 1 },
  { value: 0, label: "女" },
];

const patientUser = reactive<Patient>({
  name: "张思",
  idCard: "110101198307212600",
  gender: 1,
  defaultFlag: 0,
});
const showRight = ref(false);
const loadList = async () => {
  const res = await getPatientList();
  patientList.value = res.data;
  if (isChange.value && patientList.value.length) {
    const defPatient = patientList.value.find((item) => item.defaultFlag === 1);
    if (defPatient) patientId.value = defPatient.id;
    else patientId.value = patientList.value[0].id;
  }
};
// 返回关闭
const goLeft = function () {
  showRight.value = false;
  for (const i in patientUser) {
    patientUser[i] = "";
  }
};
// 默认值需要转换
const defaultFlag = computed({
  get() {
    return patientUser.defaultFlag === 1 ? true : false;
  },
  set(value) {
    patientUser.defaultFlag = value ? 1 : 0;
  },
});

const form = ref<FormInstance>();
//没成功
const onSubmit = async () => {
  if (form.value) {
    // console.log(form.value[0], "form");

    await form.value[0]?.validate();
    // 身份证倒数第二位，单数是男，双数是女
    const gender = +patientUser.idCard.slice(-2, -1) % 2;
    if (gender !== patientUser.gender) {
      await showConfirmDialog({
        title: "温馨提示",
        message: "填写的性别和身份证号中的不一致\n您确认提交吗?",
      });
    }
    // 添加
    await addPatient(patientUser);
    showToast("添加成功");
    showRight.value = false;
    loadList();
  }
};

onMounted(async () => {
  loadList();
});

const route = useRoute();
const isChange = computed(() => route.query.isChange === "1");
const patientId = ref<string>();
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    patientId.value = item.id;
  }
};

// 下一步 记录患者
const router = useRouter();
const store = useConsultStore();
const next = () => {
  if (!patientId.value) return showToast("请选择患者");
  store.setPatient(patientId.value);
  router.push("/consult/pay");
};
</script>

<template>
  <div class="patient-page" v-if="patientList">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>

    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in patientList"
        :key="item.idCard"
        @click="selectedPatient(item)"
        :class="{ selected: item.id === patientId }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/(\d{6})\d{8}(\d{4})/, "$1********$2")
          }}</span>
          <span>{{ item.gender == 1 ? "女" : "男" }}</span>
          <span>{{ item.age }}岁</span>
        </div>
<<<<<<< Updated upstream
        <div class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 0">默认</div>
=======
        <div class="icon" @click.stop="edit_oradd(item)">
          <cp-icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
>>>>>>> Stashed changes
      </div>

      <div
        class="patient-add"
        v-if="patientList.length < 6"
        @click="showRight = true"
      >
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
<<<<<<< Updated upstream
      <div class="patient-tip">
        最多可添加 6 人
        <van-popup
          v-model:show="showRight"
          position="right"
          :style="{ width: '100%', height: '100%' }"
        >
          <cpNavBar
            title="添加患者"
            rigth-text="保存"
            :back="goLeft"
            @click-right="onSubmit"
          ></cpNavBar>
          <van-form autocomplete="off" ref="form">
            <van-field
              label="真实姓名"
              placeholder="请输入真实姓名"
              :rules="nameRules"
              v-model="patientUser.name"
            />
            <van-field
              label="身份证号"
              :rules="idCardRules"
              placeholder="请输入身份证号"
              v-model="patientUser.idCard"
            />
            <van-field label="性别" class="pb4">
              <!-- 单选按钮组件 -->
              <template #input>
                <cp-radio-btn
                  :options="options"
                  v-model:gender="patientUser.gender"
                ></cp-radio-btn>
              </template>
            </van-field>
            <van-field label="默认就诊人">
              <template #input>
                <van-checkbox :icon-size="18" round v-model="defaultFlag" />
              </template>
            </van-field>
          </van-form>
        </van-popup>
=======
      <div class="patient-tip">最多可添加 6 人</div>
      <van-popup
        v-model:show="showRight"
        position="right"
        :style="{ width: '100%', height: '100%' }"
      >
        <cpNavBar
          :title="!patientUser?.id ? '添加患者' : '编辑患者'"
          rigth-text="保存"
          :back="goLeft"
          @click-right="onSubmit"
        ></cpNavBar>
        <van-form autocomplete="off" ref="form">
          <van-field
            label="真实姓名"
            placeholder="请输入真实姓名"
            :rules="nameRules"
            v-model="patientUser.name"
          />
          <van-field
            label="身份证号"
            :rules="idCardRules"
            placeholder="请输入身份证号"
            v-model="patientUser.idCard"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <cp-radio-btn
                :options="options"
                v-model:gender="patientUser.gender"
              ></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox :icon-size="18" round v-model="defaultFlag" />
            </template>
          </van-field>
        </van-form>
      </van-popup>

      <!-- 底部按钮 -->
      <div class="patient-next" v-if="isChange">
        <van-button type="primary" round block @click="next">下一步</van-button>
>>>>>>> Stashed changes
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-form) {
  padding-top: 50px;
}
<<<<<<< Updated upstream
=======
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}

>>>>>>> Stashed changes
.patient-page {
  padding: 46px 0 80px !important;
 
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0 !important;
}
.pb4 {
  padding-bottom: 4px;
}


  
</style>
