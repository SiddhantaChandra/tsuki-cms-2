#!/bin/bash

# Set Node.js version
export NODE_VERSION=20

# Print versions for debugging
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
npm ci

# Run the build
npm run build

# Run Cloudflare adapter
npx @cloudflare/next-on-pages 