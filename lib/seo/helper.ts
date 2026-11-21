/**
 * @description 获取今天（UTC）的 W3C 日期。没有真实修改时间的条目用它当 lastmod。
 */
export function getTodayUTCW3cDate(): string {
  return new Date().toISOString().slice(0, 10);
}
