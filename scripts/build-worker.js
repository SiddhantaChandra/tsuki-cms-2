const fs = require('fs');
const path = require('path');

// Simple build script that creates a basic worker.js file
const workerCode = `
import { NextRequest, NextResponse } from 'next/server';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle static assets
      if (request.url.includes('/_next/static/') || request.url.includes('/favicon.ico')) {
        return await getAssetFromKV({
          request,
          waitUntil: ctx.waitUntil
        });
      }

      // For all other requests, return a simple response for now
      return new Response('Tsuki CMS v2 - Worker deployment in progress', {
        headers: {
          'content-type': 'text/plain',
        },
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};
`;

fs.writeFileSync(path.join(process.cwd(), 'worker.js'), workerCode);
console.log('Worker.js created successfully'); 