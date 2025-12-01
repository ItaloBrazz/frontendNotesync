// URLs dos serviços - suporta gateway único ou serviços separados
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || '';
const TASKS_SERVICE_URL = import.meta.env.VITE_TASKS_SERVICE_URL || '';

// Se URLs específicas forem fornecidas, use-as; caso contrário, use o gateway
const getAuthBaseUrl = () => {
  if (AUTH_SERVICE_URL) {
    return AUTH_SERVICE_URL.endsWith('/') ? AUTH_SERVICE_URL.slice(0, -1) : AUTH_SERVICE_URL;
  }
  // Fallback para gateway
  const base = API_BASE_URL.includes('/api') ? API_BASE_URL.replace('/api', '') : API_BASE_URL;
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const getTasksBaseUrl = () => {
  if (TASKS_SERVICE_URL) {
    return TASKS_SERVICE_URL.endsWith('/') ? TASKS_SERVICE_URL.slice(0, -1) : TASKS_SERVICE_URL;
  }
  // Fallback para gateway
  const base = API_BASE_URL.includes('/api') ? API_BASE_URL.replace('/api', '') : API_BASE_URL;
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

// URLs base para cada serviço
const AUTH_BASE = getAuthBaseUrl();
const TASKS_BASE = getTasksBaseUrl();

// API Root para gateway (compatibilidade com código antigo)
const API_ROOT = API_BASE_URL.includes('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const buildHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function request(path, { method = 'GET', body, token, baseUrl, timeout = 10000 } = {}) {
  // Se baseUrl for fornecida, usa diretamente; caso contrário, usa API_ROOT
  const url = baseUrl 
    ? `${baseUrl}${path.startsWith('/') ? path : '/' + path}`
    : `${API_ROOT}${path}`;
  
  // Criar AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: buildHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      const message = data?.error || data?.message || 'Erro ao comunicar com o servidor';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Tempo de espera esgotado. Tente novamente.');
    }
    throw error;
  }
}

export { API_ROOT, AUTH_BASE, TASKS_BASE };
