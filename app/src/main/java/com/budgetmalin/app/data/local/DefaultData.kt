package com.budgetmalin.app.data.local

import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.CategoryKind

object DefaultData {

    val categories = listOf(
        CategoryEntity("food", "Alimentation", "#FF8A65", "🍽️", CategoryKind.EXPENSE),
        CategoryEntity("transport", "Transport", "#4FC3F7", "🚗", CategoryKind.EXPENSE),
        CategoryEntity("housing", "Logement", "#9575CD", "🏠", CategoryKind.EXPENSE),
        CategoryEntity("leisure", "Loisirs", "#F06292", "🎮", CategoryKind.EXPENSE),
        CategoryEntity("health", "Santé", "#4DB6AC", "🏥", CategoryKind.EXPENSE),
        CategoryEntity("shopping", "Shopping", "#FFB74D", "🛍️", CategoryKind.EXPENSE),
        CategoryEntity("bills", "Factures", "#E57373", "🧾", CategoryKind.EXPENSE),
        CategoryEntity("education", "Éducation", "#64B5F6", "🎓", CategoryKind.EXPENSE),
        CategoryEntity("savings", "Épargne", "#00BFA6", "🏦", CategoryKind.EXPENSE),
        CategoryEntity("other", "Autre", "#90A4AE", "📦", CategoryKind.EXPENSE),
        CategoryEntity("salary", "Salaire", "#66BB6A", "💰", CategoryKind.INCOME),
        CategoryEntity("other_income", "Autre revenu", "#81C784", "💵", CategoryKind.INCOME)
    )
}
