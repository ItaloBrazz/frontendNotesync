import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 1000 },   // Sobe para 1000 usuários
    { duration: '5m', target: 1000 },   // Mantém 1000 usuários
    { duration: '1m', target: 0 },      // Desce para 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<10000'], // 95% das requests < 10s
    errors: ['rate<0.3'],               // Taxa de erro < 30%
  },
};

const BASE_URL = 'https://notesync-auth-service.onrender.com';

export default function () {
  // Teste do health check
  const healthRes = http.get(`${BASE_URL}/health`);
  
  const healthCheck = check(healthRes, {
    'health status é 200': (r) => r.status === 200,
    'health responde em < 5000ms': (r) => r.timings.duration < 5000,
  });
  
  errorRate.add(!healthCheck);
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'monitoring/viral-load-results.json': JSON.stringify(data, null, 2),
  };
}
