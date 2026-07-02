package com.budgetmalin.app.ui.screens.budget

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.LabeledProgressBar
import com.budgetmalin.app.ui.components.colorFromHex
import com.budgetmalin.app.ui.theme.ExpenseRed
import com.budgetmalin.app.util.CurrencyFormatter

@Composable
fun BudgetScreen(
    repository: BudgetRepository,
    settings: SettingsRepository
) {
    val viewModel: BudgetViewModel = viewModel(factory = GenericViewModelFactory { BudgetViewModel(repository) })
    val state by viewModel.uiState.collectAsState()
    val currency = settings.currencySymbol
    var editingCategory by remember { mutableStateOf<CategoryEntity?>(null) }

    Column(modifier = Modifier.fillMaxSize().padding(top = 20.dp)) {
        Column(modifier = Modifier.padding(horizontal = 20.dp)) {
            Text(stringResource(R.string.budget_title), style = MaterialTheme.typography.headlineMedium)
            Text(
                stringResource(R.string.budget_subtitle),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        LazyColumn(contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            items(state.rows, key = { it.category.id }) { row ->
                val color = colorFromHex(row.category.colorHex)
                Surface(
                    shape = MaterialTheme.shapes.large,
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 1.dp,
                    onClick = { editingCategory = row.category },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("${row.category.icon} ${row.category.name}", style = MaterialTheme.typography.titleMedium)
                            if (row.limit > 0) {
                                Text(
                                    stringResource(
                                        R.string.budget_spent_of,
                                        CurrencyFormatter.format(row.spent, currency),
                                        CurrencyFormatter.format(row.limit, currency)
                                    ),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            } else {
                                Text(
                                    stringResource(R.string.budget_set),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        if (row.limit > 0) {
                            val progress = (row.spent / row.limit).toFloat()
                            val remaining = row.limit - row.spent
                            LabeledProgressBar(
                                label = "",
                                progress = progress,
                                color = if (progress > 1f) ExpenseRed else color,
                                trailingText = if (remaining >= 0)
                                    stringResource(R.string.budget_remaining, CurrencyFormatter.format(remaining, currency))
                                else
                                    stringResource(R.string.budget_exceeded, CurrencyFormatter.format(-remaining, currency))
                            )
                        } else {
                            Text(
                                CurrencyFormatter.format(row.spent, currency),
                                style = MaterialTheme.typography.titleLarge,
                                color = color
                            )
                        }
                    }
                }
            }
        }
    }

    editingCategory?.let { category ->
        val currentLimit = state.rows.find { it.category.id == category.id }?.limit ?: 0.0
        var amountText by remember(category.id) { mutableStateOf(if (currentLimit > 0) currentLimit.toString() else "") }
        AlertDialog(
            onDismissRequest = { editingCategory = null },
            title = { Text(stringResource(R.string.budget_dialog_title, category.name)) },
            text = {
                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it },
                    label = { Text(stringResource(R.string.budget_dialog_amount)) },
                    keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(
                        keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
                    ),
                    singleLine = true
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    amountText.replace(",", ".").toDoubleOrNull()?.let { viewModel.setBudget(category.id, it) }
                    editingCategory = null
                }) { Text(stringResource(R.string.action_save)) }
            },
            dismissButton = {
                TextButton(onClick = { editingCategory = null }) { Text(stringResource(R.string.action_cancel)) }
            }
        )
    }
}
