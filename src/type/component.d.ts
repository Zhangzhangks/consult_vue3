import CpIcon from "@/components/CpIcon.vue";
import CpPaySheet from '@/components/CpPaySheet.vue'
declare module "vue" {
  interface GlobalComponents {
    CpIcon: typeof CpIcon;
    CpPaySheet: typeof CpPaySheet
  }
}
