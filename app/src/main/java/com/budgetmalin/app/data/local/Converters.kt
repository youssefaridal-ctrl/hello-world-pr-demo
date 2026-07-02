package com.budgetmalin.app.data.local

import androidx.room.TypeConverter
import com.budgetmalin.app.data.local.entity.CategoryKind
import com.budgetmalin.app.data.local.entity.TransactionType

class Converters {

    @TypeConverter
    fun fromTransactionType(value: TransactionType): String = value.name

    @TypeConverter
    fun toTransactionType(value: String): TransactionType = TransactionType.valueOf(value)

    @TypeConverter
    fun fromCategoryKind(value: CategoryKind): String = value.name

    @TypeConverter
    fun toCategoryKind(value: String): CategoryKind = CategoryKind.valueOf(value)
}
