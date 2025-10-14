#!/bin/bash

set -e

echo "🚀 Starting NestJS Boilerplate Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to install Docker to run infrastructure services."
else
    echo "✅ Docker version: $(docker --version)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration before running the app"
else
    echo "✅ .env file already exists"
fi

# Setup Husky
echo ""
echo "🔧 Setting up Husky git hooks..."
npm run prepare

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check if Docker services should be started
echo ""
read -p "Do you want to start Docker services (PostgreSQL, Redis, RabbitMQ)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐳 Starting Docker services..."
    docker-compose up -d postgres redis rabbitmq
    
    echo "⏳ Waiting for services to be ready..."
    sleep 5
    
    echo "🔄 Running database migrations..."
    npm run migrate
fi

echo ""
echo "✨ Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env with your configuration"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000/docs for API documentation"
echo ""
echo "Happy coding! 🎉"
