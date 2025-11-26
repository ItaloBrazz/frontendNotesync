import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks.js';
import '../../styles/createPage/index.css';

const CreateTaskPage = () => {
  const { create } = useTasks();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const errorStyles = {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'center'
  };

  const successStyles = {
    backgroundColor: '#51cf66',
    color: '#fff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'center'
  };

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
      await create(title);
      setMessage('Tarefa criada com sucesso!');
      setTitle('');
      setTimeout(() => navigate('/tasks'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <header>
        <button className="back-btn" onClick={() => navigate('/tasks')}>← Voltar</button>
        <div className="title">NoteSync</div>
      </header>

      <main>
        <form id="createTaskForm" onSubmit={handleSubmit}>
          {error && <div style={errorStyles}>{error}</div>}
          {message && <div style={successStyles}>{message}</div>}

          <div className="input-group">
            <img src="/assets/icons/list.svg" alt="Ícone de lista" />
            <input
              type="text"
              id="taskName"
              name="taskName"
              placeholder="Nome da task"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-create" disabled={submitting}>
            {submitting ? 'Criando...' : 'Criar Tarefa'}
          </button>
        </form>
      </main>

    </div>
  );
};

export default CreateTaskPage;
