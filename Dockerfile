FROM node:lts-bookworm-slim AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html/todo-angular-seventeen

RUN rm -rf ./*

COPY --from=builder /app/dist/browser .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]