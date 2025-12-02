import { useEffect, useState } from 'react';

const TaskCard = ({ task, onRename, onToggleStatus, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  // Converter deadline para formato date (YYYY-MM-DD)
  const getDeadlineDate = (deadlineDate) => {
    if (!deadlineDate) return '';
    const date = new Date(deadlineDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [deadline, setDeadline] = useState(getDeadlineDate(task.deadline));
  
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDeadline(getDeadlineDate(task.deadline));
  }, [task.title, task.description, task.deadline]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDeadline(getDeadlineDate(task.deadline));
      setIsEditing(false);
      return;
    }

    // Validar data se fornecida
    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert('Não é possível definir uma data que já passou');
        setDeadline(getDeadlineDate(task.deadline));
        return;
      }
    }

    const trimmedDescription = description.trim() || null;
    // Converter data para datetime completo (fim do dia: 23:59:59)
    let deadlineValue = null;
    if (deadline) {
      const date = new Date(deadline);
      date.setHours(23, 59, 59, 999);
      deadlineValue = date.toISOString();
    }
    
    // Verifica se houve mudanças
    const taskDeadlineDate = getDeadlineDate(task.deadline);
    if (trimmed === task.title && 
        trimmedDescription === (task.description || null) && 
        deadline === taskDeadlineDate) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onRename(trimmed, trimmedDescription, deadlineValue);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDeadline(getDeadlineDate(task.deadline));
    setIsEditing(false);
  };

  // Obter data mínima (hoje) no formato YYYY-MM-DD
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para formatar a data do deadline
  const formatDeadline = (deadlineDate) => {
    if (!deadlineDate) return null;
    const date = new Date(deadlineDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadlineDateOnly = new Date(date);
    deadlineDateOnly.setHours(0, 0, 0, 0);
    const diffTime = deadlineDateOnly - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formatted = date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
    
    if (diffDays < 0) {
      return { text: formatted, status: 'overdue', days: Math.abs(diffDays) };
    } else if (diffDays === 0) {
      return { text: formatted, status: 'today' };
    } else if (diffDays === 1) {
      return { text: formatted, status: 'tomorrow' };
    } else if (diffDays <= 7) {
      return { text: formatted, status: 'soon', days: diffDays };
    }
    return { text: formatted, status: 'normal' };
  };

  return (
    <article className="task-card" data-task-id={task.id}>
      <div className="task-header">
        <div className="task-header-left">
          <span className={`task-pill ${task.status}`}>
            {task.status === 'todo' ? 'A fazer' : 'Concluída'}
          </span>
          {task.deadline && (() => {
            const deadlineInfo = formatDeadline(task.deadline);
            return (
              <div 
                className="task-deadline-badge" 
                data-status={deadlineInfo.status}
                title={deadlineInfo.status === 'overdue' ? `Atrasado há ${deadlineInfo.days} dia(s)` :
                       deadlineInfo.status === 'today' ? 'Vence hoje' :
                       deadlineInfo.status === 'tomorrow' ? 'Vence amanhã' :
                       deadlineInfo.status === 'soon' ? `Vence em ${deadlineInfo.days} dias` :
                       'Prazo'}
              >
                <span className="task-deadline-icon">Data</span>
                <span className="task-deadline-date">{deadlineInfo.text}</span>
                {deadlineInfo.status === 'overdue' && (
                  <span className="task-deadline-label">Atrasado</span>
                )}
                {deadlineInfo.status === 'today' && (
                  <span className="task-deadline-label">Hoje</span>
                )}
                {deadlineInfo.status === 'tomorrow' && (
                  <span className="task-deadline-label">Amanhã</span>
                )}
                {deadlineInfo.status === 'soon' && (
                  <span className="task-deadline-label">{deadlineInfo.days}d</span>
                )}
              </div>
            );
          })()}
        </div>
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
            style={{ resize: 'vertical', minHeight: '60px', marginBottom: '8px' }}
          />
          <input
            type="date"
            className="task-input"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            min={getMinDate()}
            disabled={saving}
            style={{ fontSize: '0.85rem' }}
          />
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
          <p className="task-title">{task.title}</p>
          {task.description && (
            <p className="task-description" style={{ 
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
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="task-btn task-btn--cancel"
            onClick={handleCancel}
            disabled={saving}
            title="Cancelar (Esc)"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          className="task-btn task-btn--status"
          onClick={onToggleStatus}
        >
          {task.status === 'todo' ? 'Concluir' : 'Reabrir'}
        </button>
        <button
          type="button"
          className="task-btn task-btn--delete"
          onClick={onDelete}
        >
          Excluir
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
