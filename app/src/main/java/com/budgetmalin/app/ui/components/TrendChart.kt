package com.budgetmalin.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp

data class TrendPoint(val label: String, val value: Double)

@Composable
fun TrendChart(
    points: List<TrendPoint>,
    lineColor: Color,
    modifier: Modifier = Modifier
) {
    val maxValue = (points.maxOfOrNull { it.value } ?: 0.0).takeIf { it > 0 } ?: 1.0

    Column(modifier = modifier.fillMaxWidth()) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
        ) {
            if (points.size < 2) return@Canvas
            val stepX = size.width / (points.size - 1)
            val coords = points.mapIndexed { index, point ->
                Offset(
                    x = index * stepX,
                    y = size.height - (point.value / maxValue * size.height).toFloat()
                )
            }

            val linePath = androidx.compose.ui.graphics.Path().apply {
                moveTo(coords.first().x, coords.first().y)
                coords.drop(1).forEach { lineTo(it.x, it.y) }
            }
            val fillPath = androidx.compose.ui.graphics.Path().apply {
                addPath(linePath)
                lineTo(coords.last().x, size.height)
                lineTo(coords.first().x, size.height)
                close()
            }

            drawPath(
                path = fillPath,
                brush = Brush.verticalGradient(
                    colors = listOf(lineColor.copy(alpha = 0.35f), lineColor.copy(alpha = 0f))
                ),
                style = Fill
            )
            drawPath(path = linePath, color = lineColor, style = Stroke(width = 6f, cap = androidx.compose.ui.graphics.StrokeCap.Round))
            coords.forEach { drawCircle(color = lineColor, radius = 8f, center = it) }
        }
        Row(modifier = Modifier.fillMaxWidth().padding(top = 6.dp)) {
            points.forEach { point ->
                Text(
                    text = point.label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }
        }
    }
}
