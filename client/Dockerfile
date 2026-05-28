FROM node:20-alpine AS main-builder
WORKDIR /hotel-bookings
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=main-builder /hotel-bookings/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && chown -R appuser:appgroup /var/log/nginx \
    && chown -R appuser:appgroup /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]