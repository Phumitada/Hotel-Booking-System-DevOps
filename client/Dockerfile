FROM node:20-alpine AS main-builder
WORKDIR /hotel-bookings
COPY package.json .
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine AS main-runner
COPY --from=main-builder /hotel-bookings/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]