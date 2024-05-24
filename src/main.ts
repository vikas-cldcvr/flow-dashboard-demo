import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@ollion/flow-core";
import "@ollion/flow-system-icon";
import "@ollion/flow-table";
import "@ollion/flow-dashboard";

import "@ollion/flow-core/dist/types/vue3";
import "@ollion/flow-dashboard/dist/types/vue3";
import "@ollion/flow-table/dist/types/vue3";

createApp(App).use(store).use(router).mount("#app");
