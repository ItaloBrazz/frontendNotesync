import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Sobe para 100 usuários
    { duration: '3m', target: 100 },   // Mantém 100 usuários
    { duration: '30s', target: 0 },    // Desce para 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% das requests < 5s
    errors: ['rate<0.2'],              // Taxa de erro < 20%
  },
};

const BASE_URL = 'https://notesync-auth-service.onrender.com';

export default function () {
  // Teste do health check
  const healthRes = http.get(`${BASE_URL}/health`);
  
  const healthCheck = check(healthRes, {
    'health status é 200': (r) => r.status === 200,
    'health responde em < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(!healthCheck);
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'monitoring/popular-load-results.json': JSON.stringify(data, null, 2),
  };
}
