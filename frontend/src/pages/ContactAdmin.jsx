import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { ArrowLeft, Send, Phone, Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { createContactMessage, getContactMessages } from '../services/api';
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


      {/* Fixed bottom input */}
      <div className="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="w-full border rounded px-3 py-2 resize-none" placeholder="Écrire un message..."></textarea>
            {file && <div className="mt-2 text-sm">Pièce jointe: {file.name} <button onClick={() => setFile(null)} className="ml-2 text-red-500">Supprimer</button></div>}
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center px-3 py-2 border rounded">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0016.586 6L13 2.414A2 2 0 0011.586 2H4z" /></svg>
            </label>
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">Envoyer</Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactAdmin;
