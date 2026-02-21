import React, { useState, useEffect, useRef } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(Array.isArray(data) ? data.reverse() : []);
      // scroll to bottom
      setTimeout(() => messagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    loadMessages();
    const id = setInterval(loadMessages, 5000);
    return () => clearInterval(id);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: 'Erreur', description: 'Le message est vide', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        name: name || 'Client',
        email: email || '',
        message: message.trim(),
        status: 'new',
        created_at: new Date().toISOString(),
      };
      if (file) payload.file = file;

      await createContactMessage(payload);
      toast({ title: 'Message envoyé', duration: 2000 });
      setMessage('');
      setFile(null);
      loadMessages();
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Impossible d'envoyer le message", variant: "destructive" });
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

      {/* Chat area */}
      <div className="px-4 mt-6 pb-32">
        <Card className="p-4 border border-gray-200 h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && <p className="text-sm text-gray-500">Aucune conversation pour le moment</p>}
            {messages.map((m) => (
              <div key={m.id || m.created_at} className={`p-3 rounded-lg ${m.email ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-800">{m.name || m.email || 'Inconnu'}</div>
                  <div className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString('fr-FR')}</div>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap mb-2">{m.message}</div>
                {m.attachment_url && (
                  <img src={m.attachment_url} alt="attachement" className="max-w-xs rounded-md" />
                )}
              </div>
            ))}
            <div ref={messagesRef} />
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
