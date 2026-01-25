---
stepsCompleted:
  ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys"]
inputDocuments:
  - "_bmad-output/analysis/brainstorming-session-2026-01-24.md"
  - "_bmad-output/analysis/architecture-roadmap.md"
  - "_bmad-output/analysis/quick-start.md"
  - "docs/index.md"
workflowType: "prd"
classification:
  projectType: web_app
  domain: general
  complexity: medium
  projectContext: brownfield
---

# Product Requirements Document - chicken-family

**Author:** Jamal
**Date:** 2026-01-25

## Success Criteria

### User Success

- **Accès instantané :** Le client trouve le menu en moins de 2 secondes (Performance).
- **Navigation fluide :** Le client comprend immédiatement comment naviguer entre les sections (Burgers, Wraps, etc.) sur mobile.
- **Réponse immédiate :** Le client obtient une réponse à sa question ("C'est halal ?", "C'est ouvert ?") via le chatbot sans chercher.
- **Appétence :** Le design donne faim (photos/emojis, couleurs, animations).

### Business Success

- **Image de marque :** Avoir un site "Pro" et moderne qui rassure les clients.
- **Réduction du support :** Le chatbot répond aux questions fréquentes (horaires, ingrédients), libérant du temps.
- **Maintenabilité :** Modification rapide des prix/produits via YAML sans toucher au code HTML.

### Technical Success

- **Performance :** Score Lighthouse > 90/100 (AssetMapper + Tailwind compilé).
- **Sécurité :** Clé API Gemini 100% sécurisée (Proxy Backend).
- **Architecture :** Code modulaire (Feature-based) prêt pour la V2.
- **Stabilité :** Zéro bug bloquant sur les fonctionnalités critiques (Menu, Chat).

### Measurable Outcomes

- **Performance Web :** Temps de chargement < 2s sur 4G.
- **Sécurité :** 0 fuite de clé API détectée.
- **Qualité Code :** Structure respectant l'architecture Feature-based définie.

## Product Scope

### MVP - Minimum Viable Product (V1)

- **Homepage :** Site One-page responsive avec design moderne.
- **Menu Dynamique :** Affichage des sections et produits depuis configuration YAML.
- **Chatbot IA :** Assistant virtuel (Gemini) pour répondre aux questions sur le menu/restaurant.
- **Infos Pratiques :** Footer avec horaires, adresse, réseaux sociaux.
- **Stack Technique :** Symfony 6.4+, Tailwind CSS (compilé), Stimulus, Docker.

### Growth Features (Post-MVP / V2)

- **Backoffice Admin :** Interface pour modifier le menu sans toucher au code/YAML.
- **Base de Données :** Migration des données YAML vers MySQL/PostgreSQL.
- **Tests Automatisés :** Couverture de tests unitaires et fonctionnels.
- **SEO Avancé :** Optimisations fines pour le référencement local.

### Vision (Future)

- **Commande en ligne :** Possibilité de commander et payer directement sur le site.
- **Compte Client :** Fidélité, historique de commandes.
- **Personnalisation IA :** Recommandations personnalisées basées sur les préférences.

## User Journeys

### 1. Sarah, l'étudiante pressée (Mobile First)

**Situation:** 11h50, sortie de cours, faim, 45min de pause.
**But:** Manger vite et pas cher (<10€).

1.  **Ouverture:** Ouvre le site sur mobile. Chargement instantané.
2.  **Navigation:** Scrolle vers "Menus Étudiants" ou "Burgers".
3.  **Interaction IA:** Doute sur la dispo du menu étudiant le samedi. Clique sur le chat : "Menu étudiant samedi ?".
4.  **Réponse:** L'IA répond instantanément que c'est du Lundi au Vendredi, mais propose une alternative (Menu Chicken 8,90€).
5.  **Action:** Convaincue, elle vient au restaurant.

### 2. Thomas, le père de famille (Desktop/Tablette)

**Situation:** Vendredi 19h, commande pour 4 personnes.
**But:** Commander sans attendre au téléphone.

1.  **Consultation:** Regarde les "Buckets" et "Menus Enfants" sur sa tablette.
2.  **Décision:** Choisi son menu. Cherche comment commander.
3.  **Incitation:** Voit un bouton "Commander en Click & Collect" très visible (plus que le téléphone).
4.  **Action:** Clique et est redirigé vers la plateforme de commande externe.
5.  **Résultat:** Commande passée en ligne, pas d'appel téléphonique à gérer pour le staff.

