#!/bin/bash

# Preview deployment script
set -e

echo "🚀 Starting preview deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Validate environment variables
echo "🔧 Validating environment configuration..."
npm run env:check

# Build application
echo "🏗️  Building application..."
npm run build

# Deploy to Vercel preview
echo "☁️  Deploying preview to Vercel..."
PREVIEW_URL=$(npx vercel deploy --token "$VERCEL_TOKEN")

echo "✅ Preview deployment completed!"
echo "🔗 Preview URL: $PREVIEW_URL"

# Update PR with preview URL (if in CI)
if [ ! -z "$GITHUB_TOKEN" ] && [ ! -z "$GITHUB_REPOSITORY" ] && [ ! -z "$PR_NUMBER" ]; then
    curl -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$PR_NUMBER/comments \
        -d "{\"body\":\"🚀 Preview deployment ready!\\n\\n📱 **Preview URL**: $PREVIEW_URL\"}"
fi