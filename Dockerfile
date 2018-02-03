FROM node:9.2.0-alpine

WORKDIR /version-compare

COPY package.json ./

COPY . ./

RUN yarn --prod install

RUN ln -s $(pwd)/lib/index.js /usr/local/bin/compare

ENTRYPOINT ["compare"]
