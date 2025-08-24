#!/bin/bash

# Local Supabase Setup Script
# This script sets up a local Supabase development environment

set -e

echo "🏠 Setting up local Supabase development environment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing it now..."
    npm install -g supabase
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Initialize Supabase if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "📝 Initializing Supabase project..."
    supabase init
fi

echo "🚀 Starting local Supabase services..."
supabase start

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️  Running database migrations..."
supabase db reset

echo "✅ Local Supabase setup completed!"
echo ""
echo "📊 Local Supabase Dashboard: http://localhost:54323"
echo "🔗 Local Supabase URL: http://localhost:54321"
echo "🔑 Local Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
echo ""
echo "To use the local environment:"
echo "1. Copy env.example to .env.local"
echo "2. Update SUPABASE_URL and SUPABASE_ANON_KEY with the local values above"
echo "3. Run 'npm run dev' to start your Next.js application"
echo ""
echo "To stop Supabase services: supabase stop"
echo "To view logs: supabase logs"
