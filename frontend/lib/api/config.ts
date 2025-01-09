export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hospital-food-delivery.onrender.com/api/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}; 