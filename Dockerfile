FROM oven/bun:1.3 AS build

WORKDIR /app

# 缓存依赖安装
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM distroless/base-debian13:latest

WORKDIR /app

COPY --from=build /app/server server
COPY ./public ./public
COPY ./uploads ./uploads

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 4000
