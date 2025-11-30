# Notesync – Frontend

![Frontend CI](https://github.com/ItaloBrazz/frontendNotesync/actions/workflows/ci-cd.yml/badge.svg)

Este é o frontend do projeto Notesync, desenvolvido com **React + Vite**.  
O repositório também implementa a Parte 2 do trabalho de DevOps, incluindo testes automatizados, pipeline CI/CD e deploy automático no GitHub Pages.

---

## :rocket: Como rodar o projeto

Instalar dependências:

npm install

Rodar em ambiente de desenvolvimento:

npm run dev

Rodar build:

npm run build

Rodar testes:

npm test

---

## :heavy_check_mark: Pipeline CI/CD

O pipeline do frontend executa:

1. **Checkout do código**
2. **Instalação das dependências (npm ci)**
3. **Execução dos testes**
4. **Build do projeto**
5. **Upload dos artefatos**
6. **Deploy automático para GitHub Pages**  
   (somente quando há push para a branch `main`)

Arquivo do workflow:

.github/workflows/frontend-ci.yml

---

## :repeat: Deploy Automático

Sempre que ocorrer um **push na branch `main`**, o job `deploy` envia o conteúdo da pasta `dist` para a branch `gh-pages`.

O deploy usa a action:

JamesIves/github-pages-deploy-action@v4

A aplicação ficará disponível em:



(Deploy já configurado e funcional.)

---

## :computer: Teste Automatizado

O frontend possui um teste simples para validar a integridade do pipeline:

test("frontend health test", () => {
expect(2 + 2).toBe(4);
});

Esse teste é executado automaticamente em:

- Push para `main` ou `test-devops`
- Pull requests para `main` ou `test-devops`

---

## Prints do Pipeline

- Execução do CI:  
  `/docs/prints/frontend-ci-run.png`

- Deploy no GitHub Pages:  
  `/docs/prints/frontend-deploy.png`

---

## :open_file_folder: Estrutura Básica do Projeto

src/

├── pages/

├── components/

├── hooks/

├── contexts/

├── App.jsx

├── main.jsx

public/

index.html

vite.config.js
