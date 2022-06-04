import dayjs from "dayjs"
/**
 * convert amount
 * @param number
 * @returns
 */
export const cfloat = (number?: number | string) => {
  if (number == void 0) return number
  return Number(number).toLocaleString()
}

/**
 * convert datetime
 * @param datetime
 */
export const cdatetime = (datetime: any) => {
  try {
    // if same year
    return new Date().getFullYear() == new Date(datetime).getFullYear()
      ? dayjs(datetime).format("MM月DD日 HH:mm")
      : dayjs(datetime).format("YYYY年MM月DD日 HH:mm")
  } catch (error) {
    return datetime
  }
}
