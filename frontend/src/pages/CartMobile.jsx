import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CartMobile = () => {
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
      duration: 2000,
    });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toast({
      title: "Commande enregistrée ✅",
      description: "Nous vous contactons bientôt.",
      duration: 3000,
    });
    localStorage.setItem('cart', '[]');
    setCartItems([]);
  };

  return (
    <div className="pb-32 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-white mb-1">Mon Panier</h1>
        <p className="text-blue-100">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="bg-gray-200 p-8 rounded-full mb-6">
            <ShoppingBag size={60} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Panier vide</h2>
          <p className="text-gray-600 mb-8 text-center">Commencez vos achats maintenant!</p>
          <Button 
            onClick={() => navigate('/shop')}
            className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
          >
            Découvrir les produits
          </Button>
        </div>
      ) : (
        <>
          {/* Articles */}
          <div className="px-4 mt-6 space-y-3 mb-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="rounded-2xl overflow-hidden shadow-md">
                <div className="flex gap-4 p-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-lg font-bold text-blue-600 mb-2">${item.price}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantité */}
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2"
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Supprimer */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Bottom bar fixe avec total */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Livraison</span>
              <span className="font-semibold text-gray-900">À calculer</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-full text-base font-semibold"
          >
            Commander maintenant
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartMobile;
