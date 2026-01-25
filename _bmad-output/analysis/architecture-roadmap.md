# 🏗️ Chicken Family - Architecture Roadmap V1

**Projet:** Refactoring site monolithique → Application Symfony modulaire  
**Date:** 2026-01-25  
**Responsable:** Jamal  
**Durée estimée V1:** 16-26 heures (8 jours à 2-3h/jour)

---

## 📋 Vue d'ensemble

### Objectif V1

Transformer le site monolithique actuel (406 lignes HTML) en application Symfony moderne, modulaire et scalable, tout en préservant le design existant.

### Stack Technique Validée

- **Backend:** Symfony 6.4/7.x
- **Frontend:** Twig Components + Stimulus.js + AssetMapper
- **Styling:** Tailwind CSS (compilé)
- **Data V1:** YAML (migration DB prévue V2)
- **Infrastructure:** Docker
- **Deploy:** Git

### Contraintes & Principes

✅ Garder le design actuel (excellent)  
✅ Modulaire dès V1  
✅ Scalable pour V2 backoffice  
✅ Sécurité API Gemini (proxy backend)  
✅ Patterns connus (Sylius, DTOs, Assets)  
✅ Vitesse de développement

---

## 🗺️ Architecture Finale

### Structure de Dossiers

```
chicken-family/
├── docker-compose.yml
├── composer.json
├── .env / .env.local
│
├── config/
│   ├── packages/
│   │   ├── asset_mapper.yaml
│   │   └── rate_limiter.yaml
│   ├── menu.yaml                    # Data menu V1
│   └── services.yaml
│
├── src/
│   ├── Menu/                         # Feature: Menu
│   │   ├── Controller/
│   │   │   └── MenuController.php
│   │   ├── Service/
│   │   │   └── MenuProvider.php
│   │   ├── DTO/
│   │   │   ├── MenuItemDTO.php
│   │   │   └── MenuSectionDTO.php
│   │   └── Entity/                  # V2 uniquement
│   │
│   ├── Chat/                         # Feature: Chatbot IA
│   │   ├── Controller/
│   │   │   └── ChatController.php
│   │   └── Service/
│   │       └── GeminiService.php
│   │
│   └── Home/                         # Feature: Page accueil
│       └── Controller/
│           └── HomeController.php
│
├── templates/
│   ├── base.html.twig
│   ├── home/
│   │   └── index.html.twig
│   └── components/                   # Twig Components
│       ├── Navigation.html.twig
│       ├── Hero.html.twig
│       ├── MenuSection.html.twig
│       ├── MenuCard.html.twig
│       ├── ChatWidget.html.twig
│       └── Footer.html.twig
│
├── assets/
│   ├── app.js
│   ├── styles/
│   │   ├── app.css
│   │   └── tokens.css              # Design tokens (couleurs)
│   └── controllers/                 # Stimulus
│       ├── mobile-menu_controller.js
│       ├── chat-widget_controller.js
│       ├── smooth-scroll_controller.js
│       └── floating-animation_controller.js
│
└── public/
    └── assets/                      # Généré par AssetMapper
```

---

## 📅 ROADMAP D'IMPLÉMENTATION

### PHASE 0: FONDATIONS (2-4h) ⚙️

**Objectif:** Setup projet Symfony avec bonne structure

#### Étape 0.1: Initialiser Symfony

```bash
# Créer nouveau projet
composer create-project symfony/skeleton chicken-family
cd chicken-family

# Installer dépendances principales
composer require webapp
composer require symfony/asset-mapper symfony/stimulus-bundle
composer require symfony/yaml
```

#### Étape 0.2: Configurer Docker

```yaml
# docker-compose.yml
version: "3.8"
services:
  php:
    image: php:8.3-fpm
    volumes:
      - .:/var/www/chicken-family

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/chicken-family
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf
```

```bash
docker-compose up -d
```

#### Étape 0.3: Structure Feature-based

```bash
# Créer dossiers features
mkdir -p src/{Menu,Chat,Home}/{Controller,Service,DTO,Entity}
mkdir -p templates/{home,components}
mkdir -p assets/{styles,controllers}
```

#### Étape 0.4: AssetMapper Config

```yaml
# config/packages/asset_mapper.yaml
framework:
  asset_mapper:
    paths:
      - assets/
    excluded_patterns:
      - "*/tests/*"
```

**✅ Résultat:** Projet Symfony initialisé, structure prête

---

### PHASE 1: SÉCURITÉ & CORE (8-12h) 🔐

**Objectif:** Site fonctionnel SÉCURISÉ avec menu dynamique

