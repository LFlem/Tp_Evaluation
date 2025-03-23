# Application de Gestion de Projets
Une application web construite avec Next.js et Parse Server pour gérer des projets, des documents et des équipes.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Création et gestion complète des projets (CRUD)
- Gestion des membres d'équipe pour chaque projet
- Interface utilisateur responsive et intuitive

## Prérequis

- Node.js (v16+)
- npm ou yarn
- Compte Parse Server (ou installation locale de Parse Server)

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/LFlem/Tp_Evaluation.git
cd my_app
```

2. Installez les dépendances :

``` bash
npm install
# ou
yarn install
```

3. Créez un fichier ```.env.local``` à la racine du projet avec les variables suivantes :

``` bash
NEXT_PUBLIC_PARSE_APP_ID=votre_parse_app_id
NEXT_PUBLIC_PARSE_JS_KEY=votre_parse_js_key
NEXT_PUBLIC_PARSE_SERVER_URL=https://votre-parse-server-url/parse
```
## Configuration de Parse Server
### Option 1 : Utiliser Parse Server hébergé (Back4App, etc.)

1. Créez un compte sur une plateforme comme Back4App
2. Créez une nouvelle application
3. Récupérez vos clés d'API (Application ID et JavaScript Key)
4. Configurez les classes dans le Dashboard :

+ Classe User (par défaut)
+ Classe Project avec les champs :

    + name (String)
    + description (String)
    + dueDate (Date)
    + status (String)
    + owner (Pointer vers User)
    + teamMembers (Relation vers User)


## Option 2 : Installation locale de Parse Server

1. Suivez les instructions officielles pour configurer Parse Server localement
2. Créez les mêmes classes que dans l'Option 1

## Lancement de l'application

1. Démarrez le serveur de développement :

``` bash
npm run dev
# ou
yarn dev
```

2. Ouvrez votre navigateur à l'adresse http://localhost:3000

## Structure du projet
``` bash
my_app/
├── public/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── AddTeamMember.jsx
│   │   ├── ProjectLayout.jsx
│   │   └── TeamMembersList.jsx
│   ├── app/              # Pages de l'application (App Router)
│   │   ├── login/
│   │   ├── register/
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   ├── members/
│   │   │   │   ├── edit/
│   │   │   ├── new/
│   │   ├── layout.js
│   │   └── page.js
│   ├── lib/              # Utilitaires et configurations
│   │   └── parseClient.js
│   ├── styles/           # Fichiers CSS
│   └── models/           # Modèles de données Parse
│       └── Project.js
├── .env.local            # Variables d'environnement
├── next.config.js
└── package.json
```

## Routes de l'application

/ - Dashboard/Accueil
/login - Page de connexion
/register - Page d'inscription
/projects - Liste des projets
/projects/new - Création d'un nouveau projet
/projects/[id] - Détails d'un projet
/projects/[id]/edit - Modification d'un projet
/projects/[id]/members - Gestion des membres d'un projet

## Schéma de données
### User

- username (String)
- email (String)
- password (String)

### Project

- name (String)
- description (String)
- dueDate (Date)
- status (String) : "À faire", "En cours", "Terminé"
- owner (Pointer vers User)
- teamMembers (Relation vers User)

## Développement
### Ajout de fonctionnalités

1. Pour ajouter une nouvelle fonctionnalité, créez les composants nécessaires dans ```src/components```
2. Ajoutez les pages correspondantes dans ```src/app```
3. Mettez à jour les modèles si nécessaire dans ```src/models```

## Déploiement
Pour déployer l'application en production :
```bash
npm run build
npm start
# ou
yarn build
yarn start
```
Vous pouvez également déployer sur Vercel ou Netlify via leurs intégrations avec GitHub.
## Dépannage
### Problèmes de connexion à Parse Server

- Vérifiez que vos clés API sont correctes dans .env.local
- Assurez-vous que votre Parse Server est accessible

### Erreurs côté client

- Vérifiez la console du navigateur pour les messages d'erreur
- Assurez-vous que toutes les dépendances sont installées

### Ressources

Documentation Next.js
Documentation Parse JavaScript SDK
Documentation Parse Server

Licence
MIT