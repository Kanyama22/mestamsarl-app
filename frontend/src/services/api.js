import { supabase } from '../lib/supabase';

// Try common buckets when resolving storage paths
const STORAGE_BUCKETS = ['images', 'public', 'uploads'];

async function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return '/placeholder.svg';
  if (pathOrUrl.startsWith('http')) return pathOrUrl;

  // Try each common bucket to find a public URL
  for (const bucket of STORAGE_BUCKETS) {
    try {
      // getPublicUrl returns: { data: { publicUrl } } in newer SDKs
      const res = supabase.storage.from(bucket).getPublicUrl(pathOrUrl);
      const publicUrl = res?.data?.publicUrl || res?.publicURL || res?.data?.publicURL;
      if (publicUrl && publicUrl.indexOf('null') === -1) return publicUrl;
    } catch (err) {
      // ignore and try next bucket
    }
  }

  // Last resort: return placeholder
  return '/placeholder.svg';
}

// Categories
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Mapper les colonnes si nécessaire et résoudre les URLs d'images
    return await Promise.all((data || []).map(async cat => ({
      ...cat,
      image: await resolveImageUrl(cat.image_url || cat.image || ''),
    })));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      image: await resolveImageUrl(data.image_url || data.image || ''),
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

// Products
export const getProducts = async (filters = {}) => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Mapper les colonnes d'images (priorité à `images[0]`) et résoudre les URLs de stockage
    const results = await Promise.all((data || []).map(async product => {
      const firstImage = (product.images && product.images.length) ? product.images[0] : (product.image_url || product.image || '');
      return {
        ...product,
        image: await resolveImageUrl(firstImage),
      };
    }));
    
    // Filtrer featured côté client si nécessaire
    if (filters.featured !== undefined) {
      results = results.filter(p => p.featured === filters.featured);
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    const firstImage = (data.images && data.images.length) ? data.images[0] : (data.image_url || data.image || '');
    return {
      ...data,
      image: await resolveImageUrl(firstImage),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return await Promise.all((data || []).map(async product => {
      const firstImage = (product.images && product.images.length) ? product.images[0] : (product.image_url || product.image || '');
      return {
        ...product,
        image: await resolveImageUrl(firstImage),
      };
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Orders
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Contact Messages
export const createContactMessage = async (messageData) => {
  try {
    // If there is a file object, upload it to storage first
    if (messageData.file instanceof File) {
      try {
        const filename = `contact-${Date.now()}-${messageData.file.name}`;
        const bucket = 'contact-attachments';
        const uploadRes = await supabase.storage.from(bucket).upload(filename, messageData.file, { cacheControl: '3600', upsert: false });
        if (uploadRes.error) {
          console.warn('Attachment upload failed:', uploadRes.error);
        } else {
          const publicRes = supabase.storage.from(bucket).getPublicUrl(uploadRes.data.path || filename);
          const publicUrl = publicRes?.data?.publicUrl || publicRes?.publicURL || null;
          if (publicUrl) messageData.attachment_url = publicUrl;
        }
      } catch (err) {
        console.error('Failed to upload attachment:', err);
      }
    }

    // Essayer d'abord avec 'contact_messages'
    let { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();

    // Si erreur, essayer avec 'contacts'
    if (error) {
      const result = await supabase
        .from('contacts')
        .insert([messageData])
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating contact message:', error);
    // En dernier recours, sauvegarder en localStorage
    const localMessages = JSON.parse(localStorage.getItem('pending_messages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      created_at: new Date().toISOString()
    };
    localMessages.push(newMessage);
    localStorage.setItem('pending_messages', JSON.stringify(localMessages));
    return newMessage;
  }
};

// Get all contact messages (for admin)
export const getContactMessages = async () => {
  try {
    // Essayer d'abord avec 'contact_messages'
    let { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Si erreur, essayer avec 'contacts'
    if (error) {
      const result = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      data = result.data;
      error = result.error;
    }
    
    // Si toujours une erreur, charger depuis localStorage
    if (error) {
      const localMessages = JSON.parse(localStorage.getItem('pending_messages') || '[]');
      return localMessages;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    const localMessages = JSON.parse(localStorage.getItem('pending_messages') || '[]');
    return localMessages;
  }
};

// Update contact message status
export const updateMessageStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};
