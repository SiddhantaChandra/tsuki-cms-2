import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Define protected routes with required roles and permissions
const protectedRoutes = [
  {
    path: '/admin',
    requiredRoles: ['admin'],
    requiredPermissions: []  // Admin role inherently has all permissions
  },
  {
    path: '/admin/users',
    requiredRoles: ['admin'],
    requiredPermissions: ['manage:users']
  },
  {
    path: '/admin/roles',
    requiredRoles: ['admin'],
    requiredPermissions: ['manage:roles']
  },
  {
    path: '/admin/settings',
    requiredRoles: ['admin'],
    requiredPermissions: ['manage:settings']
  },
  {
    path: '/editor',
    requiredRoles: ['admin', 'editor'],
    requiredPermissions: ['create:any', 'update:any']
  },
  {
    path: '/cards',
    requiredRoles: ['admin', 'editor', 'viewer'],
    requiredPermissions: ['read:any']
  },
  {
    path: '/slabs',
    requiredRoles: ['admin', 'editor', 'viewer'],
    requiredPermissions: ['read:any']
  }
]

/**
 * Middleware to protect routes based on user roles and permissions
 * @param {import('next/server').NextRequest} req - The incoming request
 * @returns {import('next/server').NextResponse}
 */
export async function middleware(req) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  // Check if we need to protect this route
  const path = req.nextUrl.pathname
  const routeToProtect = protectedRoutes.find(route => 
    path === route.path || path.startsWith(`${route.path}/`)
  )
  
  if (!routeToProtect) {
    return res
  }
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no session, redirect to login
  if (!session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  const userId = session.user.id
  const { requiredRoles, requiredPermissions } = routeToProtect
  
  // Try to get user roles using the relation approach first
  let userRoles = [];
  
  try {
    // First try getting roles with the role_id relation
    const { data: relationRoles } = await supabase
      .from('user_roles')
      .select(`
        role_id,
        roles:role_id (
          id,
          name
        )
      `)
      .eq('user_id', userId)
    
    if (relationRoles && relationRoles.length > 0) {
      userRoles = relationRoles.map(ur => ur.roles?.name).filter(Boolean)
    }
  } catch (err) {
    console.log("Relation role fetch failed, trying direct role field")
  }
  
  // If relation approach didn't yield results, try direct 'role' field
  if (userRoles.length === 0) {
    try {
      const { data: directRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
      
      if (directRoles && directRoles.length > 0) {
        userRoles = directRoles.map(ur => ur.role).filter(Boolean)
      }
    } catch (err) {
      console.error("Both role fetch methods failed")
    }
  }
  
  // If no roles found, redirect to unauthorized
  if (userRoles.length === 0) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  
  // Check if the user has any of the required roles
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
  
  if (!hasRequiredRole) {
    // User doesn't have the required role, redirect to unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  
  // If the route requires specific permissions and user is not an admin, check permissions
  if (requiredPermissions.length > 0 && !userRoles.includes('admin')) {
    try {
      // Admin role bypasses permission checks (has all permissions)
      const { data: userPermissions } = await supabase
        .from('user_roles')
        .select(`
          roles:role_id (
            role_permissions (
              permission_id,
              permissions:permission_id (
                name
              )
            )
          )
        `)
        .eq('user_id', userId)
      
      // Extract permission names from the query result
      const permissions = []
      userPermissions?.forEach(ur => {
        if (ur.roles && ur.roles.role_permissions) {
          ur.roles.role_permissions.forEach(rp => {
            if (rp.permissions && rp.permissions.name) {
              permissions.push(rp.permissions.name)
            }
          })
        }
      })
      
      // Check if the user has all the required permissions
      const hasAllRequiredPermissions = requiredPermissions.every(permission => 
        permissions.includes(permission)
      )
      
      if (!hasAllRequiredPermissions) {
        // User doesn't have all required permissions, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    } catch (err) {
      // If permissions check fails, default to role-based access only
      console.error("Permissions check failed:", err.message || err)
      // Already passed role check, so continue
    }
  }
  
  // User has the required roles and permissions, allow access
  return res
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/editor/:path*', 
    '/cards/:path*',
    '/slabs/:path*'
  ]
} 