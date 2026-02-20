import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star } from 'lucide-react';
import { getProductById } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ProductDetailMobile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
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
    <div className="pb-32 bg-white">
      {/* Header avec image */}
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-96 object-cover"
        />
        
        {/* Boutons superposés */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg"
            >
              <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-900'} />
            </button>
            <button className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg">
              <Share2 size={20} className="text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-4 -mt-6">
        <Card className="rounded-3xl shadow-xl p-6 bg-white">
          {/* Prix et titre */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-4">{product.name}</h1>
              {product.featured && (
                <Badge className="bg-orange-500">Populaire</Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-blue-600">${product.price}</p>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">4.8</span>
                <span className="text-sm text-gray-500">(120)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Spécifications */}
          {product.specifications && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Spécifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
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
          
          {/* Bouton ajouter au panier */}
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-full text-base font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} className="mr-2" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailMobile;
