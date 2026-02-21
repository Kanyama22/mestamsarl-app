import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { getCategories, getProducts } from '../services/api';

const HomeMobile = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Charger les données depuis Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts() // Charger tous les produits
        ]);
        
        setCategories(categoriesData);
        // Prendre les 6 premiers produits pour la section "populaires"
        setFeaturedProducts(productsData.slice(0, 6));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-scroll des catégories
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || categories.length === 0) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;
        
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [categories]);

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
    <div className="pb-20">
      {/* Header avec recherche */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">MESTAM SARL</h1>
        <p className="text-white/80 text-sm mb-4">Importation Chine → RDC</p>
        
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white h-11 border-0"
          />
        </div>
      </div>

      {/* Catégories - Défilement automatique infini */}
      <div className="mb-6 mt-6">
        <div className="flex items-center justify-between mb-3 px-4">
          <h2 className="text-base font-bold text-gray-900">Catégories</h2>
          <Link to="/shop" className="text-blue-600 text-sm font-medium">Voir tout</Link>
        </div>
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-hidden pb-2"
          style={{ scrollBehavior: 'auto' }}
        >
          {/* Dupliquer les catégories pour l'effet infini */}
          {[...categories, ...categories, ...categories].map((category, index) => (
            <Link key={`${category.id}-${index}`} to={`/shop?category=${category.id}`}>
              <div className="flex-shrink-0 w-20 ml-3 first:ml-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden mb-2 border border-gray-200">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center text-gray-700 font-medium line-clamp-2">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Produits en vedette */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Produits populaires</h2>
          <Link to="/shop" className="text-blue-600 text-sm font-medium">Voir tout</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden border border-gray-200">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600">${product.price ?? product.price_usd ?? product.price_cdf ?? '—'}</p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-3">
                      Voir
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Info livraison */}
      <div className="px-4 mt-6 mb-6">
        <Card className="bg-gray-50 p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Prix usine direct</p>
              <p className="text-xs text-gray-600">Importation depuis la Chine</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bouton de contact flottant */}
      <Link to="/contact-admin">
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 transition-colors">
          <MessageCircle className="text-white" size={24} />
        </button>
      </Link>
    </div>
  );
};

export default HomeMobile;
