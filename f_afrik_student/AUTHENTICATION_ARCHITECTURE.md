# 🔐 Architecture d'Authentification et Protection des Routes

> Documentation complète du système de sécurité basé sur les rôles (RBAC) avec TanStack Router

## 📚 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Flux d'authentification](#flux-dauthentification)
4. [Niveaux de protection](#niveaux-de-protection)
5. [Rôles et permissions](#rôles-et-permissions)
6. [Gestion des erreurs](#gestion-des-erreurs)
7. [Intégration Laravel](#intégration-laravel)

---

## 🎯 Vue d'ensemble

Cette application utilise un système de **contrôle d'accès basé sur les rôles (RBAC)** avec trois niveaux de protection en profondeur :

1. **Validation au chargement** : Vérification de l'intégrité du rôle dans localStorage
2. **Protection des routes parentes** : Validation de l'authentification sur `_protected`
3. **Protection des routes spécifiques** : Validation du rôle sur `/admin` et `/client`

### Rôles disponibles

- **`admin`** : Accès complet à l'interface d'administration
- **`client`** : Accès limité à l'espace client
- **`null`** : Non authentifié

---

## 📁 Structure des fichiers

### Arborescence complète

```
src/
├── lib/
│   └── router-context-state.tsx    # 🔑 NIVEAU 1 : Gestion de l'état d'authentification
│
├── routes/
│   ├── __root.tsx                  # 📦 Contexte global du router
│   ├── index.tsx                   # 🏠 Page d'accueil (redirection)
│   │
│   ├── (auth)/                     # 🚪 Routes publiques d'authentification
│   │   ├── login.tsx              # Formulaire de connexion
│   │   └── register.tsx           # Formulaire d'inscription
│   │
│   └── _protected/                 # 🛡️ NIVEAU 2 : Routes protégées (authentification requise)
│       ├── route.tsx              # Guard principal + Layout commun
│       │
│       ├── admin/                  # 👨‍💼 NIVEAU 3 : Espace Admin
│       │   ├── route.tsx          # Guard admin + redirect /admin → /admin/dashboard
│       │   ├── dashboard/
│       │   │   └── index.tsx      # Dashboard admin avec graphiques
│       │   ├── posts/
│       │   │   └── route.tsx      # Gestion CRUD des posts
│       │   └── -components/       # Composants spécifiques admin
│       │
│       └── client/                 # 👤 NIVEAU 3 : Espace Client
│           ├── route.tsx          # Guard client
│           └── (futures routes client)
```

### Détails des fichiers clés

---

## 🔑 Fichiers de sécurité détaillés

### 1. `src/lib/router-context-state.tsx`

**Rôle** : Gestion centralisée de l'état d'authentification (NIVEAU 1)

**Responsabilités** :

- ✅ Validation du rôle au chargement de l'application
- ✅ Nettoyage automatique des rôles invalides dans localStorage
- ✅ Fourniture des méthodes `login()` et `logout()`
- ✅ Calcul des flags `isAdmin`, `isClient`, `isAuthenticated`

**Code clé** :

```typescript
// Validation immédiate au chargement
const [role, setRole] = useState<UserRole>(() => {
  const savedRole = localStorage.getItem('userRole') as UserRole

  // 🛡️ SÉCURITÉ : Nettoyer les rôles invalides
  if (savedRole && savedRole !== 'admin' && savedRole !== 'client') {
    console.warn('⚠️ Invalid role in localStorage, clearing:', savedRole)
    localStorage.removeItem('userRole')
    return null
  }

  return savedRole || null
})
```

**Flux de sécurité** :

```
App Load → Lit localStorage → Rôle invalide ? → Nettoie → role = null
                              ↓
                         Rôle valide → Garde le rôle
```

---

### 2. `src/routes/__root.tsx`

**Rôle** : Définition du contexte global du router

**Responsabilités** :

- Définit le type `RouterContext` avec les propriétés d'authentification
- Fournit le layout global (ThemeProvider, Toaster)
- Configure les devtools (en développement)

**Types exportés** :

```typescript
export type UserRole = 'admin' | 'client' | null

export type RouterContext = {
  role: UserRole
  login: (role: 'admin' | 'client') => void
  logout: () => void
  isAdmin: boolean
  isClient: boolean
  isAuthenticated: boolean
}
```

---

### 3. `src/routes/_protected/route.tsx`

**Rôle** : Guard principal pour toutes les routes protégées (NIVEAU 2)

**Responsabilités** :

- ✅ Vérifier que l'utilisateur est authentifié
- ✅ Valider l'intégrité du rôle (admin ou client uniquement)
- ✅ Fournir le layout commun (Sidebar, Header, Breadcrumbs)
- ✅ Rediriger vers `/login` si non autorisé

**Protection appliquée** :

```typescript
beforeLoad: async ({ context, location }) => {
  // 🔒 Protection 1 : Vérifier l'authentification
  if (!context.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }

  // 🔒 Protection 2 : Valider le rôle
  if (
    !context.role ||
    (context.role !== 'admin' && context.role !== 'client')
  ) {
    console.error('🚨 Security: Invalid role detected, forcing logout')
    context.logout()
    throw redirect({ to: '/login' })
  }
}
```

**Flux de validation** :

```
Utilisateur → Route protégée → _protected/route.tsx
                                      |
                                      ├─ isAuthenticated ? ──┬─ Oui → Continuer
                                      │                      └─ Non → /login
                                      |
                                      └─ Rôle valide ? ──┬─ Oui → Afficher contenu
                                                         └─ Non → Logout + /login
```

---

### 4. `src/routes/_protected/admin/route.tsx`

**Rôle** : Guard spécifique pour l'espace admin (NIVEAU 3)

**Responsabilités** :

- ✅ Vérifier que l'utilisateur a le rôle `admin`
- ✅ Rediriger `/admin` → `/admin/dashboard` (route racine invalide)
- ✅ Rediriger les clients vers leur espace
- ✅ Rediriger les non-authentifiés vers `/login`

**Protection appliquée** :

```typescript
beforeLoad: async ({ context, location }) => {
  // 🔒 Protection rôle : Vérifier que c'est un admin
  if (!context.isAdmin) {
    if (context.isClient) {
      // Client essaie d'accéder à l'admin → renvoyer à son espace
      throw redirect({ to: '/client' })
    }
    // Rôle invalide ou non authentifié → login
    throw redirect({ to: '/login' })
  }

  // 🔒 Protection route racine : /admin n'est pas accessible
  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    throw redirect({ to: '/admin/dashboard' })
  }
}
```

**Scénarios gérés** :

| Utilisateur   | Tente d'accéder    | Action                        |
| ------------- | ------------------ | ----------------------------- |
| Admin         | `/admin`           | Redirect → `/admin/dashboard` |
| Admin         | `/admin/dashboard` | ✅ Autorisé                   |
| Admin         | `/admin/posts`     | ✅ Autorisé                   |
| Client        | `/admin`           | Redirect → `/client`          |
| Non auth      | `/admin`           | Redirect → `/login`           |
| Rôle invalide | `/admin`           | Redirect → `/login`           |

---

### 5. `src/routes/_protected/client/route.tsx`

**Rôle** : Guard spécifique pour l'espace client (NIVEAU 3)

**Responsabilités** :

- ✅ Vérifier que l'utilisateur a le rôle `client`
- ✅ Rediriger les admins vers leur espace
- ✅ Rediriger les non-authentifiés vers `/login`
- ✅ Afficher le dashboard client

**Protection appliquée** :

```typescript
beforeLoad: async ({ context }) => {
  if (!context.isClient) {
    if (context.isAdmin) {
      throw redirect({ to: '/admin/dashboard' })
    }
    throw redirect({ to: '/login' })
  }
}
```

---

### 6. `src/routes/(auth)/login.tsx`

**Rôle** : Page de connexion publique

**Responsabilités** :

- ✅ Afficher le formulaire de connexion
- ✅ Rediriger les utilisateurs déjà authentifiés
- ✅ Gérer la connexion (demo : "admin" ou "client")
- ✅ Préserver la destination avec `redirect` query param

**Protection appliquée** :

```typescript
beforeLoad: async ({ context }) => {
  // Si déjà authentifié, rediriger vers son espace
  if (context.isAuthenticated) {
    throw redirect({
      to: context.isAdmin ? '/admin/dashboard' : '/client',
    })
  }
}
```

---

## 🔄 Flux d'authentification complet

### Diagramme de flux

```mermaid
graph TD
    A[🌐 Utilisateur accède à l'app] --> B{📍 Quelle route ?}

    B -->|/| C[index.tsx]
    B -->|/login| D[login.tsx]
    B -->|/admin*| E[_protected/route.tsx]
    B -->|/client*| E

    C --> C1{Authentifié ?}
    C1 -->|Oui| C2{Rôle ?}
    C1 -->|Non| D
    C2 -->|admin| F[/admin/dashboard]
    C2 -->|client| G[/client]

    D --> D1{Déjà authentifié ?}
    D1 -->|Oui| C2
    D1 -->|Non| D2[Afficher formulaire]
    D2 --> D3[Soumettre]
    D3 --> D4[login avec rôle]
    D4 --> C2

    E --> E1{isAuthenticated ?}
    E1 -->|Non| D
    E1 -->|Oui| E2{Rôle valide ?}
    E2 -->|Non| E3[logout + /login]
    E2 -->|Oui| E4{Quelle route ?}

    E4 -->|/admin*| H[admin/route.tsx]
    E4 -->|/client*| I[client/route.tsx]

    H --> H1{isAdmin ?}
    H1 -->|Non, isClient| G
    H1 -->|Non, autre| D
    H1 -->|Oui| H2{pathname ?}
    H2 -->|/admin| F
    H2 -->|/admin/dashboard| F
    H2 -->|/admin/posts| J[Posts CRUD]

    I --> I1{isClient ?}
    I1 -->|Non, isAdmin| F
    I1 -->|Non, autre| D
    I1 -->|Oui| G

    style E fill:#ff9999
    style H fill:#ffcccc
    style I fill:#ffcccc
    style D fill:#99ff99
    style F fill:#9999ff
    style G fill:#9999ff
```

---

## 🛡️ Niveaux de protection en profondeur

### Niveau 1 : Validation à l'initialisation

**Fichier** : `src/lib/router-context-state.tsx`

**Quand** : Au chargement de l'application

**Protection** :

```typescript
// Lit localStorage et valide immédiatement
if (savedRole && savedRole !== 'admin' && savedRole !== 'client') {
  localStorage.removeItem('userRole')
  return null
}
```

**Scénarios bloqués** :

- ❌ localStorage = `"hacker"` → Nettoyé, role = null
- ❌ localStorage = `"superadmin"` → Nettoyé, role = null
- ❌ localStorage = `""` → role = null
- ✅ localStorage = `"admin"` → role = "admin"
- ✅ localStorage = `"client"` → role = "client"

---

### Niveau 2 : Protection des routes parentes

**Fichier** : `src/routes/_protected/route.tsx`

**Quand** : À chaque navigation vers une route protégée

**Protection** :

1. Vérification de l'authentification
2. Validation de l'intégrité du rôle
3. Logout forcé si rôle invalide

**Scénarios bloqués** :

- ❌ Utilisateur non authentifié → `/login`
- ❌ Rôle manipulé pendant l'exécution → Logout + `/login`
- ❌ Rôle null → `/login`

---

### Niveau 3 : Protection par rôle spécifique

**Fichiers** :

- `src/routes/_protected/admin/route.tsx`
- `src/routes/_protected/client/route.tsx`

**Quand** : À chaque navigation vers `/admin/*` ou `/client/*`

**Protection** :

1. Vérification du rôle exact (isAdmin ou isClient)
2. Redirection intelligente vers le bon espace
3. Redirection des routes racines invalides

**Scénarios bloqués** :

- ❌ Client tente `/admin` → Redirect `/client`
- ❌ Admin tente `/client` → Redirect `/admin/dashboard`
- ❌ Accès direct à `/admin` → Redirect `/admin/dashboard`

---

## 🎭 Rôles et permissions

### Matrice des permissions

| Route              | Non authentifié | Client      | Admin                |
| ------------------ | --------------- | ----------- | -------------------- |
| `/`                | → `/login`      | → `/client` | → `/admin/dashboard` |
| `/login`           | ✅ Autorisé     | → `/client` | → `/admin/dashboard` |
| `/register`        | ✅ Autorisé     | → `/client` | → `/admin/dashboard` |
| `/admin`           | → `/login`      | → `/client` | → `/admin/dashboard` |
| `/admin/dashboard` | → `/login`      | → `/client` | ✅ Autorisé          |
| `/admin/posts`     | → `/login`      | → `/client` | ✅ Autorisé          |
| `/client`          | → `/login`      | ✅ Autorisé | → `/admin/dashboard` |

### Définition des rôles

#### 👨‍💼 Admin

**Accès** :

- ✅ `/admin/dashboard` : Tableau de bord avec statistiques
- ✅ `/admin/posts` : CRUD complet des posts
- ✅ (Futures routes admin)

**Restrictions** :

- ❌ Ne peut pas accéder à `/client`
- ❌ Redirigé automatiquement vers son espace

#### 👤 Client

**Accès** :

- ✅ `/client` : Dashboard client
- ✅ (Futures routes client)

**Restrictions** :

- ❌ Ne peut pas accéder à `/admin/*`
- ❌ Redirigé automatiquement vers son espace

---

## ⚠️ Gestion des erreurs

### Scénarios d'erreur gérés

#### 1. Rôle invalide dans localStorage

**Détection** : `router-context-state.tsx` au chargement

**Action** :

```typescript
console.warn('⚠️ Invalid role in localStorage, clearing:', savedRole)
localStorage.removeItem('userRole')
return null
```

**Résultat** : Utilisateur traité comme non authentifié

---

#### 2. Rôle manipulé pendant l'exécution

**Détection** : `_protected/route.tsx` à chaque navigation

**Action** :

```typescript
if (!context.role || (context.role !== 'admin' && context.role !== 'client')) {
  console.error('🚨 Security: Invalid role detected, forcing logout')
  context.logout()
  throw redirect({ to: '/login' })
}
```

**Résultat** : Logout forcé + redirection `/login`

---

#### 3. Accès non autorisé par rôle

**Détection** : Routes spécifiques admin/client

**Action** : Redirection intelligente

```typescript
// Client essaie /admin
if (!context.isAdmin && context.isClient) {
  throw redirect({ to: '/client' })
}

// Admin essaie /client
if (!context.isClient && context.isAdmin) {
  throw redirect({ to: '/admin/dashboard' })
}
```

**Résultat** : Redirection vers l'espace approprié

---

#### 4. Route racine invalide

**Détection** : `admin/route.tsx` vérifie le pathname

**Action** :

```typescript
if (location.pathname === '/admin' || location.pathname === '/admin/') {
  throw redirect({ to: '/admin/dashboard' })
}
```

**Résultat** : Redirection automatique vers le dashboard

---

## 🔗 Intégration Laravel (Future)

### Architecture Frontend + Backend

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TanStack Router)       │
│                                                             │
│  - Vérifie le JWT/token dans localStorage                  │
│  - Contrôle côté client pour UX rapide                     │
│  - NE FAIT PAS confiance au rôle pour la sécurité finale   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP + JWT
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Laravel API)                     │
│                                                             │
│  - Vérifie VRAIMENT le rôle depuis la base de données      │
│  - Middleware Laravel : auth:sanctum, role:admin, etc.      │
│  - SEULE source de vérité pour la sécurité                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Modifications nécessaires

#### 1. Remplacer localStorage par JWT

**Fichier** : `src/lib/router-context-state.tsx`

```typescript
import { jwtDecode } from 'jwt-decode'

export function useRouterContextState(): RouterContext {
  const [role, setRole] = useState<UserRole>(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      const decoded = jwtDecode<{ role: string }>(token)
      const userRole = decoded.role

      if (userRole !== 'admin' && userRole !== 'client') {
        localStorage.removeItem('auth_token')
        return null
      }

      return userRole as UserRole
    } catch {
      localStorage.removeItem('auth_token')
      return null
    }
  })

  // ...
}
```

---

#### 2. Appels API authentifiés

**Fichier** : `src/lib/api.ts` (à créer)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur : Ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur : Gérer les erreurs 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Backend dit "pas autorisé" → forcer logout frontend
      localStorage.removeItem('auth_token')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
```

---

#### 3. Backend Laravel - Routes protégées

**Fichier** : `routes/api.php`

```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {

    // Routes admin uniquement
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('posts', PostController::class);
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    });

    // Routes client uniquement
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('dashboard', [ClientController::class, 'dashboard']);
    });

    // Routes communes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
