package com.budgetmalin.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.sp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository
import com.budgetmalin.app.ui.screens.addtransaction.AddTransactionScreen
import com.budgetmalin.app.ui.screens.budget.BudgetScreen
import com.budgetmalin.app.ui.screens.dashboard.DashboardScreen
import com.budgetmalin.app.ui.screens.goals.GoalsScreen
import com.budgetmalin.app.ui.screens.settings.SettingsScreen
import com.budgetmalin.app.ui.screens.statistics.StatisticsScreen
import com.budgetmalin.app.ui.screens.transactions.TransactionsScreen

@Composable
fun BudgetMalinNavGraph(
    repository: BudgetRepository,
    settings: SettingsRepository
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination

    val showChrome = bottomNavItems.any { it.screen.route == currentRoute?.route }

    Scaffold(
        bottomBar = {
            if (showChrome) {
                NavigationBar {
                    bottomNavItems.forEach { item ->
                        val selected = currentRoute?.hierarchy?.any { it.route == item.screen.route } == true
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(item.screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Text(item.emoji, fontSize = 18.sp) },
                            label = { Text(stringResource(item.labelRes)) }
                        )
                    }
                }
            }
        },
        floatingActionButton = {
            if (currentRoute?.route == Screen.Dashboard.route || currentRoute?.route == Screen.Transactions.route) {
                ExtendedFloatingActionButton(
                    onClick = { navController.navigate(Screen.AddTransaction.createRoute()) },
                    icon = { Icon(Icons.Filled.Add, contentDescription = null) },
                    text = { Text(stringResource(com.budgetmalin.app.R.string.action_add)) }
                )
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    repository = repository,
                    settings = settings,
                    onSeeAllTransactions = { navController.navigate(Screen.Transactions.route) },
                    onOpenSettings = { navController.navigate(Screen.Settings.route) }
                )
            }
            composable(Screen.Transactions.route) {
                TransactionsScreen(
                    repository = repository,
                    settings = settings,
                    onEditTransaction = { id -> navController.navigate(Screen.AddTransaction.createRoute(id)) }
                )
            }
            composable(
                route = Screen.AddTransaction.route,
                arguments = listOf(navArgument("transactionId") {
                    type = NavType.LongType
                    defaultValue = -1L
                })
            ) { entry ->
                val transactionId = entry.arguments?.getLong("transactionId") ?: -1L
                AddTransactionScreen(
                    repository = repository,
                    settings = settings,
                    transactionId = transactionId.takeIf { it >= 0 },
                    onDone = { navController.popBackStack() }
                )
            }
            composable(Screen.Budget.route) {
                BudgetScreen(repository = repository, settings = settings)
            }
            composable(Screen.Goals.route) {
                GoalsScreen(repository = repository, settings = settings)
            }
            composable(Screen.Statistics.route) {
                StatisticsScreen(repository = repository, settings = settings)
            }
            composable(Screen.Settings.route) {
                SettingsScreen(settings = settings, onBack = { navController.popBackStack() })
            }
        }
    }
}
