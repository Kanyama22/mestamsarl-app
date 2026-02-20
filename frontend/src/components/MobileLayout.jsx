import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User, Bell } from 'lucide-react';
import { Toaster } from './ui/toaster';

const MobileLayout = () => {
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Mettre à jour le compteur de notifications
  useEffect(() => {
    // Simuler des notifications (en production, ce serait via API/WebSocket)
    const mockNotifications = [
      { id: '1', read: false },
      { id: '2', read: false }
    ];
    const unread = mockNotifications.filter(n => !n.read).length;
    setNotificationCount(unread);
  }, []);
  
  // Ne pas afficher la navigation pour les pages admin
  if (location.pathname.includes('/admin')) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  // Masquer la navigation pour les pages de contact, notifications, login et register
  const hideNav = location.pathname === '/contact-admin' || 
                  location.pathname === '/notifications' ||
                  location.pathname === '/login' ||
                  location.pathname === '/register';

  const navigation = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Boutique', path: '/shop', icon: ShoppingBag },
    { name: 'Panier', path: '/cart', icon: ShoppingCart },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Bouton notifications flottant */}
      {!hideNav && (
        <Link to="/notifications" className="fixed top-4 right-4 z-50">
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
              <Bell size={20} className="text-gray-700" />
            </div>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
        </Link>
      )}

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center justify-around h-16">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon size={24} className={isActive ? 'mb-1' : 'mb-1'} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      <Toaster />
    </div>
  );
};

export default MobileLayout;
