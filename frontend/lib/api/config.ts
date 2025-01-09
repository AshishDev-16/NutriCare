export const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  return baseUrl
}

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
}; 