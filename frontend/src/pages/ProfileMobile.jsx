import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, MapPin, Phone, Mail, ShoppingBag, Settings, HelpCircle, ChevronRight, LogOut, LogIn } from 'lucide-react';
// companyInfo removed from profile display
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';
import { useToast } from '../hooks/use-toast';

const ProfileMobile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        duration: 2000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const menuItems = [
    { icon: ShoppingBag, label: 'Mes commandes', action: () => {} },
    { icon: User, label: 'Informations personnelles', action: () => {} },
    { icon: MapPin, label: 'Adresses de livraison', action: () => {} },
    { icon: Settings, label: 'Paramètres', action: () => {} },
    { icon: HelpCircle, label: 'Aide & Support', action: () => {} },
  ];

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

  return (
    <div className="pb-20 bg-gray-50">
      {/* Header simple */}
      <div className="bg-blue-600 px-4 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <User size={32} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isAuthenticated ? (user?.user_metadata?.name || 'Mon Profil') : 'Invité'}
            </h2>
            <p className="text-blue-100 text-sm">
              {isAuthenticated ? user?.email : 'Non connecté'}
            </p>
          </div>
        </div>
      </div>

      {/* Boutons de connexion/inscription si non connecté */}
      {!isAuthenticated && (
        <div className="px-4 mt-6 space-y-3">
          <Button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          >
            <LogIn size={20} className="mr-2" />
            Se connecter
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="outline"
            className="w-full h-12"
          >
            Créer un compte
          </Button>
        </div>
      )}

      {/* Menu options */}
      {isAuthenticated && (
        <div className="px-4 mt-6 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index}
                className="bg-white border border-gray-200"
                onClick={item.action}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon size={20} className="text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </Card>
            );
          })}
          
          {/* Bouton déconnexion */}
          <Card 
            className="bg-white border border-red-200"
            onClick={handleLogout}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut size={20} className="text-red-600" />
                </div>
                <span className="font-medium text-red-600">Se déconnecter</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* (Contact and legal information removed) */}
    </div>
  );
};

export default ProfileMobile;