### 3. Jamal, le propriétaire (Admin/Maintenance)

**Situation:** Hausse du prix du poulet.
**But:** Mettre à jour les prix rapidement.

1.  **Accès:** Ouvre le projet en local.
2.  **Édition:** Modifie . Change prix 8.90 -> 9.50.
3.  **Déploiement:** Git commit & push.
4.  **Vérification:** Le site est à jour instantanément.

### Journey Requirements Summary

- **Mobile:** Performance critique, UX fluide pour scroll vertical.
- **Chatbot:** Doit connaître les règles métier (horaires menus étudiants, etc.).
- **Conversion:** Bouton "Click & Collect" doit être le CTA principal (Call To Action).
- **Admin:** Structure YAML claire et documentée pour modification facile.

## Domain-Specific Requirements

### Compliance & Regulatory (Restauration)

- **Information Allergènes:** Le chatbot doit inclure un disclaimer systématique : *"Pour toute allergie sévère, merci de consulter notre équipe en restaurant avant de commander."*
- **Transparence Prix:** Tous les prix affichés (Menu, Chatbot) doivent être TTC.
- **Photos:** Mention *"Photos non contractuelles"* visible dans le footer ou les mentions légales.
- **Origine Viandes:** Si applicable, mention de l'origine des viandes (ex: Poulet 100% Filet).

### Technical Constraints

- **Source Unique de Vérité:** Les horaires et prix doivent provenir d'une seule source () pour garantir la cohérence entre le site, le footer et les réponses du Chatbot.
- **Disponibilité:** Le site doit gérer les cas de "Rupture de stock" (via modification YAML rapide) pour éviter de promettre des produits indisponibles.

### Risk Mitigations

- **Hallucination IA:** Le System Prompt de Gemini doit interdire formellement d'inventer des produits ou des prix qui ne sont pas dans le JSON fourni.
- **Horaires Fériés:** Procédure simple documentée pour changer les horaires exceptionnels dans le YAML.

## Web App Specific Requirements

### Project-Type Overview

Chicken Family est une **Web App "One-Page"** focalisée sur la présentation du menu et l'interaction rapide. Bien que techniquement construite sur Symfony (MPA), l'expérience utilisateur doit être fluide comme une SPA (Single Page App).

### Technical Architecture Considerations

- **Architecture:** One-Page principale + Pages légales statiques. Pas de collecte de données personnelles (RGPD simplifié).
- **Browser Support:** **Modern Browsers Only** (Chrome, Safari, Firefox, Edge - versions récentes). Support Mobile (iOS/Android) prioritaire.
- **SEO Strategy (Impact First):**
    - Server-Side Rendering (SSR) natif Symfony pour indexation parfaite.
    - Structure sémantique HTML5 stricte.
    - Performance (Core Web Vitals) comme facteur de ranking.
    - Meta tags optimisés pour le partage social (Open Graph).
- **Accessibilité:** **Standard**.
    - Contraste couleurs suffisant (lisibilité soleil).
    - Navigation clavier fonctionnelle.
    - Attributs  sur toutes les images de produits.

### Implementation Considerations

- **Routing:** Une route principale  qui charge tout le contenu. Ancres  pour la navigation interne.
- **Assets:** Utilisation de formats d'images modernes (WebP) pour la performance.
- **Cache:** Stratégie de cache HTTP agressive pour les assets statiques (images, CSS, JS).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** "Experience MVP" - L'objectif n'est pas seulement fonctionnel, mais de fournir une expérience utilisateur supérieure (Vitesse, Design, IA) dès le lancement pour remplacer l'ancien site.
**Resource Requirements:** 1 Développeur Fullstack (Jamal) - Stack Symfony/Tailwind/Stimulus.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Sarah (Consultation Mobile Rapide + IA)
- Thomas (Redirection Click & Collect)
- Jamal (Maintenance via YAML)

**Must-Have Capabilities:**
- **Homepage One-Page:** Hero, Menu, Footer, Mentions légales.
- **Menu Dynamique:** Affichage des sections et produits depuis configuration YAML.
- **Chatbot IA:** Gemini intégré avec contexte menu et disclaimer allergènes.
- **Navigation:** Smooth scroll, Menu burger mobile, CTA Click & Collect.
- **Performance:** AssetMapper + Tailwind compilé.

