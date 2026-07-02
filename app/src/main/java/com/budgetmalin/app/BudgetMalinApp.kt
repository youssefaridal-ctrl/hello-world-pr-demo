package com.budgetmalin.app

import android.app.Application
import com.budgetmalin.app.data.local.AppDatabase
import com.budgetmalin.app.data.repository.BudgetRepository
import com.budgetmalin.app.data.repository.SettingsRepository

class BudgetMalinApp : Application() {

    lateinit var repository: BudgetRepository
        private set

    lateinit var settings: SettingsRepository
        private set

    override fun onCreate() {
        super.onCreate()
        val database = AppDatabase.getInstance(this)
        repository = BudgetRepository(database)
        settings = SettingsRepository(this)
    }
}
