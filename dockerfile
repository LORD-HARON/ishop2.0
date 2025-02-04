FROM node:lts as build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm ci --force
COPY . .
RUN ng build

FROM nginx:stable-alpine

# COPY --from=build /dist /usr/share/nginx/html 
# COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /dist/src/app/dist/ISHOP2.0 /usr/share/nginx/html
# COPY /nginx.conf  /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ishop2.0 /usr/share/nginx/html
EXPOSE 80

# CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "80"]
CMD ["nginx", "-g", "daemon off;"]
