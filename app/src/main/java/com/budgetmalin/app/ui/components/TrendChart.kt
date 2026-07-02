package com.budgetmalin.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

data class TrendPoint(val label: String, val value: Double)

@Composable
fun TrendChart(
    points: List<TrendPoint>,
    lineColor: Color,
    modifier: Modifier = Modifier,
    highlightColor: Color = Color(0xFFFF6B6B)
) {
    val maxValue = (points.maxOfOrNull { it.value } ?: 0.0).takeIf { it > 0 } ?: 1.0

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.Bottom
        ) {
            points.forEachIndexed { index, point ->
                val fraction = (point.value / maxValue).toFloat().coerceIn(0.04f, 1f)
                val isLast = index == points.lastIndex
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(fraction)
                        .clip(RoundedCornerShape(topStart = 7.dp, topEnd = 7.dp, bottomStart = 3.dp, bottomEnd = 3.dp))
                        .background(
                            Brush.verticalGradient(
                                colors = if (isLast) {
                                    listOf(highlightColor, highlightColor.copy(alpha = 0.75f))
                                } else {
                                    listOf(lineColor, lineColor.copy(alpha = 0.75f))
                                }
                            )
                        )
                )
            }
        }
        Row(modifier = Modifier.fillMaxWidth().padding(top = 6.dp)) {
            points.forEach { point ->
                Text(
                    text = point.label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
