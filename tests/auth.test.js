import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register } from '../src/api/auth.js';
import * as http from '../src/api/http.js';

vi.mock('../src/api/http.js');

describe('Autenticação - API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve realizar login com credenciais válidas', async () => {
      const mockResponse = {
        token: 'jwt-token-123',
        usuario: {
          id: 1,
          nome: 'Usuario Teste',
          email: 'teste@example.com'
        }
      };

      http.request.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'teste@example.com',
        senha: 'senha123'
      };

      const result = await login(credentials);

      expect(http.request).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: credentials,
        baseUrl: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
      expect(result.token).toBeDefined();
      expect(result.usuario.email).toBe(credentials.email);
    });

    it('deve retornar erro quando credenciais são inválidas', async () => {
      const errorMessage = 'Credenciais inválidas';
      http.request.mockRejectedValue(new Error(errorMessage));

      const credentials = {
        email: 'invalido@example.com',
        senha: 'senhaerrada'
      };

      await expect(login(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    it('deve registrar novo usuário com dados válidos', async () => {
      const mockResponse = {
        token: 'jwt-token-456',
        usuario: {
          id: 2,
          nome: 'Novo Usuario',
          email: 'novo@example.com'
        }
      };

      http.request.mockResolvedValue(mockResponse);

      const payload = {
        nome: 'Novo Usuario',
        email: 'novo@example.com',
        senha: 'senha123'
      };

      const result = await register(payload);

      expect(http.request).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: payload,
        baseUrl: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
      expect(result.usuario.nome).toBe(payload.nome);
    });

    it('deve retornar erro quando email já está em uso', async () => {
      const errorMessage = 'Email já cadastrado';
      http.request.mockRejectedValue(new Error(errorMessage));

      const payload = {
        nome: 'Usuario',
        email: 'existente@example.com',
        senha: 'senha123'
      };

      await expect(register(payload)).rejects.toThrow(errorMessage);
    });

    it('deve retornar erro quando dados são incompletos', async () => {
      const errorMessage = 'Dados obrigatórios não fornecidos';
      http.request.mockRejectedValue(new Error(errorMessage));

      const payload = {
        email: 'teste@example.com'
      };

      await expect(register(payload)).rejects.toThrow(errorMessage);
    });
  });
});
