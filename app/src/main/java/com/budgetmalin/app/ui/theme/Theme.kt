package com.budgetmalin.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Indigo,
    onPrimary = Color.White,
    primaryContainer = LightSurfaceVariant,
    onPrimaryContainer = Indigo,
    secondary = Mint,
    onSecondary = Color.White,
    secondaryContainer = LightSurfaceVariant,
    tertiary = Coral,
    background = LightBackground,
    onBackground = LightOnBackground,
    surface = LightSurface,
    onSurface = LightOnBackground,
    surfaceVariant = LightSurfaceVariant,
    onSurfaceVariant = NeutralGray,
    outline = LightOutline,
    error = ExpenseRed
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF9698F5),
    onPrimary = Color(0xFF1B1B3A),
    primaryContainer = DarkSurfaceVariant,
    onPrimaryContainer = Color(0xFFC9CAFB),
    secondary = Color(0xFF5FE0CB),
    onSecondary = Color(0xFF00332C),
    secondaryContainer = DarkSurfaceVariant,
    tertiary = Coral,
    background = DarkBackground,
    onBackground = DarkOnBackground,
    surface = DarkSurface,
    onSurface = DarkOnBackground,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = NeutralGray,
    outline = DarkOutline,
    error = Color(0xFFFF8A80)
)

@Composable
fun BudgetMalinTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colorScheme,
        typography = BudgetMalinTypography,
        content = content
    )
}
