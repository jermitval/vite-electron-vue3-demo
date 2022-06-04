// ! 谨慎使用本地存储功能
// ! 本地储存未对账号进行区分
// ! 请避免重要信息泄漏
// ! 应用退出或账号登出时做好必要清理

import WebStorageCache from "web-storage-cache"

const wsc = new WebStorageCache({
  storage: "localStorage",
  exp: Infinity // expired [second]||Infinity
})

/**
 * 获取本地缓存
 * @param key 键名
 * @returns
 */
export function GET(key: string) {
  return wsc.get(key)
}

/**
 * 设置本地缓存
 * @param key 键名
 * @param val 键值
 * @returns
 */
export function SET(key: string, val: any) {
  wsc.set(key, val)
}

/**
 * 清除本地缓存
 * @param key 键名
 * @param val 键值
 * @returns
 */
export function DEL(key: string) {
  wsc.delete(key)
}
