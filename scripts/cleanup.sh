#!/bin/bash

set -e

echo "🧹 Cleaning up project..."

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "📦 Removing node_modules..."
    rm -rf node_modules
fi

# Remove dist
if [ -d "dist" ]; then
    echo "🗑️  Removing dist..."
    rm -rf dist
fi

# Remove coverage
if [ -d "coverage" ]; then
    echo "📊 Removing coverage..."
    rm -rf coverage
fi

# Stop and remove Docker containers
echo "🐳 Stopping Docker containers..."
docker-compose down -v

echo "✨ Cleanup completed!"
