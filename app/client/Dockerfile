FROM oven/bun:latest AS builder

WORKDIR /app

COPY ./app/client/package.json ./
COPY ./bun.lock ./

COPY ./app/client .
COPY ./app/server ./server

RUN bun install
RUN bun run build

FROM nginx:alpine

RUN echo 'server { \
    listen 3001; \
    server_name localhost; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]

# FROM oven/bun:latest
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# EXPOSE 3001
# CMD ["bun", "run", "serve", "dist"]
