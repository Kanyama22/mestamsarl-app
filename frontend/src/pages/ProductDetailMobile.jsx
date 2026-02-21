import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from 'lucide-react';
import { getProductById, createOrder, getProductReviews } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { testimonials } from '../mock';

const ProductDetailMobile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        const revs = await getProductReviews(id);
        setReviews(revs && revs.length ? revs : (testimonials || []));
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Produit non trouvé</h2>
          <Button onClick={() => navigate('/shop')}>Retour</Button>
        </div>
      </div>
    );
  }

  const parseSpecifications = (specs) => {
    if (!specs) return null;
    if (typeof specs === 'object') return specs;
    try { return JSON.parse(specs); } catch (e) { return null; }
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
      if (order && order.id) window.location.href = `/checkout/${order.id}`;
    } catch (err) {
      console.error('Buy now mobile error', err);
      toast({ title: 'Erreur', description: 'Impossible de créer la commande', variant: 'destructive' });
    }
  };

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
      title: "Ajouté au panier ✅",
      description: `${product.name}`,
      duration: 2000,
    });
  };

  return (
    <div className="pb-32 bg-gray-50">
      {/* Header avec image */}
      <div className="relative">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          className="w-full h-96 object-cover"
        />
        
        {/* Boutons superposés */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition"
            >
              <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-900'} />
            </button>
            <button className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-white transition">
              <Share2 size={20} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 -mt-6 mb-4">
        <Card className="rounded-3xl shadow-lg p-6 bg-white">
          {/* Titre et badge */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 pr-2">{product.name}</h1>
              {product.featured && (
                <Badge className="bg-orange-500 text-white whitespace-nowrap">Populaire</Badge>
              )}
            </div>

            {/* Prix et note */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-3xl font-bold text-blue-600">${product.price ?? product.price_usd ?? product.price_cdf ?? '—'}</p>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-1">4.8</span>
                <span className="text-xs text-gray-500">(120)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h3 className="text-base font-semibold mb-2 text-gray-900">À propos de ce produit</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{product.long_description || product.short_description || product.description}</p>
          </div>

          {/* Spécifications */}
          {parseSpecifications(product.specifications) && (
            <div className="mb-0">
              <h3 className="text-base font-semibold mb-3 text-gray-900">Spécifications techniques</h3>
              <div className="space-y-2">
                {Object.entries(parseSpecifications(product.specifications)).map(([key, value], idx) => (
                  <div key={key} className={`flex justify-between py-2.5 ${idx !== Object.keys(parseSpecifications(product.specifications)).length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-gray-600 capitalize text-sm font-medium">{key}:</span>
                    <span className="font-semibold text-gray-900 text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Section Avis & commentaires */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Avis et commentaires</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl">
            <p className="text-gray-500 text-sm">Aucun avis pour ce produit pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review, idx) => (
              <Card key={review.id || idx} className="p-4 bg-white rounded-2xl shadow-sm">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{review.name || review.user_name || 'Client'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(review.created_at || review.date || Date.now()).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    {review.rating || review.stars ? (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <div className="flex items-center gap-0.5">
                          {[...Array(Math.min(5, Math.round(review.rating || review.stars || 0)))].map((_, i) => (
                            <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-700 ml-1">{review.rating || review.stars || 0}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{review.comment || review.message || review.body}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Quantité */}
          <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 font-bold text-gray-700"
            >
              -
            </button>
            <span className="px-4 py-2 font-bold text-gray-900 bg-gray-50">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 font-bold text-gray-700"
            >
              +
            </button>
          </div>
          
          <div className="flex-1 flex gap-2">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-full text-base font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} className="mr-2" />
              Ajouter
            </Button>
            <Button 
              className="w-36 bg-green-600 hover:bg-green-700 h-12 rounded-full text-base font-semibold"
              onClick={handleBuyNow}
            >
              Acheter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailMobile;
