---
stepsCompleted:
    [
        "step-01-init",
        "step-02-discovery",
        "step-03-success",
        "step-04-journeys",
        "step-05-architecture",
    ]
inputDocuments:
    - "_bmad-output/planning-artifacts/prd.md"
    - "_bmad-output/planning-artifacts/architecture.md"
workflowType: "epics-stories"
---

# Épics & User Stories - Refactoring Chicken Family

**Date:** 25/01/2026
**Auteur:** John (Product Manager)
**Source:** PRD v1.0 & Architecture v1.0

## Epic 1 : Infrastructure & Fondations (Phase 0)

**Lien Architecture:** Phase 1 : Fondations
**Objectif:** Mettre en place le socle technique Symfony/Docker validé par l'architecte.

### Story 1.1 : Environnement Docker

**En tant que** Développeur,
**Je veux** un environnement conteneurisé (PHP 8.3, Nginx) prêt à l'emploi,
**Afin de** pouvoir initialiser et exécuter le projet Symfony dans un environnement isolé.

**Critères d'Acceptation:**

- [x] `docker-compose.yml` créé selon spécifications Architecture (Section 4).
- [x] Service PHP-FPM 8.3 configuré.
- [x] Service Nginx configuré avec accès au dossier `public/`.
- [x] Possibilité d'exécuter `composer` et `php` dans le conteneur.

### Story 1.2 : Initialisation du Projet Symfony (via Docker)

**En tant que** Développeur,
**Je veux** initialiser le projet Symfony (version 7.4) en utilisant le conteneur PHP,
**Afin de** garantir que les dépendances sont installées avec la bonne version de PHP.

**Critères d'Acceptation:**

- [x] Commande `composer create-project` exécutée dans le conteneur.
- [x] Composants installés : `webapp`, `asset-mapper`, `stimulus-bundle`, `yaml`, `http-client`.
- [x] Git initialisé avec `.gitignore` standard Symfony.
- [x] Le site répond "Welcome to Symfony" sur `http://localhost:8080`.

### Story 1.3 : Structure "Feature-based"

**En tant que** Développeur,
**Je veux** organiser mes dossiers par fonctionnalité (`Menu`, `Chat`, `Home`),
**Afin de** respecter l'architecture modulaire définie (ADR-003).

**Critères d'Acceptation:**

- [x] Dossiers créés : `src/Menu`, `src/Chat`, `src/Home`.
- [x] Sous-dossiers `Controller`, `Service`, `DTO` dans chaque feature.
- [x] Suppression des dossiers par défaut inutiles si nécessaire.

---

## Epic 2 : Gestion du Menu & Données (Phase 1)

**Lien PRD:** FR-001, FR-002, FR-003
**Lien Architecture:** Section 3.1

### Story 2.1 : Modélisation des Données (DTOs)

**En tant que** Développeur,
**Je veux** créer les objets de transfert de données (DTO),
**Afin de** manipuler des objets typés et non des tableaux en vrac.

**Critères d'Acceptation:**

- [x] Classe `MenuItemDTO` créée (readonly) avec propriétés : nom, desc, prix, emoji.
- [x] Classe `MenuSectionDTO` créée (readonly) avec liste de `MenuItemDTO`.
- [x] Les types correspondent strictement au YAML prévu.

### Story 2.2 : Configuration YAML du Menu

**En tant que** Administrateur (Jamal),
**Je veux** éditer le menu dans un fichier `menu.yaml`,
**Afin de** mettre à jour les prix et produits sans toucher au PHP.

**Critères d'Acceptation:**

- [x] Fichier `config/menu.yaml` créé.
- [x] Structure respectée : Sections -> Items.
- [x] Données initiales du site actuel migrées dans ce fichier.

### Story 2.3 : Service MenuProvider

**En tant que** Développeur,
**Je veux** un service qui lit le YAML et retourne des DTOs,
**Afin d'** alimenter les contrôleurs avec des données propres.

