# Création de Modules Multiples avec Lessons

## Vue d'ensemble

Cette fonctionnalité permet à l'administrateur de créer **plusieurs modules d'un coup** avec leurs **lessons associées** pour une formation donnée.

## Points clés

1. **Formation CRUD** : Simplifié - création de la formation uniquement selon les champs de la migration (ni plus ni moins)
2. **Modules en masse** : Permet la création de plusieurs modules avec leurs lessons en une seule requête
3. **Flexible** : L'admin peut créer autant de modules qu'il souhaite, chacun avec ses propres lessons

## Endpoint

```
POST /api/modules/bulk
```

## Structure de la requête

```json
{
  "formation_id": "uuid-de-la-formation",
  "modules": [
    {
      "title": "Module 1: Introduction",
      "description": "Description du module 1",
      "instructor_id": "uuid-de-l-instructeur",
      "order": 1,
      "lessons": [
        {
          "title": "Leçon 1.1: Présentation",
          "content": "Contenu de la leçon",
          "link": "https://youtube.com/...",
          "order": 1
        },
        {
          "title": "Leçon 1.2: Concepts de base",
          "content": "Contenu de la leçon",
          "order": 2
        }
      ]
    },
    {
      "title": "Module 2: Avancé",
      "description": "Description du module 2",
      "order": 2,
      "lessons": [
        {
          "title": "Leçon 2.1: Techniques avancées",
          "content": "Contenu de la leçon",
          "order": 1
        }
      ]
    },
    {
      "title": "Module 3: Pratique",
      "description": "Description du module 3",
      "order": 3,
      "lessons": [
        {
          "title": "Leçon 3.1: Exercice pratique 1",
          "content": "Contenu de la leçon",
          "order": 1
        },
        {
          "title": "Leçon 3.2: Exercice pratique 2",
          "content": "Contenu de la leçon",
          "order": 2
        }
      ]
    }
  ]
}
```

## Champs requis

### Niveau formation_id
- `formation_id` : UUID de la formation (requis)
- `modules` : Tableau d'objets modules (requis, minimum 1 module)

### Niveau module
- `title` : Titre du module (requis, max 255 caractères)
- `description` : Description du module (optionnel)
- `instructor_id` : UUID de l'instructeur par défaut (optionnel)
- `order` : Ordre du module (optionnel, entier >= 1)
- `lessons` : Tableau de lessons (optionnel)

### Niveau lesson
- `title` : Titre de la leçon (requis si lessons présentes, max 255 caractères)
- `content` : Contenu de la leçon (optionnel)
- `link` : Lien vers ressource externe (optionnel, doit être une URL valide)
- `order` : Ordre de la leçon (optionnel, entier >= 1)

## Réponse

### Succès (201 Created)

```json
{
  "status": "success",
  "message": "Modules created successfully",
  "data": [
    {
      "id": "uuid-module-1",
      "title": "Module 1: Introduction",
      "description": "Description du module 1",
      "formation_id": "uuid-de-la-formation",
      "order": 1,
      "default_instructor": {
        "id": "uuid-instructeur",
        "name": "Nom de l'instructeur"
      },
      "lessons": [
        {
          "id": "uuid-lesson-1",
          "title": "Leçon 1.1: Présentation",
          "content": "Contenu de la leçon",
          "module_id": "uuid-module-1",
          "link": "https://youtube.com/...",
          "order": 1,
          "created_at": "2025-11-13T10:00:00.000000Z",
          "updated_at": "2025-11-13T10:00:00.000000Z"
        }
      ],
      "created_at": "2025-11-13T10:00:00.000000Z",
      "updated_at": "2025-11-13T10:00:00.000000Z"
    }
  ]
}
```

### Erreur de validation (422 Unprocessable Entity)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "formation_id": [
      "L'ID de la formation est requis."
    ],
    "modules": [
      "Vous devez fournir au moins un module."
    ],
    "modules.0.title": [
      "Le titre du module est requis."
    ]
  }
}
```

## Workflow d'utilisation

### Étape 1 : Créer une formation

```http
POST /api/formations
Content-Type: application/json

{
  "title": "Formation Python",
  "description": "Apprendre Python de A à Z",
  "learning_objectives": "Maîtriser les bases de Python",
  "target_skills": ["Python", "Programmation", "OOP"],
  "level": "easy",
  "duration": 40,
  "price": 99.99
}
```

### Étape 2 : Créer plusieurs modules avec leurs lessons

```http
POST /api/modules/bulk
Content-Type: application/json

{
  "formation_id": "uuid-recu-de-l-etape-1",
  "modules": [
    {
      "title": "Module 1",
      "order": 1,
      "lessons": [...]
    },
    {
      "title": "Module 2",
      "order": 2,
      "lessons": [...]
    }
  ]
}
```

## Avantages

1. **Gain de temps** : Créez tous vos modules en une seule requête
2. **Atomicité** : Toute la création se fait dans une transaction - soit tout passe, soit rien
3. **Flexibilité** : Créez autant de modules que nécessaire avec autant de lessons par module
4. **Organisation** : Définissez l'ordre de vos modules et lessons dès la création

## Notes techniques

- Toutes les opérations sont effectuées dans une **transaction DB**
- Si une erreur survient, **toutes les créations sont annulées** (rollback)
- Les modules sont créés avec leurs lessons de manière **imbriquée**
- Le champ `order` permet d'organiser les modules et lessons dans l'ordre souhaité
