FROM node:lts as build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm ci --force
COPY . .
RUN ng build

FROM nginx:stable-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ishop2.0 /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
