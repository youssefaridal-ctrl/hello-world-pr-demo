package com.budgetmalin.app.ui.screens.addtransaction

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.CategoryKind
import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.util.DateUtils
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AddTransactionUiState(
    val amount: String = "",
    val label: String = "",
    val type: TransactionType = TransactionType.EXPENSE,
    val categoryId: String? = null,
    val date: Long = DateUtils.nowMillis(),
    val amountError: Boolean = false,
    val labelError: Boolean = false,
    val isEditing: Boolean = false,
    val saved: Boolean = false
)

class AddTransactionViewModel(
    private val repository: BudgetRepository,
    private val transactionId: Long?
) : ViewModel() {

    private val _uiState = MutableStateFlow(AddTransactionUiState(isEditing = transactionId != null))
    val uiState: StateFlow<AddTransactionUiState> = _uiState

    val categories: StateFlow<List<CategoryEntity>> = repository.categories
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        if (transactionId != null) {
            viewModelScope.launch {
                val existing = repository.transactions.first().find { it.id == transactionId }
                if (existing != null) {
                    _uiState.update {
                        it.copy(
                            amount = existing.amount.toString(),
                            label = existing.label,
                            type = existing.type,
                            categoryId = existing.categoryId,
                            date = existing.date
                        )
                    }
                }
            }
        }
    }

    fun categoriesFor(type: TransactionType): List<CategoryEntity> {
        val kind = if (type == TransactionType.INCOME) CategoryKind.INCOME else CategoryKind.EXPENSE
        return categories.value.filter { it.kind == kind }
    }

    fun updateAmount(value: String) = _uiState.update { it.copy(amount = value, amountError = false) }

    fun updateLabel(value: String) = _uiState.update { it.copy(label = value, labelError = false) }

    fun updateType(type: TransactionType) = _uiState.update {
        val validCategory = categoriesFor(type).any { c -> c.id == it.categoryId }
        it.copy(type = type, categoryId = if (validCategory) it.categoryId else categoriesFor(type).firstOrNull()?.id)
    }

    fun updateCategory(categoryId: String) = _uiState.update { it.copy(categoryId = categoryId) }

    fun updateDate(millis: Long) = _uiState.update { it.copy(date = millis) }

    fun save() {
        val current = _uiState.value
        val amountValue = current.amount.replace(",", ".").toDoubleOrNull()
        val amountValid = amountValue != null && amountValue > 0
        val labelValid = current.label.isNotBlank()

        if (!amountValid || !labelValid) {
            _uiState.update { it.copy(amountError = !amountValid, labelError = !labelValid) }
            return
        }

        val categoryId = current.categoryId ?: categoriesFor(current.type).firstOrNull()?.id ?: return

        viewModelScope.launch {
            val entity = TransactionEntity(
                id = transactionId ?: 0L,
                amount = amountValue!!,
                label = current.label.trim(),
                categoryId = categoryId,
                type = current.type,
                date = current.date
            )
            if (transactionId != null) {
                repository.updateTransaction(entity)
            } else {
                repository.saveTransaction(entity)
            }
            _uiState.update { it.copy(saved = true) }
        }
    }
}
