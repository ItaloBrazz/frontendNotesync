import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import '../../styles/registerPage/index.css';

const RegisterPage = () => {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
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

    if (form.senha !== form.confirmacao) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await register({ nome: form.nome, email: form.email, senha: form.senha });
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <section>
        <h1>Register</h1>

        <form id="registerForm" onSubmit={handleSubmit}>
          {error && <div style={errorStyles}>{error}</div>}

          <div className="input-group">
            <img src="/assets/icons/user.svg" alt="Ícone de usuário" />
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome de usuário"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="input-group">
            <img src="/assets/icons/padlock.svg" alt="Ícone de confirmação" />
            <input
              type="password"
              id="confirmacao"
              name="confirmacao"
              placeholder="Confirme a senha"
              value={form.confirmacao}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? 'Registrando...' : 'Register'}
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

          <p className="switch-link">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
