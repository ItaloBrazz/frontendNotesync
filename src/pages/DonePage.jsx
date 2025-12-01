import { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTasks } from '../hooks/useTasks.js';
import TaskCard from '../components/TaskCard.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const DonePage = () => {
  const { logout, user } = useAuth();
  const { tasks, loading, error, rename, toggleStatus, remove } = useTasks();
  const location = useLocation();
  const navigate = useNavigate();

  const doneTasks = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="tasks-shell">
      <header className="tasks-header">
        <div className="tasks-brand">
          <span className="tasks-logo">NoteSync</span>
          <span className="tasks-title">Tarefas concluídas</span>
        </div>
        <div className="tasks-header-actions">
          <button className="tasks-logout" onClick={handleLogout} title="Sair">
            ⎋
          </button>
          <ThemeToggle className="tasks-theme-toggle" />
        </div>
      </header>

      <main className="tasks-main">
        <div className="tasks-content">
          {user && user.nome && (
            <div className="welcome-message">
              <span className="welcome-text">Bem-vindo, <strong>{user.nome}</strong>!</span>
            </div>
          )}
          <h2 className="tasks-section-title">Histórico de tarefas</h2>
          {error && <div className="tasks-empty">{error}</div>}
          {loading ? (
            <div className="tasks-empty">Carregando tarefas...</div>
          ) : doneTasks.length === 0 ? (
            <div className="tasks-empty">Você ainda não concluiu nenhuma tarefa</div>
          ) : (
            <div className="tasks-list">
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onRename={(title, description, deadline) => rename(task.id, title, description, deadline)}
                  onToggleStatus={() => toggleStatus(task.id, 'todo')}
                  onDelete={() => remove(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <nav className="tasks-nav">
        <div className="tasks-nav-inner">
          <NavLink
            to="/tasks"
            className={`tasks-nav-link ${location.pathname === '/tasks' ? 'tasks-nav-link-active' : ''}`}
          >
            📦 A fazer
          </NavLink>
          <NavLink
            to="/tasks/create"
            className="tasks-nav-link tasks-nav-link--primary"
          >
            ➕ Criar
          </NavLink>
          <NavLink
            to="/tasks/done"
            className={`tasks-nav-link ${location.pathname === '/tasks/done' ? 'tasks-nav-link-active' : ''}`}
          >
            ✔️ Feito
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default DonePage;