```

---

#### 4. Middleware Laravel de vérification de rôle

**Fichier** : `app/Http/Middleware/CheckRole.php`

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($request->user()->role !== $role) {
            return response()->json([
                'message' => 'Unauthorized - Invalid role'
            ], 403);
        }

        return $next($request);
    }
}
```

---

## 🧪 Tests de sécurité

### Checklist de tests manuels

#### ✅ Test 1 : Rôle invalide dans localStorage

```javascript
// Dans la console du navigateur
localStorage.setItem('userRole', 'hacker')
location.reload()

// Résultat attendu:
// ⚠️ Warning: "Invalid role in localStorage, clearing: hacker"
// Redirection vers /login
```

#### ✅ Test 2 : Client essaie d'accéder à /admin

```javascript
// Se connecter en tant que client
// Puis taper dans la barre d'adresse: /admin

// Résultat attendu:
// Redirection automatique vers /client
```

#### ✅ Test 3 : Admin essaie d'accéder à /client

```javascript
// Se connecter en tant qu'admin
// Puis taper dans la barre d'adresse: /client

// Résultat attendu:
// Redirection automatique vers /admin/dashboard
```

#### ✅ Test 4 : Accès direct à /admin

```javascript
// Se connecter en tant qu'admin
// Taper dans la barre d'adresse: /admin

// Résultat attendu:
// Redirection automatique vers /admin/dashboard
```

