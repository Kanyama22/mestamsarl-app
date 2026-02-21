import { supabase } from '../lib/supabase';
import { TABLES, REVIEW_TABLE_PREFERENCES } from './tables';

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
      .from(TABLES.CATEGORIES)
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
      .from(TABLES.CATEGORIES)
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
      .from(TABLES.PRODUCTS)
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
      .from(TABLES.PRODUCTS)
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
      .from(TABLES.PRODUCTS)
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

// Get reviews for a product (try common table names)
export const getProductReviews = async (productId) => {
  // Use configured review table preferences and normalize returned rows
  try {
    for (const t of REVIEW_TABLE_PREFERENCES) {
      try {
        const { data, error } = await supabase
          .from(t)
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) {
          // table missing or other error — log and continue
          console.debug(`getProductReviews: table '${t}' returned error:`, error.message || error);
          continue;
        }

        if (!data) continue;

        // Normalize rows to a consistent shape for UI
        const normalized = (data || []).map((r) => ({
          id: r.id,
          name: r.customer_name || r.user_name || r.name || r.customer || 'Client anonyme',
          email: r.customer_email || r.user_email || r.email || '',
          rating: r.rating || r.stars || 0,
          comment: r.comment || r.message || r.body || '',
          created_at: r.created_at || r.date || null,
          raw: r,
        }));

        return normalized;
      } catch (innerErr) {
        console.debug(`getProductReviews: exception when querying '${t}':`, innerErr?.message || innerErr);
        continue;
      }
    }

    return [];
  } catch (err) {
    console.error('Unexpected error fetching product reviews:', err);
    return [];
  }
};

// Orders
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
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

export const getOrderById = async (id) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching order:', err);
    return null;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error updating order status:', err);
    throw err;
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
      .from(TABLES.CONTACT_MESSAGES)
      .insert([messageData])
      .select()
      .single();

    // Si erreur, essayer avec 'contacts'
    if (error) {
      const result = await supabase
        .from(TABLES.CONTACTS)
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
      .from(TABLES.CONTACT_MESSAGES)
      .select('*')
      .order('created_at', { ascending: false });
    
    // Si erreur, essayer avec 'contacts'
    if (error) {
      const result = await supabase
        .from(TABLES.CONTACTS)
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
      .from(TABLES.CONTACT_MESSAGES)
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

// Create/Post a product review
export const createReview = async (reviewData) => {
  try {
    const primary = TABLES.PRODUCT_REVIEWS_PRIMARY;

    // Build payloads compatible with common schemas
    const payloadFor = (table) => {
      if (table === 'reviews') {
        return {
          product_id: reviewData.product_id,
          customer_name: reviewData.user_name || reviewData.customer_name || 'Anonyme',
          customer_email: reviewData.user_email || reviewData.customer_email || '',
          rating: reviewData.rating || 5,
          comment: reviewData.comment || ''
        };
      }
      // fallback/older schema (product_reviews)
      return {
        product_id: reviewData.product_id,
        user_id: reviewData.user_id || null,
        user_name: reviewData.user_name || reviewData.customer_name || 'Anonyme',
        rating: reviewData.rating || 5,
        comment: reviewData.comment || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    };

    // Try primary table first
    let { data, error } = await supabase
      .from(primary)
      .insert([payloadFor(primary)])
      .select()
      .single();

    if (!error && data) return data;

    // If primary failed, try fallback
    const fallback = TABLES.PRODUCT_REVIEWS_FALLBACK;
    const result = await supabase
      .from(fallback)
      .insert([payloadFor(fallback)])
      .select()
      .single();

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Error creating review:', error);
    // Save locally if Supabase fails
    const localReviews = JSON.parse(localStorage.getItem('pending_reviews') || '[]');
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      created_at: new Date().toISOString()
    };
    localReviews.push(newReview);
    localStorage.setItem('pending_reviews', JSON.stringify(localReviews));
    return newReview;
  }
};

// Update an existing review
export const updateReview = async (reviewId, updates) => {
  try {
    const table = TABLES.PRODUCT_REVIEWS_PRIMARY;
    // Map common update keys to schema-specific columns
    const mapped = { ...updates };
    if (mapped.user_name) {
      mapped.customer_name = mapped.user_name;
      delete mapped.user_name;
    }
    if (mapped.user_email) {
      mapped.customer_email = mapped.user_email;
      delete mapped.user_email;
    }
    if (mapped.updated_at === undefined) mapped.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(table)
      .update(mapped)
      .eq('id', reviewId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const { error } = await supabase
      .from(TABLES.PRODUCT_REVIEWS_PRIMARY)
      .delete()
      .eq('id', reviewId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
