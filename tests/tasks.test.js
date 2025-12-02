import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../src/api/tasks.js';
import * as http from '../src/api/http.js';

vi.mock('../src/api/http.js');

describe('Tarefas - API', () => {
  const mockToken = 'jwt-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('deve buscar lista de tarefas do usuário', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Tarefa 1',
          description: 'Descrição 1',
          status: 'todo',
          deadline: null
        },
        {
          id: 2,
          title: 'Tarefa 2',
          description: 'Descrição 2',
          status: 'done',
          deadline: '2025-12-31'
        }
      ];

      http.request.mockResolvedValue(mockTasks);

      const result = await fetchTasks(mockToken);

      expect(http.request).toHaveBeenCalledWith('/api/tasks', {
        token: mockToken,
        baseUrl: expect.any(String)
      });
      expect(result).toEqual(mockTasks);
      expect(result).toHaveLength(2);
    });

    it('deve retornar lista vazia quando usuário não tem tarefas', async () => {
      http.request.mockResolvedValue([]);

      const result = await fetchTasks(mockToken);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('createTask', () => {
    it('deve criar tarefa com dados completos', async () => {
      const mockTask = {
        id: 3,
        title: 'Nova Tarefa',
        description: 'Descrição completa',
        status: 'todo',
        deadline: '2025-12-15'
      };

      http.request.mockResolvedValue(mockTask);

      const taskData = {
        title: 'Nova Tarefa',
        description: 'Descrição completa',
        deadline: '2025-12-15',
        status: 'todo'
      };

      const result = await createTask(mockToken, taskData);

      expect(http.request).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        token: mockToken,
        body: {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          status: taskData.status
        },
        baseUrl: expect.any(String)
      });
      expect(result).toEqual(mockTask);
      expect(result.title).toBe(taskData.title);
    });

    it('deve criar tarefa apenas com título', async () => {
      const mockTask = {
        id: 4,
        title: 'Tarefa Simples',
        description: null,
        status: 'todo',
        deadline: null
      };

      http.request.mockResolvedValue(mockTask);

      const taskData = {
        title: 'Tarefa Simples'
      };

      const result = await createTask(mockToken, taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.status).toBe('todo');
    });
  });

  describe('updateTask', () => {
    it('deve atualizar tarefa existente', async () => {
      const mockUpdatedTask = {
        id: 1,
        title: 'Tarefa Atualizada',
        description: 'Nova descrição',
        status: 'todo',
        deadline: '2025-12-20'
      };

      http.request.mockResolvedValue(mockUpdatedTask);

      const updateData = {
        title: 'Tarefa Atualizada',
        description: 'Nova descrição',
        deadline: '2025-12-20'
      };

      const result = await updateTask(mockToken, 1, updateData);

      expect(http.request).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'PUT',
        token: mockToken,
        body: updateData,
        baseUrl: expect.any(String)
      });
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('updateTaskStatus', () => {
    it('deve atualizar status de tarefa para done', async () => {
      const mockTask = {
        id: 1,
        title: 'Tarefa Completa',
        status: 'done'
      };

      http.request.mockResolvedValue(mockTask);

      const result = await updateTaskStatus(mockToken, 1, 'done');

      expect(http.request).toHaveBeenCalledWith('/api/tasks/1/status', {
        method: 'PATCH',
        token: mockToken,
        body: { status: 'done' },
        baseUrl: expect.any(String)
      });
      expect(result.status).toBe('done');
    });

    it('deve atualizar status de tarefa para todo', async () => {
      const mockTask = {
        id: 2,
        title: 'Tarefa Pendente',
        status: 'todo'
      };

      http.request.mockResolvedValue(mockTask);

      const result = await updateTaskStatus(mockToken, 2, 'todo');

      expect(result.status).toBe('todo');
    });
  });

  describe('deleteTask', () => {
    it('deve deletar tarefa existente', async () => {
      http.request.mockResolvedValue({ message: 'Tarefa deletada com sucesso' });

      const result = await deleteTask(mockToken, 1);

      expect(http.request).toHaveBeenCalledWith('/api/tasks/1', {
        method: 'DELETE',
        token: mockToken,
        baseUrl: expect.any(String)
      });
      expect(result.message).toBeDefined();
    });
  });
});
