# Parte 4: Monitoramento e Observabilidade

## Objetivo

Garantir a estabilidade e desempenho da aplicação através de:
- Monitoramento contínuo dos serviços
- Testes de carga simulando diferentes cenários
- Análise de métricas de performance

---

## Ferramentas Utilizadas

- **K6**: Testes de carga e stress
- **Node.js**: Scripts de monitoramento
- **Health Checks**: Validação de disponibilidade

---

## Estrutura de Arquivos

```
monitoring/
  ├── light-load-results.json
  ├── growing-load-results.json
  ├── popular-load-results.json
  └── viral-load-results.json

scripts/
  └── health-check.js

tests/load/
  ├── light-load.js
  ├── growing-load.js
  ├── popular-load.js
  └── viral-load.js
```

---

## Como Usar

### 1. Instalação do K6

O K6 já foi instalado via winget. Para verificar:

```bash
k6 version
```

Se não reconhecer o comando, reinicie o terminal e tente novamente.

### 2. Monitoramento de Health Check

Execute o script de monitoramento para verificar status dos serviços:

```bash
npm run monitor
```

**O que faz:**
- Checa endpoints `/health` dos serviços backend
- Mede tempo de resposta
- Exibe status colorido (OK, WARN, ERROR)
- Calcula tempo médio de resposta
- Gera alertas se serviços estiverem offline

**Saída esperada:**
```
[INFO] Iniciando monitoramento dos serviços...
[INFO] AUTH - Status: OK - Tempo: 1234ms
[INFO] TASKS - Status: OK - Tempo: 567ms

RESUMO:
   Servicos Ativos: 2/2
   Tempo Medio de Resposta: 900.50ms
```

---

## Testes de Carga

### Cenário 1: Carga Leve (10 req/s)

Simula uso normal da aplicação.

```bash
npm run load:light
```

**Configuração:**
- 10 usuários simultâneos
- Duração: 1min 50s
- Threshold: 95% requests < 2s

### Cenário 2: Carga Crescente (50 req/s)

Simula crescimento de usuários.

```bash
npm run load:growing
```

**Configuração:**
- 50 usuários simultâneos
- Duração: 3min 30s
- Threshold: 95% requests < 3s

### Cenário 3: Carga Popular (100 req/s)

Simula aplicação popular em uso normal.

```bash
npm run load:popular
```

**Configuração:**
- 100 usuários simultâneos
- Duração: 4min 30s
- Threshold: 95% requests < 5s

### Cenário 4: Carga Viral (1000 req/s)

Simula pico extremo de tráfego (viralização).

```bash
npm run load:viral
```

**Configuração:**
- 1000 usuários simultâneos
- Duração: 8min
- Threshold: 95% requests < 10s

### Executar Todos os Cenários

```bash
npm run load:all
```

**Atenção**: Este comando pode levar mais de 20 minutos para completar.

---

## Métricas Avaliadas

### 1. Tempo de Resposta
- **Média**: Tempo médio de todas as requisições
- **p(95)**: 95% das requisições ficaram abaixo deste tempo
- **p(99)**: 99% das requisições ficaram abaixo deste tempo
- **Max**: Tempo máximo registrado

### 2. Taxa de Sucesso/Falha
- **http_req_failed**: Percentual de requisições com erro
- **checks**: Percentual de validações que passaram

### 3. Throughput
- **http_reqs**: Total de requisições por segundo
- **data_received**: Volume de dados recebidos

### 4. Latência
- **http_req_connecting**: Tempo de conexão
- **http_req_waiting**: Tempo aguardando resposta
- **http_req_receiving**: Tempo recebendo dados

---

## Interpretando os Resultados

### Resultado Bom
```
http_req_duration..............: avg=450ms  p(95)=800ms
http_req_failed................: 0.50%
checks.........................: 99.50%
```

### Resultado Aceitável
```
http_req_duration..............: avg=1.2s   p(95)=2.5s
http_req_failed................: 8.50%
checks.........................: 91.50%
```

### Resultado Ruim
```
http_req_duration..............: avg=5.8s   p(95)=12s
http_req_failed................: 35.00%
checks.........................: 65.00%
```

---

## Alertas Implementados

### No Script de Monitoramento:

1. **Serviço Offline**
```
[ERROR] AUTH - OFFLINE - Erro: connect ECONNREFUSED
ALERTA: 1 servico(s) offline!
```

2. **Resposta Lenta**
```
[WARN] TASKS - Status: 200 - Tempo: 5432ms
```

### Nos Testes de Carga:

1. **Taxa de Erro Alta**
```
errors.........................: rate>0.1 (threshold violated)
```

2. **Tempo de Resposta Excedido**
```
http_req_duration..............: p(95)>2000 (threshold violated)
```

---

## Relatório de Resultados

Após executar os testes, os resultados são salvos em:
- `monitoring/light-load-results.json`
- `monitoring/growing-load-results.json`
- `monitoring/popular-load-results.json`
- `monitoring/viral-load-results.json`

### Estrutura do JSON:

```json
{
  "metrics": {
    "http_req_duration": {
      "avg": 450.23,
      "med": 420.15,
      "p(95)": 780.45
    },
    "http_req_failed": {
      "rate": 0.005
    }
  }
}
```

---

## Para Apresentar ao Professor

### 1. Demonstração do Monitoramento
```bash
npm run monitor
```
Explique: "Este script verifica a saúde dos serviços backend em tempo real"

### 2. Executar Teste de Carga Leve
```bash
npm run load:light
```
Explique: "Simulando 10 usuários simultâneos durante 2 minutos"

### 3. Mostrar Resultados
Abra o arquivo `monitoring/light-load-results.json` e destaque:
- Tempo médio de resposta
- Taxa de sucesso (deve ser > 90%)
- Latência p(95)

### 4. Comparar Cenários
Mostre a diferença entre:
- Carga leve (10 req/s) → Resposta rápida
- Carga viral (1000 req/s) → Resposta degradada

---

## Troubleshooting

### K6 não reconhecido
```bash
# Reinicie o terminal ou use o caminho completo
"C:\Program Files\k6\k6.exe" run tests/load/light-load.js
```

### Backend não responde
- Verifique se os serviços Render estão ativos
- Serviços gratuitos do Render entram em sleep após inatividade
- Primeira requisição pode demorar ~30s para acordar

### Testes falhando
- Normal em serviços gratuitos (recursos limitados)
- Render free tier: 512MB RAM, compartilhado
- Taxa de erro aceitável: até 15% em carga alta

---

## Checklist de Entrega

- [x] Health check endpoint configurado
- [x] Script de monitoramento implementado
- [x] Logs estruturados (info, warn, error)
- [x] Alertas para erros implementados
- [x] 4 cenários de teste de carga criados
- [x] Métricas sendo coletadas
- [x] Resultados salvos em JSON
- [x] Documentação completa

---

## Comandos Rápidos

```bash
# Monitoramento
npm run monitor

# Testes individuais
npm run load:light
npm run load:growing
npm run load:popular
npm run load:viral

# Todos os testes
npm run load:all
```

---

**Status**: Parte 4 Completa e Funcional
