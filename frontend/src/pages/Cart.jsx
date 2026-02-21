import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2, ShoppingBag, ArrowLeft, Loader } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, createContactMessage } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

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

  const totalPrice = cartItems.reduce((sum, item) => sum + ((item.price ?? item.price_usd ?? item.price_cdf ?? 0) * item.quantity), 0);

  const handleCheckout = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Créer une commande pour chaque produit ou une commande unique avec tous les items
      const orderData = {
        user_id: user?.id || null,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price ?? item.price_usd ?? item.price_cdf ?? 0,
        })),
        total: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        customer_zip: formData.zip,
        created_at: new Date().toISOString(),
      };

      const order = await createOrder(orderData);

      if (order && order.id) {
        toast({
          title: 'Commande créée ✓',
          description: 'Redirection vers paiement...',
          duration: 2000,
        });

        // Notify admin about the new order and request discussion about delivery fees
        try {
          const contactPayload = {
            name: formData.name || (user?.email?.split('@')[0] || 'Client'),
            email: formData.email || user?.email || '',
            message: `Nouvelle commande créée (ID: ${order.id}).\nMontant: $${order.total}.\nJe souhaite discuter des frais de livraison pour cette commande.`,
            status: 'new',
            order_id: order.id,
            created_at: new Date().toISOString(),
          };
          await createContactMessage(contactPayload);
        } catch (err) {
          console.error('Failed to notify admin about order:', err);
        }

        setTimeout(() => {
          localStorage.setItem('cart', '[]');
          navigate(`/checkout/${order.id}`);
        }, 500);
      } else {
        throw new Error('Échec création commande');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        title: 'Erreur de commande',
        description: err.message || 'Impossible de créer votre commande',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
                      <span className="font-semibold text-gray-900">Gratuit</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!showCheckoutForm ? (
                    <Button 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                      onClick={() => setShowCheckoutForm(true)}
                      disabled={loading}
                    >
                      Procéder au paiement
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-semibold mb-1">Nom complet</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-1">Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-1">Téléphone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          placeholder="+243 123456789"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-1">Adresse</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => handleFormChange('address', e.target.value)}
                          placeholder="123 Rue..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-sm font-semibold mb-1">Ville</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => handleFormChange('city', e.target.value)}
                            placeholder="Kinshasa"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold mb-1">Code postal</Label>
                          <Input
                            value={formData.zip}
                            onChange={(e) => handleFormChange('zip', e.target.value)}
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                        onClick={handleCheckout}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader size={20} className="mr-2 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          'Aller au paiement'
                        )}
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowCheckoutForm(false)}
                        disabled={loading}
                      >
                        Retour panier
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Vos données sont sécurisées et stockées de manière confidentielle.
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
