import { ActionTree, MutationTree, GetterTree } from "vuex"

const state: VSApp = {
  window: {
    maximize: false,
    screenWidth: 0,
    screenheight: 0
  }
}

const getters: GetterTree<VSApp, VRState> = {}

const mutations: MutationTree<VSApp> = {
  /**
   * 设置窗口最大化状态
   * @param state
   * @param value 是否最大化
   */
  setWindowMaximizeState(state, boolean) {
    state.window.maximize = boolean || false
  },

  /**
   * 记录视窗窗口尺寸
   * @param state
   * @param payload 参数集合
   */
  screen(state, payload) {
    state.window.screenWidth = payload?.width || 0
    state.window.screenheight = payload?.height || 0
  }
}

const actions: ActionTree<VSApp, VRState> = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
