package com.budgetmalin.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

/** Lightweight factory so screen ViewModels can take constructor args without a DI framework. */
class GenericViewModelFactory<T : ViewModel>(private val creator: () -> T) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <U : ViewModel> create(modelClass: Class<U>): U = creator() as U
}
