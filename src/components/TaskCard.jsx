import { useEffect, useState } from 'react';

const TaskCard = ({ task, onRename, onToggleStatus, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(task.title);
      setIsEditing(false);
      return;
    }

    if (trimmed === task.title) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onRename(trimmed);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="task-card" data-task-id={task.id}>
      <div className="card-header">
        <div className={`status-indicator ${task.status}`}>
          {task.status === 'todo' ? '📦 A fazer' : '✅ Feito'}
        </div>
        <div className="task-date">
          {new Date(task.createdAt || task.updatedAt || Date.now()).toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div className="card-content">
        {isEditing ? (
          <input
            className="task-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSave();
              if (event.key === 'Escape') {
                setIsEditing(false);
                setTitle(task.title);
              }
            }}
            autoFocus
            disabled={saving}
          />
        ) : (
          <div className="task-title" onClick={() => setIsEditing(true)}>
            {task.title}
          </div>
        )}
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="action-btn edit-btn"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          {isEditing ? '💾' : '✏️'}
        </button>
        <button
          type="button"
          className="action-btn status-btn"
          onClick={onToggleStatus}
        >
          {task.status === 'todo' ? '✅' : '📦'}
        </button>
        <button type="button" className="action-btn delete-btn" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
