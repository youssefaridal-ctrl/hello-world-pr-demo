package com.budgetmalin.app.data.repository

import com.budgetmalin.app.data.local.AppDatabase
import com.budgetmalin.app.data.local.entity.BudgetEntity
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.GoalEntity
import com.budgetmalin.app.data.local.entity.TransactionEntity
import kotlinx.coroutines.flow.Flow

class BudgetRepository(private val db: AppDatabase) {

    val transactions: Flow<List<TransactionEntity>> = db.transactionDao().observeAll()
    val categories: Flow<List<CategoryEntity>> = db.categoryDao().observeAll()
    val goals: Flow<List<GoalEntity>> = db.goalDao().observeAll()
    val budgets: Flow<List<BudgetEntity>> = db.budgetDao().observeAll()

    suspend fun saveTransaction(transaction: TransactionEntity): Long =
        db.transactionDao().upsert(transaction)

    suspend fun updateTransaction(transaction: TransactionEntity) =
        db.transactionDao().update(transaction)

    suspend fun deleteTransaction(transaction: TransactionEntity) =
        db.transactionDao().delete(transaction)

    suspend fun saveGoal(goal: GoalEntity): Long = db.goalDao().upsert(goal)

    suspend fun updateGoal(goal: GoalEntity) = db.goalDao().update(goal)

    suspend fun deleteGoal(goal: GoalEntity) = db.goalDao().delete(goal)

    suspend fun addFundsToGoal(goal: GoalEntity, amount: Double) =
        db.goalDao().update(goal.copy(savedAmount = goal.savedAmount + amount))

    suspend fun setBudget(categoryId: String, monthlyLimit: Double) =
        db.budgetDao().upsert(BudgetEntity(categoryId, monthlyLimit))
}
