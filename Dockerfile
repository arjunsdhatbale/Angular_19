# ═══════════════════════════════════════════════
# Stage 1 — BUILD Angular
# ═══════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (cache npm install layer)
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source
COPY . .

# Build Angular for production
RUN npm run build -- --configuration=production

# ═══════════════════════════════════════════════
# Stage 2 — SERVE with Nginx
# ═══════════════════════════════════════════════
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy built Angular app
COPY --from=builder /app/dist/demo/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]