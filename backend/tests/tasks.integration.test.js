const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

require('dotenv').config();

describe('Suite de Pruebas: Endpoints de Tareas (CRUD)', () => {
  let token;
  let taskId;
  const emailTareas = 'test_tasks@example.com';

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: "Federico Tasks",
        email: emailTareas,
        password: "password123"
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: emailTareas,
        password: "password123"
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    const testUser = await User.findOne({ email: emailTareas });
    if (testUser) {
      await Task.deleteMany({ user: testUser._id });
      await User.deleteOne({ _id: testUser._id });
    }
  });

  it('Debería denegar el acceso (401) si se intenta listar tareas sin token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(401);
  });

  it('Debería crear una tarea correctamente cuando el usuario está autenticado', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Tarea Aislada",
        description: "Probando la modularización de los tests",
        assignedTo: "Federico"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  it('Debería obtener las tareas del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Debería actualizar el estado de una tarea (Marcar como completada)', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: "completada" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("completada");
  });

  it('Debería eliminar una tarea correctamente', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('eliminada correctamente');
  });
});