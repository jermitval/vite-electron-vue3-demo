interface VRState {
  app: VSApp
}

interface VSApp {
  /** 窗口 */
  window: {
    /** 窗口是否最大化 */
    maximize: boolean
    /** 视窗宽度 */
    screenWidth: number
    /** 视窗高度 */
    screenheight: number
  }
}
