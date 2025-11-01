FROM node:18-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json* ./

# Clean install with specific flags
RUN npm ci --silent --no-optional && npm cache clean --force

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]