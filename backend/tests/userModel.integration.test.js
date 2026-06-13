const User = require('../models/User');

require('dotenv').config();

describe('UserModel', () => {

  jest.setTimeout(15000);

  it('Debería encriptar la contraseña correctamente antes de guardar (pre-save hook)', async () => {
    const rawPassword = 'passwordSeguro123';
    
    const user = new User({
      name: 'Test Modelo',
      email: 'model_test1@example.com',
      password: rawPassword
    });

    await user.save();

    expect(user.password).not.toBe(rawPassword);
    
    expect(user.password).toMatch(/^\$2[ayb]\$.+/);
  });

  it('Debería retornar true si la contraseña coincide y false si no (matchPassword)', async () => {
    const user = new User({
      name: 'Test Métodos',
      email: 'model_test2@example.com',
      password: 'miPassword123'
    });

    await user.save();

    const userFromDb = await User.findOne({ email: user.email }).select('+password');

    const isMatch = await userFromDb.matchPassword('miPassword123');
    expect(isMatch).toBe(true);

    const isNotMatch = await userFromDb.matchPassword('passwordIncorrecto');
    expect(isNotMatch).toBe(false);
  });
});