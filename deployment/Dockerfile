FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS dev-deps
RUN npm ci

FROM base AS prod-deps
RUN npm ci --omit=dev

FROM dev-deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY --from=dev-deps /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
