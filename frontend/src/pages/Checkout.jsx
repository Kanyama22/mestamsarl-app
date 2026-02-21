import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { getOrderById, updateOrderStatus } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { Lock, CheckCircle, AlertCircle, Loader, CreditCard, MapPin, Package } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const o = await getOrderById(id);
        setOrder(o);
        if (o?.customer_name) {
          setCardData(prev => ({ ...prev, name: o.customer_name }));
        }
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePayment = async () => {
    // Validation simple
    if (!cardData.number || !cardData.expiry || !cardData.cvc) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs de paiement',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mettre à jour le statut de la commande
      await updateOrderStatus(id, 'paid');

      toast({
        title: 'Paiement réussi ✓',
        description: 'Votre commande a été confirmée. Vous recevrez un email de confirmation.',
        duration: 3000
      });

      setTimeout(() => {
        navigate(`/order-confirmation/${id}`);
      }, 1000);
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: 'Erreur de paiement',
        description: 'Le paiement a échoué. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Commande non trouvée</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const total = order.total ?? order.amount ?? 0;
  const items = order.items || [];
  const isArray = Array.isArray(items);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Finaliser votre commande</h1>
          <p className="text-gray-600">Commande #{order.id?.slice(0, 8)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            {/* Items */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Vos articles</h2>
                </div>

                <div className="space-y-4">
                  {isArray && items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      {order.product_name || order.product_id}<br />
                      <span className="text-sm">Quantité: {order.quantity || 1}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Adresse de livraison</h2>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">{order.customer_name}</p>
                  {order.customer_address && (
                    <>
                      <p className="text-gray-600">{order.customer_address}</p>
                      <p className="text-gray-600">
                        {order.customer_zip && `${order.customer_zip} `}
                        {order.customer_city}
                      </p>
                    </>
                  )}
                  <p className="text-gray-600 mt-2">{order.customer_email}</p>
                  <p className="text-gray-600">{order.customer_phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Méthode de paiement</h2>
                </div>

                <div className="space-y-4">
                  {/* Card Payment */}
                  <div className="border rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold text-gray-900">Carte bancaire</span>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 mt-4 pl-7">
                        <div>
                          <Label className="text-sm font-semibold mb-2">Numéro de carte</Label>
                          <Input
                            value={cardData.number}
                            onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\s/g, '')})}
                            placeholder="4111 1111 1111 1111"
                            maxLength="16"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-semibold mb-2">Expiration (MM/YY)</Label>
                            <Input
                              value={cardData.expiry}
                              onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                              placeholder="12/26"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2">CVV/CVC</Label>
                            <Input
                              value={cardData.cvc}
                              onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                              placeholder="123"
                              maxLength="4"
                              type="password"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold mb-2">Nom sur la carte</Label>
                          <Input
                            value={cardData.name}
                            onChange={(e) => setCardData({...cardData, name: e.target.value})}
                            placeholder="JOHN DOE"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Money */}
                  <div className="border rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={paymentMethod === 'mobile'}
                        onChange={() => setPaymentMethod('mobile')}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold text-gray-900">Mobile Money</span>
                    </label>
                  </div>

                  {/* Bank Transfer */}
                  <div className="border rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold text-gray-900">Virement bancaire</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Résumé</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-semibold">${total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison:</span>
                    <span className="font-semibold">Gratuit</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-blue-600">${total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 mb-3"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Confirmer le paiement
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/cart')}
                  disabled={processing}
                >
                  Retour au panier
                </Button>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 flex items-start gap-2">
                    <Lock size={14} className="mt-0.5 flex-shrink-0" />
                    Votre paiement est sécurisé et chiffré SSL 256-bit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
