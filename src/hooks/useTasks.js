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

  const create = async (title, description = null) => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error('Informe um título para a tarefa');
    
    // Tratamento correto da descrição: preserva strings vazias e null
    let descriptionValue = null;
    if (description !== null && description !== undefined) {
      const trimmedDesc = String(description).trim();
      descriptionValue = trimmedDesc === '' ? null : trimmedDesc;
    }
    
    console.log('[useTasks.create] Enviando:', { title: trimmed, description: descriptionValue });
    
    await tasksApi.createTask(token, { 
      title: trimmed, 
      description: descriptionValue 
    });
    await loadTasks();
  };

  const rename = async (taskId, newTitle, newDescription = null) => {
    const updateData = { title: newTitle };
    if (newDescription !== undefined) {
      updateData.description = newDescription;
    }
    await tasksApi.updateTask(token, taskId, updateData);
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
