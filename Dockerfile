# Việt Phục Remix – production image (Render / Railway / Fly.io / Cloud Run)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_FEEDBACK_URL
ARG VITE_PUBLIC_URL
ENV VITE_FEEDBACK_URL=$VITE_FEEDBACK_URL
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY src ./src
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
