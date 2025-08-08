# Discord OAuth Setup Guide

## 1. Configure Discord OAuth in Supabase Dashboard

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: https://supabase.com/dashboard/project/auerjtqqvftxndshuhpn
3. Go to **Authentication** → **Providers**
4. Enable **Discord** provider
5. Add these redirect URLs:
   - `https://auerjtqqvftxndshuhpn.supabase.co/auth/v1/callback`
   - `http://localhost:3001/auth/callback` (for development)

## 2. Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**
3. Name it "Galatea AI" or similar
4. Go to **OAuth2** tab
5. Add redirect URIs:
   - `https://auerjtqqvftxndshuhpn.supabase.co/auth/v1/callback`
   - `http://localhost:3001/auth/callback`
6. Copy the **Client ID** and **Client Secret**

## 3. Configure in Supabase

1. In Supabase Dashboard → Authentication → Providers → Discord
2. Enable Discord
3. Enter your Discord **Client ID**
4. Enter your Discord **Client Secret**
5. Click **Save**

## 4. Test the Integration

1. Make sure your development server is running on port 3001
2. Go to http://localhost:3001/sign-in
3. Click "Continue with Discord"
4. You should be redirected to Discord for authorization
5. After authorization, you'll be redirected back to your dashboard

## 5. User Flow

1. User clicks "Continue with Discord" on sign-in page
2. Redirected to Discord OAuth
3. User authorizes the application
4. Discord redirects to Supabase callback URL
5. Supabase processes the authentication
6. User is redirected to `/auth/callback` page
7. The callback page redirects authenticated users to `/dashboard`
8. Dashboard shows user's Discord profile picture and username in navbar

## Environment Variables

Your `.env.local` is already configured with:
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL`

## Features Implemented

- ✅ Discord OAuth authentication
- ✅ User profile picture display in navbar
- ✅ Username display in navbar
- ✅ Dashboard page after login
- ✅ Protected routes with middleware
- ✅ Automatic redirects for authenticated/unauthenticated users
- ✅ Responsive design for mobile and desktop
