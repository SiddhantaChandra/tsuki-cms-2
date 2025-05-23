import { createClient } from '@/utils/supabase/client'

/**
 * @typedef {'admin' | 'editor' | 'viewer'} UserRole
 */

/**
 * Check if the current user has a specific role
 * @param {UserRole} role - The role to check
 * @returns {Promise<boolean>}
 */
export async function hasRole(role) {
  const supabase = createClient()
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  
  // Check if user has the specified role
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('role', role)
    .single()
  
  if (error || !data) return false
  return true
}

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  return hasRole('admin')
}

/**
 * Get all roles for the current user
 * @returns {Promise<UserRole[]>}
 */
export async function getUserRoles() {
  const supabase = createClient()
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []
  
  // Get all roles for the user
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
  
  if (error || !data) return []
  return data.map(item => item.role)
}

/**
 * Assign a role to a user
 * @param {string} userId - The user ID
 * @param {UserRole} role - The role to assign
 * @returns {Promise<boolean>}
 */
export async function assignRole(userId, role) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .insert([
      { user_id: userId, role }
    ])
  
  return !error
}

/**
 * Remove a role from a user
 * @param {string} userId - The user ID
 * @param {UserRole} role - The role to remove
 * @returns {Promise<boolean>}
 */
export async function removeRole(userId, role) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role', role)
  
  return !error
}

/**
 * Get all users with their roles
 * @returns {Promise<Array<{id: string, email: string, roles: string[]}>}
 */
export async function getAllUsersWithRoles() {
  const supabase = createClient()
  
  // Get users from auth schema
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError || !users?.users) return []
  
  // For each user, get their roles
  const usersWithRoles = await Promise.all(
    users.users.map(async (user) => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
      
      return {
        id: user.id,
        email: user.email,
        roles: roles ? roles.map(r => r.role) : []
      }
    })
  )
  
  return usersWithRoles
} 