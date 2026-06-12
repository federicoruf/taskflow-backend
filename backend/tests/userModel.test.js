const User = require('../models/User');
const connectDB = require('../config/db');

require('dotenv').config();

describe('UserModel', () => {
  const testEmail = 'model_test@example.com';

  jest.setTimeout(15000);

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({ email: testEmail });
  });

  afterAll(async () => {
    await User.deleteMany({ email: testEmail });
  });

  it('Debería encriptar la contraseña correctamente antes de guardar (pre-save hook)', async () => {
    const rawPassword = 'passwordSeguro123';
    
    const user = new User({
      name: 'Test Modelo',
      email: testEmail,
      password: rawPassword
    });

    await user.save();

    expect(user.password).not.toBe(rawPassword);
    
    expect(user.password).toMatch(/^\$2[ayb]\$.+/);
  });

  it('Debería retornar true si la contraseña coincide y false si no (matchPassword)', async () => {
    const user = new User({
      name: 'Test Métodos',
      email: testEmail,
      password: 'miPassword123'
    });

    await user.save();

    const userFromDb = await User.findOne({ email: testEmail }).select('+password');

    const isMatch = await userFromDb.matchPassword('miPassword123');
    expect(isMatch).toBe(true);

    const isNotMatch = await userFromDb.matchPassword('passwordIncorrecto');
    expect(isNotMatch).toBe(false);
  });
});