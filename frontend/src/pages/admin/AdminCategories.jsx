import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categories as initialCategories } from '../../mock';
import { useToast } from '../../hooks/use-toast';

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, ...formData }
          : c
      ));
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès.",
        duration: 3000,
      });
    } else {
      const newCategory = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        ...formData
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Catégorie ajoutée",
        description: "La catégorie a été ajoutée avec succès.",
        duration: 3000,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter(c => c.id !== categoryId));
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
        duration: 3000,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Catégories</h1>
          <p className="text-gray-600">{categories.length} catégorie(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenDialog()}>
              <Plus size={20} className="mr-2" />
              Ajouter une catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Équipement Électrique"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description de la catégorie..."
                  rows={3}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                  className="mt-2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingCategory ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative h-48">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">{category.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(category)}
                >
                  <Edit size={16} className="mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
