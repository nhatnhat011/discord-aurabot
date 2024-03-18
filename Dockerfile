FROM node:lts-alpine3.19
WORKDIR /app
COPY . .
RUN apk add sqlite &&\
    npm install
CMD ["npm run start"]
