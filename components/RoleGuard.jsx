import { ReactNode, useEffect, useState } from 'react'
import { hasRole } from '@/lib/rbac'
import { useRouter } from 'next/navigation'

/**
 * A component that restricts access based on user roles
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render if the user has the required role
 * @param {string[]} props.allowedRoles - The roles that are allowed to access the content
 * @param {React.ReactNode} [props.fallback=null] - Optional content to render if the user doesn't have the required role
 * @param {string} [props.redirectTo] - Optional URL to redirect to if the user doesn't have the required role
 * @returns {React.ReactElement}
 */
export default function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  redirectTo,
}) {
  const [hasAccess, setHasAccess] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      // Check if the user has any of the allowed roles
      const accessPromises = allowedRoles.map(role => hasRole(role))
      const accessResults = await Promise.all(accessPromises)
      const hasAnyRole = accessResults.some(result => result === true)
      
      setHasAccess(hasAnyRole)
      
      // Redirect if specified and user doesn't have access
      if (!hasAnyRole && redirectTo) {
        router.push(redirectTo)
      }
    }
    
    checkAccess()
  }, [allowedRoles, redirectTo, router])
  
  // Show nothing while checking
  if (hasAccess === null) {
    return null
  }
  
  // Show children if user has access
  if (hasAccess) {
    return <>{children}</>
  }
  
  // Show fallback if user doesn't have access
  return <>{fallback}</>
} 