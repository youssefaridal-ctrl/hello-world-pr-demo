package com.budgetmalin.app.ui.screens.statistics

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.budgetmalin.app.R
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.GenericViewModelFactory
import com.budgetmalin.app.ui.components.DonutChart
import com.budgetmalin.app.ui.components.TrendChart
import com.budgetmalin.app.ui.components.colorFromHex
import com.budgetmalin.app.ui.theme.Indigo
import com.budgetmalin.app.util.CurrencyFormatter

@Composable
fun StatisticsScreen(
    repository: BudgetRepository,
    settings: SettingsRepository
) {
    val viewModel: StatisticsViewModel = viewModel(factory = GenericViewModelFactory { StatisticsViewModel(repository) })
    val state by viewModel.uiState.collectAsState()
    val currency = settings.currencySymbol

    if (state.categorySlices.isEmpty() && state.trendPoints.all { it.value == 0.0 }) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(stringResource(R.string.stats_empty), color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        return
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        item {
            Text(stringResource(R.string.stats_title), style = MaterialTheme.typography.headlineMedium)
        }

        if (state.categorySlices.isNotEmpty()) {
            item {
                Surface(
                    shape = MaterialTheme.shapes.large,
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 1.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(stringResource(R.string.stats_by_category), style = MaterialTheme.typography.titleMedium)
                        Spacer(modifier = Modifier.height(8.dp))
                        DonutChart(
                            slices = state.categorySlices,
                            centerValue = CurrencyFormatter.format(state.totalExpense, currency),
                            centerLabel = stringResource(R.string.dashboard_expenses)
                        )
                    }
                }
            }
        }

        state.topCategory?.let { category ->
            item {
                Surface(
                    shape = MaterialTheme.shapes.large,
                    color = colorFromHex(category.colorHex).copy(alpha = 0.12f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    androidx.compose.foundation.layout.Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(category.icon, fontSize = 20.sp)
                        Column {
                            Text(stringResource(R.string.stats_top_category), style = MaterialTheme.typography.bodySmall)
                            Text(category.name, style = MaterialTheme.typography.titleMedium)
                        }
                    }
                }
            }
        }

        item {
            Surface(
                shape = MaterialTheme.shapes.large,
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(stringResource(R.string.stats_trend), style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(12.dp))
                    TrendChart(points = state.trendPoints, lineColor = Indigo)
                }
            }
        }
    }
}
