package com.budgetmalin.app.data.local.entity

import androidx.room.Entity

@Entity(tableName = "budgets", primaryKeys = ["categoryId"])
data class BudgetEntity(
    val categoryId: String,
    val monthlyLimit: Double
)
