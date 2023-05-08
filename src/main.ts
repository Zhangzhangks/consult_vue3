import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./Router/index";
import "./Style/style.scss";

import pinia from "./Store/piniaSetting";
const app = createApp(App);

import "virtual:svg-icons-register";

import "vant/lib/index.css";
app.use(router);
app.use(pinia);

app.mount("#app");
