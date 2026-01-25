# Chicken Family - Documentation Projet

**Généré le:** 2026-01-24T18:13:34+01:00  
**Type de projet:** Site vitrine monolithique (Single-page Application)  
**Technologies:** HTML, CSS (Tailwind CDN), JavaScript Vanilla  
**État:** Brownfield - Refactoring requis

---

## 📋 Vue d'ensemble

**Chicken Family** est un site vitrine pour un fast-food spécialisé en poulet halal à Beaurains.

### Objectif métier

- Présenter le menu complet (Burgers, Kebabs, Hot-Dogs, Salades, Boxs)
- Afficher les horaires et informations de contact
- Proposer un chatbot IA pour conseiller les clients sur leurs choix

### Caractéristiques actuelles

- ✅ Design moderne et responsive (mobile-first)
- ✅ Menu interactif généré dynamiquement avec JavaScript
- ✅ Chatbot intégré utilisant l'API Gemini
- ✅ Navigation mobile avec overlay fullscreen
- ✅ Animations CSS (floating, hover effects)
- ⚠️ **Tout le code dans un seul fichier HTML (406 lignes)**

---

## 🏗️ Architecture actuelle

### Structure monolithique

```
chickent-family-index.html (406 lignes)
├── <head> - Meta, CDN Tailwind, Fonts, Styles inline
├── <style> - 83 lignes de CSS custom
├── <body>
│   ├── Navigation (fixed header)
│   ├── Menu mobile (overlay)
│   ├── Hero section
│   ├── Main menu (généré par JS)
│   ├── Chatbot widget
│   └── Footer
└── <script> - 170 lignes de JavaScript
    ├── menuData (données structurées)
    ├── renderMenu()
    ├── toggleMobileMenu()
    ├── toggleChat()
    ├── callGemini() - API Gemini
    └── askGemini()
```

### Problèmes identifiés

1. **Maintenabilité** ⚠️
   - Tout dans un seul fichier rend les modifications complexes
   - Mélange de préoccupations (structure, style, comportement, données)
   - Difficulté à naviguer dans le code (406 lignes)

2. **Réutilisabilité** ⚠️
   - Impossible de réutiliser des composants sur d'autres pages
   - Styles CSS custom non séparés de Tailwind
   - Fonctions JavaScript non modulaires

3. **Performance** ⚠️
   - Chargement de Tailwind CDN complet (non optimisé)
   - Inline CSS et JS (pas de mise en cache)
   - Pas de minification

4. **Sécurité** 🔴
   - **Clé API Gemini exposée côté client** (ligne 369: `const apiKey = "";`)
   - Risque d'abus si la clé est renseignée

5. **SEO** ⚠️
   - Contenu menu généré en JavaScript (peut nuire au référencement)
   - Pas de meta descriptions riches
   - Images externes (Unsplash) non optimisées

---

## 🎨 Design System

### Palette de couleurs (CSS Variables)

```css
--brand-brown: #3d2b1f /* Primaire - Navigation, textes */
  --brand-yellow: #ffc244 /* Secondaire - Hero, accents */
  --brand-orange: #f57c00 /* Tertiaire - CTA, hover */ --brand-cream: #fff9f0
  /* Background */ --brand-red: #b22222 /* Kebab section, boutons commander */;
```

### Typographie

- **Affichage:** Bungee (cursive, pour titres)
- **Corps:** Inter (sans-serif, 400/600/700)
- **Source:** Google Fonts CDN

### Composants UI

1. **Navigation**
   - Fixed header (h-16 lg:h-20)
   - Menu burger mobile (sliding overlay)
   - Liens de navigation desktop (hover effects)

2. **Hero Section**
   - Background jaune avec clip-path diagonal
   - Image produit avec animation floating
   - CTA "Commander" proéminent

3. **Cards Menu**
   - Grid responsive (2-3-4 colonnes)
   - Hover lift effect (translateY + shadow)
   - Emojis pour illustrations

4. **Chatbot Widget**
   - Fixed bottom-right
   - Fenêtre modale fullscreen mobile
   - Intégration API Gemini avec system prompt

---

## 📊 Données Menu

### Structure menuData (JavaScript)

