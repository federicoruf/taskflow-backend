import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from './TaskForm';
import { taskService } from '../services/taskService';

vi.mock('../services/taskService', () => ({
  taskService: {
    create: vi.fn(),
  },
}));

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Debe procesar la creación de una tarea exitosamente cuando todos los campos son válidos', async () => {
    const mockTaskCreada = {
      _id: '12345',
      title: 'Vitest',
      description: 'Escribir pruebas unitarias para el front',
      assignedTo: 'Carlos Dev',
      status: 'pendiente'
    };
    taskService.create.mockResolvedValueOnce(mockTaskCreada);
    
    const onTaskCreatedSpy = vi.fn();

    render(<TaskForm onTaskCreated={onTaskCreatedSpy} />);

    const inputTitle = screen.getByLabelText(/Título de la tarea/i);
    const inputDesc = screen.getByLabelText(/Descripción detallada/i);
    const inputAssigned = screen.getByLabelText(/Asignado a/i);
    const botonSubmit = screen.getByRole('button', { name: /Crear Tarea/i });

    fireEvent.change(inputTitle, { target: { value: 'Vitest' } });
    fireEvent.change(inputDesc, { target: { value: 'Escribir pruebas unitarias para el front' } });
    fireEvent.change(inputAssigned, { target: { value: 'Carlos Dev' } });

    expect(botonSubmit).not.toBeDisabled();

    fireEvent.click(botonSubmit);

    await waitFor(() => {
      expect(taskService.create).toHaveBeenCalledWith({
        title: 'Vitest',
        description: 'Escribir pruebas unitarias para el front',
        assignedTo: 'Carlos Dev'
      });

      expect(onTaskCreatedSpy).toHaveBeenCalledWith(mockTaskCreada);

      expect(inputTitle.value).toBe('');
      expect(inputDesc.value).toBe('');
      expect(inputAssigned.value).toBe('');
    });
  });
});