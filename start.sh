#!/bin/bash

# Travel Itinerary Planner - Quick Start Script

echo "🧳 Travel Itinerary Planner - Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not available!"
    echo "Please install Docker Compose or use Docker Desktop which includes it."
    exit 1
fi

echo "✅ Docker Compose is available"
echo ""

echo "🚀 Starting Travel Itinerary Planner..."
echo "This will take 2-3 minutes on first run..."
echo ""

# Start the application
docker-compose up --build

echo ""
echo "🛑 Application stopped."
echo "To restart, run: ./start.sh"
echo "To clean up, run: docker-compose down -v"
