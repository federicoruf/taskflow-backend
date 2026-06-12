import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const ComponenteConsumidorPrueba = () => {
  const { user, login } = useAuth();
  return (
    <div>
      <span data-testid="user-status">
        {user ? `Logueado como ${user.name}` : 'No autenticado'}
      </span>
      <button onClick={() => login('test@flow.com', 'password123')}>
        Simular Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('Debe autenticar al usuario, guardar el token en localStorage y mutar el estado global', async () => {
    const mockRespuestaLogin = {
      token: 'jwt-token-falso-123',
      id: 'userId99',
      name: 'Alan Turing',
      email: 'test@flow.com'
    };
    authService.login.mockResolvedValueOnce(mockRespuestaLogin);

    render(
      <AuthProvider>
        <ComponenteConsumidorPrueba />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-status')).toHaveTextContent('No autenticado');

    fireEvent.click(screen.getByRole('button', { name: /Simular Login/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@flow.com', 'password123');

      expect(localStorage.getItem('token')).toBe('jwt-token-falso-123');

      const userGuardado = JSON.parse(localStorage.getItem('user'));
      expect(userGuardado.name).toBe('Alan Turing');
      expect(userGuardado.id).toBe('userId99');

      expect(screen.getByTestId('user-status')).toHaveTextContent('Logueado como Alan Turing');
    });
  });
});