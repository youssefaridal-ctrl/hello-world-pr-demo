package com.budgetmalin.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.budgetmalin.app.data.local.entity.CategoryEntity
import com.budgetmalin.app.data.local.entity.TransactionEntity
import com.budgetmalin.app.data.local.entity.TransactionType
import com.budgetmalin.app.ui.theme.ExpenseRed
import com.budgetmalin.app.ui.theme.IncomeGreen
import com.budgetmalin.app.util.CurrencyFormatter
import com.budgetmalin.app.util.DateUtils

@Composable
fun TransactionRow(
    transaction: TransactionEntity,
    category: CategoryEntity?,
    currencySymbol: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val color = category?.let { colorFromHex(it.colorHex) } ?: MaterialTheme.colorScheme.primary
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Surface(shape = CircleShape, color = color.copy(alpha = 0.15f), modifier = Modifier.size(44.dp)) {
            Icon(
                imageVector = iconForKey(category?.icon ?: "category"),
                contentDescription = null,
                tint = color,
                modifier = Modifier.padding(11.dp)
            )
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = transaction.label,
                style = MaterialTheme.typography.titleMedium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = "${category?.name ?: ""} · ${DateUtils.formatShortDate(transaction.date)}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        val signedAmount = if (transaction.type == TransactionType.INCOME) transaction.amount else -transaction.amount
        Text(
            text = CurrencyFormatter.formatSigned(signedAmount, currencySymbol),
            style = MaterialTheme.typography.titleMedium,
            color = if (transaction.type == TransactionType.INCOME) IncomeGreen else ExpenseRed
        )
    }
}