#### Étape 1.1: Proxy Gemini (CRITIQUE) - 3-4h

**1.1.1 - Service Gemini**

```php
<?php
// src/Chat/Service/GeminiService.php
namespace App\Chat\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class GeminiService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private string $geminiApiKey
    ) {}

    public function chat(string $userMessage, array $menuData): string
    {
        $systemPrompt = sprintf(
            "Tu es l'expert menu de Chicken Family. SAVOIR : %s. " .
            "RÉPONDS: Plats du JSON uniquement. Gras (**). Concis. " .
            "Halal. 100%% Filet. Mar-Dim 18h30-23h.",
            json_encode($menuData, JSON_UNESCAPED_UNICODE)
        );

        $response = $this->httpClient->request('POST',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
            [
                'headers' => ['Content-Type' => 'application/json'],
                'query' => ['key' => $this->geminiApiKey],
                'json' => [
                    'contents' => [['parts' => [['text' => $userMessage]]]],
                    'systemInstruction' => ['parts' => [['text' => $systemPrompt]]]
                ]
            ]
        );

        $data = $response->toArray();
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Erreur de communication.';
    }
}
```

**1.1.2 - Controller Chat avec Rate Limiting**

```php
<?php
// src/Chat/Controller/ChatController.php
namespace App\Chat\Controller;

use App\Chat\Service\GeminiService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

class ChatController extends AbstractController
{
    #[Route('/api/chat', name: 'api_chat', methods: ['POST'])]
    public function chat(
        Request $request,
        GeminiService $gemini,
        RateLimiterFactory $anonymousApiLimiter
    ): JsonResponse
    {
        // Rate limiting: 10 req/min par IP
        $limiter = $anonymousApiLimiter->create($request->getClientIp());

        if (!$limiter->consume(1)->isAccepted()) {
            return $this->json([
                'error' => 'Trop de requêtes. Réessayez dans 1 minute.'
            ], 429);
        }

        $data = json_decode($request->getContent(), true);
        $userMessage = $data['message'] ?? '';

        if (empty($userMessage) || strlen($userMessage) > 500) {
            return $this->json(['error' => 'Message invalide'], 400);
        }

        $menuData = $this->getParameter('menu_items');
        $response = $gemini->chat($userMessage, $menuData);

        return $this->json(['response' => $response]);
    }
}
```

**1.1.3 - Configuration**

```yaml
# config/services.yaml
services:
  App\Chat\Service\GeminiService:
    arguments:
      $geminiApiKey: "%env(GEMINI_API_KEY)%"
```

```bash
# .env.local (JAMAIS commité !)
GEMINI_API_KEY=AIzaSy...VotreCleIci...
```

```yaml
# config/packages/rate_limiter.yaml
framework:
  rate_limiter:
    anonymous_api:
      policy: "sliding_window"
      limit: 10
      interval: "1 minute"
```

**✅ Checkpoint:** Tester `/api/chat` avec Postman/curl

---

#### Étape 1.2: Menu Data YAML + DTOs - 2-3h

**1.2.1 - Structure Data**

```yaml
# config/menu.yaml
parameters:
  menu_items:
    burgers_classiques:
      id: "poulet"
      title: "Burgers Classiques"
      subtitle: "6,90€ Seul / 8,90€ Menu"
      color: "yellow"
      items:
        - name: "Le Poulailler"
          desc: "Croustillant ou filet, cheddar, crudités"
          emoji: "🍔"
          priceSolo: "6,90€"
          priceMenu: "8,90€"
          priceDouble: "11,90€"

        - name: "L'Indien"
          desc: "Filet mariné aux épices, cheddar, crudités"
          emoji: "👳‍♂️"
          priceSolo: "6,90€"
          priceMenu: "8,90€"
          priceDouble: "11,90€"

    # ... autres sections
```

**1.2.2 - DTOs**

```php
<?php
// src/Menu/DTO/MenuItemDTO.php
namespace App\Menu\DTO;

readonly class MenuItemDTO
{
    public function __construct(
        public string $name,
        public string $description,
        public string $emoji,
        public ?string $priceSolo = null,
        public ?string $priceMenu = null,
        public ?string $priceDouble = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['desc'],
            emoji: $data['emoji'],
            priceSolo: $data['priceSolo'] ?? null,
            priceMenu: $data['priceMenu'] ?? null,
            priceDouble: $data['priceDouble'] ?? null,
        );
    }
}
```