```javascript
{
  id: string,           // Anchor pour navigation
  title: string,        // Titre de section
  subtitle: string,     // Prix/description
  color: string,        // "yellow|orange|red|brown"
  type?: string,        // "upgrade|list" (optionnel)
  items: [
    {
      name: string,     // Nom du produit
      desc: string,     // Description
      solo?: string,    // Prix seul
      menu?: string,    // Prix menu
      double?: string,  // Prix double
      img: string       // Emoji
    }
  ]
}
```

### Sections menu (12 catégories)

1. Burgers Classiques (3 items)
2. Burgers Premiums (7 items)
3. Burgers Deluxes (2 items)
4. Kebab Family (4 items)
5. Kebabs du Monde (6 items)
6. Nos Hot-Dogs (2 items)
7. Nos Salades (1 item)
8. Nos Boxs (3 items)
9. Menu Enfant (1 item)
10. Big Menu (6 options)
11. Suppléments (6 options)

**Total:** ~45 produits gérés dynamiquement

---

## ⚙️ Fonctionnalités techniques

### Navigation

- **Desktop:** Links horizontaux avec smooth scroll
- **Mobile:** Menu overlay fullscreen avec animation slide
- **Scroll lock:** Empêche le scroll body quand menu ouvert

### Menu dynamique

- Génération HTML à partir de `menuData` au `window.onload`
- Template strings ES6 avec conditions ternaires
- Rendering adaptatif selon le type (card, list, upgrade)

### Chatbot IA

- **API:** Gemini 2.5 Flash (Preview 09-2025)
- **Fonction:** Conseiller les clients sur les choix de menu
- **System Prompt:**
  ```
  Tu es l'expert menu de Chicken Family.
  SAVOIR : ${JSON.stringify(menuData)}.
  RÉPONDS: Plats du JSON uniquement. Gras (**). Concis.
  Halal. 100% Filet. Mar-Dim 18h30-23h.
  ```
- **UI:** Bulles de message style chat (bot/user differentiated)
- **Mobile:** Fullscreen avec fix viewport pour clavier

### Animations CSS

- **Floating:** Hero image (3s loop translateY)
- **Hover:** Menu cards lift + shadow
- **Transitions:** Menu mobile slide, chat window scale
- **Loader:** Spinner pour réponse chatbot

---

## 🔧 Stack technique

### Frontend

| Technologie  | Version      | Source                | Usage                            |
| ------------ | ------------ | --------------------- | -------------------------------- |
| HTML5        | -            | -                     | Structure                        |
| Tailwind CSS | Latest (CDN) | `cdn.tailwindcss.com` | Styling utility-first            |
| CSS Custom   | -            | Inline `<style>`      | Variables, animations, overrides |
| JavaScript   | ES6+         | Vanilla               | Logique, rendering, API calls    |
| Marked.js    | Latest (CDN) | `cdn.jsdelivr.net`    | Markdown parsing (chatbot)       |
| Google Fonts | -            | fonts.googleapis.com  | Bungee + Inter                   |

### API Externes

| Service           | Usage                   | Authentification         |
| ----------------- | ----------------------- | ------------------------ |
| Google Gemini API | Chatbot conseils menu   | API Key (⚠️ côté client) |
| Unsplash          | Image hero (temporaire) | Public CDN               |

### Pas de framework

- ❌ Pas de build system (Vite, Webpack)
- ❌ Pas de preprocessor CSS (Sass, PostCSS)
- ❌ Pas de module bundler
- ❌ Pas de TypeScript
- ❌ Pas de tests

---

## 📱 Responsive Design

### Breakpoints (Tailwind defaults)

- **Mobile:** < 640px (default)
- **Tablet:** ≥ 768px (md:)
- **Desktop:** ≥ 1024px (lg:)

### Adaptations

| Composant  | Mobile           | Desktop           |
| ---------- | ---------------- | ----------------- |
| Navigation | Burger menu      | Liens horizontaux |
| Hero       | Stacked vertical | Flex row (60/40)  |
| Menu grid  | 2 colonnes       | 3-4 colonnes      |
| Chatbot    | Fullscreen       | 380px window      |
| Footer     | Stacked          | 4 colonnes        |

