package com.budgetmalin.app.ui.screens.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.domain.ForecastEngine
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

data class DashboardUiState(
    val isLoading: Boolean = true,
    val income: Double = 0.0,
    val expense: Double = 0.0,
    val balance: Double = 0.0,
    val forecastTotal: Double = 0.0,
    val budgetTotal: Double = 0.0,
    val recentTransactions: List<TransactionEntity> = emptyList(),
    val categories: Map<String, CategoryEntity> = emptyMap()
)

class DashboardViewModel(private val repository: BudgetRepository) : ViewModel() {

    val uiState: StateFlow<DashboardUiState> = combine(
        repository.transactions,
        repository.categories,
        repository.budgets
    ) { transactions, categories, budgets ->
        val summary = ForecastEngine.monthSummary(transactions, java.time.YearMonth.now())
        val forecast = ForecastEngine.forecastCurrentMonth(transactions)
        DashboardUiState(
            isLoading = false,
            income = summary.income,
            expense = summary.expense,
            balance = summary.net,
            forecastTotal = forecast.projectedTotal,
            budgetTotal = budgets.sumOf { it.monthlyLimit },
            recentTransactions = transactions.take(5),
            categories = categories.associateBy { it.id }
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DashboardUiState())
}
