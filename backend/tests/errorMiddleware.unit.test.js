const errorHandler = require('../middlewares/errorMiddleware');

describe('errorMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    this.originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = this.originalEnv;
    jest.clearAllMocks();
  });

  it('Debería responder con el statusCode del error y su mensaje', () => {
    const fakeError = new Error('Acceso denegado');
    fakeError.statusCode = 403;

    errorHandler(fakeError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Acceso denegado'
    }));
  });

  it('Debería responder con 500 si el error no tiene un statusCode definido', () => {
    const genericError = new Error('Explosión inesperada en el código');

    errorHandler(genericError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Explosión inesperada en el código'
    }));
  });

  it('NO debería incluir la propiedad stack si el entorno es producción', () => {
    process.env.NODE_ENV = 'production';
    const fakeError = new Error('Error crítico');

    errorHandler(fakeError, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Error crítico'
    });
    expect(res.json).not.toHaveBeenCalledWith(expect.objectContaining({
      stack: expect.any(String)
    }));
  });
});