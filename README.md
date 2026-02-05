# Dubai VAT Assistant

A comprehensive VAT management application for businesses and individuals in Dubai, UAE.

## Features

- Invoice Generation & Management
- Expense Tracking & Receipt Scanning
- VAT Calculator & Rate Finder
- VAT Returns Filing
- Reports & Analytics
- Tourist VAT Refund Information
- Education Center
- Professional Directory

## Tech Stack

- React 18 + TypeScript
- Vite
- Supabase (Authentication & Database)
- Tailwind CSS
- Lucide React Icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment on Vercel

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon/public key

4. **Build Settings** (should auto-detect from `vercel.json`)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Important Notes

- The `vercel.json` file is configured to handle SPA routing (all routes serve `index.html`)
- Make sure all environment variables are set in Vercel dashboard
- The app uses client-side routing, so direct URL access requires the rewrite rules in `vercel.json`

## Troubleshooting

### Blank Page on Vercel

1. **Check Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
2. **Check Build Logs**: Look for any build errors in Vercel deployment logs
3. **Check Browser Console**: Open browser dev tools to see any runtime errors
4. **Verify vercel.json**: Ensure the file exists and has correct routing configuration

### Common Issues

- **404 on refresh**: Fixed by `vercel.json` rewrite rules
- **Blank page**: Usually missing environment variables or build errors
- **CORS errors**: Check Supabase CORS settings in Supabase dashboard
