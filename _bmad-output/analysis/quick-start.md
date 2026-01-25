# 🎯 Chicken Family - Quick Start Guide

**Pour démarrer RAPIDEMENT demain matin !**

---

## ⚡ PREMIÈRE SESSION (2-3h)

### 🚀 Commandes à exécuter

```bash
# 1. Créer le projet
composer create-project symfony/skeleton:/var/www/chicken-family
cd chicken-family

# 2. Installer dépendances
composer require webapp
composer require symfony/asset-mapper symfony/stimulus-bundle
composer require symfony/yaml symfony/http-client

# 3. Créer structure
mkdir -p src/{Menu,Chat,Home}/{Controller,Service,DTO}
mkdir -p templates/{home,components}
mkdir -p assets/{styles,controllers}

# 4. Initialiser Git
git init
git add .
git commit -m "Initial Symfony setup"
```

---

## 📋 FICHIERS À CRÉER EN PREMIER

### 1. Docker (si besoin)

Copier le `docker-compose.yml` de la roadmap complète

### 2. Menu YAML

Copier tes données menu actuelles dans `config/menu.yaml`

### 3. .env.local

```bash
GEMINI_API_KEY=ta_cle_ici
```

---

## 🎯 ORDRE DE DÉVELOPPEMENT

**Jour 1-2:** GeminiService + ChatController (SÉCURITÉ D'ABORD)  
**Jour 3-4:** Menu YAML + DTOs + Templates  
**Jour 5-6:** Stimulus controllers  
**Jour 7:** Tailwind compilation  
**Jour 8:** Tests + deploy

---

## 📚 DOCUMENTS DE RÉFÉRENCE

**Document principal:**
`_bmad-output/analysis/architecture-roadmap.md`

**Brainstorming complet:**
`_bmad-output/analysis/brainstorming-session-2026-01-24.md`

**Workflow status:**
`_bmad-output/planning-artifacts/bmm-workflow-status.yaml`

---

## 🆘 EN CAS DE BLOCAGE

1. Relis la section concernée dans la roadmap
2. Check la doc Symfony officielle
3. Teste avec des var_dump() / dd()
4. Consulte `php bin/console debug:*`

---

## ✅ CHECKLIST RAPIDE

- [ ] Symfony installé
- [ ] Git initialisé
- [ ] Structure dossiers créée
- [ ] .env.local avec clé Gemini
- [ ] Docker UP (si utilisé)

**TU ES PRÊT ! GO GO GO ! 🚀**
