/**
 * RBAC (Role-Based Access Control) utility functions for Supabase
 */

/**
 * Get all roles assigned to a user
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} - Array of role objects
 */
export async function getUserRoles(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles:role_id (
        id,
        name,
        description
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }

  return data.map(item => item.roles);
}

/**
 * Check if a user has a specific role
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {string} roleName - Role name to check
 * @returns {Promise<boolean>} - True if user has the role
 */
export async function hasRole(supabase, userId, roleName) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      roles:role_id (
        name
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }

  return data.some(item => item.roles.name === roleName);
}

/**
 * Check if a user has a specific permission
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {string} permissionName - Permission name to check
 * @returns {Promise<boolean>} - True if user has the permission
 */
export async function hasPermission(supabase, userId, permissionName) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles:role_id (
        role_permissions (
          permission_id,
          permissions:permission_id (
            name
          )
        )
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error checking user permission:', error);
    return false;
  }

  return data.some(userRole => 
    userRole.roles.role_permissions.some(
      rolePermission => rolePermission.permissions.name === permissionName
    )
  );
}

/**
 * Assign a role to a user
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {number} roleId - Role ID to assign
 * @returns {Promise<object>} - Result of the operation
 */
export async function assignRoleToUser(supabase, userId, roleId) {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role_id: roleId })
    .select();

  if (error) {
    console.error('Error assigning role to user:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Remove a role from a user
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User UUID
 * @param {number} roleId - Role ID to remove
 * @returns {Promise<object>} - Result of the operation
 */
export async function removeRoleFromUser(supabase, userId, roleId) {
  const { data, error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', roleId)
    .select();

  if (error) {
    console.error('Error removing role from user:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Get all available roles in the system
 * @param {object} supabase - Supabase client instance
 * @returns {Promise<Array>} - Array of role objects
 */
export async function getAllRoles(supabase) {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }

  return data;
}

/**
 * Get all permissions for a specific role
 * @param {object} supabase - Supabase client instance
 * @param {number} roleId - Role ID
 * @returns {Promise<Array>} - Array of permission objects
 */
export async function getRolePermissions(supabase, roleId) {
  const { data, error } = await supabase
    .from('role_permissions')
    .select(`
      permission_id,
      permissions:permission_id (
        id,
        name,
        description
      )
    `)
    .eq('role_id', roleId);

  if (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }

  return data.map(item => item.permissions);
}

/**
 * Get all users with their assigned roles
 * @param {object} supabase - Supabase client instance
 * @returns {Promise<Array>} - Array of user objects with roles
 */
export async function getUsersWithRoles(supabase) {
  // This requires admin access to auth.users
  // Make sure your RLS policies allow this for admin users
  const { data: users, error: usersError } = await supabase
    .from('auth.users')
    .select('id, email');

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  // Get all user roles
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      roles:role_id (
        id,
        name
      )
    `);

  if (rolesError) {
    console.error('Error fetching user roles:', rolesError);
    return users;
  }

  // Associate roles with users
  return users.map(user => {
    const roles = userRoles
      .filter(ur => ur.user_id === user.id)
      .map(ur => ur.roles);
    
    return {
      ...user,
      roles
    };
  });
} 