FROM oven/bun:latest AS builder

WORKDIR /app

COPY ./app/server/package.json ./
COPY ./bun.lock ./

COPY ./app/server .

RUN bun install
RUN bun run build

FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist/an-app-server ./an-app-server

EXPOSE 3000

CMD ["/app/an-app-server"]
