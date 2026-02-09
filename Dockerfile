FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências em modo reprodutível
RUN npm ci

# Copia o restante do código
COPY . .

# Build da aplicação para produção
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Servidor HTTP simples para arquivos estáticos
RUN npm install -g http-server

# Copia os artefatos buildados do estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta HTTP
EXPOSE 80

# Sobe o servidor estático
CMD ["http-server", "dist", "-p", "80", "-a", "0.0.0.0"]

