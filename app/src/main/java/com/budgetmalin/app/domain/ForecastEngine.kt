package com.budgetmalin.app.domain

import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.util.DateUtils
import java.time.YearMonth
import kotlin.math.max

data class MonthSummary(
    val month: YearMonth,
    val income: Double,
    val expense: Double
) {
    val net: Double get() = income - expense
}

data class ExpenseForecast(
    val spentSoFar: Double,
    val projectedTotal: Double,
    val dailyAverage: Double
)

data class GoalProjection(
    val monthsRemaining: Int?,
    val projectedMonth: YearMonth?,
    val averageMonthlySaving: Double
)

/**
 * Derives spending forecasts and goal projections from raw transaction history.
 * Uses a simple run-rate model (extrapolating the current pace to the full period)
 * rather than a heavier statistical model, since a few months of personal data
 * rarely justifies more than that.
 */
object ForecastEngine {

    fun monthSummary(transactions: List<TransactionEntity>, month: YearMonth): MonthSummary {
        val (start, end) = DateUtils.monthRange(month)
        val inRange = transactions.filter { it.date in start..end }
        val income = inRange.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
        val expense = inRange.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
        return MonthSummary(month, income, expense)
    }

    fun forecastCurrentMonth(transactions: List<TransactionEntity>): ExpenseForecast {
        val month = YearMonth.now()
        val summary = monthSummary(transactions, month)
        val daysElapsed = max(1, DateUtils.daysElapsedInMonth(month))
        val daysInMonth = DateUtils.daysInMonth(month)
        val dailyAverage = summary.expense / daysElapsed
        val projectedTotal = dailyAverage * daysInMonth
        return ExpenseForecast(summary.expense, projectedTotal, dailyAverage)
    }

    fun forecastCategoryForCurrentMonth(
        transactions: List<TransactionEntity>,
        categoryId: String
    ): ExpenseForecast {
        val filtered = transactions.filter { it.categoryId == categoryId }
        return forecastCurrentMonth(filtered)
    }

    fun lastMonthsSummaries(transactions: List<TransactionEntity>, count: Int): List<MonthSummary> =
        DateUtils.lastNMonths(count).map { monthSummary(transactions, it) }

    /** Average net saving (income - expense) per month over the last [months] full months, excluding the current one. */
    fun averageMonthlyNetSaving(transactions: List<TransactionEntity>, months: Int = 3): Double {
        val history = DateUtils.lastNMonths(months + 1, YearMonth.now().minusMonths(1))
        if (history.isEmpty()) return 0.0
        val nets = history.map { monthSummary(transactions, it).net }
        return nets.average()
    }

    fun projectGoalCompletion(
        remainingAmount: Double,
        transactions: List<TransactionEntity>
    ): GoalProjection {
        val avg = averageMonthlyNetSaving(transactions)
        if (remainingAmount <= 0.0) {
            return GoalProjection(0, YearMonth.now(), avg)
        }
        if (avg <= 0.0) {
            return GoalProjection(null, null, avg)
        }
        val monthsNeeded = kotlin.math.ceil(remainingAmount / avg).toInt()
        return GoalProjection(monthsNeeded, YearMonth.now().plusMonths(monthsNeeded.toLong()), avg)
    }

    /**
     * Splits the remaining amount into equal monthly instalments between now and [deadlineMillis],
     * so a goal with a deadline can be read as "save X per month" rather than just a percentage.
     */
    fun requiredMonthlySaving(remainingAmount: Double, deadlineMillis: Long): Double {
        if (remainingAmount <= 0.0) return 0.0
        val deadlineMonth = YearMonth.from(DateUtils.millisToLocalDate(deadlineMillis))
        val monthsLeft = max(1, java.time.temporal.ChronoUnit.MONTHS.between(YearMonth.now(), deadlineMonth).toInt() + 1)
        return remainingAmount / monthsLeft
    }
}
