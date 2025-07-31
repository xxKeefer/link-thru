# ----------- Builder stage -----------
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  # Enable pnpm
  RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
  
  # Copy manifests and install dependencies
  COPY package.json pnpm-lock.yaml* ./
  RUN pnpm install
  
  # Copy source code
  COPY . .
  
  # Build Vite app
  RUN pnpm run build
  
  
  # ----------- Runner stage -----------
  FROM nginx:stable-alpine
  
  # Copy build output to nginx public folder
  COPY --from=builder /app/dist /usr/share/nginx/html
  
  # Copy custom nginx config (see below)
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  