#!/bin/bash

# Deployment script for production
set -e

echo "🚀 Starting deployment process..."

# Environment check
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN environment variable is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Validate environment variables
echo "🔧 Validating environment configuration..."
npm run env:check

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Type check
echo "🔧 Type checking..."
npm run typecheck

# Build application
echo "🏗️  Building application..."
npm run build

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
npx vercel deploy --prod --token "$VERCEL_TOKEN"

echo "✅ Deployment completed successfully!"