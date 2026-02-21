import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getOrderById, updateOrderStatus } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const o = await getOrderById(id);
      setOrder(o);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleMockPay = async () => {
    try {
      await updateOrderStatus(id, 'paid');
      toast({ title: 'Paiement simulé', description: 'La commande est marquée comme payée.' });
      navigate('/orders');
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de marquer la commande comme payée', variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!order) return <div className="p-8">Commande non trouvée.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Paiement de la commande</h1>
      <Card>
        <CardContent>
          <div className="mb-4">
            <div className="text-sm text-gray-600">Commande</div>
            <div className="font-semibold">{order.id}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-600">Produit</div>
            <div className="font-semibold">{order.product_name || order.product_id}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-600">Montant</div>
            <div className="font-bold text-xl">${order.total ?? order.amount ?? order.price ?? '—'}</div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleMockPay} className="bg-green-600 hover:bg-green-700">Payer (simulateur)</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
