package com.budgetmalin.app.domain

import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.time.YearMonth

class ForecastEngineTest {

    @Test
    fun `requiredMonthlySaving returns zero when the goal is already reached`() {
        val deadline = DateUtils.localDateToMillis(YearMonth.now().plusMonths(2).atDay(1))
        assertEquals(0.0, ForecastEngine.requiredMonthlySaving(0.0, deadline), 0.0001)
        assertEquals(0.0, ForecastEngine.requiredMonthlySaving(-50.0, deadline), 0.0001)
    }

    @Test
    fun `requiredMonthlySaving is due in full when the deadline is this month`() {
        val deadline = DateUtils.localDateToMillis(YearMonth.now().atEndOfMonth())
        assertEquals(1000.0, ForecastEngine.requiredMonthlySaving(1000.0, deadline), 0.0001)
    }

    @Test
    fun `requiredMonthlySaving splits evenly across the current plus future months`() {
        // current month + 3 following months = 4 instalments
        val deadline = DateUtils.localDateToMillis(YearMonth.now().plusMonths(3).atDay(15))
        assertEquals(250.0, ForecastEngine.requiredMonthlySaving(1000.0, deadline), 0.0001)
    }

    @Test
    fun `requiredMonthlySaving treats a past deadline as due this month rather than a negative divisor`() {
        val pastDeadline = DateUtils.localDateToMillis(YearMonth.now().minusMonths(2).atDay(1))
        assertEquals(1000.0, ForecastEngine.requiredMonthlySaving(1000.0, pastDeadline), 0.0001)
    }

    @Test
    fun `projectGoalCompletion reports zero months remaining once the goal is funded`() {
        val projection = ForecastEngine.projectGoalCompletion(0.0, emptyList())
        assertEquals(0, projection.monthsRemaining)
        assertEquals(YearMonth.now(), projection.projectedMonth)
    }

    @Test
    fun `projectGoalCompletion has no projected month without any saving history`() {
        val projection = ForecastEngine.projectGoalCompletion(1000.0, emptyList())
        assertNull(projection.projectedMonth)
        assertNull(projection.monthsRemaining)
    }

    @Test
    fun `monthSummary sums income and expense within the month and ignores other months`() {
        val thisMonth = YearMonth.now()
        val inMonth = thisMonth.atDay(5)
        val otherMonth = thisMonth.minusMonths(1).atDay(5)
        val transactions = listOf(
            TransactionEntity(
                amount = 500.0, label = "Salaire", categoryId = "salary",
                type = TransactionType.INCOME, date = DateUtils.localDateToMillis(inMonth)
            ),
            TransactionEntity(
                amount = 120.0, label = "Courses", categoryId = "food",
                type = TransactionType.EXPENSE, date = DateUtils.localDateToMillis(inMonth)
            ),
            TransactionEntity(
                amount = 999.0, label = "Hors mois", categoryId = "food",
                type = TransactionType.EXPENSE, date = DateUtils.localDateToMillis(otherMonth)
            )
        )
        val summary = ForecastEngine.monthSummary(transactions, thisMonth)
        assertEquals(500.0, summary.income, 0.0001)
        assertEquals(120.0, summary.expense, 0.0001)
        assertEquals(380.0, summary.net, 0.0001)
    }
}
