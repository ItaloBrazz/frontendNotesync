import { request } from './http.js';

export const fetchTasks = (token) => request('/tasks', { token });

export const createTask = (token, task) => request('/tasks', {
  method: 'POST',
  token,
  body: { title: task.title, status: task.status || 'todo' }
});

export const updateTask = (token, taskId, payload) => request(`/tasks/${taskId}`, {
  method: 'PUT',
  token,
  body: payload
});

export const deleteTask = (token, taskId) => request(`/tasks/${taskId}`, {
  method: 'DELETE',
  token
});
