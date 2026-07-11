export const AUTH = {
  LOGIN: '/api/accounts/login/',
  REGISTER: '/api/accounts/register/',
  REFRESH: '/api/accounts/login/refresh/',
  LOGOUT: '/api/accounts/logout/',
  PROFILE: '/api/accounts/profile/',
  CHANGE_PASSWORD: '/api/accounts/change-password/',
};

export const PRODUCTS = {
  LIST: '/api/products/',
  DETAIL: (id) => `/api/products/${id}/`,
};

export const CATEGORIES = {
  LIST: '/api/products/categories/',
  DETAIL: (slug) => `/api/products/categories/${slug}/`,
};

export const REVIEWS = {
  LIST: '/api/products/reviews/',
  CREATE: '/api/products/reviews/',
  DETAIL: (id) => `/api/products/reviews/${id}/`,
  ME: '/api/products/reviews/',
};

export const WISHLIST = {
  LIST: '/api/products/watchlist/',
  ADD: '/api/products/watchlist/',
  ITEM: (id) => `/api/products/watchlist/${id}/`,
};

export const CART = {
  LIST: '/api/cart/',
  ADD: '/api/cart/',
  ITEM: (id) => `/api/cart/${id}/`,
  CLEAR: '/api/cart/clear/',
  SUMMARY: '/api/cart/summary/',
};

export const ADDRESSES = {
  LIST: '/api/accounts/addresses/',
  CREATE: '/api/accounts/addresses/',
  ITEM: (id) => `/api/accounts/addresses/${id}/`,
};

export const ORDERS = {
  LIST: '/api/orders/',
  CHECKOUT: '/api/orders/checkout/',
  DETAIL: (id) => `/api/orders/${id}/`,
  CANCEL: (id) => `/api/orders/${id}/cancel/`,
};

export const ADMIN = {
  STATS: '/api/admin/dashboard/',
  PRODUCTS: '/api/admin/products/',
  PRODUCT_DETAIL: (id) => `/api/admin/products/${id}/`,
  PRODUCT_STOCK: (id) => `/api/admin/products/${id}/stock/`,
  ORDERS_LIST: '/api/admin/orders/',
  ORDER_STATUS: (id) => `/api/admin/orders/${id}/status/`,
  CATEGORIES_LIST: '/api/admin/categories/',
  CATEGORY_DETAIL: (id) => `/api/admin/categories/${id}/`,
};
