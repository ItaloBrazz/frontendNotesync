# NoteSync Frontend

![CI/CD](https://github.com/ItaloBrazz/frontendNotesync/actions/workflows/ci-cd.yml/badge.svg)

Frontend do NoteSync desenvolvido em React + Vite, conectado aos serviços backend.

## Instalação

```bash
npm install
```

## Executar em Desenvolvimento

```bash
npm run dev
```

Acessar em: **http://localhost:5173**

## Testes

```bash
# Executar testes
npm test

# Modo watch
npm run test:watch
```

Os testes cobrem:
- Autenticação (login e registro)
- Operações de tarefas (CRUD)
- Gerenciamento de sessão

## Configuração

Criar arquivo `.env` na raiz:

```env
VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com
```

Reiniciar o servidor após alterar o `.env`.

## Docker

### Container Individual

```bash
docker build -t notesync-frontend .
docker run -p 3000:80 notesync-frontend
```

### Docker Compose (Alta Disponibilidade)

```bash
# Iniciar ambiente completo
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

O docker-compose configura:
- 2 instâncias do frontend (redundância)
- Load balancer Nginx (failover automático)
- Health checks e restart automático

Acessar via: **http://localhost:8080**

### Testar Failover

```bash
# Parar instância principal
docker stop notesync-frontend

# Aplicação continua funcionando via réplica
curl http://localhost:8080
```

## Build para Produção

```bash
npm run build
npm run preview
```

## CI/CD

Pipeline automatizado via GitHub Actions:
- Executa testes em cada push/PR
- Build automático
- Deploy no GitHub Pages (branch main)
- PRs só podem ser mergeados se testes passarem

## Estrutura do Projeto

```
frontendNotesync/
├── src/
│   ├── api/              # Chamadas à API
│   ├── components/       # Componentes React
│   ├── context/          # Context API
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas
│   └── styles/           # CSS
├── tests/                # Testes unitários
├── Dockerfile
├── docker-compose.yml
└── nginx.conf            # Config do load balancer
```

## Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm test                 # Testes unitários
npm run test:watch       # Testes em watch mode
npm run monitor          # Monitoramento de serviços
npm run load:light       # Teste de carga leve (10 req/s)
npm run load:growing     # Teste de carga crescente (50 req/s)
npm run load:popular     # Teste de carga popular (100 req/s)
npm run load:viral       # Teste de carga viral (1000 req/s)
npm run load:all         # Executar todos os testes de carga
```

## Monitoramento e Observabilidade

### Health Check

Monitora a saúde dos serviços backend:

```bash
npm run monitor
```

Verifica:
- Status dos endpoints `/health`
- Tempo de resposta de cada serviço
- Alertas para serviços offline

### Testes de Carga

4 cenários de teste implementados com K6:

1. **Leve**: 10 requisições/segundo (uso normal)
2. **Crescente**: 50 requisições/segundo (crescimento)
3. **Popular**: 100 requisições/segundo (app popular)
4. **Viral**: 1000 requisições/segundo (pico extremo)

**Documentação completa:** Ver `monitoring/README.md`

### Métricas Coletadas

- Tempo médio de resposta
- Taxa de sucesso/falha
- Latência p(95) e p(99)
- Throughput (requisições/segundo)
- Alertas automáticos para degradação

## Troubleshooting

**Erro de conexão com backend:**
- Verificar se backend está rodando
- Conferir URLs no arquivo `.env`
- Reiniciar servidor após alterar `.env`

**Testes falhando:**
- Executar `npm install` novamente
- Verificar se há erros de sintaxe

**Porta em uso:**
- Alterar porta no `vite.config.js`
