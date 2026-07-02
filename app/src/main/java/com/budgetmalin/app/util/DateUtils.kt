package com.budgetmalin.app.util

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.YearMonth
import java.time.ZoneId
import java.time.format.TextStyle
import java.util.Locale

object DateUtils {

    private val zone: ZoneId = ZoneId.systemDefault()

    fun nowMillis(): Long = System.currentTimeMillis()

    fun currentMonthRange(): Pair<Long, Long> = monthRange(YearMonth.now())

    fun monthRange(month: YearMonth): Pair<Long, Long> {
        val start = month.atDay(1).atStartOfDay(zone).toInstant().toEpochMilli()
        val end = month.atEndOfMonth().atTime(23, 59, 59).atZone(zone).toInstant().toEpochMilli()
        return start to end
    }

    fun millisToLocalDate(millis: Long): LocalDate =
        LocalDateTime.ofInstant(java.time.Instant.ofEpochMilli(millis), zone).toLocalDate()

    fun localDateToMillis(date: LocalDate): Long =
        date.atStartOfDay(zone).toInstant().toEpochMilli()

    fun daysElapsedInMonth(month: YearMonth = YearMonth.now()): Int {
        val today = LocalDate.now()
        return if (YearMonth.from(today) == month) today.dayOfMonth else month.lengthOfMonth()
    }

    fun daysInMonth(month: YearMonth = YearMonth.now()): Int = month.lengthOfMonth()

    fun monthLabel(month: YearMonth = YearMonth.now()): String {
        val name = month.month.getDisplayName(TextStyle.FULL, Locale.FRENCH)
        return "${name.replaceFirstChar { it.uppercase() }} ${month.year}"
    }

    fun formatShortDate(millis: Long): String {
        val date = millisToLocalDate(millis)
        val month = date.month.getDisplayName(TextStyle.SHORT, Locale.FRENCH)
        return "${date.dayOfMonth} $month ${date.year}"
    }

    fun lastNMonths(n: Int, from: YearMonth = YearMonth.now()): List<YearMonth> =
        (0 until n).map { from.minusMonths(it.toLong()) }.reversed()
}
