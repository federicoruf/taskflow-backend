// src/components/TaskForm.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from './TaskForm';
import { taskService } from '../services/taskService';

// 1. Mockeamos el servicio para interceptar las peticiones HTTP reales
vi.mock('../services/taskService', () => ({
  taskService: {
    create: vi.fn(),
  },
}));

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpiamos el historial de llamadas antes de cada test
  });

  test('Debe procesar la creación de una tarea exitosamente cuando todos los campos son válidos', async () => {
    // Definimos qué debe retornar simuladamente nuestro servicio al ser llamado
    const mockTaskCreada = {
      _id: '12345',
      title: 'Aprender Vitest',
      description: 'Escribir pruebas unitarias para el front',
      assignedTo: 'Carlos Dev',
      status: 'pendiente'
    };
    taskService.create.mockResolvedValueOnce(mockTaskCreada);
    
    // Función espía tipo callback que pasamos desde el Dashboard
    const onTaskCreatedSpy = vi.fn();

    render(<TaskForm onTaskCreated={onTaskCreatedSpy} />);

    // Capturamos los elementos del formulario por su Label (Accesibilidad)
    const inputTitle = screen.getByLabelText(/Título de la tarea/i);
    const inputDesc = screen.getByLabelText(/Descripción detallada/i);
    const inputAssigned = screen.getByLabelText(/Asignado a/i);
    const botonSubmit = screen.getByRole('button', { name: /Crear Tarea/i });

    // 2. Simulación de Interacción del Usuario (Llenando el formulario)
    fireEvent.change(inputTitle, { target: { value: 'Aprender Vitest' } });
    fireEvent.change(inputDesc, { target: { value: 'Escribir pruebas unitarias para el front' } });
    fireEvent.change(inputAssigned, { target: { value: 'Carlos Dev' } });

    // El botón debería habilitarse de inmediato al completarse los campos obligatorios
    expect(botonSubmit).not.toBeDisabled();

    // 3. Simulación del Click de envío
    fireEvent.click(botonSubmit);

    // 4. Aseveraciones (Assertions) esperadas
    await waitFor(() => {
      // Verificamos que se invocó al servicio con los parámetros correctos del Schema
      expect(taskService.create).toHaveBeenCalledWith({
        title: 'Aprender Vitest',
        description: 'Escribir pruebas unitarias para el front',
        assignedTo: 'Carlos Dev'
      });

      // Verificamos que el Dashboard se enteró de la nueva tarea
      expect(onTaskCreatedSpy).toHaveBeenCalledWith(mockTaskCreada);

      // Verificamos que el formulario se limpió por completo para la siguiente tarea
      expect(inputTitle.value).toBe('');
      expect(inputDesc.value).toBe('');
      expect(inputAssigned.value).toBe('');
    });
  });
});