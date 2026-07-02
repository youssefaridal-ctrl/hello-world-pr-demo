package com.budgetmalin.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Savings
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.SportsEsports
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

fun iconForKey(key: String): ImageVector = when (key) {
    "restaurant" -> Icons.Filled.Restaurant
    "directions_car" -> Icons.Filled.DirectionsCar
    "home" -> Icons.Filled.Home
    "sports_esports" -> Icons.Filled.SportsEsports
    "local_hospital" -> Icons.Filled.LocalHospital
    "shopping_bag" -> Icons.Filled.ShoppingBag
    "receipt_long" -> Icons.Filled.ReceiptLong
    "school" -> Icons.Filled.School
    "savings" -> Icons.Filled.Savings
    "payments" -> Icons.Filled.Payments
    "attach_money" -> Icons.Filled.AttachMoney
    else -> Icons.Filled.Category
}

fun colorFromHex(hex: String): Color = try {
    Color(android.graphics.Color.parseColor(hex))
} catch (e: IllegalArgumentException) {
    Color.Gray
}