#### ✅ Test 5 : Manipulation du rôle pendant l'exécution

```javascript
// Se connecter en tant qu'admin
// Dans la console:
localStorage.setItem('userRole', 'superadmin')
// Naviguer vers une autre page

// Résultat attendu:
// 🚨 Security error
// Logout + redirection vers /login
```

---

## 📝 Résumé de l'architecture

### Points clés

1. **🔒 Défense en profondeur** : 3 niveaux de validation
2. **🎯 Séparation des responsabilités** : Chaque fichier a un rôle précis
3. **🛡️ Validation stricte** : Aucun rôle invalide n'est toléré
4. **🔄 Redirections intelligentes** : L'utilisateur est toujours dirigé vers le bon endroit
5. **📱 UX fluide** : Les erreurs de navigation sont gérées gracieusement
6. **🔐 Prêt pour la production** : Architecture compatible avec Laravel backend

### Principes de sécurité appliqués

- ✅ **Validation côté client** (UX rapide)
- ✅ **Pas de confiance aveugle** (validation à plusieurs niveaux)
- ✅ **Nettoyage proactif** (rôles invalides supprimés)
- ✅ **Logging des tentatives** (console.warn/error)
- ✅ **Préparé pour validation backend** (architecture compatible)

---

## 🚀 Évolutions futures

### Court terme

1. [ ] Ajouter plus de routes admin (/users, /settings, etc.)
2. [ ] Implémenter le dashboard client complet
3. [ ] Ajouter des tests unitaires avec Vitest

### Moyen terme

1. [ ] Intégration avec Laravel API
2. [ ] Remplacement localStorage → JWT
3. [ ] Intercepteurs HTTP pour la sécurité
4. [ ] Refresh token automatique

### Long terme

1. [ ] Permissions granulaires (au-delà des rôles)
2. [ ] Audit log des accès
3. [ ] Rate limiting frontend
4. [ ] 2FA (authentification à deux facteurs)

---

**📅 Dernière mise à jour** : 2025-10-19  
**👨‍💻 Auteur** : Documentation générée automatiquement  
**🔖 Version** : 1.0.0
