FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Serve the built static files
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]
