// Configuração da API
const API_CONFIG = {
  // URL base da API - será definida automaticamente baseada no ambiente
  BASE_URL: (() => {
    // Se estiver rodando localmente (desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    
    // Se estiver em produção (Firebase)
    // URL do seu backend no Render
    return 'https://backendnotesync.onrender.com';
  })(),
  
  // Endpoints da API
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login'
    },
    TASKS: {
      BASE: '/api/tasks',
      BY_ID: (id) => `/api/tasks/${id}`
    }
  }
};

// Função para construir URLs completas
function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.buildApiUrl = buildApiUrl;

console.log('🔧 API Config carregada:', API_CONFIG);
