'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { hasRole, hasPermission } from '@/utils/supabase/rbac';

/**
 * React hook for handling RBAC functionality in components
 * @returns {Object} RBAC utilities and state
 */
export default function useRBAC() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Fetch user and roles on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user
        const { data, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        const user = data?.user;
        
        if (!user) {
          setUserRoles([]);
          setUserId(null);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        setUserId(user.id);
        
        // First try getting user roles via new schema format
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select(`
              roles:role_id (
                id,
                name
              )
            `)
            .eq('user_id', user.id);

          if (roleData && roleData.length > 0) {
            setUserRoles(roleData.map(r => r.roles).filter(Boolean));
            return;
          }
        } catch (relationError) {
          console.log("Falling back to simple role query", relationError.message);
        }

        // Fallback to using direct 'role' column if it exists
        try {
          const { data: simpleRoleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
          
          if (simpleRoleData && simpleRoleData.length > 0) {
            const formattedRoles = simpleRoleData.map(r => ({ 
              name: r.role 
            }));
            setUserRoles(formattedRoles);
            return;
          }
        } catch (simpleRoleError) {
          console.error("Error with simple role query:", simpleRoleError.message);
        }
        
        // If we get here, no roles were found
        setUserRoles([]);
      } catch (err) {
        console.error('Error in useRBAC:', err.message || err);
        // Don't set error state as it's not critical for UI
        setUserRoles([]);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    fetchUser();
    
    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        fetchUser();
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);
  
  // Check if user has a specific role
  const checkRole = useCallback((roleName) => {
    if (!initialized || loading || !userId || !userRoles || userRoles.length === 0) return false;
    return userRoles.some(role => role && role.name === roleName);
  }, [initialized, loading, userId, userRoles]);
  
  // Check if user has a specific permission
  const checkPermission = useCallback(async (permissionName) => {
    if (!initialized || loading || !userId) return false;
    try {
      return await hasPermission(supabase, userId, permissionName);
    } catch (err) {
      console.error('Error checking permission:', err.message || err);
      return false;
    }
  }, [initialized, loading, supabase, userId]);

  // Check if user is an admin
  const isAdmin = useCallback(() => {
    return checkRole('admin');
  }, [checkRole]);
  
  // Check if user is an editor
  const isEditor = useCallback(() => {
    return checkRole('editor') || checkRole('admin'); // Admins can do everything editors can
  }, [checkRole]);
  
  // Check if user is a viewer
  const isViewer = useCallback(() => {
    return checkRole('viewer') || checkRole('editor') || checkRole('admin'); // Role hierarchy
  }, [checkRole]);
  
  return {
    userId,
    userRoles,
    loading,
    error,
    initialized,
    checkRole,
    checkPermission,
    isAdmin,
    isEditor,
    isViewer
  };
} 