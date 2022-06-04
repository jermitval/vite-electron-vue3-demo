import * as IPC from "@/util/ipc"
import { Store } from "vuex"

/**
 * IPC 进程通讯
 * @param {*} store vuex store 实例
 */
export default (store: Store<VRState>) => {
  IPC.SEND("isMaximized")
  IPC.ON("maximize", (boolean: boolean) => {
    store.commit("app/setWindowMaximizeState", boolean)
  })

  IPC.ON("devtools", () => {
    IPC.SEND("devtools", true)
  })
}
