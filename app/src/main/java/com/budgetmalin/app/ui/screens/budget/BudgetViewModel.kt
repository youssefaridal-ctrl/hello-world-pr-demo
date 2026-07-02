package com.budgetmalin.app.ui.screens.budget

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.CategoryKind
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.domain.ForecastEngine
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.time.YearMonth

data class CategoryBudgetState(
    val category: CategoryEntity,
    val spent: Double,
    val limit: Double,
    val forecast: Double
)

data class BudgetUiState(
    val rows: List<CategoryBudgetState> = emptyList(),
    val totalSpent: Double = 0.0,
    val totalLimit: Double = 0.0
)

class BudgetViewModel(private val repository: BudgetRepository) : ViewModel() {

    val uiState: StateFlow<BudgetUiState> = combine(
        repository.transactions,
        repository.categories,
        repository.budgets
    ) { transactions, categories, budgets ->
        val limits = budgets.associate { it.categoryId to it.monthlyLimit }
        val expenseCategories = categories.filter { it.kind == CategoryKind.EXPENSE }
        val rows = expenseCategories.map { category ->
            val categoryTransactions = transactions.filter { it.categoryId == category.id }
            val spent = ForecastEngine.monthSummary(categoryTransactions, YearMonth.now()).expense
            val forecast = ForecastEngine.forecastCurrentMonth(categoryTransactions).projectedTotal
            CategoryBudgetState(category, spent, limits[category.id] ?: 0.0, forecast)
        }.sortedByDescending { it.spent }
        BudgetUiState(
            rows = rows,
            totalSpent = rows.sumOf { it.spent },
            totalLimit = rows.sumOf { it.limit }
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), BudgetUiState())

    fun setBudget(categoryId: String, amount: Double) {
        viewModelScope.launch { repository.setBudget(categoryId, amount) }
    }
}
