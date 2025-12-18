# Database Seeders and Factories for Certification Exam System

## Overview

This document describes the database seeders and factories created for the certification exam generation system.

## Seeders

### ChapterSeeder

The `ChapterSeeder` creates realistic test data for certification exams:

-   **Purpose**: Creates chapters and questions for certifications
-   **Usage**: `php artisan db:seed --class=ChapterSeeder`
-   **What it creates**:
    -   5 chapters per certification with realistic topics:
        -   Fundamentals and Core Concepts (15 questions)
        -   Security and Best Practices (12 questions)
        -   Implementation and Configuration (18 questions)
        -   Troubleshooting and Maintenance (10 questions)
        -   Advanced Topics and Integration (8 questions)
    -   Questions with varied difficulties (easy, medium, hard)
    -   Both single-choice and multiple-choice questions
    -   Realistic question content and answers

**Note**: If no certifications exist, the seeder will create 3 sample certifications first.

## Factories

### ChapterFactory

Enhanced factory for creating chapters with various configurations:

```php
// Basic chapter
Chapter::factory()->create();

// Chapter without description
Chapter::factory()->withoutDescription()->create();

// Chapter with specific order
Chapter::factory()->withOrder(3)->create();

// Chapter for specific certification
Chapter::factory()->forCertification($certificationId)->create();

// Chapter with exam-focused realistic content
Chapter::factory()->examFocused()->create();

// Multiple chapters with sequential ordering
Chapter::factory()->sequentialOrder(1)->count(5)->create();
```

### QuestionFactory (Enhanced)

Enhanced factory for creating questions with certification-specific features:

```php
// Basic question
Question::factory()->create();

// Question for specific chapter
Question::factory()->forChapter($chapterId)->create();

// Questions by difficulty
Question::factory()->easy()->create();      // 1-3 points
Question::factory()->medium()->create();    // 3-6 points
Question::factory()->hard()->create();      // 6-10 points

// Questions by answer pattern
Question::factory()->singleChoice()->create();    // One correct answer
Question::factory()->multipleChoice()->create();  // Multiple correct answers

// Realistic exam questions
Question::factory()->examRealistic()->create();

// Combined states
Question::factory()
    ->forChapter($chapterId)
    ->hard()
    ->multipleChoice()
    ->create();
```

## Testing

### Test Files Created

1. **ChapterFactoryTest** - Tests all Chapter factory methods
2. **QuestionFactoryTest** - Tests all Question factory methods
3. **ChapterSeederTest** - Tests the ChapterSeeder functionality
4. **ExamGenerationWithSeedersTest** - Integration tests using seeders and factories

### Running Tests

```bash
# Run all factory and seeder tests
php artisan test tests/Unit/ChapterFactoryTest.php tests/Unit/QuestionFactoryTest.php tests/Feature/ChapterSeederTest.php tests/Feature/ExamGenerationWithSeedersTest.php

# Run individual test files
php artisan test tests/Feature/ChapterSeederTest.php
php artisan test tests/Unit/ChapterFactoryTest.php
```

## Usage Examples

### Creating Test Data for Development

```php
// Create a certification with chapters and questions
$certification = Certification::factory()->create();

$chapters = Chapter::factory()
    ->forCertification($certification->id)
    ->examFocused()
    ->sequentialOrder()
    ->count(3)
    ->create();

foreach ($chapters as $chapter) {
    Question::factory()
        ->forChapter($chapter->id)
        ->examRealistic()
        ->count(10)
        ->create();
}
```

### Creating Exam Configuration Test Data

```php
$certification = Certification::factory()->create();
$chapters = Chapter::factory()->forCertification($certification->id)->count(3)->create();

// Create questions for each chapter
foreach ($chapters as $chapter) {
    Question::factory()->forChapter($chapter->id)->count(15)->create();
}

// Create exam configuration
QuizConfiguration::factory()->create([
    'configurable_type' => Certification::class,
    'configurable_id' => $certification->id,
    'chapter_distribution' => [
        $chapters[0]->id => 5,
        $chapters[1]->id => 8,
        $chapters[2]->id => 7,
    ],
    'time_limit' => 60,
    'passing_score' => 70,
]);
```

