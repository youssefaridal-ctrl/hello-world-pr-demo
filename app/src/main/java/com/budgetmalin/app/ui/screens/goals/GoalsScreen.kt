package com.budgetmalin.app.ui.screens.goals

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.local.entity.GoalEntity
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.LabeledProgressBar
import com.budgetmalin.app.ui.theme.Mint
import com.budgetmalin.app.util.CurrencyFormatter
import java.time.format.TextStyle
import java.util.Locale

@Composable
fun GoalsScreen(
    repository: BudgetRepository,
    settings: SettingsRepository
) {
    val viewModel: GoalsViewModel = viewModel(factory = GenericViewModelFactory { GoalsViewModel(repository) })
    val rows by viewModel.goalRows.collectAsState()
    val currency = settings.currencySymbol

    var showAddGoal by remember { mutableStateOf(false) }
    var fundingGoal by remember { mutableStateOf<GoalEntity?>(null) }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize().padding(top = 20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(stringResource(R.string.goals_title), style = MaterialTheme.typography.headlineMedium)
                    Text(
                        stringResource(R.string.goals_subtitle),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (rows.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(stringResource(R.string.goals_empty), color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                LazyColumn(contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    items(rows, key = { it.goal.id }) { row ->
                        Surface(
                            shape = MaterialTheme.shapes.large,
                            color = MaterialTheme.colorScheme.surface,
                            tonalElevation = 1.dp,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(row.goal.name, style = MaterialTheme.typography.titleMedium)
                                    IconButton(onClick = { viewModel.deleteGoal(row.goal) }) {
                                        Icon(Icons.Filled.Delete, contentDescription = stringResource(R.string.action_delete))
                                    }
                                }
                                Text(
                                    stringResource(R.string.goals_saved, CurrencyFormatter.format(row.goal.savedAmount, currency)) +
                                        " · " + stringResource(R.string.goals_target, CurrencyFormatter.format(row.goal.targetAmount, currency)),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                LabeledProgressBar(
                                    label = stringResource(R.string.goals_progress, (row.progress * 100).toInt()),
                                    progress = row.progress,
                                    color = Mint,
                                    trailingText = ""
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                val etaText = row.projection.projectedMonth?.let { month ->
                                    val monthName = month.month.getDisplayName(TextStyle.FULL, Locale.FRENCH)
                                    stringResource(R.string.goals_eta_on_track, "${monthName.replaceFirstChar { it.uppercase() }} ${month.year}")
                                } ?: stringResource(R.string.goals_eta_unknown)
                                Text(etaText, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Spacer(modifier = Modifier.height(10.dp))
                                TextButton(onClick = { fundingGoal = row.goal }) {
                                    Text(stringResource(R.string.goals_add_funds))
                                }
                            }
                        }
                    }
                }
            }
        }

        Button(
            onClick = { showAddGoal = true },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
        ) {
            Icon(Icons.Filled.Add, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(stringResource(R.string.goals_add))
        }
    }

    if (showAddGoal) {
        var name by remember { mutableStateOf("") }
        var target by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { showAddGoal = false },
            title = { Text(stringResource(R.string.goals_dialog_title)) },
            text = {
                Column {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(stringResource(R.string.goals_dialog_name)) },
                        placeholder = { Text(stringResource(R.string.goals_dialog_name_hint)) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = target,
                        onValueChange = { target = it },
                        label = { Text(stringResource(R.string.goals_dialog_target)) },
                        singleLine = true,
                        keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(
                            keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    val targetValue = target.replace(",", ".").toDoubleOrNull()
                    if (name.isNotBlank() && targetValue != null && targetValue > 0) {
                        viewModel.addGoal(name.trim(), targetValue, null)
                        showAddGoal = false
                    }
                }) { Text(stringResource(R.string.action_save)) }
            },
            dismissButton = {
                TextButton(onClick = { showAddGoal = false }) { Text(stringResource(R.string.action_cancel)) }
            }
        )
    }

    fundingGoal?.let { goal ->
        var amount by remember(goal.id) { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { fundingGoal = null },
            title = { Text(stringResource(R.string.goals_add_funds)) },
            text = {
                OutlinedTextField(
                    value = amount,
                    onValueChange = { amount = it },
                    label = { Text(stringResource(R.string.add_transaction_amount)) },
                    singleLine = true,
                    keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(
                        keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
                    )
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    amount.replace(",", ".").toDoubleOrNull()?.let { viewModel.addFunds(goal, it) }
                    fundingGoal = null
                }) { Text(stringResource(R.string.action_save)) }
            },
            dismissButton = {
                TextButton(onClick = { fundingGoal = null }) { Text(stringResource(R.string.action_cancel)) }
            }
        )
    }
}
