package com.budgetmalin.app.ui.screens.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.budgetmalin.app.R
import com.budgetmalin.app.data.repository.AppThemeMode
import com.budgetmalin.app.data.repository.SettingsRepository

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settings: SettingsRepository,
    onBack: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Filled.ArrowBack, contentDescription = stringResource(R.string.cd_back))
            }
            Text(stringResource(R.string.settings_title), style = MaterialTheme.typography.headlineSmall)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(stringResource(R.string.settings_currency), style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            SettingsRepository.SUPPORTED_CURRENCIES.forEach { symbol ->
                FilterChip(
                    selected = settings.currencySymbol == symbol,
                    onClick = { settings.setCurrency(symbol) },
                    label = { Text(symbol) }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        Text(stringResource(R.string.settings_theme), style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(10.dp))
        SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
            SegmentedButton(
                selected = settings.themeMode == AppThemeMode.LIGHT,
                onClick = { settings.updateThemeMode(AppThemeMode.LIGHT) },
                shape = SegmentedButtonDefaults.itemShape(0, 3)
            ) { Text(stringResource(R.string.settings_theme_light)) }
            SegmentedButton(
                selected = settings.themeMode == AppThemeMode.DARK,
                onClick = { settings.updateThemeMode(AppThemeMode.DARK) },
                shape = SegmentedButtonDefaults.itemShape(1, 3)
            ) { Text(stringResource(R.string.settings_theme_dark)) }
            SegmentedButton(
                selected = settings.themeMode == AppThemeMode.SYSTEM,
                onClick = { settings.updateThemeMode(AppThemeMode.SYSTEM) },
                shape = SegmentedButtonDefaults.itemShape(2, 3)
            ) { Text(stringResource(R.string.settings_theme_system)) }
        }

        Spacer(modifier = Modifier.height(28.dp))

        Surface(
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.surfaceVariant,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(stringResource(R.string.settings_about), style = MaterialTheme.typography.titleMedium)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    stringResource(R.string.settings_about_desc),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
