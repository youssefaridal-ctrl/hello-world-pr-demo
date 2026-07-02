package com.budgetmalin.app.ui.navigation

import com.budgetmalin.app.R

sealed class Screen(val route: String) {
    data object Dashboard : Screen("dashboard")
    data object Transactions : Screen("transactions")
    data object AddTransaction : Screen("add_transaction?transactionId={transactionId}") {
        fun createRoute(transactionId: Long? = null) = "add_transaction?transactionId=${transactionId ?: -1L}"
    }
    data object Budget : Screen("budget")
    data object Goals : Screen("goals")
    data object Statistics : Screen("statistics")
    data object Settings : Screen("settings")
}

data class BottomNavItem(
    val screen: Screen,
    val labelRes: Int,
    val emoji: String
)

val bottomNavItems = listOf(
    BottomNavItem(Screen.Dashboard, R.string.nav_dashboard, "🏠"),
    BottomNavItem(Screen.Transactions, R.string.nav_transactions, "🧾"),
    BottomNavItem(Screen.Budget, R.string.nav_budget, "💼"),
    BottomNavItem(Screen.Goals, R.string.nav_goals, "🚩"),
    BottomNavItem(Screen.Statistics, R.string.nav_stats, "📊")
)
