# 🛒 Projet E-commerce – Backend

## 📌 Présentation

Ce projet est une application **e-commerce** développée initialement dans le cadre d’un **projet de groupe**.  
J’ai ensuite repris le projet en autonomie afin de le comprendre, le corriger et le faire évoluer techniquement.

Le travail de reprise a notamment porté sur :
- la **migration de la base de données alwaysdata vers MariaDB**,
- la prise en main et la réorganisation du backend,
- la **migration progressive du projet en TypeScript**,
- la compréhension et la clarification de la configuration globale du projet.

---

## 🚀 Fonctionnalités principales

- Authentification et gestion des utilisateurs
- Gestion des rôles (user, admin)
- Gestion des produits
- Gestion du panier
- Gestion des commandes
- Paiement en ligne via **Stripe**
- Webhooks Stripe
- API REST sécurisée
- Interaction avec une base de données relationnelle (MariaDB)

---

## 🛠️ Stack technique

- **Node.js**
- **Express**
- **TypeScript**
- **MariaDB**
- **JWT**
- **Stripe**
- SQL

---

## 🔄 Travail de reprise du projet

À l’origine, ce projet était un travail collaboratif.  
Dans un second temps, j’ai repris l’ensemble du projet afin de :

- analyser l’architecture existante,
- comprendre le fonctionnement des routes, contrôleurs et middlewares,
- **migrer la base de données vers MariaDB**,
- adapter et sécuriser les requêtes SQL,
- renforcer le typage avec TypeScript,
- améliorer la lisibilité et la maintenabilité du code.

Une réflexion a également été menée autour de la **containerisation avec Docker**, sans mise en place complète à ce stade.

---

## 🗄️ Base de données

La base de données utilisée est **MariaDB**.

Les interactions avec la base ont été réalisées :
- via le **client MariaDB / MySQL en ligne de commande**

Exemple de connexion en ligne de commande :

```bash
mysql -u USER -p -h HOST DATABASE_NAME

```
Le schéma de base de données est disponible dans backend/schema/schema.sql.

## 🗄️ Structure du projet 

ecommerce/
├── backend
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── schema
│   │   ├── schema.sql
│   │   └── test.sql
│   ├── src
│   │   ├── config
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── controllers
│   │   │   ├── authController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── productController.ts
│   │   │   └── stripeController.ts
│   │   ├── index.ts
│   │   ├── middlewares
│   │   │   ├── initCart.ts
│   │   │   ├── payment.ts
│   │   │   ├── security.ts
│   │   │   ├── uploadImage.ts
│   │   │   ├── verifyAuthToken.ts
│   │   │   └── verifyRole.ts
│   │   ├── models
│   │   │   ├── cartModel.ts
│   │   │   ├── orderModel.ts
│   │   │   ├── productModel.ts
│   │   │   └── userModel.ts
│   │   ├── routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── cartRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   └── stripeWebhook.ts
│   │   ├── types
│   │   │   ├── cart.ts
│   │   │   ├── express.d.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   ├── utils
│   │   │   └── emailSender.ts
│   │   └── validators
│   │       ├── authValidator.ts
│   │       ├── cartValidator.ts
│   │       └── productValidator.ts
│   ├── tsconfig.json
│   └── yarn.lock
├── documentation
│   └── Conception.excalidraw
├── frontend
├── README.md

```
## Installation et lancement

git clone <repo>

cd ecommerce/backend
npm install
npm run dev

```
## Améliorations envisagées

Mise en place complète de Docker et Docker Compose

Ajout de tests automatisés

Documentation de l’API (Swagger / OpenAPI)

Renforcement de la sécurité (rate limiting, refresh tokens)

Optimisation des performances

```
## Auteur

Projet repris et développé par Charlène, dans un objectif de consolidation des compétences en développement backend, bases de données et reprise de projet existant.

```
## Licence
Projet à usage pédagogique et démonstratif.