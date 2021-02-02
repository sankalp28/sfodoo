import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import NagvigationMenu from "@/components/NavigationMenu";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/setup",
    name: "setup",
    component: () => import("../views/Setup.vue"),
  },
  {
    path: "/compareRecord",
    name: "compareRecord",
    components: {
      default: () => import("../views/CompareRecord.vue"),
      head: NagvigationMenu,
    },
  },
  {
    path: "/CompareAssetsRecord",
    name: "CompareAssetsRecord",
    components: {
      default: () => import("../views/CompareAssetsRecord.vue"),
      head: NagvigationMenu,
    },
  },
  {
    path: "/fieldMapping",
    name: "fieldMapping",
    components: {
      default: () => import("../views/Setup1.vue"),
      head: NagvigationMenu,
    },
  },
  {
    path: "/syncRule",
    name: "syncRule",
    components: {
      default: () => import("../views/SyncRule.vue"),
      head: NagvigationMenu,
    },
  },
  {
    path: "/logs",
    name: "logs",
    components: {
      default: () => import("../views/Logs.vue"),
      head: NagvigationMenu,
    },
  },
  {
    path: "/logsDetails/:type/:name",
    name: "logsDetails",
    components: {
      default: () => import("../views/LogsDetails.vue"),
      head: NagvigationMenu,
    },
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
