import { request, TASKS_BASE } from './http.js';

// Path para tarefas - os serviços já têm /api/tasks configurado
const TASKS_PATH = '/api/tasks';

export const fetchTasks = (token) => request(TASKS_PATH, { 
  token,
  baseUrl: TASKS_BASE
});

export const createTask = (token, task) => request(TASKS_PATH, {
  method: 'POST',
  token,
  body: { 
    title: task.title, 
    description: task.description || null,
    status: task.status || 'todo' 
  },
  baseUrl: TASKS_BASE
});

export const updateTask = (token, taskId, payload) => request(`${TASKS_PATH}/${taskId}`, {
  method: 'PUT',
  token,
  body: payload,
  baseUrl: TASKS_BASE
});

export const updateTaskStatus = (token, taskId, status) => request(`${TASKS_PATH}/${taskId}/status`, {
  method: 'PATCH',
  token,
  body: { status },
  baseUrl: TASKS_BASE
});

export const deleteTask = (token, taskId) => request(`${TASKS_PATH}/${taskId}`, {
  method: 'DELETE',
  token,
  baseUrl: TASKS_BASE
});
