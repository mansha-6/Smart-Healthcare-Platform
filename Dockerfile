# ==========================================
# Phase 1: Build the Frontend (React/Vite)
# ==========================================
FROM node:18-alpine as client-build

WORKDIR /app/client

# Copy Client package files
COPY client/package*.json ./

# Install Client Dependencies
RUN npm install

# Copy Client Source Code
COPY client/ .

# Build the React Application (Output: /app/client/dist)
RUN npm run build

# ==========================================
# Phase 2: Setup the Backend (Node/Express)
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Copy Server package files
COPY server/package*.json ./

# Install Server Dependencies
RUN npm install

# Copy Server Source Code
COPY server/ .

# Ensure 'uploads' directory exists
RUN mkdir -p uploads

# Copy Built Frontend from Phase 1 to 'public' folder in Backend
COPY --from=client-build /app/client/dist ./public

# Expose Port
EXPOSE 5000

# Start the Server
CMD ["node", "server.js"]
