import { ref } from "vue";
import {
  cancelOrder,
  deleteOrder,
  followOrUnfollow,
  getPrescriptionPic,
} from "@/services/consult";
import type { ConsultOrderItem, FollowType } from "@/type/consult";
import { showFailToast, showImagePreview, showSuccessToast } from "vant";
import { OrderType } from "@/enums";
import { defineEmits } from 'vue'
// 是组合API封装逻辑复用的函数，一般叫 hook 函数，是一种逻辑复用的思想
// 对象类型多的可以传递给少的，叫：类型兼容
// 封装逻辑，规范 useXxx，表示使用某功能
export const useFollow = (type: FollowType = "doc") => {
  const loading = ref(false);
  // {a, b} 类型，传值得时候 {a, b, c} 也可以，这是类型兼容：多的可以给少的
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true;
    try {
      await followOrUnfollow(item.id, type);
      item.likeFlag = item.likeFlag === 1 ? 0 : 1;
    } finally {
      loading.value = false;
    }
  };
  return { loading, follow };
};

// 查看处方

export const useshowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id);
      showImagePreview([res.data.url]);
    }
  };
  return { showPrescription };
};

// 取消订单
export const useCancel = () => {
  const loading = ref(false);
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true;
      await cancelOrder(item.id);
      item.status = OrderType.ConsultCancel;
      item.statusValue = "已取消";
      showSuccessToast("取消成功");
    } catch (error) {
      showFailToast("取消失败");
    } finally {
      loading.value = false;
    }
  };
  return { loading, cancelConsultOrder };
};

export const useDelte = (callback:()=>void) => {
 
  // 删除订单
  const deleteLoading = ref(false);
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    try {
      deleteLoading.value = true;
      await deleteOrder(item.id);
      showSuccessToast("删除成功");
     callback&&callback()
    } catch (error) {
      showFailToast("删除失败");
    } finally {
      deleteLoading.value = false;
    }
  };
  return { deleteConsultOrder, deleteLoading };
};
