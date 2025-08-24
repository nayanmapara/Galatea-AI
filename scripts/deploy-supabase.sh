#!/bin/bash

# Supabase Deployment Script
# This script handles the complete deployment of the Galatea AI app to Supabase

set -e

echo "🚀 Starting Supabase deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ You're not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

echo "✅ Supabase CLI is ready"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it based on env.example"
    exit 1
fi

# Source environment variables
set -a
source .env.local
set +a

# Validate required environment variables
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ SUPABASE_PROJECT_ID is not set in .env.local"
    echo "Please add your Supabase project ID to .env.local"
    exit 1
fi

echo "📊 Linking to Supabase project: $SUPABASE_PROJECT_ID"
supabase link --project-ref $SUPABASE_PROJECT_ID

echo "🗄️  Running database migrations..."
supabase db push

echo "🌱 Seeding database with initial data..."
# Check if we should seed the database
read -p "Do you want to seed the database with sample companions? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    supabase db reset --linked
fi

echo "⚡ Deploying Edge Functions..."

# Deploy each edge function
echo "Deploying generate-companion-response function..."
supabase functions deploy generate-companion-response --no-verify-jwt

echo "Deploying get-recommendations function..."
supabase functions deploy get-recommendations --no-verify-jwt

echo "Deploying process-swipe function..."
supabase functions deploy process-swipe --no-verify-jwt

echo "Deploying get-conversations function..."
supabase functions deploy get-conversations --no-verify-jwt

echo "🔐 Setting up Edge Function secrets..."

# Set OpenAI API key if provided
if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "Setting OPENAI_API_KEY secret..."
    supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
else
    echo "⚠️  OPENAI_API_KEY not found in .env.local. AI responses will not work without it."
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env.local with the production Supabase URL and keys"
echo "2. Configure OAuth providers in the Supabase dashboard"
echo "3. Test your application"
echo ""
echo "Supabase Dashboard: https://app.supabase.com/project/$SUPABASE_PROJECT_ID"
