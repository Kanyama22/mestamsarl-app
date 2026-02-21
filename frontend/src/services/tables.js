// Central table name configuration to avoid 404s and keep names consistent
export const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CONTACT_MESSAGES: 'contact_messages',
  // There is no `contacts` table in the DB schema; fallback to `messages` if needed
  CONTACTS: 'messages',
  // In the DB schema the reviews table is named `reviews`. Use that as primary
  PRODUCT_REVIEWS_PRIMARY: 'reviews',
  PRODUCT_REVIEWS_FALLBACK: 'product_reviews',
};

// Export arrays for easy iteration
export const REVIEW_TABLE_PREFERENCES = [TABLES.PRODUCT_REVIEWS_PRIMARY, TABLES.PRODUCT_REVIEWS_FALLBACK];
