import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { products, categories } from '../mock';
import { useToast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

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

  const category = categories.find(c => c.id === product.category);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

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
                src={product.image} 
                alt={product.name}
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
              <p className="text-5xl font-bold text-blue-600 mb-6">${product.price}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Spécifications</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-100 pb-3 last:border-0">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-semibold text-gray-900">{value}</span>
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
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{relatedProduct.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">${relatedProduct.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
