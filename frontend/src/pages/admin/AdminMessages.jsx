import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { getContactMessages, updateMessageStatus } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMessageStatus(id, status);
      toast({
        title: "Statut mis à jour",
        duration: 2000,
      });
      loadMessages();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-600">Nouveau</Badge>;
      case 'read':
        return <Badge className="bg-gray-600">Lu</Badge>;
      case 'replied':
        return <Badge className="bg-green-600">Répondu</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages de Contact</h1>
          <p className="text-gray-600">{messages.length} message{messages.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={loadMessages} variant="outline">
          Actualiser
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg">Aucun message pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{message.subject}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock size={14} />
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(message.status)}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                </div>

                <div className="flex gap-2">
                  {message.status === 'new' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(message.id, 'read')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Marquer comme lu
                    </Button>
                  )}
                  {message.status === 'read' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(message.id, 'replied')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Marquer comme répondu
                    </Button>
                  )}
                  {message.status === 'replied' && (
                    <span className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle size={16} />
                      Répondu
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
