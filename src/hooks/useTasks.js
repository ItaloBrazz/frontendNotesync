import { useCallback, useEffect, useState } from 'react';
import * as tasksApi from '../api/tasks.js';
import { useAuth } from './useAuth.js';

export const useTasks = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await tasksApi.fetchTasks(token);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const create = async (title) => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error('Informe um título para a tarefa');
    await tasksApi.createTask(token, { title: trimmed });
    await loadTasks();
  };

  const rename = async (taskId, newTitle) => {
    await tasksApi.updateTask(token, taskId, { title: newTitle });
    await loadTasks();
  };

  const toggleStatus = async (taskId, newStatus) => {
    // Tenta usar o endpoint específico de status, se não funcionar usa o updateTask
    try {
      await tasksApi.updateTaskStatus(token, taskId, newStatus);
    } catch (err) {
      // Fallback para updateTask se o endpoint de status não existir
      await tasksApi.updateTask(token, taskId, { status: newStatus });
    }
    await loadTasks();
  };

  const remove = async (taskId) => {
    await tasksApi.deleteTask(token, taskId);
    await loadTasks();
  };

  return {
    tasks,
    loading,
    error,
    reload: loadTasks,
    create,
    rename,
    toggleStatus,
    remove
  };
};
