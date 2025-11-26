const API_ROOT = `${import.meta.env.VITE_API_BASE_URL || 'https://backendnotesync.onrender.com'}/api`;

const buildHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  });

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
}

export { API_ROOT };
