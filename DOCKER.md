# Docker Guide

This guide explains how to create and use `Dockerfile` and `docker-compose.yml` for this JWT auth project.

## Prerequisites

- Docker installed
- Docker Compose installed
- Project root contains `.env` with:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT`

You can create it from the example:

```bash
cp .env.example .env
```

## 1. Create Dockerfile

Create a file named `Dockerfile` in the project root:

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose app port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
```

What this does:
- Uses a lightweight Node.js image
- Installs production dependencies
- Copies your app code into the container
- Starts the API server on port 5000

## 2. Create docker-compose.yml

Create a file named `docker-compose.yml` in the project root:

```yaml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=${PORT}
    depends_on:
      - mongo
    networks:
      - jwt-network

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - jwt-network

networks:
  jwt-network:
    driver: bridge

volumes:
  mongo-data:
```

What this does:
- Runs two containers: `app` and `mongo`
- Maps app port `5000` and MongoDB port `27017`
- Persists MongoDB data using a named volume
- Connects both services to the same Docker network

## 3. Run with Docker Compose

From the project root:

```bash
docker-compose up --build
```

Then open:

```text
http://localhost:5000
```

## Common Commands

Start in background:

```bash
docker-compose up -d --build
```

View logs:

```bash
docker-compose logs -f
```

Stop containers:

```bash
docker-compose down
```

Stop and remove MongoDB volume (resets DB data):

```bash
docker-compose down -v
```

Rebuild app image after changes:

```bash
docker-compose up --build
```

## Troubleshooting

- Port already in use:
  - Change host-side ports in `docker-compose.yml`
- App cannot connect to MongoDB:
  - Ensure `MONGODB_URI` points to `mongo` service when using Compose (for example: `mongodb://mongo:27017/jwt_auth`)
- Environment variables not applied:
  - Confirm `.env` exists in project root and keys are set correctly

## Deploy to Render (Docker)

### Prerequisites

- GitHub account with this repository pushed
- Render account (free at https://render.com)
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)

### Setup MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with password
3. Whitelist all IPs (0.0.0.0/0) for Render access
4. Get your connection string (example: `mongodb+srv://username:password@cluster.mongodb.net/jwt_auth`)

### Deploy Steps

1. Push your code to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Create a new Web Service on Render:
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click "New +" -> "Web Service"
- Connect your GitHub repository
- Configure:
  - Name: jwt-auth-example (or your choice)
  - Environment: Docker
  - Region: Choose closest to you
  - Branch: main
  - Instance Type: Free

3. Set environment variables in Render:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong secret key for production
- `PORT`: 5000

4. Deploy:
- Click "Create Web Service"
- Render will automatically build and deploy your Docker container

5. Access your app:
- `https://your-service-name.onrender.com`

### Render Notes

- Free tier apps may spin down after inactivity (30-50 seconds to wake up)
- First deployment usually takes 5-10 minutes
- Use MongoDB Atlas (not local MongoDB) for production
- Update CORS settings if frontend is on a different domain
