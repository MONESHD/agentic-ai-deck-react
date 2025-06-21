const localApiUrl = 'http://127.0.0.1:5007';
const productionApiUrl = 'https://ai-agent-optimizer.onrender.com';

export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? productionApiUrl
  : localApiUrl; 