## Database Seeder Integration

The `ChapterSeeder` is integrated into the main `DatabaseSeeder` but commented out by default. To enable it:

```php
// In database/seeders/DatabaseSeeder.php
$this->call([
    RoleAndPermissionSeeder::class,
    UserSeeder::class,
    // CategorySeeder::class,
    // FormationSeeder::class,
    // CertificationSeeder::class,
    ChapterSeeder::class,     // Uncomment this line
    // ModuleSeeder::class,
    // ...
]);
```

## Data Structure

### Question Types

-   **Type Field**: Always 'certification' for certification questions
-   **Answer Patterns**:
    -   Single Choice: One answer with `correct: true`
    -   Multiple Choice: Two or more answers with `correct: true`

### Realistic Content

The seeder creates realistic exam content including:

-   Professional question phrasing
-   Industry-relevant topics
-   Appropriate difficulty progression
-   Realistic answer options with common distractors

## Tests avec Postman

### Configuration de Base

**Base URL**: `http://localhost:8000/api/v1/admin`

**Headers requis**:

```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {your_token}
```

### 1. Gestion des Chapitres

#### Lister les chapitres d'une certification

```http
GET /certifications/{certification_id}/chapters
```

**Exemple de réponse**:

```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Fundamentals and Core Concepts",
            "description": "Basic principles and foundational knowledge",
            "order": 1,
            "questions_count": 15
        }
    ]
}
```

#### Créer un nouveau chapitre

```http
POST /certifications/{certification_id}/chapters
```

**Body**:

```json
{
    "name": "Security and Best Practices",
    "description": "Security protocols and authentication methods",
    "order": 2
}
```

#### Modifier un chapitre

```http
PUT /chapters/{chapter_id}
```

**Body**:

```json
{
    "name": "Advanced Security Concepts",
    "description": "Advanced security implementation techniques"
}
```

#### Supprimer un chapitre

```http
DELETE /chapters/{chapter_id}
```

### 2. Gestion des Questions

#### Lister les questions d'un chapitre

```http
GET /chapters/{chapter_id}/questions
```

#### Créer une nouvelle question

```http
POST /chapters/{chapter_id}/questions
```

**Body pour question à choix unique**:

```json
{
    "question": "What is the primary purpose of implementing proper authentication mechanisms?",
    "answers": [
        {
            "id": 1,
            "text": "Implement multi-factor authentication and secure session management",
            "correct": true
        },
        {
            "id": 2,
            "text": "Use simple password-only authentication",
            "correct": false
        },
        {
            "id": 3,
            "text": "Store passwords in plain text for easy access",
            "correct": false
        },
        {
            "id": 4,
            "text": "Disable all security measures for better performance",
            "correct": false
        }
    ],
    "difficulty": "medium",
    "type": "certification",
    "points": 5
}
```

**Body pour question à choix multiples**:

```json
{
    "question": "Which of the following are security best practices? (Select all that apply)",
    "answers": [
        {
            "id": 1,
            "text": "Use HTTPS for all communications",
            "correct": true
        },
        {
            "id": 2,
            "text": "Implement input validation",
            "correct": true
        },
        {
            "id": 3,
            "text": "Store sensitive data in source code",
            "correct": false
        },
        {
            "id": 4,
            "text": "Disable all logging for performance",
            "correct": false
        }
    ],
    "difficulty": "hard",
    "type": "certification",
    "points": 8
}
```

#### Voir une question spécifique

```http
GET /chapters/{chapter_id}/questions/{question_id}
```

#### Modifier une question

```http
PUT /chapters/{chapter_id}/questions/{question_id}
```

#### Supprimer une question

```http
DELETE /chapters/{chapter_id}/questions/{question_id}
```

### 3. Configuration d'Examen

