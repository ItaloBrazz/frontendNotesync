import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext.jsx';
import { useContext } from 'react';
import * as authApi from '../src/api/auth.js';

vi.mock('../src/api/auth.js');

const TestComponent = () => {
  const { user, token, isAuthenticated, login, logout } = useContext(AuthContext);
  
  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? user.nome : 'null'}</div>
      <div data-testid="token">{token || 'null'}</div>
      <button onClick={() => login({ email: 'test@example.com', senha: 'senha123' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve iniciar com estado não autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
  });

  it('deve realizar login e persistir sessão', async () => {
    const mockResponse = {
      token: 'token-123',
      usuario: {
        id: 1,
        nome: 'Usuario Teste',
        email: 'test@example.com'
      }
    };

    authApi.login.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toBe('Usuario Teste');
      expect(screen.getByTestId('token').textContent).toBe('token-123');
    });

    expect(localStorage.getItem('notesync_token')).toBe('token-123');
    expect(localStorage.getItem('notesync_user')).toBeTruthy();
  });

  it('deve realizar logout e limpar sessão', async () => {
    const mockResponse = {
      token: 'token-123',
      usuario: {
        id: 1,
        nome: 'Usuario Teste',
        email: 'test@example.com'
      }
    };

    authApi.login.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('null');
      expect(screen.getByTestId('token').textContent).toBe('null');
    });

    expect(localStorage.getItem('notesync_token')).toBeNull();
    expect(localStorage.getItem('notesync_user')).toBeNull();
  });

  it('deve recuperar sessão do localStorage ao iniciar', () => {
    localStorage.setItem('notesync_token', 'stored-token');
    localStorage.setItem('notesync_user', JSON.stringify({
      id: 2,
      nome: 'Usuario Armazenado',
      email: 'stored@example.com'
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe('Usuario Armazenado');
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
  });
});
