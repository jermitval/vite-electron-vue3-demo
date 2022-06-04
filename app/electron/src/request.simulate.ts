import { readFileSync, appendFileSync } from "fs"
import { parseCSV2JSON } from "./utils"
import dayjs from "dayjs"

/** 账单csv文件地址 */
const path_bill = "./resources/bill.csv"
/** 账单分类csv文件地址 */
const path_categories = "./resources/categories.csv"

/** 账单数据源 */
const db_bill: Array<Bill> = parseCSV2JSON(
  readFileSync(path_bill).toString()
).map((r: any) => ({
  type: Number(r.type),
  time: Number(r.time),
  category: String(r.category),
  amount: Number(r.amount)
}))

/** 分类数据源 */
const db_categories: Array<Category> = parseCSV2JSON(
  readFileSync(path_categories).toString()
).map((r: any) => ({
  id: String(r.id),
  name: String(r.name),
  type: Number(r.type)
}))

/**
 * 获取账单分类列表
 * @returns
 */
export const getCategories = async (params: {
  /** 账单类型(1:收入;0;支出) */
  type?: number
  /** 月份 */
  month?: number
}) => {
  const type = params?.type ?? null
  const month = params?.month ?? null

  /** 深拷贝账单分类列表 */
  const data: Array<Category> = JSON.parse(JSON.stringify(db_categories))

  db_bill
    .filter(
      (r: Bill) =>
        (!month || (Number(dayjs(r.time).format("M")) ?? 0) == month) &&
        (type == void 0 || r.type == type)
    )
    .sort((a, b) => (b.time || 0) - (a.time || 0))
    .map((r: Bill) => {
      /** 所属账单分类索引 */
      const idx = data.findIndex((s: Category) => r.category == s.id)
      if (!data[idx]) return
      data[idx].sum = (data[idx].sum || 0) + Number(r.amount) // 合计金额
      if (!data[idx].lastAmount) data[idx].lastAmount = Number(r.amount) //  最近一笔账单金额
    })

  return { rows: data }
}

/**
 * 获取账单列表
 * @param params
 */
export const getList = async (params: {
  /** 偏移量 */
  offset?: number
  /** 账单类型(1:收入;0;支出) */
  type?: number
  /** 月份 */
  month?: number
  /** 账单分类ID */
  category?: string
}) => {
  const offset = params?.offset ?? 0
  const type = params?.type ?? null
  const month = Number(params?.month ?? 0)
  const category = params?.category

  return {
    rows: db_bill
      .filter(
        (r: Bill) =>
          (!month || Number(dayjs(r.time).format("M")) == month) &&
          (type == void 0 || r.type == type) &&
          (!category || r.category == category)
      )
      .sort((a, b) => b.time - a.time)
      // todo pagination
      .splice(offset, 1000)
  }
}

/**
 * 新增账单
 * @param params
 */
export const addBill = async (params: {
  /** 账单分类 */
  category: string
  /** 账单金额 */
  amount: number
}) => {
  const category = db_categories.find(r => r.id == params.category)
  if (!category) throw new Error("分类有误")
  if (!Number(params.amount)) throw new Error("金额格式有误")

  const dbRow = {
    type: category.type,
    time: Date.now(),
    category: params.category,
    amount: Number(params.amount)
  }
  const csvRow = `\n${Object.values(dbRow).join(",")}`

  db_bill.push(dbRow)
  appendFileSync(path_bill, csvRow)
}