#### Voir la configuration actuelle

```http
GET /certifications/{certification_id}/exam-configuration
```

**Exemple de réponse**:

```json
{
    "certification": {
        "id": "uuid",
        "name": "Advanced Web Development Certification"
    },
    "chapters": [
        {
            "id": "uuid",
            "name": "Fundamentals and Core Concepts",
            "description": "Basic principles",
            "questions_count": 15
        }
    ],
    "configuration": {
        "total_questions": 23,
        "chapter_distribution": {
            "chapter-uuid-1": 10,
            "chapter-uuid-2": 8,
            "chapter-uuid-3": 5
        },
        "time_limit": 90,
        "passing_score": 75
    }
}
```

#### Configurer un examen

```http
PUT /certifications/{certification_id}/exam-configuration
```

**Body**:

```json
{
    "total_questions": 23,
    "chapter_distribution": {
        "chapter-uuid-1": 10,
        "chapter-uuid-2": 8,
        "chapter-uuid-3": 5
    },
    "time_limit": 90,
    "passing_score": 75
}
```

**Validation importante** :

-   `total_questions` est obligatoire
-   La somme des questions par chapitre doit égaler `total_questions`
-   Chaque chapitre ne peut pas demander plus de questions qu'il n'en contient

### 4. Génération et Exécution d'Examens

#### Générer un examen (aperçu)

```http
GET /certifications/{certification_id}/exam/generate
```

**Exemple de réponse**:

```json
{
    "success": true,
    "message": "Exam generated successfully",
    "data": {
        "certification_id": "uuid",
        "questions": [
            {
                "id": "question-uuid",
                "chapter_id": "chapter-uuid",
                "chapter_name": "Security and Best Practices",
                "question": "What is the primary purpose of...",
                "answers": [
                    {
                        "id": 1,
                        "text": "Answer text",
                        "correct": true
                    }
                ],
                "type": "certification",
                "difficulty": "medium",
                "points": 5
            }
        ],
        "time_limit": 90,
        "total_points": 115,
        "total_questions": 23
    }
}
```

#### Démarrer une session d'examen

```http
POST /certifications/{certification_id}/exam/start
```

**Exemple de réponse**:

```json
{
  "success": true,
  "message": "Exam session started successfully",
  "data": {
    "session_id": "session-uuid",
    "exam_data": {
      "questions": [...],
      "time_limit": 90,
      "total_points": 115
    },
    "started_at": "2025-07-23T17:30:00Z",
    "expires_at": "2025-07-23T19:00:00Z",
    "remaining_time": 5400,
    "total_questions": 23
  }
}
```

#### Sauvegarder une réponse

```http
POST /exam-sessions/{session_id}/save-answer
```

**Body**:

```json
{
    "question_id": "question-uuid",
    "answer_ids": [1, 2]
}
```

#### Vérifier le statut de la session

```http
GET /exam-sessions/{session_id}/status
```

#### Soumettre l'examen

```http
POST /exam-sessions/{session_id}/submit
```

**Body (optionnel)**:

```json
{
    "answers": {
        "question-uuid-1": [1],
        "question-uuid-2": [1, 3],
        "question-uuid-3": [2]
    }
}
```

**Exemple de réponse**:

```json
{
    "success": true,
    "message": "Exam submitted successfully",
    "data": {
        "session_id": "session-uuid",
        "status": "completed",
        "score": 78.5,
        "submitted_at": "2025-07-23T18:45:00Z",
        "total_questions": 23,
        "answered_questions": 21
    }
}
```

### 5. Workflow Complet de Test

#### Étape 1: Préparer les données

```bash
# Exécuter le seeder pour créer des données de test
php artisan db:seed --class=ChapterSeeder
```

#### Étape 2: Obtenir un ID de certification

```http
GET /certifications
```

#### Étape 3: Vérifier les chapitres et questions

```http
GET /certifications/{certification_id}/chapters
GET /chapters/{chapter_id}/questions
```

