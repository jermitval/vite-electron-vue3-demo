import kebabCase from "lodash/kebabCase"
import { InjectionKey } from "vue"
import { createStore, Store } from "vuex"
import plugins from "./store.plugins"

export const key: InjectionKey<Store<VRState>> = Symbol()

let store_modules: any = []
const glob = import.meta.globEager("../store/*.ts")
for (var path in glob) {
  store_modules[
    kebabCase(
      String(path?.split("/").pop()).replace(/(.ts)/g, "").replace(/\./g, " ")
    )
  ] = glob[path].default || glob[path]
}

export const store = createStore<VRState>({
  modules: store_modules,
  plugins: [plugins],
  strict: true
})
