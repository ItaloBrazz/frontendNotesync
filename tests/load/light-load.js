import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Sobe para 10 usuários
    { duration: '1m', target: 10 },   // Mantém 10 usuários
    { duration: '20s', target: 0 },   // Desce para 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requests < 2s
    errors: ['rate<0.1'],              // Taxa de erro < 10%
  },
};

const BASE_URL = 'https://notesync-auth-service.onrender.com';

export default function () {
  // Teste do health check
  const healthRes = http.get(`${BASE_URL}/health`);
  
  const healthCheck = check(healthRes, {
    'health status é 200': (r) => r.status === 200,
    'health responde em < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(!healthCheck);
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'monitoring/light-load-results.json': JSON.stringify(data, null, 2),
  };
}
