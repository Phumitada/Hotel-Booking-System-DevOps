FROM node:20-alpine
WORKDIR /hotel-bookings
COPY package.json .
RUN npm install
COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /hotel-bookings
USER appuser

EXPOSE 5000
CMD ["npm","start"]