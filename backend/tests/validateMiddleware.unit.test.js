const validate = require('../middlewares/validateMiddleware');

describe('validateMiddleware', () => {
  let req;
  let res;
  let next;
  let mockSchema;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    mockSchema = {
      safeParse: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  it('Debería llamar a next() si los datos del body cumplen con el esquema de Zod', () => {
    req.body = { email: 'fede@example.com', password: 'password123' };

    mockSchema.safeParse.mockReturnValue({
      success: true,
      data: req.body
    });

    const middleware = validate(mockSchema);
    
    middleware(req, res, next);

    expect(mockSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Debería responder con 400 y los errores formateados si Zod detecta fallos de validación', () => {
    req.body = { email: 'correo-invalido', password: '123' };

    const mockZodError = {
      success: false,
      error: {
        issues: [
          { path: ['email'], message: 'Por favor, añade un correo válido' },
          { path: ['password'], message: 'La contraseña debe tener al menos 6 caracteres' }
        ]
      }
    };

    mockSchema.safeParse.mockReturnValue(mockZodError);

    const middleware = validate(mockSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); 
    expect(next).not.toHaveBeenCalled();
    
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { field: 'email', message: 'Por favor, añade un correo válido' },
        { field: 'password', message: 'La contraseña debe tener al menos 6 caracteres' }
      ]
    });
  });
});