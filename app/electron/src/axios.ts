import axios from "axios"
import { proxy } from "../../config"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import * as request from "./request.simulate"

/**
 * 模拟请求分发
 * @param conf 请求参数
 * @returns
 */
async function dispatch(conf: AxiosRequestConfig) {
  switch (conf.url) {
    case "/bill/categories":
      return await request.getCategories(conf.params)
    case "/bill/list":
      return await request.getList(conf.params)
    case "/bill/add":
      return await request.addBill(conf.data)
    default:
      throw new Error("404")
  }
}
/**
 * 模拟请求
 * @param conf 请求参数
 * @returns
 */
export default async function (conf: AxiosRequestConfig) /*: AxiosResponse */ {
  try {
    return { data: { code: 0, ...(await dispatch(conf)) } }
  } catch (error) {
    return { data: { code: 1, msg: error.message } }
  }
}