#### Étape 4: Configurer l'examen

```http
PUT /certifications/{certification_id}/exam-configuration
```

#### Étape 5: Tester la génération

```http
GET /certifications/{certification_id}/exam/generate
```

#### Étape 6: Démarrer une session

```http
POST /certifications/{certification_id}/exam/start
```

#### Étape 7: Répondre aux questions

```http
POST /exam-sessions/{session_id}/save-answer
```

#### Étape 8: Soumettre l'examen

```http
POST /exam-sessions/{session_id}/submit
```

### 6. Codes d'Erreur Courants

-   **422**: Validation échouée ou données insuffisantes
-   **404**: Ressource non trouvée
-   **401**: Non authentifié
-   **403**: Non autorisé
-   **500**: Erreur serveur

### 7. Collection Postman

Pour faciliter les tests, vous pouvez créer une collection Postman avec:

1. **Variables d'environnement**:

    - `base_url`: `http://localhost:8000/api/v1/admin`
    - `token`: Votre token d'authentification
    - `certification_id`: ID de certification pour les tests
    - `session_id`: ID de session d'examen

2. **Tests automatisés** dans chaque requête pour extraire les IDs nécessaires pour les requêtes suivantes.

### 8. Exemple de Script de Test Automatisé

Vous pouvez ajouter ce script dans l'onglet "Tests" de vos requêtes Postman pour automatiser l'extraction des données :

```javascript
// Pour extraire l'ID de certification après GET /certifications
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.length > 0) {
        pm.environment.set("certification_id", response.data[0].id);
    }
}

// Pour extraire l'ID de chapitre après GET /certifications/{id}/chapters
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.length > 0) {
        pm.environment.set("chapter_id", response.data[0].id);
    }
}

// Pour extraire l'ID de session après POST /exam/start
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.session_id) {
        pm.environment.set("session_id", response.data.session_id);
    }
}
```

## Roles and Permissions Management

### Overview

The system includes a comprehensive role-based access control (RBAC) system that allows administrators to manage roles and permissions. This system uses the Spatie Laravel Permission package for robust permission management.

### API Endpoints

#### Role Management

**Base URL**: `http://localhost:8000/api/v1/admin`

**Headers required**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {your_token}
```

##### List all roles
```http
GET /roles
```

**Example Response**:
```json
{
    "success": true,
    "message": "Roles retrieved successfully",
    "roles": [
        {
            "id": "uuid",
            "name": "admin",
            "guard_name": "web",
            "description": "Administrator role with full access",
            "permissions": [
                {
                    "id": "uuid",
                    "name": "manage_users",
                    "guard_name": "web"
                }
            ]
        }
    ]
}
```

##### Create a new role
```http
POST /roles
```

**Request Body**:
```json
{
    "name": "teacher",
    "guard_name": "web",
    "description": "Teacher role with limited access"
}
```

##### Get a specific role
```http
GET /roles/{role_id}
```

##### Update a role
```http
PUT /roles/{role_id}
```

**Request Body**:
```json
{
    "name": "senior_teacher",
    "description": "Senior teacher with additional permissions"
}
```

##### Delete a role
```http
DELETE /roles/{role_id}
```

#### Permission Management

##### List all permissions
```http
GET /permissions
```

##### Create a new permission
```http
POST /permissions
```

**Request Body**:
```json
{
    "name": "manage_courses",
    "guard_name": "web",
    "description": "Permission to manage courses"
}
```

##### Get a specific permission
```http
GET /permissions/{permission_id}
```

##### Update a permission
```http
PUT /permissions/{permission_id}
```

##### Delete a permission
```http
DELETE /permissions/{permission_id}
```

#### Role-Permission Assignment

##### Assign permissions to a role
```http
POST /roles/{role_id}/permissions/assign
```

**Request Body**:
```json
{
    "permission_ids": ["permission-uuid-1", "permission-uuid-2"]
}
```

**Example Response**:
```json
{
    "success": true,
    "message": "Permissions assigned successfully",
    "role": {
        "id": "role-uuid",
        "name": "teacher",
        "permissions": [
            {
                "id": "permission-uuid-1",
                "name": "manage_courses"
            },
            {
                "id": "permission-uuid-2",
                "name": "view_students"
            }
        ]
    }
}
```

##### Revoke permissions from a role
```http
POST /roles/{role_id}/permissions/revoke
```

**Request Body**:
```json
{
    "permission_ids": ["permission-uuid-1"]
}
```

##### Sync permissions for a role (replace all existing permissions)
```http
POST /roles/{role_id}/permissions/sync
```

**Request Body**:
```json
{
    "permission_ids": ["permission-uuid-2", "permission-uuid-3"]
}
```

##### Get all permissions for a specific role
```http
GET /roles/{role_id}/permissions
```

**Example Response**:
```json
{
    "success": true,
    "message": "Role permissions retrieved successfully",
    "permissions": [
        {
            "id": "permission-uuid-1",
            "name": "manage_courses",
            "guard_name": "web",
            "description": "Permission to manage courses"
        }
    ]
}
```

### Testing with Postman

#### Complete Workflow Example

1. **Create a role**:
```http
POST /roles
{
    "name": "content_manager",
    "description": "Manages course content"
}
```

2. **Create permissions**:
```http
POST /permissions
{
    "name": "create_courses",
    "description": "Can create new courses"
}

