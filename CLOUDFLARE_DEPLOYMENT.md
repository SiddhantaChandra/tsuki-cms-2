# Cloudflare Pages Deployment Guide

This guide will help you deploy your Tsuki CMS v2 application to Cloudflare Pages.

## ✅ Issues Fixed

- **Node.js Version**: Set Node.js 20 via environment variables
- **Deprecated Supabase Packages**: Removed `@supabase/auth-helpers-nextjs` and updated all imports to use `@supabase/ssr`
- **Middleware**: Updated to use the new Supabase SSR client
- **Windows Compatibility**: Created Windows-compatible build scripts
- **wrangler.toml**: Simplified for Cloudflare Pages compatibility

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler` or use the local version)
3. Your application configured for Cloudflare Pages (already done)

## Configuration Files

The following files have been configured for Cloudflare Pages deployment:

- `wrangler.toml` - Simplified Cloudflare Pages configuration
- `next.config.mjs` - Next.js configuration with Cloudflare setup
- `package.json` - Updated with deployment scripts
- `middleware.js` - Updated to use new Supabase SSR client

## Deployment Methods

### Method 1: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to Pages
4. Click "Create a project"
5. Connect your Git repository
6. Configure build settings:   - **Build command**: `npm run build`   - **Framework preset**: `Next.js` (auto-detected)   - **Build output directory**: `.next`   - **Root directory**: `/` (or leave empty)

### Method 2: Command Line Deployment

#### For Windows Users:
```bash
# Build and test locally
npm run pages:build-windows

# For actual deployment, use Git integration (recommended)
# Or if you have wrangler configured:
# wrangler pages deploy .next
```

#### For Linux/macOS Users:
```bash
# Build for Cloudflare
npm run pages:build

# Deploy
wrangler pages deploy .vercel/output/static
```

## Environment Variables

Make sure to set the following environment variables in your Cloudflare Pages project:

- `NODE_VERSION` = `20`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Any other environment variables your app needs

You can set these in:
- Cloudflare Dashboard > Pages > Your Project > Settings > Environment variables

## Local Development with Cloudflare

To test your app locally:

```bash
# Standard Next.js development
npm run dev

# Build and test for Cloudflare compatibility
npm run pages:build-windows  # Windows
# or
npm run pages:build          # Linux/macOS
```

## Troubleshooting

### Windows Compatibility Issues

If you encounter issues with `@cloudflare/next-on-pages` on Windows:
- Use `npm run pages:build-windows` for local testing
- Use Git integration for deployment (runs on Cloudflare's servers)

### Build Errors

1. ✅ **Fixed**: Deprecated Supabase packages updated to `@supabase/ssr`
2. ✅ **Fixed**: Node.js version compatibility (now using Node.js 20)
3. ✅ **Fixed**: Middleware updated for new Supabase client
4. ✅ **Fixed**: wrangler.toml simplified for Pages compatibility

### Environment Variables

Make sure all environment variables are properly set in your Cloudflare Pages project settings.

## Deployment Steps Summary

1. **Push to Git**: Commit and push your code to GitHub/GitLab
2. **Connect Repository**: Link your repository in Cloudflare Pages Dashboard
3. **Set Environment Variables**: Add your Supabase credentials and Node.js version
4. **Deploy**: Cloudflare will automatically build and deploy your app

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/get-started/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## Support

Your application is now fully configured and ready for Cloudflare Pages deployment with:
- ✅ SSR support
- ✅ Middleware protection
- ✅ Supabase integration
- ✅ Windows compatibility
- ✅ Node.js 20 support
- ✅ Simplified wrangler.toml for Pages 