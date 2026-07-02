package com.budgetmalin.app.ui.screens.addtransaction

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.colorFromHex
import com.budgetmalin.app.ui.components.iconForKey
import com.budgetmalin.app.util.DateUtils

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddTransactionScreen(
    repository: BudgetRepository,
    settings: SettingsRepository,
    transactionId: Long?,
    onDone: () -> Unit
) {
    val viewModel: AddTransactionViewModel = viewModel(
        factory = GenericViewModelFactory { AddTransactionViewModel(repository, transactionId) }
    )
    val state by viewModel.uiState.collectAsState()
    var showDatePicker by remember { mutableStateOf(false) }

    LaunchedEffect(state.saved) {
        if (state.saved) onDone()
    }

    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onDone) {
                Icon(Icons.Filled.ArrowBack, contentDescription = stringResource(R.string.cd_back))
            }
            Text(
                stringResource(if (state.isEditing) R.string.add_transaction_edit_title else R.string.add_transaction_title),
                style = MaterialTheme.typography.headlineSmall
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
            SegmentedButton(
                selected = state.type == TransactionType.EXPENSE,
                onClick = { viewModel.updateType(TransactionType.EXPENSE) },
                shape = SegmentedButtonDefaults.itemShape(0, 2)
            ) { Text(stringResource(R.string.add_transaction_type_expense)) }
            SegmentedButton(
                selected = state.type == TransactionType.INCOME,
                onClick = { viewModel.updateType(TransactionType.INCOME) },
                shape = SegmentedButtonDefaults.itemShape(1, 2)
            ) { Text(stringResource(R.string.add_transaction_type_income)) }
        }

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
            value = state.amount,
            onValueChange = viewModel::updateAmount,
            label = { Text(stringResource(R.string.add_transaction_amount)) },
            suffix = { Text(settings.currencySymbol) },
            isError = state.amountError,
            supportingText = {
                if (state.amountError) Text(stringResource(R.string.add_transaction_error_amount))
            },
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(
                keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
            ),
            textStyle = MaterialTheme.typography.headlineSmall.copy(textAlign = TextAlign.Start),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = state.label,
            onValueChange = viewModel::updateLabel,
            label = { Text(stringResource(R.string.add_transaction_label)) },
            placeholder = { Text(stringResource(R.string.add_transaction_label_hint)) },
            isError = state.labelError,
            supportingText = {
                if (state.labelError) Text(stringResource(R.string.add_transaction_error_label))
            },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        Surface(
            onClick = { showDatePicker = true },
            shape = MaterialTheme.shapes.small,
            color = MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Icon(Icons.Filled.CalendarToday, contentDescription = null)
                Text("${stringResource(R.string.add_transaction_date)} : ${DateUtils.formatShortDate(state.date)}")
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(stringResource(R.string.add_transaction_category), style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))

        val availableCategories = viewModel.categoriesFor(state.type)
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.fillMaxWidth().height(180.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(availableCategories) { category ->
                val selected = category.id == state.categoryId
                val color = colorFromHex(category.colorHex)
                Card(
                    onClick = { viewModel.updateCategory(category.id) },
                    colors = CardDefaults.cardColors(
                        containerColor = if (selected) color.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp).fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(iconForKey(category.icon), contentDescription = category.name, tint = color)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            category.name,
                            style = MaterialTheme.typography.labelSmall,
                            textAlign = TextAlign.Center,
                            maxLines = 1
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { viewModel.save() },
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Filled.Check, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(stringResource(R.string.add_transaction_save))
        }
    }

    if (showDatePicker) {
        val datePickerState = rememberDatePickerState(initialSelectedDateMillis = state.date)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    datePickerState.selectedDateMillis?.let { viewModel.updateDate(it) }
                    showDatePicker = false
                }) { Text(stringResource(R.string.action_save)) }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) { Text(stringResource(R.string.action_cancel)) }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }
}
