// Configuração da API para produção no Render
window.API_CONFIG = {
  BASE_URL: 'https://backendnotesync.onrender.com'
};

console.log('✅ API configurada para:', window.API_CONFIG.BASE_URL);

// Teste de conexão ao carregar
fetch(`${window.API_CONFIG.BASE_URL}/`)
  .then(res => res.json())
  .then(data => {
    console.log('✅ Conexão com API bem-sucedida:', data);
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com API:', err);
    console.log('⚠️  Verifique se o backend está online no Render');
  });