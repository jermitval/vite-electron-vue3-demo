/**
 * 发送进程消息(异步)
 * @param channel 频道
 * @param args 传参
 */
export function SEND(channel: string, ...args: any[]) {
  window.ipc?.send(channel, ...args)
}

/**
 * 接收进程消息(异步)
 * ! 谨慎注册监听器
 * @param channel 频道
 * @param listener 监听函数
 */
export function ON(channel: string, listener: IpcListenerR) {
  window.ipc?.on(channel, (e, a) => listener(a, e))
}
