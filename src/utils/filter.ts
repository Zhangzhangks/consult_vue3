import { IllnessTime } from "@/enums";
import { flagOptions, timeOptions } from "@services/constant";

// 显示患病信息
export const getIllnessTimeText = (time: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label;

export const getConsultFlagText = (flag: 0 | 1) =>
  flagOptions.find((item) => item.value === flag)?.label;
