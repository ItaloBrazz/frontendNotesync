import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import '../../styles/loginPage/index.css';

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    <main>
      <section>
        <h1>NoteSync</h1>

        <form id="loginForm" onSubmit={handleSubmit}>
          {error && <div style={errorStyles}>{error}</div>}

          <div className="input-group">
            <img src="/assets/icons/mail.svg" alt="Ícone de email" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <img src="/assets/icons/padlock.svg" alt="Ícone de senha" />
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="links">
            <a href="#">Esqueceu a senha?</a>
            <p>
              Não tem uma conta? <Link to="/register">Registre-se</Link>
            </p>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Login'}
          </button>

          <div className="social-login">
            <p>ou</p>
            <div>
              <button type="button" className="google-btn" onClick={() => setError('Login com Google ainda não está disponível')}>
                <img src="/assets/icons/google_logo.svg" alt="Google" />
              </button>
              <button type="button" className="apple-btn" onClick={() => setError('Login com Apple ainda não está disponível')}>
                <img src="/assets/icons/apple_logo.svg" alt="Apple" />
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
