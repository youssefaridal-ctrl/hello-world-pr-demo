package com.budgetmalin.app.util

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale
import kotlin.math.roundToInt

object CurrencyFormatter {

    private val symbols = DecimalFormatSymbols(Locale.FRANCE).apply {
        groupingSeparator = ' '
        decimalSeparator = ','
    }

    fun format(amount: Double, currencySymbol: String): String {
        val pattern = if (amount == amount.roundToInt().toDouble()) "#,##0" else "#,##0.00"
        val formatter = DecimalFormat(pattern, symbols)
        return "${formatter.format(amount)} $currencySymbol"
    }

    fun formatSigned(amount: Double, currencySymbol: String): String {
        val formatted = format(kotlin.math.abs(amount), currencySymbol)
        return if (amount < 0) "-$formatted" else "+$formatted"
    }
}
