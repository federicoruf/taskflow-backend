const authService = require('../services/authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authService', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    
    it('Debería lanzar un error si el usuario no existe', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(authService.login('noexiste@example.com', '123456'))
        .rejects
        .toThrow('Credenciales inválidas');
    });

    it('Debería lanzar un error si la contraseña no coincide', async () => {
      const fakeUser = {
        _id: 'fake_id_123',
        name: 'Carlos Test',
        email: 'carlos@example.com',
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(fakeUser)
      });

      await expect(authService.login('carlos@example.com', 'password_incorrecto'))
        .rejects
        .toThrow('Credenciales inválidas');
    });

    it('Debería retornar los datos del usuario y el token si las credenciales son correctas', async () => {
      const fakeUser = {
        _id: 'user_ok_123',
        name: 'Federico Unit',
        email: 'federico@example.com',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(fakeUser)
      });

      jwt.sign.mockReturnValue('token_unit_test_123');

      const result = await authService.login('federico@example.com', 'password_correcto');

      expect(result).toHaveProperty('token', 'token_unit_test_123');
      expect(result.name).toBe('Federico Unit');
      expect(result._id).toBe('user_ok_123');
      expect(fakeUser.matchPassword).toHaveBeenCalledWith('password_correcto');
    });
  });
});