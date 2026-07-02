package com.budgetmalin.app.data.repository

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class AppThemeMode { LIGHT, DARK, SYSTEM }

class SettingsRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences("budgetmalin_prefs", Context.MODE_PRIVATE)

    var currencySymbol by mutableStateOf(prefs.getString(KEY_CURRENCY, "€") ?: "€")
        private set

    var themeMode by mutableStateOf(
        AppThemeMode.valueOf(prefs.getString(KEY_THEME, AppThemeMode.SYSTEM.name) ?: AppThemeMode.SYSTEM.name)
    )
        private set

    fun setCurrency(symbol: String) {
        currencySymbol = symbol
        prefs.edit().putString(KEY_CURRENCY, symbol).apply()
    }

    fun setThemeMode(mode: AppThemeMode) {
        themeMode = mode
        prefs.edit().putString(KEY_THEME, mode.name).apply()
    }

    companion object {
        private const val KEY_CURRENCY = "currency_symbol"
        private const val KEY_THEME = "theme_mode"
        val SUPPORTED_CURRENCIES = listOf("€", "$", "MAD", "£", "CHF")
    }
}
