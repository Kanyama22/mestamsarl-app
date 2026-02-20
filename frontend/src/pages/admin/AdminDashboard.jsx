import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Package, FolderOpen, ShoppingCart, TrendingUp } from 'lucide-react';
import { products, categories } from '../../mock';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Produits',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Catégories',
      value: categories.length,
      icon: FolderOpen,
      color: 'bg-green-500',
      change: '+2%'
    },
    {
      title: 'Commandes (mock)',
      value: 24,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
      change: '+8%'
    },
    {
      title: 'Revenu Total (mock)',
      value: '$12,450',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const recentProducts = products.filter(p => p.featured).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Products */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Produits en Vedette</h2>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