### Post-MVP Features

**Phase 2 (Growth & Stability):**
- **Backoffice Admin:** Interface EasyAdmin ou custom pour éditer le menu.
- **Base de Données:** Migration YAML vers MySQL/PostgreSQL.
- **Tests:** Tests unitaires et fonctionnels (PHPUnit/Panther).

**Phase 3 (Expansion):**
- **Commande en ligne:** Intégration native (plus de redirection).
- **Compte Client:** Fidélité.

### Risk Mitigation Strategy

- **Technical Risks (IA):** Complexité et hallucinations. -> **Mitigation:** Prompt système restrictif et disclaimer obligatoire.
- **Market Risks (Adoption):** Les clients continuent d'appeler. -> **Mitigation:** Bouton "Click & Collect" plus visible que le numéro de téléphone.
- **Resource Risks (Maintenance):** Erreur de syntaxe YAML. -> **Mitigation:** Documentation claire et validation YAML par Symfony.

## Functional Requirements

### Menu & Produits

- **FR-001:** L'utilisateur peut consulter la liste complète des catégories de produits (Burgers, Wraps, Buckets, etc.).
- **FR-002:** L'utilisateur peut voir les détails d'un produit incluant son Nom, sa Description, son Prix Seul et son Prix Menu.
- **FR-003:** L'administrateur peut modifier les produits, les prix et les catégories via un fichier de configuration centralisé (YAML).

### Chatbot IA (Gemini)

- **FR-004:** L'utilisateur peut poser une question en langage naturel concernant le menu ou le restaurant via une interface de chat.
- **FR-005:** Le système répond aux questions en utilisant uniquement les données du menu actuellement configurées, sans hallucination.
- **FR-006:** Le système affiche systématiquement un avertissement générique concernant les allergènes (ex: "Consultez le staff") dans les réponses.
- **FR-007:** Le système limite le nombre de questions par utilisateur sur une période donnée (Rate Limiting) pour protéger l'API.

### Navigation & Interface

- **FR-008:** L'utilisateur peut naviguer rapidement vers une section spécifique du menu via une barre de navigation (Sticky sur Desktop, Burger sur Mobile).
- **FR-009:** L'utilisateur peut cliquer sur un bouton "Click & Collect" bien visible qui le redirige vers la plateforme de commande externe.
- **FR-010:** L'utilisateur peut consulter les informations pratiques (Adresse, Horaires d'ouverture théoriques, Téléphone, Réseaux sociaux) dans le pied de page.

### Mentions Légales

- **FR-011:** L'utilisateur peut consulter les Mentions Légales du site via un lien dédié.
- **FR-012:** L'utilisateur est informé via une mention visible que les photos des produits sont non contractuelles.

## Non-Functional Requirements

### Performance

- **NFR-001:** Le temps de chargement initial (LCP - Largest Contentful Paint) doit être inférieur à **2.5 secondes** sur une connexion 4G standard.
- **NFR-002:** Le score Lighthouse "Performance" doit être supérieur à **90/100** sur mobile et desktop.
- **NFR-003:** La navigation interne (scroll vers ancres) doit être fluide (60fps) et sans rechargement de page visible.

### Security

- **NFR-004:** La clé API Gemini ne doit **JAMAIS** être exposée côté client (JavaScript). Elle doit être stockée sécurisée côté serveur (Variables d'environnement) et appelée via un Proxy Backend.
- **NFR-005:** Le chatbot doit implémenter un Rate Limiting strict (ex: 10 requêtes / minute / IP) pour prévenir les abus et contrôler les coûts API.

### Maintenabilité

- **NFR-006:** Le fichier de configuration  doit être validé par un schéma strict lors du build/déploiement pour empêcher la mise en ligne d'erreurs de syntaxe.
- **NFR-007:** Le code CSS doit utiliser exclusivement les classes utilitaires Tailwind CSS (pas de CSS custom sauf nécessité absolue) pour garantir la cohérence du design system.

### Accessibility

- **NFR-008:** Les couleurs de texte et de fond doivent respecter un ratio de contraste minimum AA (WCAG) pour garantir la lisibilité en extérieur.
- **NFR-009:** Toutes les images de produits et éléments visuels porteurs d'information doivent avoir un attribut  descriptif.
