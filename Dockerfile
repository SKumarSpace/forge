FROM oven/bun:1 AS frontend
WORKDIR /app

COPY ./client .

# install with --production (exclude devDependencies)
RUN bun install --frozen-lockfile

# build the frontend
RUN bun run build

FROM golang:1.23.5-bullseye AS backend
WORKDIR /app

COPY ./server .

RUN go mod download

# build the backend
RUN CGO_ENABLED=0 go build -o /bin/forge

FROM scratch AS final
WORKDIR /app

COPY --from=backend /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ADD https://github.com/golang/go/raw/master/lib/time/zoneinfo.zip /zoneinfo.zip
ENV ZONEINFO /zoneinfo.zip

COPY --from=backend /bin/forge .
COPY --from=frontend /app/dist ./client/dist

EXPOSE 8080

ENTRYPOINT [ "/app/forge" ]