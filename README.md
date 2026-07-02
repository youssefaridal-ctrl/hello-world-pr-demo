# BudgetMalin 💸

Application Android (Kotlin + Jetpack Compose, Material 3) de gestion de budget personnel, entièrement en français.

## Fonctionnalités

- **Accueil** — solde du mois, revenus/dépenses, prévision de fin de mois basée sur le rythme de dépense actuel, transactions récentes.
- **Historique** — liste filtrable (tout / revenus / dépenses) des transactions, suppression par balayage, modification en un clic.
- **Ajouter une transaction** — montant, description, catégorie (icône + couleur), date, type revenu/dépense.
- **Budget** — définition d'un plafond mensuel par catégorie, comparaison dépensé/prévu avec barre de progression.
- **Objectifs** — création d'objectifs d'épargne, suivi du pourcentage atteint, estimation de la date d'atteinte selon le rythme d'épargne moyen.
- **Statistiques** — répartition des dépenses par catégorie (donut chart) et tendance sur 6 mois (courbe).
- **Réglages** — devise (€, $, MAD, £, CHF), thème clair/sombre/système.

## Architecture

- **UI** : Jetpack Compose, Material 3, navigation via `navigation-compose`, une `ViewModel` par écran (MVVM), pas de framework de DI — une petite `GenericViewModelFactory` suffit.
- **Données** : Room (SQLite) — `TransactionEntity`, `CategoryEntity`, `GoalEntity`, `BudgetEntity` — exposées via des `Flow` dans `BudgetRepository`.
- **Prévisions** : `ForecastEngine` (package `domain`) calcule la projection de fin de mois par extrapolation du rythme de dépense actuel, et estime la date d'atteinte d'un objectif à partir de l'épargne nette moyenne des derniers mois.
- **Réglages** : `SettingsRepository` stocke la devise et le thème dans les `SharedPreferences`.

## Ouvrir le projet

Ouvrir le dossier racine dans Android Studio (Koala ou plus récent). Android Studio régénère automatiquement le wrapper Gradle (`gradlew`) à la synchronisation. Le projet cible `minSdk 26` / `compileSdk 34`.
