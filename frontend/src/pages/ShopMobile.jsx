import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search } from 'lucide-react';
import { getCategories, getProducts, searchProducts } from '../services/api';
import { Input } from '../components/ui/input';

const ShopMobile = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Charger les produits en fonction des filtres
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let products = [];
        
        if (searchQuery.trim()) {
          products = await searchProducts(searchQuery);
        } else if (selectedCategory === 'all') {
          products = await getProducts();
        } else {
          products = await getProducts({ category: selectedCategory });
        }
        
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery]);

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
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Boutique</h1>
        
        {/* Barre de recherche */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white h-11 border-0"
          />
        </div>
        
        {/* Filtre catégorie */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-white h-11 border-0">
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des produits */}
      <div className="px-4 mt-6">
        <p className="text-sm text-gray-600 mb-4">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden border border-gray-200">
                <div className="relative">
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  {product.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                        Populaire
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600">${product.price ?? product.price_usd ?? product.price_cdf ?? '—'}</p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs">
                      Voir
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMobile;
