import { useEffect, useState } from 'react';

const TaskCard = ({ task, onRename, onToggleStatus, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task.title, task.description]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsEditing(false);
      return;
    }

    const trimmedDescription = description.trim() || null;
    
    // Verifica se houve mudanças
    if (trimmed === task.title && trimmedDescription === (task.description || null)) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onRename(trimmed, trimmedDescription);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <article className="task-card" data-task-id={task.id}>
      <div className="task-top">
        <span className={`task-pill ${task.status}`}>
          {task.status === 'todo' ? 'A fazer' : 'Concluída'}
        </span>
        <span className="task-date">
          {new Date(task.createdAt || task.updatedAt || Date.now()).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {isEditing ? (
        <div className="task-edit-form">
          <input
            className="task-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && event.ctrlKey) handleSave();
              if (event.key === 'Escape') handleCancel();
            }}
            placeholder="Título da tarefa"
            autoFocus
            disabled={saving}
            style={{ marginBottom: '8px' }}
          />
          <textarea
            className="task-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && event.ctrlKey) handleSave();
              if (event.key === 'Escape') handleCancel();
            }}
            placeholder="Descrição da tarefa (opcional)"
            disabled={saving}
            rows="3"
            style={{ resize: 'vertical', minHeight: '60px' }}
          />
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
          <p className="task-title">{task.title}</p>
          {task.description && (
            <p className="task-description" style={{ 
              marginTop: '8px', 
              fontSize: '0.9em', 
              color: '#666',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {task.description}
            </p>
          )}
        </div>
      )}

      <div className="task-actions">
        <button
          type="button"
          className="task-btn task-btn--edit"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
          title={isEditing ? 'Salvar (Ctrl+Enter)' : 'Editar'}
        >
          {isEditing ? '💾' : '✏️'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="task-btn task-btn--cancel"
            onClick={handleCancel}
            disabled={saving}
            title="Cancelar (Esc)"
          >
            ❌
          </button>
        )}
        <button
          type="button"
          className="task-btn task-btn--status"
          onClick={onToggleStatus}
        >
          {task.status === 'todo' ? '✅' : '📦'}
        </button>
        <button
          type="button"
          className="task-btn task-btn--delete"
          onClick={onDelete}
        >
          🗑️
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
