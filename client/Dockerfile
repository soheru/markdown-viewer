FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set up environment variables for build time
ARG DOMAIN=kickshare.fun
RUN sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" .env.production

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
