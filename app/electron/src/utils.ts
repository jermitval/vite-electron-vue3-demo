/**
 * 解析 CSV 数据源
 * @param data
 * @returns
 */
export const parseCSV2JSON = (data: string) => {
  let fields: any = []
  const rows = data.split("\n").map((r: any, idx: number) => {
    const cols = r.split(",")
    const obj: any = {}
    if (idx == 0) fields = cols
    if (idx > 0) for (var i in cols) obj[fields[i]] = cols[i]
    return obj
  })
  return rows.splice(1, rows.length)
}
