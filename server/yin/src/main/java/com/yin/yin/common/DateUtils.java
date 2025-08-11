package com.yin.yin.common;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * 日期工具类
 */
public class DateUtils {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 获取上一个时间段的开始日期
     * 例如：当前时间段是2023-01-01到2023-01-31，timeUnit为day，
     * 则上一个时间段是2022-12-02到2022-12-31
     *
     * @param startDate 当前时间段的开始日期，格式：yyyy-MM-dd
     * @param endDate 当前时间段的结束日期，格式：yyyy-MM-dd
     * @param timeUnit 时间单位：day, week, month
     * @return 上一个时间段的开始日期
     */
    public static String getPreviousPeriod(String startDate, String endDate, String timeUnit) {
        if (startDate == null || endDate == null || timeUnit == null) {
            return null;
        }

        try {
            LocalDate start = LocalDate.parse(startDate, DATE_FORMATTER);
            LocalDate end = LocalDate.parse(endDate, DATE_FORMATTER);

            // 计算当前时间段的天数
            long days = ChronoUnit.DAYS.between(start, end) + 1;

            // 根据时间单位计算上一个时间段的开始日期
            LocalDate previousStart;

            switch (timeUnit) {
                case "day":
                    previousStart = start.minusDays(days);
                    break;
                case "week":
                    previousStart = start.minusWeeks(days / 7);
                    break;
                case "month":
                    previousStart = start.minusMonths(days / 30);
                    break;
                default:
                    previousStart = start.minusDays(days);
            }

            return previousStart.format(DATE_FORMATTER);
        } catch (Exception e) {
            return null;
        }
    }
}
