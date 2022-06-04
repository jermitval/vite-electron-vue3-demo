import type { AxiosRequestConfig } from "axios"

declare global {
  namespace NodeJS {
    interface Global {}
  }

  interface Window {
    /** 进程通讯 */
    ipc: {
      /** 发送消息 */
      send: (channel: string, ...args: any[]) => void
      /** 接收消息监听器 */
      on: (channel: string, listener: IpcListener) => undefined
      /** 移除监听器 */
      removeListener: (channel: string, listener: IpcListener) => undefined
      /** 移除监听器 */
      removeAllListeners: (channels: Array<string>) => undefined
      /** Axios 请求 */
      axios: (option: AxiosRequestConfig) => Promise<any>
    }
  }
}
