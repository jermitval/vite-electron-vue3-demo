import { defineAsyncComponent } from "vue"
import { ElLoadingDirective } from "element-plus"
import { App } from "vue"

export function registerGlobalComponent(app: App) {
  const glob = import.meta.glob("../component/global/*.vue")
  for (var path in glob) {
    app.component(
      String(path.split("/").pop())
        .replace(/(.vue)/g, "")
        .replace(/\./g, " "),
      defineAsyncComponent(glob[path])
    )
  }
}

export function setGlobalProperties(app: App) {
  // element-plus global config options
  app.config.globalProperties.$ELEMENT = { size: "small" }
}

export function registerDirective(app: App) {}
