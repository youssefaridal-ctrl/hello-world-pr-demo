package com.budgetmalin.app.ui.screens.transactions

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.TransactionRow
import com.budgetmalin.app.ui.theme.ExpenseRed

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionsScreen(
    repository: BudgetRepository,
    settings: SettingsRepository,
    onEditTransaction: (Long) -> Unit
) {
    val viewModel: TransactionsViewModel = viewModel(
        factory = GenericViewModelFactory { TransactionsViewModel(repository) }
    )
    val state by viewModel.uiState.collectAsState()
    val currency = settings.currencySymbol

    Column(modifier = Modifier.fillMaxSize().padding(top = 20.dp)) {
        Text(
            stringResource(R.string.transactions_title),
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(horizontal = 20.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            FilterChip(
                selected = state.filter == TransactionFilter.ALL,
                onClick = { viewModel.setFilter(TransactionFilter.ALL) },
                label = { Text(stringResource(R.string.transactions_filter_all)) }
            )
            FilterChip(
                selected = state.filter == TransactionFilter.INCOME,
                onClick = { viewModel.setFilter(TransactionFilter.INCOME) },
                label = { Text(stringResource(R.string.transactions_filter_income)) }
            )
            FilterChip(
                selected = state.filter == TransactionFilter.EXPENSE,
                onClick = { viewModel.setFilter(TransactionFilter.EXPENSE) },
                label = { Text(stringResource(R.string.transactions_filter_expense)) }
            )
        }

        if (state.transactions.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    stringResource(R.string.transactions_empty),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp)
            ) {
                items(state.transactions, key = { it.id }) { transaction ->
                    key(transaction.id) {
                        val dismissState = rememberSwipeToDismissBoxState(
                            confirmValueChange = { value ->
                                if (value == SwipeToDismissBoxValue.EndToStart) {
                                    viewModel.deleteTransaction(transaction)
                                    true
                                } else {
                                    false
                                }
                            }
                        )
                        SwipeToDismissBox(
                            state = dismissState,
                            enableDismissFromStartToEnd = false,
                            backgroundContent = {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(ExpenseRed, shape = MaterialTheme.shapes.medium)
                                        .padding(horizontal = 20.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Icon(Icons.Filled.Delete, contentDescription = stringResource(R.string.transactions_delete), tint = Color.White)
                                }
                            }
                        ) {
                            androidx.compose.material3.Surface(color = MaterialTheme.colorScheme.background) {
                                TransactionRow(
                                    transaction = transaction,
                                    category = state.categories[transaction.categoryId],
                                    currencySymbol = currency,
                                    onClick = { onEditTransaction(transaction.id) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
