# Composants CRUD pour la gestion des Posts

## Vue d'ensemble

Ce projet contient 4 composants CRUD séparés pour gérer les posts, qui utilisent les réponses de l'API Laravel avec gestion automatique des toasts et des erreurs de validation.

## Architecture

### Structure des fichiers

```
src/
├── components/
│   ├── CreatePost.tsx      # Composant de création
│   ├── ReadPosts.tsx        # Composant de lecture/affichage
│   ├── UpdatePost.tsx       # Composant de modification
│   └── DeletePost.tsx       # Composant de suppression
├── hooks/
│   └── use-posts.ts         # Hook personnalisé pour accéder au store
├── stores/
│   └── post-store.ts        # Store Zustand pour l'état global
├── services/
│   └── post-service.ts      # Service API pour les posts
└── types/
    └── post.ts              # Types TypeScript
```

## Fonctionnalités clés

### 1. **CreatePost** - Création de posts

**Utilisation :**
```tsx
import { CreatePost } from '@/components/CreatePost'

function MyPage() {
  return <CreatePost />
}
```

**Fonctionnalités :**
- Formulaire avec validation en temps réel
- Affichage des erreurs de validation individuelles
- Toast de succès avec le message de l'API
- Toast d'erreur pour chaque champ invalide
- Réinitialisation automatique du formulaire après succès

### 2. **ReadPosts** - Affichage des posts

**Utilisation :**
```tsx
import { ReadPosts } from '@/components/ReadPosts'

function MyPage() {
  return <ReadPosts />
}
```

**Fonctionnalités :**
- Chargement automatique des posts au montage
- Affichage en grille responsive
- Bouton de rafraîchissement
- Gestion des états de chargement et d'erreur
- Sélection de post pour voir les détails

### 3. **UpdatePost** - Modification de posts

**Utilisation :**
```tsx
import { UpdatePost } from '@/components/UpdatePost'

// Sans props - avec sélecteur de post
function MyPage() {
  return <UpdatePost />
}

// Avec un ID de post spécifique
function MyPage() {
  return <UpdatePost postId={5} onSuccess={() => console.log('Updated!')} />
}
```

**Props :**
- `postId?: number` - ID du post à modifier (optionnel)
- `onSuccess?: () => void` - Callback après succès (optionnel)

**Fonctionnalités :**
- Sélection de post depuis une liste déroulante
- Chargement automatique des données du post
- Validation en temps réel
- Affichage des erreurs par champ
- Toast de succès/erreur avec messages de l'API

### 4. **DeletePost** - Suppression de posts

**Utilisation :**
```tsx
import { DeletePost } from '@/components/DeletePost'

// Sans props - avec sélecteur de post
function MyPage() {
  return <DeletePost />
}

// Avec un ID de post spécifique
function MyPage() {
  return <DeletePost postId={5} onSuccess={() => console.log('Deleted!')} />
}
```

**Props :**
- `postId?: number` - ID du post à supprimer (optionnel)
- `onSuccess?: () => void` - Callback après succès (optionnel)

**Fonctionnalités :**
- Sélection de post depuis une liste déroulante
- Affichage des détails avant suppression
- Confirmation en deux étapes
- Toast de succès avec le message de l'API
- Gestion des erreurs de suppression

## Gestion des réponses API Laravel

### Format des réponses de succès

```json
{
  "success": true,
  "message": "Post créé avec succès",
  "data": {
    "id": 1,
    "title": "Mon titre",
    "description": "Ma description",
    "user_id": 1,
    "created_at": "2025-10-15T10:00:00.000000Z",
    "updated_at": "2025-10-15T10:00:00.000000Z"
  }
}
```

### Format des réponses d'erreur

```json
{
  "success": false,
  "message": "The title field is required. (and 2 more errors)",
  "errors": {
    "title": ["The title field is required."],
    "description": ["The description field is required."],
    "user_id": ["The user id field is required."]
  }
}
```

### Gestion des toasts

**Succès :**
- Les composants utilisent le champ `message` de l'API pour afficher le toast de succès
- Toast vert avec icône de succès

