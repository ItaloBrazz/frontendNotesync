import { request } from './http.js';

export const login = (credentials) => request('/auth/login', {
  method: 'POST',
  body: credentials
});

export const register = (payload) => request('/auth/register', {
  method: 'POST',
  body: payload
});
