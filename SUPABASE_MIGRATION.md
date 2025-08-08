# Firebase to Supabase Migration

This document outlines the migration from Firebase to Supabase that has been completed for the Galatea AI project.

## Changes Made

### 1. Database Migration
- **Firebase Firestore** → **Supabase PostgreSQL**
- Updated `lib/companions.ts` to use Supabase client instead of Firestore
- Replaced Firestore operations:
  - `collection()`, `doc()`, `getDocs()`, `getDoc()` → `supabase.from().select()`
  - `addDoc()` → `supabase.from().insert()`
  - `updateDoc()` → `supabase.from().update()`
  - `deleteDoc()` → `supabase.from().delete()`

### 2. Authentication Migration
- **Firebase Auth** → **Supabase Auth**
- Updated `contexts/auth-context.tsx`:
  - `createUserWithEmailAndPassword()` → `supabase.auth.signUp()`
  - `signInWithEmailAndPassword()` → `supabase.auth.signInWithPassword()`
  - `signOut()` → `supabase.auth.signOut()`
  - `signInWithPopup()` → `supabase.auth.signInWithOAuth()`
  - `onAuthStateChanged()` → `supabase.auth.onAuthStateChange()`

### 3. Storage Migration
- **Firebase Storage** → **Supabase Storage**
- Updated `lib/storage.ts`:
  - `uploadBytes()`, `getDownloadURL()` → `supabase.storage.from().upload()`, `getPublicUrl()`
  - `deleteObject()` → `supabase.storage.from().remove()`

### 4. Profile Management
- Updated `app/profile/page.tsx`:
  - Removed Firebase `updateProfile()` function
  - Added Supabase user metadata updates via `supabase.auth.updateUser()`
  - Updated storage function calls to use user ID instead of User object

### 5. Configuration Files
- Renamed `lib/firebase.ts` → `lib/supabase.ts`
- Updated all import statements to use new Supabase client
- Added OAuth callback route at `app/auth/callback/page.tsx`

## Required Setup

### 1. Supabase Project Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Note down your project URL and anon key

### 2. Database Schema
Create the following table in your Supabase database:

\`\`\`sql
-- Create companions table
CREATE TABLE companions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  personality TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  bio TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "compatibilityScore" INTEGER,
  "personalityTraits" TEXT[] NOT NULL,
  "communicationStyle" TEXT NOT NULL,
  "learningCapacity" TEXT NOT NULL,
  backstory TEXT NOT NULL,
  "favoriteTopics" TEXT[] NOT NULL,
  "relationshipGoals" TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;

-- Create policy for reading companions (public access)
CREATE POLICY "Anyone can view companions" ON companions
  FOR SELECT USING (true);

-- Create policy for inserting companions (authenticated users only)
CREATE POLICY "Authenticated users can insert companions" ON companions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for updating companions (authenticated users only)
CREATE POLICY "Authenticated users can update companions" ON companions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for deleting companions (authenticated users only)
CREATE POLICY "Authenticated users can delete companions" ON companions
  FOR DELETE USING (auth.role() = 'authenticated');
\`\`\`

### 3. Storage Setup
1. In Supabase dashboard, go to Storage
2. Create a new bucket called `avatars`
3. Set the bucket to public if you want profile pictures to be publicly accessible
4. Configure appropriate policies for the bucket

### 4. Authentication Setup
1. In Supabase dashboard, go to Authentication → Settings
2. Configure Site URL: `http://localhost:3000` (for development)
3. Add redirect URLs: `http://localhost:3000/auth/callback`

### 5. OAuth Providers (Optional)
If you want to enable Google/Facebook login:
1. In Supabase dashboard, go to Authentication → Providers
2. Enable and configure Google OAuth:
   - Add your Google Client ID and Secret
3. Enable and configure Facebook OAuth:
   - Add your Facebook App ID and Secret

### 6. Environment Variables
Update your `.env.local` file with the Supabase credentials:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OAuth Configuration (optional - configure in Supabase dashboard)
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
# NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
\`\`\`

## Data Migration

To populate your Supabase database with companion data:

1. Uncomment the last line in `scripts/populate-companions.ts`
2. Run the script: `npm run dev` and navigate to trigger the script, or run it directly

## Key Differences

### User Object Structure
- **Firebase**: `user.uid`, `user.displayName`, `user.email`
- **Supabase**: `user.id`, `user.user_metadata.display_name`, `user.email`

### Database Queries
- **Firebase**: Document-based with subcollections
- **Supabase**: SQL-based with PostgreSQL features

### Real-time Updates
- **Firebase**: `onSnapshot()`
- **Supabase**: `supabase.from().on().subscribe()`

### File Uploads
- **Firebase**: Hierarchical paths with `ref()`
- **Supabase**: Bucket-based with `from(bucket)`

## Testing

After setup:
1. Test user registration and login
2. Test profile picture upload/delete
3. Test companion data fetching
4. Test OAuth providers (if configured)

## Notes

- All Firebase packages can be removed from package.json
- The migration maintains the same API structure for components
- User sessions are handled automatically by Supabase
- OAuth redirects now go through `/auth/callback`
