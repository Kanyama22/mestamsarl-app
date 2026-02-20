import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { signIn } from '../services/auth';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      
      toast({
        title: "Connexion réussie ✓",
        description: "Bienvenue !",
        duration: 2000,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect",
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
          <h1 className="text-2xl font-bold text-white">Connexion</h1>
          <p className="text-white/80 text-sm">Accédez à votre compte</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Card className="p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Votre mot de passe"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-600 font-semibold">
              Créer un compte
            </Link>
          </p>
          <Link to="/" className="text-gray-500 text-sm block">
            Continuer sans compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
