const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cloudflare Pages build process...');

try {
  // Step 1: Clean Next.js cache manually
  console.log('🧹 Cleaning Next.js cache...');
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Cache cleaned successfully');
  } else {
    console.log('ℹ️  No cache to clean');
  }
  
  // Step 2: Run Next.js build
  console.log('📦 Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Next.js build completed successfully!');
  console.log('');
  console.log('📋 For Cloudflare Pages deployment:');
  console.log('');
  console.log('🔧 Option 1: Git Integration (Recommended)');
  console.log('1. Push your code to GitHub/GitLab');
  console.log('2. Connect your repository in Cloudflare Pages Dashboard');
  console.log('3. Set build command: npm run build');
  console.log('4. Set build output directory: .next');
  console.log('');
  console.log('🔧 Option 2: Manual Deployment');
  console.log('1. Install @cloudflare/next-on-pages globally: npm install -g @cloudflare/next-on-pages');
  console.log('2. Run: npx @cloudflare/next-on-pages');
  console.log('3. Deploy: wrangler pages deploy .vercel/output/static');
  console.log('');
  console.log('⚠️  Note: If you encounter Windows compatibility issues with @cloudflare/next-on-pages,');
  console.log('   use Git integration instead, which runs the build on Cloudflare\'s servers.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 