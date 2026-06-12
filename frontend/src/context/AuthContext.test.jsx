// src/context/AuthContext.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Mockeamos el servicio de autenticación
vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

// Componente de prueba auxiliar para consumir el hook dentro del Provider
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
    localStorage.clear(); // Limpiamos el almacenamiento virtual del navegador
  });

  test('Debe autenticar al usuario, guardar el token en localStorage y mutar el estado global', async () => {
    // Mock de respuesta exitosa del Backend
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

    // El estado inicial debe ser no autenticado
    expect(screen.getByTestId('user-status')).toHaveTextContent('No autenticado');

    // El usuario hace clic en el botón para ingresar
    fireEvent.click(screen.getByRole('button', { name: /Simular Login/i }));

    await waitFor(() => {
      // 1. Validamos que el servicio fue ejecutado con las credenciales
      expect(authService.login).toHaveBeenCalledWith('test@flow.com', 'password123');

      // 2. Validamos la persistencia obligatoria del token en el cliente
      expect(localStorage.getItem('token')).toBe('jwt-token-falso-123');

      // 3. Validamos la persistencia de los datos del usuario sanados (sin token)
      const userGuardado = JSON.parse(localStorage.getItem('user'));
      expect(userGuardado.name).toBe('Alan Turing');
      expect(userGuardado.id).toBe('userId99');

      // 4. Validamos que React re-renderizó la interfaz con el estado actualizado
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logueado como Alan Turing');
    });
  });
});