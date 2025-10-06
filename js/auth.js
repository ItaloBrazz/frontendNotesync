// Configuração da API (será definida pelo config.js)
const API_BASE_URL = (window.API_CONFIG?.BASE_URL || 'https://backendnotesync.onrender.com') + '/api';

// Função para fazer requisições HTTP
async function makeRequest(url, options = {}) {
  try {
    console.log('Fazendo requisição para:', url);
    console.log('Opções:', options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    console.log('Resposta recebida:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Dados da resposta:', data);
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Função para registrar usuário
async function registerUser(userData) {
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    // Salvar token no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para fazer login
async function loginUser(credentials) {
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Salvar token no localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para verificar se usuário está logado
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Função para fazer logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'loginPage.html';
}

// Função para obter token de autenticação
function getAuthToken() {
  return localStorage.getItem('token');
}

// Função para obter dados do usuário
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Função para validar senhas
function validatePasswords(password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error('As senhas não coincidem');
  }
  
  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }
}

// Função para validar email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }
}

// Função para mostrar mensagens de erro
function showError(message) {
  // Criar elemento de erro se não existir
  let errorDiv = document.getElementById('error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.cssText = `
      background-color: #ff6b6b;
      color: white;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      text-align: center;
    `;
    document.querySelector('main section').appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Remover erro após 5 segundos
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Função para mostrar mensagens de sucesso
function showSuccess(message) {
  // Criar elemento de sucesso se não existir
  let successDiv = document.getElementById('success-message');
  if (!successDiv) {
    successDiv = document.createElement('div');
    successDiv.id = 'success-message';
    successDiv.style.cssText = `
      background-color: #51cf66;
      color: white;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      text-align: center;
    `;
    document.querySelector('main section').appendChild(successDiv);
  }
  
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  
  // Remover sucesso após 3 segundos
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 3000);
}

// Exportar funções para uso global
window.auth = {
  registerUser,
  loginUser,
  logout,
  isLoggedIn,
  getAuthToken,
  getUser,
  validatePasswords,
  validateEmail,
  showError,
  showSuccess
};

// Log para confirmar que o objeto foi exportado
console.log('✅ Objeto auth exportado com sucesso');

