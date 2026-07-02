package com.budgetmalin.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class CategoryKind { INCOME, EXPENSE }

@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey val id: String,
    val name: String,
    val colorHex: String,
    val icon: String,
    val kind: CategoryKind
)