```php
<?php
// src/Menu/DTO/MenuSectionDTO.php
namespace App\Menu\DTO;

readonly class MenuSectionDTO
{
    /**
     * @param MenuItemDTO[] $items
     */
    public function __construct(
        public string $id,
        public string $title,
        public string $subtitle,
        public string $color,
        public array $items,
    ) {}

    public static function fromArray(string $key, array $data): self
    {
        $items = array_map(
            fn(array $item) => MenuItemDTO::fromArray($item),
            $data['items']
        );

        return new self(
            id: $data['id'],
            title: $data['title'],
            subtitle: $data['subtitle'],
            color: $data['color'],
            items: $items
        );
    }
}
```

**1.2.3 - Service Provider**

```php
<?php
// src/Menu/Service/MenuProvider.php
namespace App\Menu\Service;

use App\Menu\DTO\MenuSectionDTO;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class MenuProvider
{
    public function __construct(
        private ParameterBagInterface $params
    ) {}

    /**
     * @return MenuSectionDTO[]
     */
    public function getAllSections(): array
    {
        $menuData = $this->params->get('menu_items');

        return array_map(
            fn(string $key, array $section) => MenuSectionDTO::fromArray($key, $section),
            array_keys($menuData),
            $menuData
        );
    }
}
```

---

#### Étape 1.3: Templates Modulaires - 3-4h

**1.3.1 - Base Layout**

```twig
{# templates/base.html.twig #}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Chicken Family - Snack Fresh Food Beaurains{% endblock %}</title>

    {% block stylesheets %}
        {{ importmap('app') }}
    {% endblock %}
</head>
<body class="overflow-x-hidden pt-16 lg:pt-20">

    <tux:Navigation />

    {% block content %}{% endblock %}

    <tux:Footer />

    <tux:ChatWidget />

    {% block javascripts %}
        {{ importmap('app') }}
    {% endblock %}
</body>
</html>
```

**1.3.2 - MenuCard Component**

```twig
{# templates/components/MenuCard.html.twig #}
<tux:MenuCard item>
    <div {{ attributes.defaults({
        class: 'bg-white rounded-2xl p-4 lg:p-6 shadow-md menu-card border border-brand-brown/5 flex flex-col group hover:-translate-y-2 transition-transform duration-300'
    }) }}>

        {# Image/Emoji #}
        <div class="h-32 lg:h-56 bg-brand-cream rounded-xl lg:rounded-2xl mb-4 lg:mb-6 flex items-center justify-center text-4xl lg:text-6xl group-hover:scale-110 transition-transform">
            <span>{{ item.emoji }}</span>
        </div>

        {# Nom #}
        <h4 class="font-bungee text-xs lg:text-2xl mb-1 lg:mb-3 uppercase leading-tight tracking-tighter">
            {{ item.name }}
        </h4>

        {# Description #}
        <p class="text-[10px] lg:text-sm text-brand-brown/70 flex-grow leading-tight">
            {{ item.description }}
        </p>

        {# Prix #}
        <div class="mt-4 pt-2 border-t border-brand-brown/10 text-[10px] lg:text-xs font-bold uppercase">
            {% if item.priceSolo %}
                <div class="flex justify-between">
                    <span>SEUL</span>
                    <span class="text-brand-orange">{{ item.priceSolo }}</span>
                </div>
            {% endif %}
            {% if item.priceMenu %}
                <div class="flex justify-between">
                    <span>MENU</span>
                    <span class="text-brand-orange">{{ item.priceMenu }}</span>
                </div>
            {% endif %}
            {% if item.priceDouble %}
                <p class="mt-1 text-brand-orange">Double : {{ item.priceDouble }}</p>
            {% endif %}
        </div>
    </div>
</tux:MenuCard>
```

**1.3.3 - Page Home**

```php
<?php
// src/Home/Controller/HomeController.php
namespace App\Home\Controller;

use App\Menu\Service\MenuProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(MenuProvider $menuProvider): Response
    {
        return $this->render('home/index.html.twig', [
            'menuSections' => $menuProvider->getAllSections(),
        ]);
    }
}
```

```twig
{# templates/home/index.html.twig #}
{% extends 'base.html.twig' %}

{% block content %}
    <tux:Hero />

    <main class="py-16 lg:py-24 px-4 bg-brand-cream space-y-32">
        {% for section in menuSections %}
            <tux:MenuSection :section="section" />
        {% endfor %}
    </main>
{% endblock %}
```

**✅ Résultat:** Site avec menu dynamique fonctionnel

---

### PHASE 2: INTERACTIVITÉ & POLISH (6-10h) 💫

**Objectif:** UX moderne avec interactions fluides

#### Étape 2.1: Stimulus Controllers - 3-4h

**2.1.1 - Mobile Menu Controller**

