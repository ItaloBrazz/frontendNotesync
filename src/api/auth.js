import { request, AUTH_BASE } from './http.js';

// Path para autenticação - os serviços já têm /api/auth configurado
const AUTH_PATH = '/api/auth';

export const login = (credentials) => request(`${AUTH_PATH}/login`, {
  method: 'POST',
  body: credentials,
  baseUrl: AUTH_BASE
});

export const register = (payload) => request(`${AUTH_PATH}/register`, {
  method: 'POST',
  body: payload,
  baseUrl: AUTH_BASE
});
