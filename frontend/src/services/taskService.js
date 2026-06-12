import API from './api';

export const taskService = {
  getAll: async () => {
    const response = await API.get('/tasks');
    return response.data;
  },

  create: async (task) => {
    const response = await API.post('/tasks', task);
    return response.data;
  },

  updateStatus: async (id, completed) => {
    const response = await API.put(`/tasks/${id}`, { completed });
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  }
};