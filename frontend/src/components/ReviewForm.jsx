import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Star, Send } from 'lucide-react';
import { createReview } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ReviewForm = ({ productId, productName, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(user?.email?.split('@')[0] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez écrire un commentaire',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        product_id: productId,
        user_id: user?.id,
        user_name: name || 'Anonyme',
        rating: parseInt(rating),
        comment: comment.trim(),
      };

      const result = await createReview(reviewData);
      
      if (result) {
        toast({
          title: 'Avis publié ✓',
          description: 'Merci pour votre avis !',
          duration: 3000
        });

        setComment('');
        setRating(5);
        setShowForm(false);
        
        if (onReviewSubmitted) {
          onReviewSubmitted(result);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de publier l\'avis. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vous désirez laisser un avis ?</h3>
          <p className="text-gray-600 text-sm mb-4">Connectez-vous pour publier votre avis sur ce produit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="flex-1 sm:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Se connecter
              </Button>
            </Link>
            <Link to="/register" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-12"
        >
          Écrire un avis
        </Button>
      ) : (
        <Card className="p-4 sm:p-6 bg-gray-50 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (prefilled if logged in) */}
            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Votre nom</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom (optionnel)"
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <Label className="text-gray-700 font-semibold mb-3 block">Note</Label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors cursor-pointer`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <Label className="text-gray-700 font-semibold mb-2 block">Votre avis</Label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 caractères
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-10"
              >
                <Send size={18} className="mr-2" />
                {loading ? 'Publication...' : 'Publier'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 border-2 border-gray-300"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ReviewForm;
