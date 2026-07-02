package com.budgetmalin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.budgetmalin.app.data.repository.AppThemeMode
import com.budgetmalin.app.ui.navigation.BudgetMalinNavGraph
import com.budgetmalin.app.ui.theme.BudgetMalinTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val app = application as BudgetMalinApp

        setContent {
            val themeMode = app.settings.themeMode
            val darkTheme = when (themeMode) {
                AppThemeMode.LIGHT -> false
                AppThemeMode.DARK -> true
                AppThemeMode.SYSTEM -> androidx.compose.foundation.isSystemInDarkTheme()
            }
            BudgetMalinTheme(darkTheme = darkTheme) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    BudgetMalinNavGraph(repository = app.repository, settings = app.settings)
                }
            }
        }
    }
}
