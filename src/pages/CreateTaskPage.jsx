import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks.js';

const CreateTaskPage = () => {
  const { create } = useTasks();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!title.trim()) {
      setError('Por favor, digite um nome para a tarefa');
      return;
    }

    setSubmitting(true);
    try {
      await create(title, description.trim() || null);
      setMessage('Tarefa criada com sucesso!');
      setTitle('');
      setDescription('');
      setTimeout(() => navigate('/tasks'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tasks-shell">
      <header className="tasks-header">
        <div className="tasks-brand">
          <span className="tasks-logo">NoteSync</span>
          <span className="tasks-title">Criar nova tarefa</span>
        </div>
        <button className="tasks-logout" onClick={() => navigate('/tasks')} title="Voltar para lista">
          ←
        </button>
      </header>

      <main className="tasks-main">
        <div className="tasks-content">
          <h2 className="tasks-section-title">Detalhes da tarefa</h2>
          <form id="createTaskForm" className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="feedback-banner feedback-danger">{error}</div>}
            {message && <div className="feedback-banner feedback-success">{message}</div>}

            <div className="input-row">
              <span className="input-label-text">Título</span>
              <div className="input-group">
                <img src="/assets/icons/list.svg" alt="Ícone de lista" />
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  placeholder="Ex: Revisar relatório semanal"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <span className="input-label-text">Descrição</span>
              <div className="input-group input-group--textarea">
                <img src="/assets/icons/edit.svg" alt="Ícone de edição" />
                <textarea
                  id="taskDescription"
                  name="taskDescription"
                  placeholder="Ex: Revisar o relatório semanal da equipe de vendas, verificar métricas e preparar apresentação para reunião."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? 'Criando...' : 'Criar tarefa'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTaskPage;
