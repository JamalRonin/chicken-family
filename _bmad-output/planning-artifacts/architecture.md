# Architecture Système - Chicken Family V1

**Date:** 25/01/2026
**Auteur:** Winston (Architecte)
**Statut:** Validé

## 1. Vue d'ensemble Technique

L'objectif est de refondre le site statique actuel en une application Symfony modulaire, performante et maintenable, prête pour une future évolution vers une gestion dynamique (Backoffice).

### Stack Technique

- **Framework Backend:** Symfony 7.4
- **Langage:** PHP 8.3
- **Frontend:** Twig, Stimulus.js, Tailwind CSS
- **Gestion des Assets:** AssetMapper (Pas de Node.js en prod)
- **Base de Données (V1):** Fichiers YAML (Migration vers MySQL prévue en V2)
- **IA:** Google Gemini API (via Proxy Backend)
- **Infrastructure:** Docker (Nginx, PHP-FPM)

## 2. Architecture Applicative

Nous adoptons une architecture **Feature-based** (orientée fonctionnalités) plutôt que Layer-based (orientée couches techniques). Cela permet de regrouper tout le code relatif à une fonctionnalité (Menu, Chat) au même endroit.

### Structure des Dossiers

```
src/
├── Chat/                   # Feature: Chatbot IA
│   ├── Controller/         # API Endpoints (ex: /api/chat)
│   ├── Service/            # Logique métier (GeminiService)
│   └── DTO/                # Objets de transfert de données
├── Menu/                   # Feature: Affichage du Menu
│   ├── Controller/         # (Optionnel si géré par Home)
│   ├── Service/            # MenuProvider (Lit le YAML)
│   └── DTO/                # MenuItemDTO, MenuSectionDTO
├── Home/                   # Feature: Page d'accueil
│   └── Controller/         # HomeController (Orchestre tout)
└── Shared/                 # Code partagé (si nécessaire)
```

### Flux de Données (Data Flow)

**1. Affichage du Menu :**
`YAML (config/menu.yaml)` -> `MenuProvider (Service)` -> `DTOs` -> `HomeController` -> `Twig Templates`

**2. Chatbot IA :**
`Client (JS)` -> `POST /api/chat` -> `ChatController` -> `GeminiService` -> `Google API`

## 3. Détails d'Implémentation

### 3.1 Gestion du Menu (YAML & DTOs)

Le menu est la pièce centrale. En V1, il est stocké en YAML pour faciliter l'édition par Jamal sans base de données.

**Fichier :** `config/menu.yaml`
Structure hiérarchique : Sections -> Items.

**DTOs (Data Transfer Objects) :**
Nous utiliserons des classes PHP 8.2 `readonly` pour typer strictement les données du menu.

- `MenuSectionDTO` : Titre, Sous-titre, Liste d'items.
- `MenuItemDTO` : Nom, Description, Prix, Emoji.

### 3.2 Sécurité & IA (Proxy Pattern)

**Problème :** La clé API Gemini ne doit jamais être exposée dans le code JavaScript du navigateur.
**Solution :** Pattern "Backend Proxy".

1.  Le frontend envoie le message utilisateur au backend Symfony (`/api/chat`).
2.  Le backend (Symfony) détient la clé API (dans `.env.local`).
3.  Le backend ajoute le "System Prompt" (contexte du menu) et interroge Gemini.
4.  Le backend renvoie uniquement la réponse textuelle au frontend.

**Rate Limiting :**
Utilisation du composant `RateLimiter` de Symfony pour limiter les abus (ex: 10 requêtes / minute / IP).

### 3.3 Frontend (AssetMapper & Tailwind)

Nous utilisons l'approche "Modern Symfony Frontend" :

- **AssetMapper :** Pour gérer les fichiers CSS/JS sans complexité de build (Webpack/Encore) en production.
- **Tailwind CSS :** Compilé localement en développement, le fichier CSS final est versionné.
- **Stimulus :** Pour l'interactivité légère (Menu mobile, Widget Chat, Scroll fluide).
- **Twig Components :** Pour découper l'interface en blocs réutilisables (`<twig:MenuCard />`).

## 4. Plan de Déploiement (Roadmap Technique)

### Phase 1 : Fondations (Infrastructure)

- Initialisation Symfony Skeleton + Webapp.
- Configuration Docker (PHP 8.3, Nginx).
- Mise en place de la structure de dossiers Feature-based.

### Phase 2 : Core (Menu & Chat)

- Création du fichier `menu.yaml` et des DTOs.
- Implémentation du `MenuProvider`.
- Implémentation du `GeminiService` et du `ChatController` sécurisé.

### Phase 3 : UI & UX (Frontend)

- Intégration du design avec Tailwind CSS.
- Création des composants Twig (`Hero`, `MenuSection`, `Footer`).
- Ajout de l'interactivité avec Stimulus (Menu mobile, Chat widget).

### Phase 4 : Validation

- Tests de non-régression visuelle.
- Vérification des performances (Lighthouse).
- Sécurisation finale (Clés API).

## 5. Décisions d'Architecture (ADR)

| ID      | Décision                    | Justification                                                                 |
| ------- | --------------------------- | ----------------------------------------------------------------------------- |
| ADR-001 | **YAML pour les données**   | Vitesse de mise en place pour la V1, pas de besoin d'admin complexe immédiat. |
| ADR-002 | **AssetMapper**             | Simplifie le déploiement (pas de Node.js requis sur le serveur de prod).      |
| ADR-003 | **Feature-based Structure** | Prépare la scalabilité et garde le code organisé par métier.                  |
| ADR-004 | **Proxy Backend pour IA**   | Sécurité impérative de la clé API.                                            |

---

**Validation :** Ce document sert de référence technique pour l'implémentation.
