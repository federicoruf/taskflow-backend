const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

require('dotenv').config();

describe('Suite de Pruebas: Autenticación y Usuarios', () => {
  const emailDePrueba = 'test_auth@example.com';

  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({ email: emailDePrueba });
  });

  afterAll(async () => {
    await User.deleteMany({ email: emailDePrueba });
    await mongoose.connection.close();
  });

  it('Debería denegar el registro si los datos no pasan la validación de Zod', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: "X",
        email: "correo-invalido", 
        password: "123"
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('Debería responder correctamente en la ruta raíz de la API', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('La API de TaskFlow está funcionando correctamente');
  });

  it('Debería registrar un usuario correctamente con datos válidos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: "Federico Auth",
        email: emailDePrueba,
        password: "password123"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Debería iniciar sesión (Login) y retornar un token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailDePrueba,
        password: "password123"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});