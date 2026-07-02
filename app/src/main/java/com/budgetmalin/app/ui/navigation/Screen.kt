package com.budgetmalin.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Flag
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.ui.graphics.vector.ImageVector
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
    val icon: ImageVector
)

val bottomNavItems = listOf(
    BottomNavItem(Screen.Dashboard, R.string.nav_dashboard, Icons.Filled.Home),
    BottomNavItem(Screen.Transactions, R.string.nav_transactions, Icons.Filled.Receipt),
    BottomNavItem(Screen.Budget, R.string.nav_budget, Icons.Filled.AccountBalanceWallet),
    BottomNavItem(Screen.Goals, R.string.nav_goals, Icons.Filled.Flag),
    BottomNavItem(Screen.Statistics, R.string.nav_stats, Icons.Filled.PieChart)
)
