import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const errorStyles = useMemo(() => ({
    backgroundColor: '#ff6b6b',
    color: '#fff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'center'
  }), []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/tasks';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">NoteSync</h1>
        <p className="auth-subtitle">Entre para acessar e sincronizar suas tarefas.</p>

        {error && (
          <div style={errorStyles} className="feedback-banner feedback-danger">
            {error}
          </div>
        )}

        <form id="loginForm" className="auth-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <span className="input-label-text">Email</span>
            <div className="input-group">
              <img src={`${import.meta.env.BASE_URL}assets/icons/mail.svg`} alt="Ícone de email" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <span className="input-label-text">Senha</span>
            <div className="input-group">
              <img src={`${import.meta.env.BASE_URL}assets/icons/padlock.svg`} alt="Ícone de senha" />
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>

        <div className="social-row">
          <span>ou entre com</span>
          <div className="social-row-buttons">
            <button
              type="button"
              className="social-btn google-btn"
              onClick={() => setError('Login com Google ainda não está disponível')}
            >
              <img src={`${import.meta.env.BASE_URL}assets/icons/google_logo.svg`} alt="Google" />
            </button>
            <button
              type="button"
              className="social-btn apple-btn"
              onClick={() => setError('Login com Apple ainda não está disponível')}
            >
              <img src={`${import.meta.env.BASE_URL}assets/icons/apple_logo.svg`} alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