**Erreurs :**
- Le tableau `errors` est parcouru pour afficher chaque erreur individuellement
- Chaque erreur est affichée dans un toast rouge séparé
- Les erreurs sont également affichées sous les champs correspondants dans le formulaire

## Utilisation du Store Zustand

Les composants utilisent le hook `usePosts` qui accède au store Zustand :

```typescript
const { 
  posts,           // Liste des posts
  currentPost,     // Post actuellement sélectionné
  loading,         // État de chargement
  error,           // Message d'erreur
  fetchPosts,      // Récupérer tous les posts
  fetchPost,       // Récupérer un post par ID
  createPost,      // Créer un post
  updatePost,      // Modifier un post
  deletePost,      // Supprimer un post
  setCurrentPost,  // Définir le post actuel
  clearError       // Effacer les erreurs
} = usePosts()
```

## Valeurs de retour des actions

Toutes les actions (create, update, delete) retournent maintenant un objet avec :

```typescript
{
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}
```

Cela permet aux composants de :
1. Savoir si l'opération a réussi
2. Récupérer le message de l'API pour le toast
3. Afficher les erreurs de validation si présentes

## Exemple d'utilisation complète

```tsx
import { useState } from 'react'
import { CreatePost } from '@/components/CreatePost'
import { ReadPosts } from '@/components/ReadPosts'
import { UpdatePost } from '@/components/UpdatePost'
import { DeletePost } from '@/components/DeletePost'
import { Button } from '@/components/ui/button'

function PostsManagement() {
  const [activeTab, setActiveTab] = useState<'create' | 'read' | 'update' | 'delete'>('read')

  return (
    <div>
      <div className="tabs">
        <Button onClick={() => setActiveTab('create')}>Créer</Button>
        <Button onClick={() => setActiveTab('read')}>Lire</Button>
        <Button onClick={() => setActiveTab('update')}>Modifier</Button>
        <Button onClick={() => setActiveTab('delete')}>Supprimer</Button>
      </div>

      {activeTab === 'create' && <CreatePost />}
      {activeTab === 'read' && <ReadPosts />}
      {activeTab === 'update' && <UpdatePost />}
      {activeTab === 'delete' && <DeletePost />}
    </div>
  )
}
```

## Personnalisation

### Modifier les messages de toast

Les messages proviennent directement de l'API Laravel. Pour les personnaliser, modifiez les réponses de votre contrôleur Laravel :

```php
// Dans votre contrôleur Laravel
return $this->successResponse(
    $post, 
    'Votre message personnalisé ici',
    Response::HTTP_CREATED
);
```

### Ajouter des champs au formulaire

Pour ajouter des champs, modifiez :
1. Le type `CreatePostData` dans `src/types/post.ts`
2. Le composant de formulaire correspondant
3. Les règles de validation Laravel

### Changer le style

Tous les composants utilisent Tailwind CSS et les composants UI de shadcn/ui. Vous pouvez personnaliser :
- Les classes Tailwind directement dans les composants
- Le thème dans `src/styles.css`
- Les composants Button dans `src/components/ui/button.tsx`

## Mode sombre

Tous les composants supportent le mode sombre grâce aux classes `dark:` de Tailwind. Utilisez le composant `ModeToggle` pour basculer entre les thèmes.

## Notes importantes

1. **Ne pas modifier** le store Zustand, les hooks ou les services - ils sont configurés pour fonctionner avec les composants
2. Les **toasts proviennent toujours de l'API**, pas du frontend
3. Les **erreurs de validation** sont gérées automatiquement via le tableau `errors`
4. Chaque composant est **indépendant** et peut être utilisé séparément
5. Les composants **partagent le même état global** via Zustand

## Dépannage

### Les toasts n'apparaissent pas
Vérifiez que le composant `<Toaster />` est bien présent dans votre layout principal.

### Les erreurs ne s'affichent pas
Vérifiez que votre API Laravel retourne bien le format avec le tableau `errors`.

### Les posts ne se chargent pas
Vérifiez :
- L'URL de l'API dans `src/lib/api.ts`
- Les CORS sur votre API Laravel
- La console pour les erreurs réseau
