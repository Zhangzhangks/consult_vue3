import userStore from "@Store/user";
import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({
  showSpinner: false,
});
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/Layout/main.vue"),
      redirect: "/home",
      meta: { title: "首页" },
      children: [
        { path: "/home", component: () => import("../views/Home/index.vue") },
        {
          path: "/article",
          meta: { title: "健康百科" },
          component: () => import("../views/article/index.vue"),
        },
        {
          path: "/notify",
          meta: { title: "消息通知" },
          component: () => import("../views/notify/index.vue"),
        },
        {
          path: "/user",
          meta: { title: "个人中心" },
          component: () => import("../views/user/index.vue"),
          children: [],
        },
      ],
    },

    {
      path: "/login",
      meta: { title: "登陆" },
      component: () => import("../views/Login/login.vue"),
    },
    {
      path: "/user/patient",
      component: () => import("../views/user/PatientPage.vue"),
      meta: { title: "家庭档案" },
      children: [],
    },
    {
      path: "/consult/fast",
      component: () => import("../views/ConsultFast/ConsultFast.vue"),
      meta: { title: "极速问诊" },
    },
    {
      path: "/consult/dep",
      component: () => import("../views/ConsultFast/consultDep.vue"),
      meta: { title: "选择科室" },
    },
    {
      path: "/consult/illness",
      component: () => import("@/views/ConsultFast/ConsultIllness.vue"),
      meta: { title: "病情描述" },
    },
    {
      path: "/consult/pay",
      component: () => import("@/views/ConsultFast/ConsultPay.vue"),
      meta: { title: "问诊支付" },
    },
    {
      path: "/room",
      component: () => import("@/views/room/index.vue"),
      meta: { title: "问诊室" },
      beforeEnter(to) {
        if (to.query.payResult === "false") return "/user/consult";
      },
    },
    {
      path: '/user/consult',
      component: () => import('@/views/user/components/consultPage.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/user/consult/:id',
      component: () => import('@/views/user/components/constDetail.vue'),
      meta: { title: '问诊详情' }
    }

  ],
});

// 访问权限控制
router.beforeEach((to) => {
  NProgress.start();
  // 用户仓库
  const store = userStore();
  // 不需要登录的页面，白名单
  const wihteList = ["/login"];
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !wihteList.includes(to.path)) return "/login";
  // 否则不做任何处理
});
router.afterEach((to) => {
  NProgress.done();
  document.title = `${to.meta.title || ""}-优医问诊`;
});
export default router;
