import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

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

    // Validações no frontend (evita requisições desnecessárias)
    if (!form.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!form.email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Email inválido');
      return;
    }

    if (form.senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (form.senha !== form.confirmacao) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      await register({ nome: form.nome.trim(), email: form.email.trim().toLowerCase(), senha: form.senha });
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Criar conta</h1>
        <p className="auth-subtitle">Cadastre-se para organizar e sincronizar suas tarefas.</p>

        {error && (
          <div style={errorStyles} className="feedback-banner feedback-danger">
            {error}
          </div>
        )}

        <form id="registerForm" className="auth-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <span className="input-label-text">Nome</span>
            <div className="input-group">
              <img src="/assets/icons/user.svg" alt="Ícone de usuário" />
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <span className="input-label-text">Email</span>
            <div className="input-group">
              <img src="/assets/icons/mail.svg" alt="Ícone de email" />
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
              <img src="/assets/icons/padlock.svg" alt="Ícone de senha" />
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Mínimo 6 caracteres"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <span className="input-label-text">Confirmar senha</span>
            <div className="input-group">
              <img src="/assets/icons/padlock.svg" alt="Ícone de confirmação" />
              <input
                type="password"
                id="confirmacao"
                name="confirmacao"
                placeholder="Repita a senha"
                value={form.confirmacao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
