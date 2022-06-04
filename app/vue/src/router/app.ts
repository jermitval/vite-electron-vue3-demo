import { RouteRecordRaw } from "vue-router"

export default [
  {
    name: "welcome",
    path: "/",
    component: () => import("../page/index.vue")
  }
] as RouteRecordRaw[]
