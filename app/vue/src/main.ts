import { createApp } from "vue"
import App from "./App.vue"
import * as imp from "./main/import"
import { store, key } from "./main/store"
import router from "./main/router"
import ElementPlus from "element-plus"
import zhCn from "element-plus/es/locale/lang/zh-cn"

// 引入全局样式
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "./assets/style/iconfont/iconfont.css"
import "nprogress/nprogress.css"

// 创建应用
const app = createApp(App)

imp.registerGlobalComponent(app)
imp.setGlobalProperties(app)
imp.registerDirective(app)

// ELement 完整引入
app.use(ElementPlus, {
  locale: zhCn
})

// 状态管理
app.use(store, key)

// 路由管理
app.use(router)

// 挂载
app.mount("#app")
