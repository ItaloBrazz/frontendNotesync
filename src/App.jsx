import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import DonePage from './pages/DonePage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TodoPage />} />
        <Route path="/tasks/done" element={<DonePage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
