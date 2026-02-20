import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, Phone, Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { createContactMessage } from '../services/api';
import { companyInfo } from '../mock';

const ContactAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      await createContactMessage({
        subject,
        message,
        status: 'new'
      });

      toast({
        title: "Message envoyé ✓",
        description: "Un admin vous répondra bientôt",
        duration: 3000,
      });

      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-12 pb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Contacter l'Admin</h1>
          <p className="text-white/80 text-sm">Nous vous répondons rapidement</p>
        </div>
      </div>

      {/* Chat rapide */}
      <div className="px-4 mt-6">
        <Card className="p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Envoyer un message</h3>
          
          <div className="space-y-3">
            <Input
              placeholder="Sujet"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-gray-300"
            />
            
            <Textarea
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="border-gray-300 resize-none"
            />
            
            <Button 
              onClick={handleSend}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send size={18} className="mr-2" />
              Envoyer le message
            </Button>
          </div>
        </Card>
      </div>

      {/* Contact direct */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact Direct</h3>
        
        <Card className="mb-3 border border-gray-200">
          <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Appeler</p>
              <p className="text-sm text-gray-600">{companyInfo.phone}</p>
            </div>
          </a>
        </Card>

        <Card className="border border-gray-200">
          <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">{companyInfo.email}</p>
            </div>
          </a>
        </Card>
      </div>

      {/* Horaires */}
      <div className="px-4 mt-6">
        <Card className="bg-gray-50 p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Horaires de réponse</h3>
          <p className="text-sm text-gray-600">Lun - Ven : 8h - 18h</p>
          <p className="text-sm text-gray-600">Sam : 9h - 14h</p>
          <p className="text-sm text-gray-600">Dim : Fermé</p>
        </Card>
      </div>
    </div>
  );
};

export default ContactAdmin;
