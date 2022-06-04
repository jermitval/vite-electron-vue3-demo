import useWindow from "./store.plugins/window"
import useIpc from "./store.plugins/ipc"
import { Store } from "vuex"

/**
 * 状态管理插件
 */
export default (store: Store<VRState>) => {
  useWindow(store)
  useIpc(store)

  store.subscribe((mutation, state) => {
    // console.log(mutation)
  })
}
