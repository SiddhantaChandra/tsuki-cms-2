import { useState, useEffect } from 'react'
import { hasRole, getUserRoles } from '@/lib/rbac'

/**
 * Hook to check if the current user has a specific role
 * @param {string} role - The role to check for
 * @returns {Object} - Object with loading state and whether the user has the role
 */
export function useHasRole(role) {
  const [loading, setLoading] = useState(true)
  const [hasUserRole, setHasUserRole] = useState(false)

  useEffect(() => {
    const checkRole = async () => {
      setLoading(true)
      const result = await hasRole(role)
      setHasUserRole(result)
      setLoading(false)
    }

    checkRole()
  }, [role])

  return { loading, hasRole: hasUserRole }
}

/**
 * Hook to check if the current user has any of the specified roles
 * @param {string[]} roles - The roles to check for
 * @returns {Object} - Object with loading state and whether the user has any of the roles
 */
export function useHasAnyRole(roles) {
  const [loading, setLoading] = useState(true)
  const [hasAnyUserRole, setHasAnyUserRole] = useState(false)

  useEffect(() => {
    const checkRoles = async () => {
      setLoading(true)
      const results = await Promise.all(roles.map(r => hasRole(r)))
      setHasAnyUserRole(results.some(r => r))
      setLoading(false)
    }

    checkRoles()
  }, [roles])

  return { loading, hasAnyRole: hasAnyUserRole }
}

/**
 * Hook to get all roles for the current user
 * @returns {Object} - Object with loading state and the user's roles
 */
export function useUserRoles() {
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      const userRoles = await getUserRoles()
      setRoles(userRoles)
      setLoading(false)
    }

    fetchRoles()
  }, [])

  return { loading, roles }
} 