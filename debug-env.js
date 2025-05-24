// Debug script to check environment variables during Cloudflare build
console.log('🔍 Environment Variables Debug:');
console.log('NODE_VERSION:', process.env.NODE_VERSION);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
console.log('Node.js version:', process.version); 