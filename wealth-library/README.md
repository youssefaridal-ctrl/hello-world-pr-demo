# ثروة (Tharwa) — Mockup de bibliothèque de résumés (argent & richesse)

Maquette statique (HTML/CSS/JS, sans build) d'une bibliothèque numérique arabe
(RTL) de résumés de livres sur l'argent et la richesse, complétée par des
articles et des séries, avec un espace personnel de suivi de lecture.

## Liens

| Quoi | Lien |
|---|---|
| Aperçu interactif (3 vues avec sélecteur d'onglets, polices intégrées) | https://claude.ai/code/artifact/639eaef1-ec14-4213-a30d-0a8a91cccf5e |
| Pull request (code source mergé) | https://github.com/youssefaridal-ctrl/hello-world-pr-demo/pull/4 |
| Site déjà public existant (Aridal Lab, non lié à ce mockup) | https://youssefaridal-ctrl.github.io/hello-world-pr-demo/ |

> Ce mockup **n'est pas encore déployé sur GitHub Pages**. Voir [Prochaines étapes](#prochaines-étapes-pour-finaliser).

## Système de design

Direction éditoriale inspirée des registres financiers et de la gravure de
billets de banque (plutôt que le cliché or/vert "luxe"), pour rester crédible
et distinctif sur le thème argent/richesse.

**Couleurs**
| Rôle | Nom | Hex |
|---|---|---|
| Fond papier | `--paper` | `#E8E6D9` |
| Carte / surface | `--paper-raised` | `#F2F0E5` |
| Texte principal | `--ink` | `#1C2333` |
| Bandeaux sombres / navigation | `--navy` | `#212A40` |
| Accent unique (CTA, liens) | `--bronze` | `#B3752E` |
| Sémantique "progrès / terminé" | `--moss` | `#55684A` |
| Sémantique "alerte" (rare) | `--claret` | `#7C3B34` |

**Typographie**
- Titres : **El Messiri** (700) — display arabe caractériel
- Corps / UI : **IBM Plex Sans Arabic** (400/500/600/700)
- Chiffres / données : **IBM Plex Mono** — tous les chiffres sont en
  numérotation **latine (0-9)**, convention courante des produits
  tech/fintech arabes (corrigé suite à une demande de révision)

**Mise en page** : salle de lecture éditoriale — héros asymétrique avec des
couvertures de livres éparpillées façon bureau, rail de catégories façon
onglets de fichier, cartes façon fiches de bibliothèque, tableau de bord façon
registre personnel.

## Structure des fichiers

```
wealth-library/
├── index.html        page d'accueil (héros, catégories, grille de livres,
│                      articles/séries, aperçu du tableau de bord)
├── summary.html       modèle de résumé (livre / article / série) :
│                      idées clés, texte, barre de progression, sommaire
├── dashboard.html      espace personnel : "en cours", "terminés",
│                      "à lire", articles sauvegardés, objectif hebdo, badges
├── preview.html        fichier autonome (polices en base64) réunissant les
│                      3 vues ci-dessus avec un sélecteur d'onglets —
│                      utilisé pour l'aperçu Artifact ci-dessus
├── css/styles.css      design system complet (tokens, composants)
├── js/main.js          interactions minimales (onglets, nav mobile)
└── assets/             (réservé aux futures images/icônes)
```

## Contenu

Le contenu utilise de vrais titres connus (pas de lorem ipsum) : *الأب الغني
والأب الفقير* (Rich Dad Poor Dad), *سيكولوجية المال* (The Psychology of
Money), *المستثمر الذكي* (The Intelligent Investor), *أغنى رجل في بابل* (The
Richest Man in Babylon), etc. Les résumés eux-mêmes sont des synthèses
originales rédigées pour la maquette, pas des extraits protégés.

## Lancer en local

Aucune étape de build : servez le dossier avec n'importe quel serveur
statique.

```bash
cd wealth-library
python3 -m http.server 8080
# puis ouvrir http://localhost:8080/index.html
```

## Prochaines étapes pour finaliser

1. **Déployer sur GitHub Pages** — étendre `.github/workflows/deploy-pages.yml`
   pour publier aussi `wealth-library/` (ex. sous `/wealth-library/`), en plus
   du site Aridal Lab déjà publié à la racine. *(Nécessite une confirmation
   explicite avant de modifier le pipeline de déploiement.)*
2. **Contenu réel** — remplacer les résumés d'exemple par les 100 vrais
   résumés, et brancher les compteurs (100 livres, catégories, etc.) sur des
   données réelles plutôt que des valeurs statiques.
3. **Backend / comptes utilisateurs** — le tableau de bord (`dashboard.html`)
   est aujourd'hui une maquette figée ; il faudra une authentification et un
   stockage réel pour que le suivi de lecture persiste par utilisateur.
4. **Couvertures de livres** — remplacer les dégradés générés par CSS par de
   vraies couvertures (ou continuer avec le style graphique actuel comme
   identité visuelle assumée).
5. **Accessibilité et SEO** — vérifier les contrastes, ajouter des balises
   `alt`/OpenGraph par page une fois le contenu réel en place.
