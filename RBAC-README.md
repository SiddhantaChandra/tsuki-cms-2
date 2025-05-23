# Role-Based Access Control (RBAC) Setup for Tsuki CMS

This document provides instructions for setting up and using the RBAC implementation with Supabase.

## Installation & Setup

1. **Install Supabase CLI** (if not already installed)

```bash
npm install -g supabase
```

2. **Start the local Supabase services**

```bash
npm run supabase:start
```

This will start the local Supabase services, including database, APIs, etc.

3. **Reset the database with schema and seed data**

If you need to reset your database or initialize it:

```bash
npm run supabase:reset
```

This will apply all migrations and seed files.

## Implementation Details

Our RBAC system is implemented with the following components:

### Database Schema

- `roles` - Defines the available roles in the system
- `user_roles` - Junction table that assigns roles to users
- `permissions` - Defines granular permissions
- `role_permissions` - Junction table that assigns permissions to roles

### Default Roles

- **Admin** - Full system access
- **Editor** - Can create, read, and update content
- **Viewer** - Read-only access to dashboard

### Helper Functions

All RBAC helper functions are available in `utils/supabase/rbac.js`:

- `getUserRoles(supabase, userId)` - Get all roles assigned to a user
- `hasRole(supabase, userId, roleName)` - Check if user has a specific role
- `hasPermission(supabase, userId, permissionName)` - Check if user has a specific permission
- `assignRoleToUser(supabase, userId, roleId)` - Assign a role to a user
- `removeRoleFromUser(supabase, userId, roleId)` - Remove a role from a user

### React Integration

Use the `useRBAC()` hook in your components for role-based rendering:

```jsx
import useRBAC from '@/utils/hooks/useRBAC';

function MyComponent() {
  const { isAdmin, isEditor, checkPermission, loading } = useRBAC();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAdmin() && <AdminPanel />}
      {isEditor() && <EditButton />}
      {/* Async permission check */}
      {checkPermission('manage:users').then(can => 
        can ? <UserManagement /> : null
      )}
    </div>
  );
}
```

## Route Protection

Routes are protected in `middleware.js` using the role-based configuration:

```js
const routeProtection = [
  {
    path: '/dashboard',
    requiredRoles: ['admin', 'editor', 'viewer'],
    redirectTo: '/login'
  },
  {
    path: '/dashboard/settings',
    requiredRoles: ['admin'],
    redirectTo: '/dashboard'
  }
];
```

## Testing RBAC

1. Start the Supabase services and your Next.js app
2. Log in with the default admin: `admin@example.com` / `password`
3. Use the RBAC hook to conditional render UI based on roles
4. Create additional test users and assign different roles

## Troubleshooting

- **Row Level Security Issues**: Check that the RLS policies are correctly applied
- **Access Denied**: Verify user has the correct role in the `user_roles` table
- **Database Connection Issues**: Ensure Supabase is running (`npm run supabase:status`) 