```javascript
// assets/controllers/mobile-menu_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu", "overlay"];

  toggle() {
    this.menuTarget.classList.toggle("active");
    this.overlayTarget.classList.toggle("active");
    document.body.classList.toggle("lock-scroll");
  }

  close() {
    this.menuTarget.classList.remove("active");
    this.overlayTarget.classList.remove("active");
    document.body.classList.remove("lock-scroll");
  }
}
```

**Usage dans Twig:**

```twig
<div data-controller="mobile-menu">
    <button
        data-action="click->mobile-menu#toggle"
        class="lg:hidden">
        ☰
    </button>

    <div data-mobile-menu-target="menu" class="fixed inset-0 translate-x-full transition-transform">
        {# Menu content #}
        <a href="#poulet" data-action="click->mobile-menu#close">Burgers</a>
    </div>

    <div data-mobile-menu-target="overlay" class="fixed inset-0 bg-black/50 opacity-0"></div>
</div>
```

**2.1.2 - Chat Widget Controller**

```javascript
// assets/controllers/chat-widget_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["window", "button", "input", "history"];
  static values = { open: Boolean };

  toggle() {
    this.openValue = !this.openValue;
  }

  openValueChanged() {
    if (this.openValue) {
      this.windowTarget.style.display = "flex";
      this.buttonTarget.style.display = "none";
      document.body.classList.add("lock-scroll");
      this.inputTarget.focus();
    } else {
      this.windowTarget.style.display = "none";
      this.buttonTarget.style.display = "flex";
      document.body.classList.remove("lock-scroll");
    }
  }

  async send(event) {
    event.preventDefault();

    const message = this.inputTarget.value.trim();
    if (!message) return;

    this.addMessage(message, true);
    this.inputTarget.value = "";

    const loader = this.addLoader();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await response.json();
      loader.remove();
      this.addMessage(data.response, false);
    } catch (error) {
      loader.remove();
      this.addMessage("Erreur de connexion. Réessayez.", false);
    }
  }

  addMessage(text, isUser) {
    const bubble = document.createElement("div");
    bubble.className = isUser
      ? "user-message message-bubble"
      : "bot-message message-bubble shadow-sm";
    bubble.textContent = text;

    this.historyTarget.appendChild(bubble);
    this.scrollToBottom();
  }

  addLoader() {
    const loader = document.createElement("div");
    loader.className =
      "bot-message message-bubble italic text-[10px] opacity-60";
    loader.innerHTML =
      '<div class="loader !w-3 !h-3"></div> Chef IA réfléchit...';
    this.historyTarget.appendChild(loader);
    this.scrollToBottom();
    return loader;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.historyTarget.scrollTop = this.historyTarget.scrollHeight;
    }, 100);
  }
}
```

**2.1.3 - Autres controllers (smooth-scroll, floating-animation)**

```javascript
// assets/controllers/smooth-scroll_controller.js
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  scroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
```

---

#### Étape 2.2: Tailwind Compilation - 2-3h

**2.2.1 - Installation**

```bash
npm install -D tailwindcss @tailwindcss/forms
npx tailwindcss init
```

**2.2.2 - Configuration**

```javascript
// tailwind.config.js
export default {
  content: ["./assets/**/*.js", "./templates/**/*.html.twig"],
  theme: {
    extend: {
      colors: {
        "brand-brown": "#3D2B1F",
        "brand-yellow": "#FFC244",
        "brand-orange": "#F57C00",
        "brand-cream": "#FFF9F0",
        "brand-red": "#B22222",
      },
      fontFamily: {
        bungee: ["Bungee", "cursive"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

**2.2.3 - CSS Entry Point**

```css
/* assets/styles/app.css */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@import "./tokens.css";
@import "./components.css";
```

```css
/* assets/styles/tokens.css */
:root {
  --brand-brown: #3d2b1f;
  --brand-yellow: #ffc244;
  --brand-orange: #f57c00;
  --brand-cream: #fff9f0;
  --brand-red: #b22222;
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--brand-cream);
  color: var(--brand-brown);
  scroll-behavior: smooth;
}

.font-bungee {
  font-family: "Bungee", cursive;
}
```

**2.2.4 - Build Process**

```json
// package.json
{
  "scripts": {
    "dev": "tailwindcss -i ./assets/styles/app.css -o ./public/build/app.css --watch",
    "build": "tailwindcss -i ./assets/styles/app.css -o ./public/build/app.css --minify"
  }
}
```

**✅ Résultat:** CSS optimisé (~10KB vs 3MB CDN)

---

### PHASE 3: TESTS & DEPLOY (2-3h) 🚀

#### Étape 3.1: Tests Manuels

- [ ] Navigation desktop/mobile
- [ ] Menu burger responsive
- [ ] Chat widget (ouvrir/fermer)
- [ ] Envoi message chat + réponse
- [ ] Smooth scroll vers sections
- [ ] Rate limiting (10 messages rapides)
- [ ] Performance Lighthouse (>90)

#### Étape 3.2: Deploy Production

```bash
# Build assets
npm run build

