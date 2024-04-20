###################
# BUILD FOR LOCAL 'DEVELOPMENT'
###################

FROM node:21.7.3-alpine AS development

COPY --chown=node:node package*.json ./

RUN npm ci

# USER node

###################
# 'BUILD' FOR PRODUCTION
###################

FROM node:21.7.3-alpine AS build

COPY --chown=node:node --from=development ./node_modules ./node_modules
COPY --chown=node:node . .

CMD ["npm", "run", "start:dev"]

# USER node
