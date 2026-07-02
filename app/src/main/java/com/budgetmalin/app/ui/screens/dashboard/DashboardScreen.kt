package com.budgetmalin.app.ui.screens.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.MiniStatCard
import com.budgetmalin.app.ui.components.TransactionRow
import com.budgetmalin.app.ui.theme.Indigo
import com.budgetmalin.app.ui.theme.IndigoDark
import com.budgetmalin.app.util.CurrencyFormatter

@Composable
fun DashboardScreen(
    repository: BudgetRepository,
    settings: SettingsRepository,
    onSeeAllTransactions: () -> Unit,
    onOpenSettings: () -> Unit
) {
    val viewModel: DashboardViewModel = viewModel(
        factory = GenericViewModelFactory { DashboardViewModel(repository) }
    )
    val state by viewModel.uiState.collectAsState()
    val currency = settings.currencySymbol

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(stringResource(R.string.dashboard_title), style = MaterialTheme.typography.headlineMedium)
                    Text(
                        stringResource(R.string.dashboard_subtitle),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                IconButton(onClick = onOpenSettings) {
                    Icon(Icons.Filled.Settings, contentDescription = stringResource(R.string.nav_settings))
                }
            }
        }

        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.linearGradient(listOf(Indigo, IndigoDark)),
                        shape = RoundedCornerShape(28.dp)
                    )
                    .padding(24.dp)
            ) {
                Text(
                    stringResource(R.string.dashboard_balance),
                    style = MaterialTheme.typography.bodyMedium,
                    color = androidx.compose.ui.graphics.Color.White.copy(alpha = 0.85f)
                )
                Text(
                    CurrencyFormatter.format(state.balance, currency),
                    style = MaterialTheme.typography.displaySmall,
                    color = androidx.compose.ui.graphics.Color.White
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                MiniStatCard(
                    label = stringResource(R.string.dashboard_income),
                    value = CurrencyFormatter.format(state.income, currency),
                    isPositive = true,
                    modifier = Modifier.weight(1f)
                )
                MiniStatCard(
                    label = stringResource(R.string.dashboard_expenses),
                    value = CurrencyFormatter.format(state.expense, currency),
                    isPositive = false,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            androidx.compose.material3.Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(stringResource(R.string.dashboard_forecast_title), style = MaterialTheme.typography.titleMedium)
                    Text(
                        stringResource(R.string.dashboard_forecast_desc),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        CurrencyFormatter.format(state.forecastTotal, currency),
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                    if (state.budgetTotal > 0) {
                        val diff = state.forecastTotal - state.budgetTotal
                        val text = if (diff > 0) {
                            stringResource(R.string.dashboard_over_budget, CurrencyFormatter.format(diff, currency))
                        } else {
                            stringResource(R.string.dashboard_under_budget, CurrencyFormatter.format(-diff, currency))
                        }
                        Text(
                            text,
                            style = MaterialTheme.typography.bodySmall,
                            color = if (diff > 0) MaterialTheme.colorScheme.error else com.budgetmalin.app.ui.theme.IncomeGreen
                        )
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(stringResource(R.string.dashboard_recent), style = MaterialTheme.typography.titleMedium)
                Text(
                    stringResource(R.string.dashboard_see_all),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .clickable(onClick = onSeeAllTransactions)
                        .padding(4.dp)
                )
            }
        }

        if (state.recentTransactions.isEmpty()) {
            item {
                Text(
                    stringResource(R.string.dashboard_empty),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            items(state.recentTransactions) { transaction ->
                TransactionRow(
                    transaction = transaction,
                    category = state.categories[transaction.categoryId],
                    currencySymbol = currency,
                    onClick = onSeeAllTransactions
                )
            }
        }
    }
}
