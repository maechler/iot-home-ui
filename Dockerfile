FROM node:11.6.0-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build -- --prod

FROM nginx:alpine

COPY --from=builder /app/dist/iot-home-ui/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
