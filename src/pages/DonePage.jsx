import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTasks } from '../hooks/useTasks.js';
import TaskCard from '../components/TaskCard.jsx';
import '../../styles/donePage/index.css';

const DonePage = () => {
  const { logout } = useAuth();
  const { tasks, loading, error, rename, toggleStatus, remove } = useTasks();

  const doneTasks = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks]);

  return (
    <div className="done-page">
      <header>
        <button className="logout" onClick={logout}>⏎</button>
        <div className="title">NoteSync</div>
      </header>

      <main>
        <div className="content">
          <div className="title-left">Feito</div>
          {error && <div className="no-tasks-message">{error}</div>}
          {loading ? (
            <div className="no-tasks-message">Carregando tarefas...</div>
          ) : doneTasks.length === 0 ? (
            <div className="no-tasks-message">Nenhuma tarefa concluída</div>
          ) : (
            doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onRename={(title) => rename(task.id, title)}
                onToggleStatus={() => toggleStatus(task.id, 'todo')}
                onDelete={() => remove(task.id)}
              />
            ))
          )}
        </div>
      </main>

      <nav>
        <div className="nav-inner">
          <NavLink to="/tasks" className="nav-link">
            📦 A fazer
          </NavLink>
          <NavLink to="/tasks/create" className="nav-center">
            ➕ Criar
          </NavLink>
          <NavLink to="/tasks/done" className="nav-link">
            ✔️ Feito
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default DonePage;
