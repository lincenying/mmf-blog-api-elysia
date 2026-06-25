FROM oven/bun:1.3 AS build

WORKDIR /app

# 缓存依赖安装
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

ENV NODE_ENV=production

COPY ./src ./src
COPY ./config ./config
COPY ./tsconfig.json ./tsconfig.json
COPY ./.env ./.env

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM oven/bun:1.3

WORKDIR /app

COPY --from=build /app/server server
COPY ./package.json ./package.json
COPY ./config ./config
COPY ./views ./views
COPY ./public ./public
COPY ./uploads ./uploads
COPY ./.env ./.env
COPY ./dist/index.html ./dist/index.html

ENV NODE_ENV=production

EXPOSE 14080

CMD ["./server"]
