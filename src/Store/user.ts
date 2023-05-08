import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "../type/user";

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
const userStore = defineStore("user", () => {
  const user = ref<User>();
  const setUser = (u: User) => {
    user.value = u;
  };
  const deleteUser = () => {
    user.value = undefined;
  };
  return { user, setUser, deleteUser };
},
{
  persist: {
    storage: localStorage,
    key: 'my-consult',
  },
 
},);
export default userStore;
