const BACKEND_URLS = {
  auth: process.env.VITE_AUTH_SERVICE_URL || 'https://notesync-auth-service.onrender.com',
  tasks: process.env.VITE_TASKS_SERVICE_URL || 'https://notesync-tasks-service.onrender.com'
};

const logger = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`)
};

async function checkHealth(serviceName, url) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      logger.info(`${serviceName} - Status: OK - Tempo: ${responseTime}ms`);
      return { success: true, responseTime, status: response.status };
    } else {
      logger.warn(`${serviceName} - Status: ${response.status} - Tempo: ${responseTime}ms`);
      return { success: false, responseTime, status: response.status };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error(`${serviceName} - OFFLINE - Erro: ${error.message}`);
    return { success: false, responseTime, error: error.message };
  }
}

async function monitorServices() {
  logger.info('Iniciando monitoramento dos serviços...\n');
  
  const results = {};
  
  for (const [name, url] of Object.entries(BACKEND_URLS)) {
    results[name] = await checkHealth(name.toUpperCase(), url);
  }
  
  const totalServices = Object.keys(results).length;
  const healthyServices = Object.values(results).filter(r => r.success).length;
  const avgResponseTime = Object.values(results)
    .reduce((sum, r) => sum + r.responseTime, 0) / totalServices;
  
  logger.info(`\nRESUMO:`);
  logger.info(`   Servicos Ativos: ${healthyServices}/${totalServices}`);
  logger.info(`   Tempo Medio de Resposta: ${avgResponseTime.toFixed(2)}ms`);
  
  if (healthyServices < totalServices) {
    logger.error(`\nALERTA: ${totalServices - healthyServices} servico(s) offline!`);
  }
  
  return results;
}

monitorServices()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.error(`Erro fatal: ${error.message}`);
    process.exit(1);
  });
