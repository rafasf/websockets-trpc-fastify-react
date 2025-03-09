FROM oven/bun:latest AS builder

WORKDIR /app

COPY ./app/server/package.json ./
COPY ./bun.lock ./

COPY ./app/server .

RUN bun install
RUN bun build --compile --outfile dist/background-updates src/background-updates.ts

FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app/dist/background-updates ./background-updates

CMD ["/app/background-updates"]