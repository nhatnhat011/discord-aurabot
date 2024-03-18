FROM node:16.9.1-alpine
WORKDIR /app
COPY . .
RUN apk add git build-base &&\
    wget 'https://www.sqlite.org/2022/sqlite-autoconf-3370200.tar.gz' &&\
    tar xvfz sqlite-autoconf-3370200.tar.gz &&\
    cd sqlite-autoconf-3370200 &&\
    ./configure &&\
    make && make install &&\
    cd .. &&\
    rm -rf ../sqlite-autoconf-3370200 && rm -rf sqlite-autoconf-3370200.tar.gz &&\
    npm install
CMD ["npm run start"]
