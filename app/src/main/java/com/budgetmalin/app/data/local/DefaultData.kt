package com.budgetmalin.app.data.local

import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.CategoryKind

object DefaultData {

    val categories = listOf(
        CategoryEntity("food", "Alimentation", "#FF8A65", "restaurant", CategoryKind.EXPENSE),
        CategoryEntity("transport", "Transport", "#4FC3F7", "directions_car", CategoryKind.EXPENSE),
        CategoryEntity("housing", "Logement", "#9575CD", "home", CategoryKind.EXPENSE),
        CategoryEntity("leisure", "Loisirs", "#F06292", "sports_esports", CategoryKind.EXPENSE),
        CategoryEntity("health", "Santé", "#4DB6AC", "local_hospital", CategoryKind.EXPENSE),
        CategoryEntity("shopping", "Shopping", "#FFB74D", "shopping_bag", CategoryKind.EXPENSE),
        CategoryEntity("bills", "Factures", "#E57373", "receipt_long", CategoryKind.EXPENSE),
        CategoryEntity("education", "Éducation", "#64B5F6", "school", CategoryKind.EXPENSE),
        CategoryEntity("savings", "Épargne", "#00BFA6", "savings", CategoryKind.EXPENSE),
        CategoryEntity("other", "Autre", "#90A4AE", "category", CategoryKind.EXPENSE),
        CategoryEntity("salary", "Salaire", "#66BB6A", "payments", CategoryKind.INCOME),
        CategoryEntity("other_income", "Autre revenu", "#81C784", "attach_money", CategoryKind.INCOME)
    )
}
