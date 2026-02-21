import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, ArrowLeft, Package, Shield, Truck, Star } from 'lucide-react';
import { categories, testimonials } from '../mock';
import { getProductById, getProductReviews } from '../services/api';
import { createOrder } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const p = await getProductById(id);
      setProduct(p);
      const revs = await getProductReviews(id);
      setReviews(revs && revs.length ? revs : (testimonials || []));
      setLoading(false);
    };
    load();
  }, [id]);


  const parseSpecifications = (specs) => {
    if (!specs) return null;
    if (typeof specs === 'object') return specs;
    try {
      return JSON.parse(specs);
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Produit non trouvé</h2>
          <Button onClick={() => navigate('/shop')}>Retour à la boutique</Button>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category_id || c.id === product.category);
  const relatedProducts = [];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
      duration: 3000,
    });
  };

  const handleBuyNow = async () => {
    try {
      const orderData = {
        product_id: product.id,
        product_name: product.name,
        quantity,
        price: product.price ?? product.price_usd ?? product.price_cdf ?? 0,
        total: (product.price ?? product.price_usd ?? product.price_cdf ?? 0) * quantity,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      const order = await createOrder(orderData);
      if (order && order.id) {
        // redirect to checkout page
        window.location.href = `/checkout/${order.id}`;
      } else {
        throw new Error('Order creation failed');
      }
    } catch (err) {
      console.error('Buy now error', err);
      toast({ title: 'Erreur', description: 'Impossible de créer la commande', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-blue-600">Boutique</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600">{category?.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Retour à la boutique
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <Card className="overflow-hidden">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                className="w-full h-[500px] object-cover"
              />
            </Card>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.featured && (
                <Badge className="bg-blue-600 mb-2">Produit Vedette</Badge>
              )}
              <h1 className="text-4xl font-bold mb-3 text-gray-900">{product.name}</h1>
              <p className="text-5xl font-bold text-blue-600 mb-6">${product.price ?? product.price_usd ?? product.price_cdf ?? '—'}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">À propos de ce produit</h3>
              <p className="text-gray-600 leading-relaxed text-base">{product.long_description || product.short_description || product.description}</p>
            </div>

            {/* Specifications */}
            {parseSpecifications(product.specifications) && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Spécifications techniques</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(parseSpecifications(product.specifications)).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                          <span className="text-gray-600 capitalize font-medium">{key}:</span>
                          <span className="font-semibold text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold text-gray-700">Quantité:</label>
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4"
                  >
                    -
                  </Button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Ajouter au panier
                </Button>
                <Link to="/cart" className="flex-1">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6"
                  >
                    Voir le panier
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <Package className="text-blue-600 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Prix usine direct</h4>
                  <p className="text-gray-600 text-sm">Importation depuis la Chine</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Qualité garantie</h4>
                  <p className="text-gray-600 text-sm">Inspection avant expédition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="text-blue-600 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Livraison sécurisée</h4>
                  <p className="text-gray-600 text-sm">Partout en RDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={relatedProduct.image || '/placeholder.svg'}
                        alt={relatedProduct.name}
                        onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{relatedProduct.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">${relatedProduct.price ?? relatedProduct.price_usd ?? relatedProduct.price_cdf ?? '—'}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Avis et commentaires</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun avis pour ce produit pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((r, idx) => (
                <div key={r.id || idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">{r.name || r.user_name || 'Client anonyme'}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(r.created_at || r.date || Date.now()).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {r.rating || r.stars ? (
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg">
                        <div className="flex items-center gap-0.5">
                          {[...Array(Math.min(5, Math.round(r.rating || r.stars || 0)))].map((_, i) => (
                            <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                          ))}
                          {[...Array(5 - Math.round(r.rating || r.stars || 0))].map((_, i) => (
                            <Star key={`empty-${i}`} size={16} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="font-bold text-gray-700 ml-1">{r.rating || r.stars || 0}/5</span>
                      </div>
                    ) : null}
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{r.comment || r.message || r.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
