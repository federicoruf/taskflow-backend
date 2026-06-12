import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data; // Retorna { token, id, name, email }
  },
  
  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data; // Retorna { token, id, name, email } del usuario creado
  }
};