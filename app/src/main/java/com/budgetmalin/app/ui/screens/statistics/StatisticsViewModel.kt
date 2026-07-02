package com.budgetmalin.app.ui.screens.statistics

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.domain.ForecastEngine
import com.budgetmalin.app.ui.components.DonutSlice
import com.budgetmalin.app.ui.components.TrendPoint
import com.budgetmalin.app.ui.components.colorFromHex
import com.budgetmalin.app.util.DateUtils
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale

data class StatisticsUiState(
    val categorySlices: List<DonutSlice> = emptyList(),
    val trendPoints: List<TrendPoint> = emptyList(),
    val totalExpense: Double = 0.0,
    val topCategory: CategoryEntity? = null
)

class StatisticsViewModel(private val repository: BudgetRepository) : ViewModel() {

    val uiState: StateFlow<StatisticsUiState> = combine(
        repository.transactions,
        repository.categories
    ) { transactions, categories ->
        val month = YearMonth.now()
        val monthSummary = ForecastEngine.monthSummary(transactions, month)

        val byCategory = transactions
            .filter { it.type == TransactionType.EXPENSE }
            .filter { DateUtils.millisToLocalDate(it.date).let { d -> YearMonth.from(d) == month } }
            .groupBy { it.categoryId }
            .mapValues { (_, list) -> list.sumOf { it.amount } }

        val slices = byCategory.entries
            .sortedByDescending { it.value }
            .mapNotNull { (categoryId, amount) ->
                categories.find { it.id == categoryId }?.let { category ->
                    DonutSlice(category.name, amount, colorFromHex(category.colorHex))
                }
            }

        val topCategoryId = byCategory.entries.maxByOrNull { it.value }?.key
        val topCategory = categories.find { it.id == topCategoryId }

        val trend = ForecastEngine.lastMonthsSummaries(transactions, 6).map { summary ->
            val label = summary.month.month.getDisplayName(TextStyle.SHORT, Locale.FRENCH)
            TrendPoint(label.replaceFirstChar { it.uppercase() }, summary.expense)
        }

        StatisticsUiState(
            categorySlices = slices,
            trendPoints = trend,
            totalExpense = monthSummary.expense,
            topCategory = topCategory
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), StatisticsUiState())
}
