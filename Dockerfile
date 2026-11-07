FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Read at build time: site metadata, and the home page, which is prerendered with its quote.
# The builder stage is not shipped, so none of these ends up in the final image;
# API_URL is passed again at run time (env_file or --env-file).
ARG SITE_URL
ARG HOME_QUOTE_ID
ARG API_URL

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

EXPOSE 4000

CMD ["node", "server.js"]
