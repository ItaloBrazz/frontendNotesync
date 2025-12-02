import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Sobe para 50 usuários
    { duration: '2m', target: 50 },   // Mantém 50 usuários
    { duration: '30s', target: 0 },   // Desce para 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% das requests < 3s
    errors: ['rate<0.15'],             // Taxa de erro < 15%
  },
};

const BASE_URL = 'https://notesync-auth-service.onrender.com';

export default function () {
  // Teste do health check
  const healthRes = http.get(`${BASE_URL}/health`);
  
  const healthCheck = check(healthRes, {
    'health status é 200': (r) => r.status === 200,
    'health responde em < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  errorRate.add(!healthCheck);
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'monitoring/growing-load-results.json': JSON.stringify(data, null, 2),
  };
}
