# 🚀 Step-by-Step Setup Guide

This guide will walk you through setting up and running the Travel Itinerary Planner application on your machine.

## 📋 Prerequisites

Before you start, make sure you have the following installed on your computer:

### Required Software

1. **Docker Desktop** (Recommended - Easiest Method)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and make sure Docker Desktop is running

2. **Alternative: Manual Setup** (If you prefer not to use Docker)
   - **Java 17 or higher**: https://adoptium.net/
   - **Node.js 18 or higher**: https://nodejs.org/
   - **PostgreSQL 15**: https://www.postgresql.org/download/

## 🎯 Method 1: Quick Start with Docker (Recommended)

This is the easiest way to run the application. Everything will be set up automatically.

### Step 1: Check Docker Installation

Open your terminal/command prompt and run:

```bash
docker --version
docker-compose --version
```

You should see version numbers. If not, install Docker Desktop first.

### Step 2: Navigate to Project Directory

```bash
cd /Users/chinnari/Travel-Itinerary-Planner
```

### Step 3: Start the Application

Run this single command to start everything:

```bash
docker-compose up --build
```

**What this does:**
- Downloads and sets up PostgreSQL database
- Builds and starts the Spring Boot backend
- Builds and starts the React frontend
- Connects everything together

### Step 4: Wait for Startup

You'll see lots of logs. Wait for these messages:
- `travel-planner-db` - Database is ready
- `travel-planner-api` - Backend started on port 8080
- `travel-planner-web` - Frontend started on port 3000

### Step 5: Access the Application

Open your web browser and go to:
- **Main App**: http://localhost:3000
- **API Documentation**: http://localhost:8080/swagger-ui.html

### Step 6: Create Your First Account

1. Go to http://localhost:3000
2. Click "create a new account"
3. Fill in your details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
4. Click "Create Account"
5. Go back and login with your credentials

### Step 7: Start Planning!

1. Click "Create Trip"
2. Fill in trip details
3. Start adding activities to your days
4. View costs and analytics

## 🛑 Stopping the Application

To stop all services:

```bash
# Press Ctrl+C in the terminal, then run:
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## 🔧 Method 2: Manual Setup (Advanced Users)

If you prefer to run components separately:

### Step 1: Setup Database

```bash
# Start PostgreSQL with Docker
docker run -d \
  --name travel-planner-postgres \
  -e POSTGRES_DB=travel_planner \
  -e POSTGRES_USER=travel_user \
  -e POSTGRES_PASSWORD=travel_password \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Run the Spring Boot application
./mvnw spring-boot:run
```

Wait for "Started TravelItineraryPlannerApplication" message.

### Step 3: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

### Step 4: Access Application

- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8080

## 🐛 Troubleshooting

### Common Issues

#### 1. "Docker command not found"
- **Solution**: Install Docker Desktop and make sure it's running

#### 2. "Port already in use"
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080
lsof -i :5432

# Kill the process using the port
kill -9 <PID>
```

#### 3. "Database connection failed"
```bash
# Check if PostgreSQL is running
docker ps

# Restart the database
docker-compose restart postgres
```

#### 4. "Frontend not loading"
- Wait a few more minutes for the build to complete
- Check logs: `docker-compose logs web`
- Try refreshing the browser

#### 5. "Backend errors"
- Check logs: `docker-compose logs api`
- Make sure database is ready first

### Getting Logs

To see what's happening:

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs api
docker-compose logs web
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

### Reset Everything

If something goes wrong, reset everything:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all containers and images
docker system prune -a

# Start fresh
docker-compose up --build
```

## 📱 Using the Application

### First Steps

1. **Register**: Create your account
2. **Login**: Sign in with your credentials
3. **Create Trip**: Click "Create Trip" and fill details
4. **Add Activities**: Go to calendar view and add daily activities
5. **Track Costs**: Add costs to activities and view analytics

### Key Features

- **Dashboard**: View all your trips
- **Calendar**: Visual timeline of your trip
- **Day View**: Detailed daily activities
- **Cost Analysis**: Charts and budget tracking
- **Trip Management**: Edit, delete, share trips

## 🔐 Default Test Data

The application starts with some default tags. You can:
- Create your own trips
- Add custom tags
- Track expenses
- Plan detailed itineraries

## 📞 Need Help?

If you encounter issues:

1. **Check the logs** using the commands above
2. **Restart the application**:
   ```bash
   docker-compose restart
   ```
3. **Reset everything** if needed (see troubleshooting section)

## 🎉 Success!

If you can see the login page at http://localhost:3000 and create an account, everything is working correctly!

---

**Happy Travel Planning! ✈️🌍**
