package com.budgetmalin.app.ui.screens.goals

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.budgetmalin.app.data.local.entity.GoalEntity
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.domain.ForecastEngine
import com.budgetmalin.app.domain.GoalProjection
import com.budgetmalin.app.util.DateUtils
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class GoalRowState(
    val goal: GoalEntity,
    val progress: Float,
    val projection: GoalProjection,
    val requiredMonthlyForDeadline: Double?
)

class GoalsViewModel(private val repository: BudgetRepository) : ViewModel() {

    val goalRows: StateFlow<List<GoalRowState>> = combine(
        repository.goals,
        repository.transactions
    ) { goals, transactions ->
        goals.map { goal ->
            val progress = if (goal.targetAmount > 0) (goal.savedAmount / goal.targetAmount).toFloat() else 0f
            val remaining = goal.targetAmount - goal.savedAmount
            val projection = ForecastEngine.projectGoalCompletion(remaining, transactions)
            val requiredMonthly = goal.deadline?.let { ForecastEngine.requiredMonthlySaving(remaining, it) }
            GoalRowState(goal, progress, projection, requiredMonthly)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addGoal(name: String, target: Double, deadline: Long?) {
        viewModelScope.launch {
            repository.saveGoal(
                GoalEntity(
                    name = name,
                    targetAmount = target,
                    savedAmount = 0.0,
                    deadline = deadline,
                    createdAt = DateUtils.nowMillis()
                )
            )
        }
    }

    fun updateGoal(goal: GoalEntity, name: String, target: Double, deadline: Long?) {
        viewModelScope.launch {
            repository.updateGoal(goal.copy(name = name, targetAmount = target, deadline = deadline))
        }
    }

    fun addFunds(goal: GoalEntity, amount: Double) {
        viewModelScope.launch { repository.addFundsToGoal(goal, amount) }
    }

    fun deleteGoal(goal: GoalEntity) {
        viewModelScope.launch { repository.deleteGoal(goal) }
    }
}
