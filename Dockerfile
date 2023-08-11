# Production Build

# Stage 1: Build react frontend
FROM node:14.15.3-alpine3.12 as frontend

# Working directory be app
WORKDIR /usr/src/app/frontend/

COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# copy local files to app folder
COPY frontend/ ./
RUN ls

RUN npm run build

# Stage 2 : Build backend

FROM node:14.15.3-alpine3.12

WORKDIR /usr/src/app/
COPY --from=frontend /usr/src/app/frontend/build/ ./frontend/build/
RUN ls

WORKDIR /usr/src/app/backend/
COPY backend/package*.json ./
RUN npm install -qy
COPY backend/ ./

ENV PORT 8080

EXPOSE 8080

CMD ["npm", "start"]