### Meta viewport

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
/>
```

⚠️ `user-scalable=0` désactive le zoom (mauvaise pratique accessibilité)

---

## 🚀 Améliorations recommandées

### Priorité HAUTE 🔴

1. **Séparer le code**
   - Extraire CSS dans `styles.css`
   - Extraire JavaScript dans `app.js`
   - Extraire données menu dans `menu-data.json`

2. **Sécuriser l'API**
   - Déplacer appel Gemini vers un backend (PHP, Node.js)
   - Proxy API pour masquer la clé
   - Variables d'environnement `.env`

3. **Optimiser Tailwind**
   - Passer de CDN à build local avec PurgeCSS
   - Générer uniquement les classes utilisées
   - Réduire la taille de 3MB à ~10KB

### Priorité MOYENNE 🟠

4. **Modulariser JavaScript**
   - Créer des modules ES6 (menu.js, chat.js, navigation.js)
   - Utiliser import/export
   - Bundler avec Vite ou Parcel

5. **Améliorer SEO**
   - Server-side rendering du menu (ou pre-render)
   - Meta tags OpenGraph
   - Schema.org markup (Restaurant, Menu)
   - Sitemap XML

6. **Accessibilité**
   - Retirer `user-scalable=0`
   - Ajouter ARIA labels
   - Focus trapping dans modales
   - Keyboard navigation

### Priorité BASSE 🟢

7. **Tests**
   - Tests unitaires (fonctions JS)
   - Tests E2E (navigation, chatbot)
   - Tests responsiveness

8. **Performance**
   - Lazy loading images
   - Code splitting JavaScript
   - Service Worker pour cache
   - Lighthouse score > 90

9. **Fonctionnalités**
   - Système de commande en ligne réel
   - Intégration maps pour localisation
   - Galerie photos professionnelles
   - Multi-langue (FR/EN/AR)

---

## 📂 Structure cible recommandée

```
chicken-family/
├── public/
│   ├── index.html (structure seulement)
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── styles/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── scripts/
│   │   ├── menu.js
│   │   ├── navigation.js
│   │   ├── chat.js
│   │   └── main.js
│   └── data/
│       └── menu-data.json
├── server/
│   └── api/
│       └── chat-proxy.php (ou .js)
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔗 URLs et Liens

### Contact

- **Téléphone:** [07 60 56 81 03](tel:0760568103)
- **Adresse:** 33 rue de la République, 62217 Beaurains

### Réseaux sociaux

- Instagram: `#` (à configurer)
- Facebook: `#` (à configurer)
- Snapchat: `#` (à configurer)

### Liens externes actuels

- Tailwind CDN: `https://cdn.tailwindcss.com`
- Marked.js: `https://cdn.jsdelivr.net/npm/marked/marked.min.js`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Bungee&family=Inter`
- Unsplash Image: `https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec`
- Gemini API: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025`

---

## ⚠️ Risques et Limitations

### Sécurité

- 🔴 **CRITIQUE:** Clé API exposée côté client
- 🟠 Pas de validation des inputs chatbot
- 🟠 Pas de rate limiting sur appels API

### Technique

- 🟠 Tailwind CDN (3MB téléchargés à chaque visite)
- 🟠 Pas de fallback si CDN inaccessibles
- 🟠 Code non minifié, non optimisé

### Business

- 🟡 Bouton "Commander" ne pointe nulle part (`href="#"`)
- 🟡 Liens réseaux sociaux vides
- 🟡 Pas de tracking analytics

---

## 📈 Métriques actuelles (estimées)

| Métrique            | Valeur  | Statut    |
| ------------------- | ------- | --------- |
| Lignes de code HTML | 232     | 🟡        |
| Lignes de code CSS  | 83      | 🟢        |
| Lignes de code JS   | 170     | 🟡        |
| **Total**           | **485** | 🟡        |
| Taille fichier      | ~31KB   | 🟢        |
| Taille avec CDN     | ~3MB+   | 🔴        |
| Lighthouse Score    | ?       | À mesurer |

---

## 📚 Prochaines étapes

D'après le workflow BMad Method :

1. ✅ **Documentation** (ce fichier) - TERMINÉ
2. 🔄 **Brainstorm** - Session créative pour améliorations
3. 📝 **PRD** - Product Requirements Document
4. 🎨 **UX Design** - Maquettes améliorées
5. 🏗️ **Architecture** - Plan de refactoring
6. 📦 **Epics & Stories** - Découpage en tâches
7. ⚙️ **Implementation** - Développement

---

**Généré par:** BMad Method (workflow document-project)  
**Dernière mise à jour:** 2026-01-24T18:13:34+01:00
