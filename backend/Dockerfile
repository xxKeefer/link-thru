# ----------- Builder stage -----------
FROM node:23-slim AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies including dev
RUN pnpm install

# Copy source files and env
COPY . .

# Build the app (compile TypeScript)
RUN pnpm build

# Build the app (compile TypeScript)
RUN pnpm build


# ----------- Runner stage -----------
FROM node:23-slim AS runner

WORKDIR /app

# Enable pnpm 
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built app files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app using the compiled output
CMD ["node", "dist/src/main.js"]
