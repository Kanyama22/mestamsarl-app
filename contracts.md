# Mestamsarl - Contrats API & Intégration Backend

## Vue d'ensemble
Application e-commerce pour l'importation de produits de Chine vers la RDC avec interface admin complète.

## Données mockées à remplacer (frontend/src/mock.js)
- `categories[]` : 6 catégories avec images
- `products[]` : 12 produits avec spécifications
- `testimonials[]` : 3 témoignages
- `companyInfo{}` : Informations de l'entreprise

## Architecture Backend

### Models MongoDB

#### 1. Category Model
```python
{
  "_id": ObjectId,
  "id": str (unique),
  "name": str,
  "description": str,
  "image": str (URL),
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 2. Product Model
```python
{
  "_id": ObjectId,
  "id": str (unique),
  "name": str,
  "price": float,
  "category": str (category.id),
  "description": str,
  "image": str (URL),
  "featured": bool,
  "specifications": dict,
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 3. Order Model
```python
{
  "_id": ObjectId,
  "id": str (unique),
  "items": [
    {
      "product_id": str,
      "product_name": str,
      "quantity": int,
      "price": float
    }
  ],
  "total": float,
  "status": str (pending, confirmed, delivered),
  "customer_info": {
    "name": str,
    "email": str,
    "phone": str
  },
  "created_at": datetime,
  "updated_at": datetime
}
```

#### 4. ContactMessage Model
```python
{
  "_id": ObjectId,
  "name": str,
  "email": str,
  "phone": str,
  "subject": str,
  "message": str,
  "status": str (new, read, replied),
  "created_at": datetime
}
```

## Endpoints API (Préfixe: /api)

### Categories
- `GET /api/categories` - Liste toutes les catégories
- `GET /api/categories/{id}` - Détail d'une catégorie
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/{id}` - Modifier une catégorie (admin)
- `DELETE /api/categories/{id}` - Supprimer une catégorie (admin)

### Products
- `GET /api/products` - Liste tous les produits (avec filtres: ?category=xxx&featured=true)
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/{id}` - Modifier un produit (admin)
- `DELETE /api/products/{id}` - Supprimer un produit (admin)

### Orders
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes (admin)
- `GET /api/orders/{id}` - Détail d'une commande
- `PUT /api/orders/{id}/status` - Mettre à jour le statut (admin)

### Contact
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact` - Liste des messages (admin)
- `PUT /api/contact/{id}/status` - Marquer comme lu/répondu (admin)

### Admin Auth
- `POST /api/admin/login` - Connexion admin (retourne token JWT)
- `GET /api/admin/stats` - Statistiques du dashboard

## Intégration Frontend

### Fichiers à modifier

1. **src/pages/Home.jsx**
   - Remplacer `categories` par `useEffect(() => fetch('/api/categories'))`
   - Remplacer `products.filter(featured)` par `fetch('/api/products?featured=true')`

2. **src/pages/Shop.jsx**
   - Remplacer `products` par `fetch('/api/products?category={id}')`

3. **src/pages/ProductDetail.jsx**
   - Remplacer `products.find()` par `fetch('/api/products/{id}')`
   - Garder localStorage pour le panier (fonctionnel)

4. **src/pages/Cart.jsx**
   - Modifier `handleCheckout()` pour `POST /api/orders`

5. **src/pages/Contact.jsx**
   - Modifier `handleSubmit()` pour `POST /api/contact`

6. **src/pages/admin/AdminLogin.jsx**
   - Remplacer authentification mock par `POST /api/admin/login`
   - Stocker JWT token dans localStorage

7. **src/pages/admin/AdminDashboard.jsx**
   - Récupérer stats via `GET /api/admin/stats`
   - Récupérer produits via `GET /api/products?featured=true`

8. **src/pages/admin/AdminProducts.jsx**
   - CRUD complet via endpoints API
   - GET, POST, PUT, DELETE /api/products

9. **src/pages/admin/AdminCategories.jsx**
   - CRUD complet via endpoints API
   - GET, POST, PUT, DELETE /api/categories

### Gestion des erreurs
- Afficher toast en cas d'erreur réseau
- Redirection vers login si token invalide (401)
- Messages d'erreur clairs pour l'utilisateur

## Initialisation des données
Créer un script pour peupler la base de données avec les données de mock.js au premier démarrage.

## Sécurité
- JWT pour l'authentification admin
- CORS configuré pour le frontend
- Validation des données avec Pydantic
- Pas de suppression en cascade (vérifier les dépendances)
