import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Package, Truck, CheckCircle, Bell } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Charger les notifications (mockées pour l'instant)
    const mockNotifications = [
      {
        id: '1',
        type: 'order',
        title: 'Commande confirmée',
        message: 'Votre commande #12345 a été confirmée',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: CheckCircle,
        color: 'bg-green-100 text-green-600'
      },
      {
        id: '2',
        type: 'shipping',
        title: 'En cours de livraison',
        message: 'Votre colis arrive demain',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: Truck,
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: '3',
        type: 'promo',
        title: 'Nouvelle promotion',
        message: '-20% sur tous les produits électriques',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: Package,
        color: 'bg-orange-100 text-orange-600'
      },
      {
        id: '4',
        type: 'order',
        title: 'Commande livrée',
        message: 'Votre commande #12344 a été livrée',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: CheckCircle,
        color: 'bg-green-100 text-green-600'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-white/80 text-sm">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <Bell className="text-white" size={24} />
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="px-4 mt-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Card 
                key={notif.id}
                className={`p-4 border ${
                  notif.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 ${notif.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      {!notif.read && (
                        <Badge className="bg-blue-600 text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(notif.date)}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
