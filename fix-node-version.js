const { execSync } = require('child_process');

console.log('🔧 Applying Node.js version fix for Cloudflare Pages...');

try {
  // Check if git is available
  execSync('git --version', { stdio: 'inherit' });
  
  console.log('📝 Adding files to git...');
  execSync('git add .nvmrc CLOUDFLARE_DEPLOYMENT.md', { stdio: 'inherit' });
  
  console.log('💾 Committing changes...');
  execSync('git commit -m "Fix Node.js version for Cloudflare Pages deployment - Add .nvmrc and update deployment guide"', { stdio: 'inherit' });
  
  console.log('✅ Changes committed successfully!');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Push to your repository: git push');
  console.log('2. Go to Cloudflare Pages Dashboard');
  console.log('3. Set environment variables:');
  console.log('   - NODE_VERSION = 20');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL = your_supabase_url');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key');
  console.log('4. Trigger a new deployment');
  console.log('');
  console.log('📖 See CLOUDFLARE_DEPLOYMENT.md for detailed instructions');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('💡 Manual steps:');
  console.log('1. git add .nvmrc CLOUDFLARE_DEPLOYMENT.md');
  console.log('2. git commit -m "Fix Node.js version for Cloudflare Pages"');
  console.log('3. git push');
  console.log('4. Set NODE_VERSION=20 in Cloudflare Pages environment variables');
} 