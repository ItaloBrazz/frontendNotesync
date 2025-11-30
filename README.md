# NoteSync Frontend

Frontend do NoteSync desenvolvido em React + Vite, conectado aos serviços backend no Render.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install
```

### Executar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

## ⚙️ Configuração

### Variáveis de Ambiente

O frontend precisa saber onde estão os serviços do backend. Configure através de um arquivo `.env` na raiz do projeto:

#### Produção (Serviços no Render) ⭐ RECOMENDADO

Crie um arquivo `.env` com:

```env
VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com
```

#### Desenvolvimento Local (Backend via Docker Compose)

Se você está rodando o backend localmente:

```env
VITE_API_BASE_URL=http://localhost:8080
```

#### Desenvolvimento Local (Backend direto)

Se você está rodando os serviços diretamente:

```env
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_TASKS_SERVICE_URL=http://localhost:3002
```

### ⚠️ IMPORTANTE

**Sempre reinicie o servidor** (`npm run dev`) após criar ou alterar o arquivo `.env`!

As variáveis de ambiente do Vite são injetadas em tempo de build/desenvolvimento, então mudanças no `.env` só terão efeito após reiniciar.

## 🌐 Serviços Backend

### URLs dos Serviços em Produção

- **Auth Service**: `https://notesync-auth-service.onrender.com`
- **Tasks Service**: `https://notesync-tasks-service.onrender.com`

### Como Funciona

O frontend está configurado para usar URLs específicas para cada serviço:

- **Autenticação** → `VITE_AUTH_SERVICE_URL/api/auth/*`
  - Login: `POST /api/auth/login`
  - Registro: `POST /api/auth/register`

- **Tarefas** → `VITE_TASKS_SERVICE_URL/api/tasks/*`
  - Listar: `GET /api/tasks`
  - Criar: `POST /api/tasks`
  - Atualizar: `PUT /api/tasks/:id`
  - Atualizar status: `PATCH /api/tasks/:id/status`
  - Deletar: `DELETE /api/tasks/:id`

**Prioridade**: Se `VITE_AUTH_SERVICE_URL` e `VITE_TASKS_SERVICE_URL` estiverem definidos, elas têm prioridade sobre `VITE_API_BASE_URL`.

## 🐳 Executar com Docker

### Build da Imagem

```bash
docker build -t notesync-frontend .
```

### Executar Container

**Produção:**
```bash
docker run -p 3000:80 \
  -e VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com \
  -e VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com \
  notesync-frontend
```

**Desenvolvimento:**
```bash
docker run -p 3000:80 \
  -e VITE_API_BASE_URL=http://localhost:8080 \
  notesync-frontend
```

## 📦 Build para Produção

### Gerar Build

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

### Preview do Build

```bash
npm run preview
```

### Servir Build Localmente

```bash
# Usando serve
npx serve -s dist -l 3000

# Ou usando http-server
npx http-server dist -p 3000
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (porta 5173)
npm run build    # Gera build de produção na pasta dist/
npm run preview  # Visualiza o build de produção localmente
```

## 📁 Estrutura do Projeto

```
frontendNotesync/
├── src/
│   ├── api/              # Chamadas à API
│   │   ├── auth.js       # Autenticação
│   │   ├── tasks.js      # Tarefas
│   │   └── http.js       # Cliente HTTP
│   ├── components/       # Componentes React
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   └── ThemeToggle.jsx
│   ├── context/          # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.js
│   │   └── useTasks.js
│   ├── pages/            # Páginas
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TodoPage.jsx
│   │   ├── DonePage.jsx
│   │   ├── CreateTaskPage.jsx
│   │   └── NotFoundPage.jsx
│   └── styles/           # Estilos CSS
│       └── global.css
├── public/               # Arquivos estáticos
│   └── assets/          # Imagens e ícones
├── index.html            # HTML principal
├── vite.config.js        # Configuração do Vite
├── Dockerfile            # Docker para produção
└── package.json
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"

**Solução**: Execute `npm install` para instalar as dependências.

### Erro: "Network Error" ou "Failed to fetch"

**Soluções**:
1. Verifique se os serviços backend estão online:
   - `https://notesync-auth-service.onrender.com/health`
   - `https://notesync-tasks-service.onrender.com/health`
2. Verifique se o arquivo `.env` está correto
3. Reinicie o servidor de desenvolvimento

### Erro de CORS

Os serviços backend já estão configurados para aceitar requisições de qualquer origem. Se houver erros:
1. Verifique se as URLs no `.env` estão corretas
2. Verifique os logs do backend

### Frontend não conecta com o backend

**Soluções**:
1. Verifique se o backend está rodando
2. Teste a URL do backend diretamente no navegador
3. Verifique o arquivo `.env`
4. Reinicie o servidor após alterar o `.env`

### Porta 5173 já está em uso

**Solução**: 
1. Pare outros processos usando a porta
2. Ou altere a porta no `vite.config.js`:
   ```javascript
   server: {
     port: 3000, // ou outra porta
   }
   ```

### Variáveis de ambiente não funcionam

**IMPORTANTE**: Variáveis de ambiente do Vite são injetadas em tempo de build/desenvolvimento. Você **DEVE** reiniciar o servidor (`npm run dev`) após alterar o `.env`!

## 📝 Notas Importantes

1. **Variáveis de Ambiente**: No Vite, variáveis de ambiente devem começar com `VITE_` para serem expostas ao código
2. **Build Time**: As variáveis de ambiente são injetadas no build, então você precisa fazer rebuild se mudar
3. **CORS**: Certifique-se de que os serviços backend permitem requisições do domínio do frontend
4. **Serviços Separados**: Para produção, é recomendado usar `VITE_AUTH_SERVICE_URL` e `VITE_TASKS_SERVICE_URL` para maior flexibilidade

## ✅ Checklist para Executar

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado com as URLs dos serviços
- [ ] Backend rodando (local ou remoto)
- [ ] Servidor de desenvolvimento iniciado (`npm run dev`)

## 🎉 Pronto!

Agora você pode executar:

```bash
npm run dev
```

E acessar: **http://localhost:5173**

---

**Documentação do Backend**: Consulte `../backendNotesync/README.md` para informações sobre os serviços backend.
