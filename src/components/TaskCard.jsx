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
        <p className="task-title" onClick={() => setIsEditing(true)}>
          {task.title}
        </p>
      )}

      <div className="task-actions">
        <button
          type="button"
          className="task-btn task-btn--edit"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          {isEditing ? '💾' : '✏️'}
        </button>
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
