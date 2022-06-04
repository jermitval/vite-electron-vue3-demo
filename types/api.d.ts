/** 账单 */
interface Bill {
  /** 账单类型(1:收入;0;支出) */
  type: number
  /** 账单时间 */
  time: number
  /** 账单分类 */
  category?: string
  /** 账单金额 */
  amount: number
}

/** 账单分类 */
interface Category {
  /** 分类 ID */
  id: string
  /** 分类名称 */
  name: string
  /** 分类类型(1:收入;0;支出) */
  type: number
  /** 合计金额 */
  sum?: number
  /** 最近一次账单金额 */
  lastAmount?: number
}