**Critères d'Acceptation:**

- [x] Service `MenuProvider` implémenté.
- [x] Méthode `getAllSections()` retourne un tableau de `MenuSectionDTO`.
- [x] Gestion d'erreur si le fichier YAML est malformé.

---

## Epic 3 : Chatbot IA Sécurisé (Phase 1)

**Lien PRD:** FR-004 à FR-007, NFR-004, NFR-005
**Lien Architecture:** Section 3.2

### Story 3.1 : Service Gemini (Backend)

**En tant que** Système,
**Je veux** interroger l'API Google Gemini via un service Symfony,
**Afin de** générer des réponses sans exposer la clé API.

**Critères d'Acceptation:**

- [x] Clé API stockée dans `.env.local` (non versionné).
- [x] Service `GeminiService` implémenté avec `HttpClient`.
- [x] System Prompt injecté avec les données du menu (JSON).
- [x] Disclaimer allergènes ajouté systématiquement (FR-006).

### Story 3.2 : API Endpoint & Rate Limiting

**En tant que** Développeur,
**Je veux** exposer une route `/api/chat` protégée,
**Afin que** le frontend puisse dialoguer avec l'IA.

**Critères d'Acceptation:**

- [x] Route `POST /api/chat` créée.
- [x] Rate Limiter configuré (10 req/min par IP) (NFR-005).
- [x] Retourne une réponse JSON standardisée.

---

## Epic 4 : Interface Utilisateur & UX (Phase 2)

**Lien PRD:** FR-008 à FR-012, NFR-001 à NFR-003
**Lien Architecture:** Section 3.3

### Story 4.1 : Intégration Tailwind CSS

**En tant que** Designer,
**Je veux** utiliser Tailwind CSS avec la charte graphique Chicken Family,
**Afin d'** avoir un design fidèle et performant.

**Critères d'Acceptation:**

- [x] Tailwind installé et configuré (couleurs brand, polices).
- [x] Compilation CSS fonctionnelle via script npm.
- [x] Fichier CSS de sortie chargé par AssetMapper.

### Story 4.2 : Composants Twig (Menu & Home)

**En tant que** Utilisateur,
**Je veux** voir le menu affiché avec le design "carte",
**Afin de** choisir mon repas facilement.

**Critères d'Acceptation:**

- [x] Composant `MenuCard` créé (Image/Emoji, Titre, Desc, Prix).
- [x] Composant `MenuSection` pour lister les cartes.
- [x] Page d'accueil intégrant ces composants.
- [x] Responsive : Grille adaptée Mobile/Desktop.

### Story 4.3 : Interactivité Stimulus (Chat & Nav)

**En tant que** Utilisateur Mobile,
**Je veux** un menu burger et un widget de chat fluide,
**Afin de** naviguer sans rechargement de page.

**Critères d'Acceptation:**

- [x] Controller `mobile-menu` (ouverture/fermeture).
- [x] Controller `chat-widget` (fenêtre flottante, appel API asynchrone).
- [x] Controller `smooth-scroll` pour les ancres.

---

## Epic 5 : Qualité & Déploiement (Phase 3)

**Lien PRD:** NFR-001, NFR-002
**Lien Architecture:** Phase 4

### Story 5.1 : Optimisation & Tests

**En tant que** Développeur,
**Je veux** valider les performances et le fonctionnement,
**Afin de** livrer un site de qualité professionnelle.

**Critères d'Acceptation:**

- [ ] Score Lighthouse > 90 (Performance, SEO, Accessibilité).
- [ ] Pas d'erreur console JS.
- [ ] Validation W3C du HTML généré.

### Story 5.2 : Préparation Production

**En tant que** Développeur,
**Je veux** préparer les artefacts de déploiement,
**Afin de** mettre en ligne la V1.

**Critères d'Acceptation:**

- [ ] `composer install --no-dev`.
- [ ] Assets compilés et versionnés.
- [ ] Cache warmup effectué.
