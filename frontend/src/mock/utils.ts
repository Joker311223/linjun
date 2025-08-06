import Mock from 'mockjs';

// 2025年7月20日的时间戳
const BASE_DATE = new Date(2025, 6, 20).getTime(); // 月份是从0开始的，所以6代表7月

/**
 * 生成2025年7月20日之后的随机日期时间
 * @param format 日期时间格式
 * @param daysAfter 最少在基准日期后多少天
 * @param daysRange 随机天数范围
 * @returns 格式化的日期时间字符串
 */
export function generateFutureDateTime(format = 'yyyy-MM-dd HH:mm:ss', daysAfter = 0, daysRange = 365) {
  const futureDate = new Date(BASE_DATE + (daysAfter + Mock.Random.integer(0, daysRange)) * 24 * 60 * 60 * 1000);
  // @ts-ignore - Mock.Random.datetime实际上支持第二个参数，但类型定义可能不完整
  return Mock.Random.datetime(format, futureDate.getTime().toString());
}

/**
 * 生成2025年7月20日之后的随机日期对象
 * @param daysAfter 最少在基准日期后多少天
 * @param daysRange 随机天数范围
 * @returns Date对象
 */
export function generateFutureDate(daysAfter = 0, daysRange = 365) {
  return new Date(BASE_DATE + (daysAfter + Mock.Random.integer(0, daysRange)) * 24 * 60 * 60 * 1000);
}

/**
 * 根据基准日期生成之后的随机日期
 * @param baseDate 基准日期
 * @param minDaysAfter 最少在基准日期后多少天
 * @param maxDaysAfter 最多在基准日期后多少天
 * @returns Date对象
 */
export function generateDateAfter(baseDate: Date, minDaysAfter = 1, maxDaysAfter = 30) {
  const baseDateTimestamp = Math.max(baseDate.getTime(), BASE_DATE); // 确保不早于2025年7月20日
  return new Date(baseDateTimestamp + Mock.Random.integer(minDaysAfter, maxDaysAfter) * 24 * 60 * 60 * 1000);
}

/**
 * 将日期格式化为字符串
 * @param date 日期对象
 * @param format 格式
 * @returns 格式化的日期时间字符串
 */
export function formatDate(date: Date, format = 'yyyy-MM-dd HH:mm:ss') {
  // @ts-ignore - Mock.Random.datetime实际上支持第二个参数，但类型定义可能不完整
  return Mock.Random.datetime(format, date.getTime().toString());
}
