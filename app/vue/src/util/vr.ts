import router from "../main/router"
import { RouteLocationRaw } from "vue-router"

/**
 * 前进
 * @param to 参数
 */
export async function push(to: RouteLocationRaw) {
  try {
    await router.push(to)
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * 重定向
 * @param to 参数
 */
export async function replace(to: RouteLocationRaw) {
  try {
    await router.replace(to)
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * 跳转
 * @param delta 参数
 */
export async function go(delta: number) {
  try {
    await router.go(delta)
  } catch (error) {
    console.error(error)
    throw error
  }
}
