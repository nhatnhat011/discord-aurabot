FROM node:16.9.1-alpine
WORKDIR /app
RUN apk add git build-base &&\
    git clone 'https://github.com/nhatnhat011/discord-aurabot.git' &&\
    wget 'https://www.sqlite.org/2022/sqlite-autoconf-3370200.tar.gz' &&\
    tar xvfz sqlite-autoconf-3370200.tar.gz &&\
    cd sqlite-autoconf-3370200 &&\
    ./configure &&\
    make && make install &&\
    cd ../discord-aurabot &&\
	rm -rf ../sqlite-autoconf-3370200 && rm -rf sqlite-autoconf-3370200.tar.gz &&\
	npm install
WORKDIR /app/discord-aurabot
CMD ["npm run start"]
