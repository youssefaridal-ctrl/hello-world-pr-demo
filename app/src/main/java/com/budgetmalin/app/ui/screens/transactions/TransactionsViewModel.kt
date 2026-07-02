package com.budgetmalin.app.ui.screens.transactions

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.data.repository.BudgetRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class TransactionFilter { ALL, INCOME, EXPENSE }

data class TransactionsUiState(
    val transactions: List<TransactionEntity> = emptyList(),
    val categories: Map<String, CategoryEntity> = emptyMap(),
    val filter: TransactionFilter = TransactionFilter.ALL
)

class TransactionsViewModel(private val repository: BudgetRepository) : ViewModel() {

    private val filterState = MutableStateFlow(TransactionFilter.ALL)

    val uiState: StateFlow<TransactionsUiState> = combine(
        repository.transactions,
        repository.categories,
        filterState
    ) { transactions, categories, filter ->
        val filtered = when (filter) {
            TransactionFilter.ALL -> transactions
            TransactionFilter.INCOME -> transactions.filter { it.type == TransactionType.INCOME }
            TransactionFilter.EXPENSE -> transactions.filter { it.type == TransactionType.EXPENSE }
        }
        TransactionsUiState(filtered, categories.associateBy { it.id }, filter)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), TransactionsUiState())

    fun setFilter(filter: TransactionFilter) {
        filterState.value = filter
    }

    fun deleteTransaction(transaction: TransactionEntity) {
        viewModelScope.launch { repository.deleteTransaction(transaction) }
    }
}
