const bcrypt = require('bcryptjs');
const User = require('../models/User');

jest.mock('bcryptjs');

describe('UserModel.matchPassword - unit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería delegar en bcrypt.compare con la contraseña ingresada y el hash almacenado', async () => {
    bcrypt.compare.mockResolvedValue(true);

    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPasswordFromDb',
    });

    const result = await user.matchPassword('plainPassword123');

    expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword123', 'hashedPasswordFromDb');
    expect(result).toBe(true);
  });

  it('debería retornar false cuando bcrypt.compare indica que no coinciden', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPasswordFromDb',
    });

    const result = await user.matchPassword('wrongPassword');

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPasswordFromDb');
    expect(result).toBe(false);
  });
});