POST /permissions
{
    "name": "edit_courses", 
    "description": "Can edit existing courses"
}
```

3. **Assign permissions to role**:
```http
POST /roles/{role_id}/permissions/assign
{
    "permission_ids": ["create_courses_id", "edit_courses_id"]
}
```

4. **Verify role permissions**:
```http
GET /roles/{role_id}/permissions
```

### Validation Rules

#### Role Creation/Update
- `name`: Required, string, unique
- `guard_name`: Optional, defaults to 'web'
- `description`: Optional, string

#### Permission Creation/Update
- `name`: Required, string, unique
- `guard_name`: Optional, defaults to 'web'
- `description`: Optional, string

#### Permission Assignment
- `permission_ids`: Required, array
- `permission_ids.*`: Must exist in permissions table

### Error Responses

#### Common Error Codes
- **422**: Validation failed
- **404**: Role or permission not found
- **500**: Server error

#### Example Error Response
```json
{
    "success": false,
    "message": "Role not found"
}
```

#### Validation Error Response
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "permission_ids.0": [
            "The selected permission_ids.0 is invalid."
        ]
    }
}
```

### Postman Collection Variables

For easier testing, set up these environment variables:

- `base_url`: `http://localhost:8000/api/v1/admin`
- `token`: Your authentication token
- `role_id`: ID of the role being tested
- `permission_id`: ID of the permission being tested

### Automated Test Scripts

Add these scripts to your Postman requests for automated testing:

```javascript
// Extract role ID after creating a role
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.role && response.role.id) {
        pm.environment.set("role_id", response.role.id);
    }
}

// Extract permission ID after creating a permission
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.permission && response.permission.id) {
        pm.environment.set("permission_id", response.permission.id);
    }
}

// Verify successful permission assignment
pm.test("Permissions assigned successfully", function () {
    pm.expect(pm.response.code).to.equal(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.role.permissions).to.be.an('array');
});
```

### Security Features

- **Database Transactions**: All role-permission operations are wrapped in database transactions
- **Validation**: Comprehensive input validation for all endpoints
- **Error Handling**: Proper error handling with meaningful messages
- **Permission Caching**: Automatic cache management for optimal performance
- **Immediate Updates**: Permission changes are immediately reflected for users with those roles

### Integration with Existing System

The role and permission system is designed to integrate seamlessly with the existing application:

- Uses the same authentication system
- Follows the same API response patterns
- Maintains consistency with existing validation patterns
- Includes comprehensive test coverage

This RBAC system provides a solid foundation for managing user access control throughout the application while maintaining security and performance standards.