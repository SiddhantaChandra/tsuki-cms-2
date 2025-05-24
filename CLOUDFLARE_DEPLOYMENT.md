# Cloudflare Pages Deployment Guide

This guide will help you deploy your Tsuki CMS v2 application to Cloudflare Pages.

## ✅ Issues Fixed

- **Node.js Version**: Set Node.js 20 via environment variables and .nvmrc file
- **Deprecated Supabase Packages**: Removed `@supabase/auth-helpers-nextjs` and updated all imports to use `@supabase/ssr`
- **Middleware**: Updated to use the new Supabase SSR client
- **Windows Compatibility**: Created Windows-compatible build scripts
- **Dynamic Configuration**: Implemented dynamic wrangler.toml generation with environment variables

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler` or use the local version)
3. Your application configured for Cloudflare Pages (already done)

## Configuration Files

The following files have been configured for Cloudflare Pages deployment:

- `generate-wrangler.js` - **NEW**: Dynamically generates wrangler.toml with environment variables
- `next.config.mjs` - Next.js configuration with Cloudflare setup
- `package.json` - Updated with deployment scripts that auto-generate wrangler.toml
- `middleware.js` - Updated to use new Supabase SSR client
- `.nvmrc` - Specifies Node.js version 20

## Dynamic Configuration System

### How It Works

The project now uses a **dynamic configuration system** that automatically injects environment variables into `wrangler.toml` at build time:

1. **Build Process**: When you run any build command, `generate-wrangler.js` runs first
2. **Environment Detection**: The script reads environment variables from Cloudflare Pages build environment
3. **Configuration Generation**: Creates `wrangler.toml` with all necessary settings and variables
4. **Build Continuation**: Next.js build proceeds with the generated configuration

### Benefits

- ✅ **Automatic Environment Variable Injection**: No manual configuration file updates needed
- ✅ **Build-Time Generation**: Works seamlessly with Cloudflare Pages' build process
- ✅ **Missing Variable Detection**: Warns about missing environment variables
- ✅ **Always Up-to-Date**: Configuration reflects current environment settings

## Deployment Methods

### Method 1: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to Pages
4. Click "Create a project"
5. Connect your Git repository
6. Configure build settings:
   - **Build command**: `npm run build` (this now includes dynamic config generation)
   - **Framework preset**: `Next.js` (auto-detected)
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or leave empty)
7. **IMPORTANT**: Set environment variables (see Environment Variables section below)

### Method 2: Command Line Deployment

#### For Windows Users:
```bash
# Build and test locally (includes dynamic config generation)
npm run pages:build-windows

# For actual deployment, use Git integration (recommended)
```

#### For Linux/macOS Users:
```bash
# Build for Cloudflare (includes dynamic config generation)
npm run pages:build

# Deploy
wrangler pages deploy .vercel/output/static
```

## Environment Variables

**CRITICAL**: You must set the following environment variables in your Cloudflare Pages project settings:

### Required Variables:
- `NODE_VERSION` = `20` (Critical - fixes Node.js version error)
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

### How to Set Environment Variables:
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Click on **Settings** tab
3. Scroll down to **Environment variables** section
4. Click **Add variable** for each variable above
5. Make sure to set them for **Production** environment
6. **Save and redeploy** your project

### Automatic Injection

The `generate-wrangler.js` script will automatically:
- Read these environment variables during build
- Inject them into the generated `wrangler.toml`
- Display which variables are set/missing
- Warn about any missing required variables

## Local Development with Cloudflare

To test your app locally:

```bash
# Standard Next.js development
npm run dev

# Build and test for Cloudflare compatibility (with dynamic config)
npm run pages:build-windows  # Windows
# or
npm run pages:build          # Linux/macOS
```

## Troubleshooting

### Dynamic Configuration

The dynamic configuration system handles:
- ✅ **Environment Variable Injection**: Automatically includes all required variables
- ✅ **Missing Variable Detection**: Shows clear warnings for missing variables
- ✅ **Build-Time Generation**: Works with Cloudflare Pages' build environment

### Windows Compatibility Issues

If you encounter issues with `@cloudflare/next-on-pages` on Windows:
- Use `npm run pages:build-windows` for local testing
- Use Git integration for deployment (runs on Cloudflare's servers)

### Build Errors

1. ✅ **Fixed**: Deprecated Supabase packages updated to `@supabase/ssr`
2. ✅ **Fixed**: Node.js version compatibility (now using Node.js 20)
3. ✅ **Fixed**: Middleware updated for new Supabase client
4. ✅ **Fixed**: Dynamic wrangler.toml generation with environment variables
5. 🔄 **Current**: Environment variables need to be set in Cloudflare Pages Dashboard

## Deployment Steps Summary

1. **Push to Git**: Commit and push your code to GitHub/GitLab
2. **Connect Repository**: Link your repository in Cloudflare Pages Dashboard
3. **Set Environment Variables**: Add NODE_VERSION=20, Supabase credentials
4. **Deploy**: Cloudflare will automatically build and deploy your app (with dynamic config generation)

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
- ✅ Node.js 20 support (.nvmrc + environment variable)
- ✅ **Dynamic wrangler.toml generation with environment variable injection** 