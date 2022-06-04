import NProgress from "nprogress"
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from "vue-router"
import { RouteRecordRaw } from "vue-router"
import { store } from "./store"

let routers: RouteRecordRaw[] = []
const glob = import.meta.globEager("../router/*.ts")
for (var path in glob) {
  routers = routers.concat(glob[path].default || glob[path])
}

const router = createRouter({
  history: createWebHashHistory("./"),
  routes: [...routers, { path: "/:catchAll(.*)", redirect: "/404" }]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (process.env.NODE_ENV == "development") {
    console.debug("[Router]: ", { to, from })
  }
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

export default router
