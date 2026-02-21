import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Package, Printer } from 'lucide-react';
import { getOrderById } from '../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const o = await getOrderById(id);
        setOrder(o);
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Commande non trouvée</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const total = order.total ?? 0;
  const items = order.items || [];
  const isArray = Array.isArray(items);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-lg text-gray-600 mb-2">Merci pour votre achat</p>
          <p className="text-sm text-gray-500">Un email de confirmation a été envoyé à {order.customer_email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Number */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
                    <p className="text-2xl font-bold text-gray-900">{order.id?.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Statut</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-600">Confirmée</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Montant total</p>
                    <p className="text-2xl font-bold text-blue-600">${total?.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">Articles commandés</h2>
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
                      {order.product_name || 'Produit'}<br />
                      <span className="text-sm">Quantité: {order.quantity || 1}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Adresse de livraison</h2>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p className="font-semibold text-gray-900 mb-2">{order.customer_name}</p>
                  {order.customer_address && (
                    <p className="text-gray-600 mb-1">{order.customer_address}</p>
                  )}
                  {(order.customer_zip || order.customer_city) && (
                    <p className="text-gray-600 mb-2">
                      {order.customer_zip && `${order.customer_zip} `}
                      {order.customer_city}
                    </p>
                  )}
                  <p className="text-gray-600 mb-1">{order.customer_email}</p>
                  <p className="text-gray-600">{order.customer_phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Prochaines étapes</h2>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Nous vous contactons pour confirmer votre adresse de livraison</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    <span>Votre commande est préparée et expédiée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                    <span>Vous recevez un numéro de suivi par email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                    <span>Livraison à votre porte</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Résumé de commande</h3>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total:</span>
                    <span className="font-semibold">${total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison:</span>
                    <span className="font-semibold">Gratuit</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">${total?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/shop')}
                  >
                    Continuer mes achats
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer la commande
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center">
                  Vous pouvez suivre votre commande dans votre espace client.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
