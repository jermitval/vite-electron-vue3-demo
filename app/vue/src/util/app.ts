/**
 * 深拷贝
 * @param obj 对象
 * @returns
 */
export function DEEPCOPY(obj: any) {
  return obj instanceof Object ? JSON.parse(JSON.stringify(obj)) : obj
}

/**
 * 等待
 * @param ms 等待毫秒数
 * @returns
 */
export function SLEEP(ms: number) {
  return new Promise(res => setTimeout(v => res(v), ms))
}