# Optimiser Composer
composer install --no-dev --optimize-autoloader

# Clear cache
php bin/console cache:clear --env=prod

# Git deploy
git add .
git commit -m "V1 Production Ready"
git push origin main
```

**✅ PRODUCTION V1 DÉPLOYÉE ! 🎉**

---

## 🔮 PRÉPARATION V2

### Migration Path YAML → Database

**Phase V2.1 - Entities**

```php
<?php
// src/Menu/Entity/MenuItem.php
namespace App\Menu\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class MenuItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(length: 10)]
    private string $emoji;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $priceSolo = null;

    // ... getters/setters
}
```

**Phase V2.2 - Repository au lieu de Provider**

```php
// Changement MINIMAL !
// V1:
$menuProvider->getAllSections();

// V2:
$menuRepository->findAllWithItems();
```

### Stratégie Tests V2

**Phase V2 Test.1 - Tests rétroactifs**

```php
// tests/Menu/Service/MenuProviderTest.php
class MenuProviderTest extends TestCase
{
    public function testGetAllSections(): void
    {
        // Tester code V1 existant
    }
}
```

**Phase V2 Test.2 - TDD strict**

- Tous nouveaux controllers = tests
- Toutes nouvelles features = tests
- Coverage minimum 80%

---

## 📊 RÉCAPITULATIF

### Temps Total Estimé

- **Phase 0:** 2-4h (setup)
- **Phase 1:** 8-12h (sécurité + core)
- **Phase 2:** 6-10h (interactivité)
- **Phase 3:** 2-3h (tests + deploy)

**TOTAL V1:** 18-29 heures

### Structure Finale

- 📁 3 Features (Menu, Chat, Home)
- 🎨 6+ Twig Components
- ⚡ 4 Stimulus Controllers
- 🔐 1 Service sécurisé (Gemini)
- 📊 2 DTOs
- 🎯 1 YAML config menu

### Gains vs Monolithe

- ✅ 406 lignes → ~20-50 lignes/fichier
- ✅ 3MB Tailwind CDN → 10KB compilé
- ✅ Clé API exposée → Proxy sécurisé
- ✅ JS inline → Controllers organisés
- ✅ HTML pur → Components réutilisables

### Prêt pour V2

- ✅ Feature-based (ajouter features facilement)
- ✅ YAML → DB (migration path claire)
- ✅ Structure tests (ready to test)
- ✅ Backoffice (ajout d'admin bundle)

---

## 🎯 CHECKLIST DE DÉMARRAGE

### Avant de commencer

- [ ] Backup du fichier HTML actuel
- [ ] Git repository initialisé
- [ ] Docker installé et fonctionnel
- [ ] Clé API Gemini obtenue
- [ ] Node.js installé (npm)

### Phase 0 (Jour 1)

- [ ] Projet Symfony créé
- [ ] Docker configuré et lancé
- [ ] Structure dossiers créée
- [ ] AssetMapper configuré

### Phase 1 (Jours 2-4)

- [ ] GeminiService implémenté
- [ ] ChatController + rate limiting
- [ ] menu.yaml créé
- [ ] DTOs créés
- [ ] MenuProvider créé
- [ ] Templates de base

### Phase 2 (Jours 5-7)

- [ ] 4 Stimulus controllers
- [ ] Tailwind compilé
- [ ] Animations CSS

### Phase 3 (Jour 8)

- [ ] Tests manuels passés
- [ ] Lighthouse score >90
- [ ] Deploy production

---

## 📚 RESSOURCES

### Documentation

- [Symfony UX](https://ux.symfony.com/)
- [AssetMapper](https://symfony.com/doc/current/frontend/asset_mapper.html)
- [Stimulus Handbook](https://stimulus.hotwired.dev/handbook/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Commandes Utiles

```bash
# Dev server
symfony serve -d

# Watch Tailwind
npm run dev

# Créer controller
php bin/console make:controller

# Clear cache
php bin/console cache:clear

# Debug routes
php bin/console debug:router
```

---

**🎉 Prêt à transformer Chicken Family en application Symfony moderne ! 🚀**

**Bon dev Jamal ! Tu as tout ce qu'il faut pour réussir ! 💪**
