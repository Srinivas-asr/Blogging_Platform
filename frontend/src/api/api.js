import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include auth token and debugging
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (userData) => API.post('/users/login', userData);
export const getUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const updateUserProfile = (id, userData) => API.put(`/users/${id}`, userData);
export const updateUserPassword = (id, passwordData) => API.put(`/users/${id}/password`, passwordData);
export const verifyPassword = (id, passwordData) => API.post(`/users/${id}/verify-password`, passwordData);

export const getBlogs = () => API.get('/blogs');
export const getAdminBlogs = () => API.get('/admin/blogs');
export const getBlogById = (id) => API.get(`/blogs/${id}`);
export const createBlog = (blogData) => API.post('/blogs', blogData);
export const updateBlog = (id, blogData) => API.put(`/blogs/${id}`, blogData);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
export const addComment = (id, commentData) => API.post(`/blogs/${id}/comments`, commentData);
export const toggleLike = (id, increment) => API.put(`/blogs/${id}/like`, { increment });