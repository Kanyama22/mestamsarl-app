# Guide: Système d'Authentification et d'Avis

## 📋 Vue d'ensemble
Le système integre complètement de l'authentification utilisateur et les avis de produits via Supabase. Les utilisateurs peuvent se connecter, acheter des produits, et laisser des avis.

---

## 🔐 Authentification (Login & Register)

### Pages Disponibles
- **`/login`** - Page de connexion
- **`/register`** - Page d'enregistrement

### Fonctionnement
1. L'utilisateur se crée un compte via **Register** avec email + mot de passe
2. Les données sont stockées dans **Supabase Auth**
3. Une session est créée et stockée dans le navigateur
4. L'utilisateur reste connecté même après rechargement de page
5. Au logout, la session est détruite

### Flux d'Authentification
```
Frontend (React)
    ↓
Supabase Auth (Client)
    ↓
Supabase Database
    ↓ (Stockage utilisateur + session)
```

### Code d'Intégration
Les fonctions principales se trouvent dans `frontend/src/services/auth.js`:
- `signUp(email, password, userData)` - Créer un compte
- `signIn(email, password)` - Se connecter
- `signOut()` - Se déconnecter
- `getCurrentUser()` - Récupérer l'utilisateur connecté
- `onAuthStateChange(callback)` - Écouter les changements d'auth

---

## ⭐ Système d'Avis

### Fonctionnement
1. **Non-connecté** → Voir un bouton "Se connecter / S'inscrire"
2. **Connecté** → Bouton "Écrire un avis" apparaît
3. Cliquer on formulaire pour :
   - Entrer son nom (prérempli avec email si connecté)
   - Sélectionner une note (1-5 étoiles)
   - Écrire un commentaire
4. Soumettre → Avis envoyé à Supabase
5. Avis apparaît immédiatement dans la liste

### Composant ReviewForm
- Fichier: `frontend/src/components/ReviewForm.jsx`
- Utilisé dans: `ProductDetail.jsx` et `ProductDetailMobile.jsx`
- Gère :
  - Vérification d'authentification
  - Validation du formulaire
  - Envoi à Supabase
  - Stockage local (fallback si offline)

### Stockage des Avis
```
Table Supabase: product_reviews
Colonnes:
- id (UUID)
- product_id (UUID)
- user_id (UUID)
- user_name (string)
- rating (int: 1-5)
- comment (text)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🔄 Synchronisation des Données

### Flux de Données: Avis
```
1. Utilisateur écrit avis
   ↓
2. Frontend appelle createReview()
   ↓
3. Supabase reçoit et stocke
   ↓
4. Frontend recharge liste d'avis
   ↓
5. Nouvel avis apparaît pour tous les visiteurs
```

### Flux de Données: Authentification
```
1. Utilisateur se connecte
   ↓
2. Supabase Auth valide email/password
   ↓
3. Session créée + stored en localStorage/sessionStorage
   ↓
4. useAuth() hook récupère le user
   ↓
5. Composants affichent contenu personnalisé
```

---

## 🛒 Intégration avec les Commandes

### Acheter un Produit
1. Cliquer bouton **"Acheter"** (mobile) ou **"Ajouter au panier / Checkout"** (desktop)
2. Créer une commande via `createOrder()`
3. Stocker dans table `orders` (Supabase ou localStorage)
4. Rediriger vers page `/checkout/:orderId`
5. Simuler paiement → status passe à `paid`

### Données de la Commande
```
Table: orders
- id (UUID)
- user_id (UUID - optionnel)
- product_id (UUID)
- product_name (string)
- quantity (int)
- price (float)
- total (float)
- status (pending/paid/shipped/delivered)
- created_at (timestamp)
```

---

## 📱 Pages Concernées

### Desktop
- `frontend/src/pages/ProductDetail.jsx` - Détail produit + avis + formulaire
- `frontend/src/pages/Login.jsx` - Connexion
- `frontend/src/pages/Register.jsx` - Inscription

### Mobile
- `frontend/src/pages/ProductDetailMobile.jsx` - Détail produit mobile + avis
- Pages de Login/Register partagées

---

## ✅ Checklist pour Tester

- [ ] Aller sur `/login` → Voir formulaire connexion
- [ ] Créer un compte avec email + password via `/register`
- [ ] Se connecter avec ces identifiants
- [ ] Aller sur page produit → Voir "Écrire un avis"
- [ ] Écrire un avis (note + commentaire)
- [ ] Avis apparaît immédiatement dans la liste
- [ ] Recharger la page → Avis toujours présent
- [ ] Se déconnecter → Bouton "Écrire un avis" disparaît
- [ ] Se reconnecter → Retrouver avis précédent

---

## 🐛 Dépannage

### Problème: Avis ne s'enregistre pas
**Solution:**
1. Vérifier la table `product_reviews` existe dans Supabase
2. Vérifier les règles d'accès (Row Level Security)
3. Vérifier la console du navigateur pour erreurs
4. Les avis sont sauvegardés en localStorage (fallback)

### Problème: Connexion ne fonctionne pas
**Solution:**
1. Vérifier Supabase URL et clé d'API dans `frontend/src/lib/supabase.js`
2. Vérifier que l'utilisateur a un compte dans Supabase Auth
3. Vérifier les droits d'accès aux tables

### Problème: Pas de session après rechargement
**Solution:**
1. S'assurer que `AuthProvider` enveloppe toute l'application
2. Vérifier que `useAuth()` est utilisé dans les composants

---

## 🔗 API Functions

### Auth
```javascript
import { signUp, signIn, signOut, getCurrentUser } from '../services/auth';

// Register
await signUp('email@example.com', 'password123', { name: 'John' });

// Login
await signIn('email@example.com', 'password123');

// Get current user
const user = await getCurrentUser();

// Logout
await signOut();
```

### Reviews
```javascript
import { 
  getProductReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} from '../services/api';

// Get reviews for product
const reviews = await getProductReviews('product-id');

// Create review
const newReview = await createReview({
  product_id: 'product-id',
  user_id: 'user-id',
  user_name: 'John Doe',
  rating: 5,
  comment: 'Excellent produit!'
});

// Update review
await updateReview('review-id', { rating: 4, comment: 'Bon produit' });

// Delete review
await deleteReview('review-id');
```

---

## 📊 Exemple de Données

### Utilisateur Stocké
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "user_metadata": {
    "name": "John Doe"
  }
}
```

### Avis Stocké
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "product_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_name": "John Doe",
  "rating": 5,
  "comment": "Excellent produit, livraison rapide!",
  "created_at": "2026-02-21T10:30:00Z"
}
```

---

## 🚀 Prochaines Étapes

1. **Intégration paiement réelle** (Stripe/PayPal)
2. **Historique de commandes** utilisateur
3. **Système de profil** utilisateur (adresse, téléphone, historique)
4. **Notifications par email** (confirmation commande, nouvel avis)
5. **Système de wishlist** (favoris)
