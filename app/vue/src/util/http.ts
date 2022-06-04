import axios from "axios"
import { AxiosRequestConfig } from "axios"

/**
 * 通用网络请求
 * @param conf 请求参数
 * @ conf.method 默认 POST 方式
 * @ conf.url 请求地址
 * @returns
 */
export async function REQUEST(conf: AxiosRequestConfig) {
  try {
    conf = {
      method: "post",
      ...conf
    }

    const { data } = await window.ipc.axios(conf)

    if (data.code) throw new Error(data.msg)

    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
