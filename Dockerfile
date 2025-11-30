FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./

# Instalar dependências (usando npm install pois pode não haver package-lock.json)
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação (usando variável de ambiente ou padrão)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# Stage 2: Servir com nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
