/** 接收进程异步通讯监听函数 */
declare type IpcListener = (event: Electron.IpcMainEvent, arg: any) => void
/** 接收进程异步通讯监听函数(参数调换处理) */
declare type IpcListenerR = (arg: any, event: Electron.IpcMainEvent) => void

/** 响应体 */
interface GRes {
  /** 响应码 */
  code: string | number
  /** 错误消息 */
  msg?: string
}
