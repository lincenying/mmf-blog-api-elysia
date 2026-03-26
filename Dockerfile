FROM oven/bun:1.3 AS build

WORKDIR /app

# 缓存依赖安装
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src
COPY ./config ./config
COPY ./tsconfig.json ./tsconfig.json
COPY ./.env ./.env

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base:latest

WORKDIR /app

COPY --from=build /app/server server
COPY ./config ./config
COPY ./views ./views
COPY ./public ./public
COPY ./uploads ./uploads
COPY ./.data ./.data
COPY ./.env ./.env

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 4080
