import { REQUEST } from "../util/http"

export namespace GetList {
  export interface Req {}

  export interface Res extends GRes {
    rows: Array<object>
  }
}

/**
 * 获取账单分类列表
 * @param params
 * @returns
 */
export const getCategories = (params: {
  /** 账单类型(1:收入;0;支出) */
  type?: string
  /** 月份 */
  month?: number
  /** 账单分类ID */
  category?: string
}): Promise<GRes & { rows: Array<Category> }> =>
  REQUEST({ method: "get", url: "/bill/categories", params })

/**
 * 获取账单列表
 * @param params
 * @returns
 */
export const getList = (params: {
  /** 偏移量 */
  offset?: number
  /** 账单类型(1:收入;0;支出) */
  type?: string
  /** 月份 */
  month?: number
  /** 账单分类ID */
  category?: string
}): Promise<GRes & { rows: Array<Bill> }> =>
  REQUEST({ method: "get", url: "/bill/list", params })

/**
 * 新增账单
 * @param data
 * @returns
 */
export const addBill = (data: {
  /** 账单分类 */
  category: string
  /** 账单金额 */
  amount: number
}): Promise<GRes> => REQUEST({ method: "post", url: "/bill/add", data })
