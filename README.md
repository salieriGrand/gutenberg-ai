This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication Setup (Google OAuth)

This project uses Supabase Auth with Google OAuth. Follow these steps to set it up:

### 1. Google Cloud Console Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > OAuth consent screen**.
   - Select **External**.
   - Fill in the required app information (App name, User support email, Developer contact info).
4. Navigate to **APIs & Services > Credentials**.
5. Click **+ Create Credentials > OAuth client ID**.
6. Select **Web application** as the Application type.
7. Add **Authorized redirect URIs**:
   - You will get this URI from Supabase (see step 2 below). It usually looks like: `https://[YOUR_PROJECT_ID].supabase.co/auth/v1/callback`
8. Note down your **Client ID** and **Client Secret**.

### 2. Supabase Configuration
1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication > Providers**.
3. Enable the **Google** provider.
4. Enter the **Client ID** and **Client Secret** obtained from the Google Cloud Console.
5. Copy the **Redirect URI** provided by Supabase and paste it into the "Authorized redirect URIs" in your Google Cloud Console (from step 1.7).
6. Click **Save**.

### 3. Local Environment
Ensure your `.env.local` is updated with your Supabase credentials. The application handles the OAuth flow via the `@/utils/supabase` helpers.

## Getting Started

### Environment Setup

1. Create a `.env.local` file in the root directory.
2. Add the following variables (see `.env.example` for reference):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
   ```

### Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
