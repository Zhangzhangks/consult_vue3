import userStore from "../Store/user";
import axios, { AxiosError, Method } from "axios";
import router from "@/Router";
import { showToast } from "vant";
export const baseURL = "https://consult-api.itheima.net/";
const instace = axios.create({
  baseURL,
  timeout: 2000,
});

instace.interceptors.request.use(
  (config) => {
    const store = userStore();
    if (store.user?.token && config.headers) {
      config.headers["Authorization"] = `Bearer ${store.user?.token}`;
    }
    return config;
  },
  (Error: AxiosError) => {
    return Promise.reject(Error);
  }
);

instace.interceptors.response.use(
  (res: any) => {
    // 后台约定，响应成功，但是code不是10000，是业务逻辑失败
    if (res.data?.code !== 10000) {
      showToast(res.data?.message || "业务失败");
      return Promise.reject(res.data);
    }
    // 业务逻辑成功，返回响应数据，作为axios成功的结果
    return res.data;
  },
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      // 删除用户信息
      const store = userStore();
      store.deleteUser();
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      router.push({
        path: "/login",
        query: { returnUrl: router.currentRoute.value.fullPath },
      });
    }
    return Promise.reject(err);
  }
);

type Data<T> = {
  code: number;
  message: string;
  data: T;
};
export const request = <T>(
  url: string,
  method: Method = "GET",
  submitData?: object
) => {
  return instace.request<any, Data<T>>({
    method,
    url,
    [method.toLocaleUpperCase() === "GET" ? "params" : "data"]: submitData,
  });
};
