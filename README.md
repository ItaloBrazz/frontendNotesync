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
npm test                 # Testes
npm run test:watch       # Testes em watch mode
```

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
