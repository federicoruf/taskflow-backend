const authController = require('../controllers/authController');
const authService = require('../services/authService');

jest.mock('../services/authService');

describe('🧪 Tests Unitarios: authController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(), // Permite encadenar .status().json()
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('Función: registerUser', () => {
    it('Debería responder con 201 y los datos del usuario si el registro es exitoso', async () => {
      const mockServiceResult = {
        _id: 'user_123',
        name: 'Federico Controller',
        email: 'fede@example.com',
        token: 'token_falso_123'
      };

      req.body = { name: 'Federico Controller', email: 'fede@example.com', password: 'password123' };
      
      authService.register.mockResolvedValue(mockServiceResult);

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockServiceResult);
      expect(authService.register).toHaveBeenCalledWith(req.body);
    });

    it('Debería responder con el código de error del servicio si algo falla (ej: 400 Correo Duplicado)', async () => {
      const fakeError = new Error('El correo electrónico ya está registrado');
      fakeError.statusCode = 400;

      req.body = { email: 'duplicado@example.com' };
      
      authService.register.mockRejectedValue(fakeError);

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: fakeError.message });
    });
  });
});