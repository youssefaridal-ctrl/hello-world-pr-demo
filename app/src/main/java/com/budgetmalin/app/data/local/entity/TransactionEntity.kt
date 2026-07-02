package com.budgetmalin.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class TransactionType { INCOME, EXPENSE }

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0L,
    val amount: Double,
    val label: String,
    val categoryId: String,
    val type: TransactionType,
    val date: Long,
    val note: String = ""
)
