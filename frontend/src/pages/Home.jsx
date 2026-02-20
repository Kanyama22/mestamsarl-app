import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Package, Shield, Truck } from 'lucide-react';
import { categories, products } from '../mock';

const Home = () => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1678182451047-196f22a4143e)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Commandez en Chine — Livraison Sécurisée en RDC
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Prix usine • Inspection rigoureuse • Livraison partout en RDC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6">
                Découvrir nos produits
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Nos Catégories</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Cliquez sur une catégorie pour voir les produits</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-gray-200 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Produits en Vedette</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Découvrez nos meilleures offres</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{product.name}</h3>
                    <p className="text-3xl font-bold text-blue-600">${product.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-6">
                <Package size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Prix Usine Direct</h3>
              <p className="text-gray-600 text-lg">Achetez directement depuis la Chine sans intermédiaires</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-6">
                <Shield size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Inspection Rigoureuse</h3>
              <p className="text-gray-600 text-lg">Contrôle qualité avant expédition et assurance transport</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-6">
                <Truck size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Livraison Sécurisée</h3>
              <p className="text-gray-600 text-lg">Partout en RDC : Kinshasa, Lubumbashi, Kolwezi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
