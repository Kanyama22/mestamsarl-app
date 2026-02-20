import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de votre panier.",
      duration: 3000,
    });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toast({
      title: "Commande enregistrée",
      description: "Votre commande a été enregistrée avec succès. Nous vous contactons bientôt.",
      duration: 5000,
    });
    localStorage.setItem('cart', '[]');
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mon Panier</h1>
          <p className="text-xl text-blue-100">Vérifiez vos articles avant de commander</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/shop')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Continuer mes achats
        </Button>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={80} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8 text-lg">Commencez vos achats dès maintenant!</p>
            <Link to="/shop">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Découvrir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full sm:w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600">{item.name}</h3>
                        </Link>
                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                              <Button 
                                variant="ghost" 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3"
                                size="sm"
                              >
                                -
                              </Button>
                              <span className="px-4 font-semibold">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3"
                                size="sm"
                              >
                                +
                              </Button>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">${item.price * item.quantity}</p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Retirer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Résumé de la commande</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Livraison:</span>
                      <span className="font-semibold text-gray-900">À calculer</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    onClick={handleCheckout}
                  >
                    Passer la commande
                  </Button>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Nous vous contacterons pour confirmer votre commande et organiser la livraison.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
