#!/bin/bash

# Populate Companions Script
# This script populates the companions table with sample data

set -e

echo "🤖 Populating companions table with sample data..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it based on env.example"
    exit 1
fi

# Source environment variables
set -a
source .env.local
set +a

# Check if we're using local or remote Supabase
if [[ "$SUPABASE_URL" == *"localhost"* ]] || [[ "$SUPABASE_URL" == *"127.0.0.1"* ]]; then
    echo "📍 Using local Supabase instance"
    # For local development, we can run the seed file directly
    supabase db reset --seed-only
else
    echo "📍 Using remote Supabase instance"
    # For remote, we need to run the seed file through the CLI
    if [ ! -z "$SUPABASE_PROJECT_ID" ]; then
        supabase link --project-ref $SUPABASE_PROJECT_ID
        psql "$SUPABASE_URL" -f supabase/seed.sql
    else
        echo "❌ SUPABASE_PROJECT_ID not found in .env.local"
        echo "Please add your Supabase project ID to .env.local"
        exit 1
    fi
fi

echo "✅ Companions table populated successfully!"
echo ""
echo "Sample companions added:"
echo "- Luna (Creative and introspective)"
echo "- Alex (Tech enthusiast and fitness lover)"
echo "- Maya (Book lover and world traveler)"
echo "- Zara (Environmental scientist)"
echo "- Kai (Chef and food blogger)"
echo "- Nova (Space enthusiast)"
echo "- River (Musician and sound engineer)"
echo "- Sage (Wellness coach)"
