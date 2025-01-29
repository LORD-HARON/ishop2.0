FROM node:current-alpine3.20
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm ci --force
COPY . .
EXPOSE 80
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "80"]
