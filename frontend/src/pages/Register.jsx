import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { signUp } from '../services/auth';
import { useToast } from '../hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name
      });
      
      toast({
        title: "Compte créé ✓",
        description: "Vérifiez votre email pour confirmer votre compte",
        duration: 5000,
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le compte",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-12 pb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
          <p className="text-white/80 text-sm">Rejoignez MESTAM SARL</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Card className="p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                <User size={18} />
                Nom complet
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Votre nom"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail size={18} />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                <Lock size={18} />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                <Lock size={18} />
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                placeholder="Retapez votre mot de passe"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
