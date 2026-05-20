FROM node:20-alpine AS main-builder
WORKDIR /hotel-bookings
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS main-runner
COPY --from=main-builder /hotel-bookings/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]