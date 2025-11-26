import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="page not-found">
    <div className="auth-card">
      <h1>404</h1>
      <p>Página não encontrada</p>
      <Link className="primary-button" to="/login">
        Voltar
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
