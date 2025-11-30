# 🔥 Deploy do Frontend no Firebase Hosting

Guia completo passo a passo para fazer deploy do frontend NoteSync no Firebase Hosting.

## 📋 Pré-requisitos

- ✅ Conta no Google (para Firebase) - [Criar conta](https://console.firebase.google.com/)
- ✅ Node.js instalado no seu computador
- ✅ Código do frontend no repositório
- ✅ Backend deployado no Render

## 🚀 Instalação e Configuração Inicial

### Passo 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Passo 2: Fazer Login no Firebase

```bash
firebase login
```

Isso abrirá o navegador para você fazer login com sua conta Google.

### Passo 3: Inicializar Firebase no Projeto

```bash
cd frontendNotesync
firebase init hosting
```

Durante a inicialização, você será perguntado:

1. **"Which Firebase CLI features do you want to set up?"**
   - Selecione: `Hosting: Configure files for Firebase Hosting`

2. **"Please select an option:"**
   - Selecione: `Use an existing project` (se já tiver um projeto)
   - Ou: `Create a new project` (se for criar um novo)

3. **"What do you want to use as your public directory?"**
   - Digite: `dist`

4. **"Configure as a single-page app (rewrite all urls to /index.html)?"**
   - Digite: `Yes` (importante para React Router funcionar)

5. **"Set up automatic builds and deploys with GitHub?"**
   - Digite: `No` (podemos configurar depois se quiser)

6. **"File dist/index.html already exists. Overwrite?"**
   - Digite: `No`

### Passo 4: Verificar Arquivos Criados

O Firebase criará dois arquivos:

- ✅ `firebase.json` - Configuração do Firebase Hosting
- ✅ `.firebaserc` - Configuração do projeto Firebase

## ⚙️ Configurar Variáveis de Ambiente

Como o Firebase Hosting serve arquivos estáticos, as variáveis de ambiente precisam ser injetadas **durante o build**. Existem duas formas:

### Método 1: Arquivo .env.local (Recomendado para Desenvolvimento)

Crie um arquivo `.env.local` na raiz do `frontendNotesync/`:

```env
VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com
```

**⚠️ IMPORTANTE**: Este arquivo NÃO deve ser commitado no Git (já está no .gitignore).

### Método 2: Variáveis no Build Script (Recomendado para Produção)

Atualize o script de build no `package.json` para incluir as variáveis:

```json
{
  "scripts": {
    "build": "vite build",
    "build:firebase": "VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com vite build"
  }
}
```

Ou, para Windows PowerShell:

```json
{
  "scripts": {
    "build": "vite build",
    "build:firebase": "cross-env VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com vite build"
  }
}
```

Para usar `cross-env`, instale:

```bash
npm install --save-dev cross-env
```

## 📝 Configurar firebase.json

Verifique se o arquivo `firebase.json` está assim:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🚀 Fazer Build e Deploy

### Passo 1: Fazer Build do Projeto

#### Opção A: Usando script com variáveis inline

```bash
# Linux/Mac
VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com \
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com \
npm run build

# Windows PowerShell
$env:VITE_AUTH_SERVICE_URL="https://notesync-auth-service.onrender.com"
$env:VITE_TASKS_SERVICE_URL="https://notesync-tasks-service.onrender.com"
npm run build

# Windows CMD
set VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com
set VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com
npm run build
```

#### Opção B: Usando arquivo .env.local

1. Crie `.env.local` com as variáveis
2. Execute:

```bash
npm run build
```

#### Opção C: Usando script customizado

Se você criou o script `build:firebase`:

```bash
npm run build:firebase
```

### Passo 2: Deploy no Firebase

```bash
firebase deploy --only hosting
```

O Firebase mostrará uma URL como: `https://seu-projeto.web.app` ou `https://seu-projeto.firebaseapp.com`

## 🔄 Automatizar Build e Deploy

### Criar Script de Deploy Automático

Crie um arquivo `deploy-firebase.sh` (Linux/Mac) ou `deploy-firebase.ps1` (Windows):

#### Linux/Mac (deploy-firebase.sh):

```bash
#!/bin/bash

echo "🔥 Fazendo build com variáveis de ambiente..."

VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com \
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com \
npm run build

echo "🚀 Fazendo deploy no Firebase..."
firebase deploy --only hosting

echo "✅ Deploy concluído!"
```

Torne executável:

```bash
chmod +x deploy-firebase.sh
```

Execute:

```bash
./deploy-firebase.sh
```

#### Windows PowerShell (deploy-firebase.ps1):

```powershell
Write-Host "🔥 Fazendo build com variáveis de ambiente..." -ForegroundColor Yellow

$env:VITE_AUTH_SERVICE_URL="https://notesync-auth-service.onrender.com"
$env:VITE_TASKS_SERVICE_URL="https://notesync-tasks-service.onrender.com"
npm run build

Write-Host "🚀 Fazendo deploy no Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
```

Execute:

```powershell
.\deploy-firebase.ps1
```

### Atualizar package.json

Adicione um script para facilitar:

```json
{
  "scripts": {
    "deploy:firebase": "npm run build && firebase deploy --only hosting",
    "deploy:firebase:full": "npm run build:firebase && firebase deploy --only hosting"
  }
}
```

## 📝 Atualizar Variáveis de Ambiente

Se você precisar alterar as URLs dos serviços:

1. **Atualize o arquivo `.env.local`** (se estiver usando)
2. **Ou atualize o script de build** no `package.json`
3. **Faça um novo build e deploy**:

```bash
# Limpar build anterior
rm -rf dist

# Novo build
npm run build

# Deploy
firebase deploy --only hosting
```

## ✅ Verificar Deploy

Após o deploy, verifique:

1. **URL do Frontend**: Acesse a URL fornecida pelo Firebase
2. **Console do Navegador**: Abra DevTools (F12)
   - Não deve haver erros
   - Verifique se as requisições estão indo para os serviços corretos
3. **Network Tab**: Confirme que as requisições são feitas para:
   - `https://notesync-auth-service.onrender.com/api/auth/*`
   - `https://notesync-tasks-service.onrender.com/api/tasks/*`

## 🔧 Configurações Adicionais

### Configurar Domínio Personalizado

1. No Firebase Console, vá para **Hosting**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar DNS

### Configurar Cache e Headers

Atualize `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Erro: "firebase: command not found"

**Solução**: Instale o Firebase CLI:

```bash
npm install -g firebase-tools
```

### Erro: "Failed to fetch" após deploy

**Causa**: Variáveis de ambiente não foram injetadas no build.

**Solução**:
1. Verifique se as variáveis foram definidas antes do build
2. Verifique o arquivo `.env.local` (se estiver usando)
3. Faça um novo build com as variáveis definidas
4. Faça deploy novamente

### Erro: "Build failed"

**Solução**:
1. Teste o build localmente primeiro: `npm run build`
2. Verifique se há erros no código
3. Verifique se o diretório `dist` foi criado

### Variáveis de ambiente não funcionam

**IMPORTANTE**: No Firebase Hosting, as variáveis devem ser injetadas **durante o build**, não no runtime!

**Soluções**:
1. Use `.env.local` e certifique-se de que está na raiz do projeto
2. Ou defina as variáveis antes do comando `npm run build`
3. Ou use o script customizado `build:firebase`

### Frontend não conecta ao backend

**Verificações**:
1. Backend está online?
   - Teste: `https://notesync-auth-service.onrender.com/health`
   - Teste: `https://notesync-tasks-service.onrender.com/health`
2. Variáveis foram injetadas no build?
   - Verifique o código no navegador (Network tab)
   - As requisições devem ir para as URLs corretas
3. CORS está configurado? (já está configurado no backend)

### Deploy para preview/staging

Para fazer deploy em um canal de preview:

```bash
firebase hosting:channel:deploy preview
```

Isso cria uma URL temporária para testar antes de fazer deploy em produção.

## 📊 Monitoramento

O Firebase Console oferece:

- ✅ Analytics de uso
- ✅ Logs de erros
- ✅ Estatísticas de performance
- ✅ Histórico de deploys

Acesse: [console.firebase.google.com](https://console.firebase.google.com)

## 🎉 Pronto!

Após o deploy, seu frontend estará:
- ✅ Disponível em `https://seu-projeto.web.app`
- ✅ Conectado aos serviços backend no Render
- ✅ Com SSL automático
- ✅ Com CDN global

---

## 📋 Resumo Rápido

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar (primeira vez)
cd frontendNotesync
firebase init hosting

# 4. Build com variáveis
VITE_AUTH_SERVICE_URL=https://notesync-auth-service.onrender.com \
VITE_TASKS_SERVICE_URL=https://notesync-tasks-service.onrender.com \
npm run build

# 5. Deploy
firebase deploy --only hosting
```

**Pronto!** 🚀

