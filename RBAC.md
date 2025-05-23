# Supabase RBAC Implementation Plan

## Overview
This document outlines the implementation plan for Role-Based Access Control (RBAC) within the Tsuki CMS application using Supabase. The plan focuses on creating a flexible and secure role system with emphasis on admin privileges.

## Current Implementation
The system currently uses a simple authorization model:
- Authentication via Supabase Auth
- Admin access control via an `admin_list` table that contains emails of authorized admins
- Row-Level Security (RLS) policies to restrict data modifications to admins

## RBAC Implementation Tasks

### 1. Database Schema Enhancement
- [x] Create a `roles` table to define available roles
  ```sql
  CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  
  -- Insert default roles
  INSERT INTO roles (name, description) VALUES 
    ('admin', 'Full system access'),
    ('editor', 'Can edit content but not system settings'),
    ('viewer', 'Read-only access to dashboard');
  ```

- [x] Create a `user_roles` junction table to assign roles to users
  ```sql
  CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, role_id)
  );
  ```

- [x] Create a `permissions` table to define granular actions
  ```sql
  CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  
  -- Insert default permissions
  INSERT INTO permissions (name, description) VALUES 
    ('create:any', 'Create any resource'),
    ('read:any', 'Read any resource'),
    ('update:any', 'Update any resource'),
    ('delete:any', 'Delete any resource'),
    ('manage:users', 'Manage user accounts'),
    ('manage:roles', 'Assign roles to users'),
    ('manage:settings', 'Manage system settings');
  ```

- [x] Create a `role_permissions` junction table to assign permissions to roles
  ```sql
  CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(role_id, permission_id)
  );
  
  -- Assign permissions to roles
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id FROM 
    roles r, permissions p 
  WHERE 
    r.name = 'admin'; -- Admin gets all permissions
  ```

### 2. Backend RBAC Implementation
- [x] Create a new Supabase helper functions file (`utils/supabase/rbac.js`)
  - [x] Implement `getUserRoles(userId)` function
  - [x] Implement `hasPermission(userId, permission)` function
  - [x] Implement `hasRole(userId, role)` function
  - [x] Implement `assignRoleToUser(userId, roleId)` function
  - [x] Implement `removeRoleFromUser(userId, roleId)` function

- [x] Enhance middleware.js to check for specific role requirements
  - [x] Add role-based route protection
  - [x] Implement more granular path protection based on permissions

### 3. Update Row-Level Security (RLS) Policies
- [x] Update existing RLS policies to use the new roles system
  ```sql
  -- Example policy for table 'categories'
  CREATE POLICY "Admin full access" ON categories 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );
  
  CREATE POLICY "Editor modify access" ON categories 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'editor')
    )
  );
  ```

- [x] Create more granular RLS policies based on permissions

### 4. Frontend Implementation
- [x] Create role management UI (for admin users)
  - [x] List users with their assigned roles
  - [x] Interface to assign/remove roles from users

- [x] Update components to conditionally render UI elements based on user roles
  - [x] Create a `useUserRoles` hook to access current user roles
  - [x] Create a `usePermissions` hook to check if user has specific permissions
  - [x] Add role-based conditional rendering in components

- [x] Add permission checks in frontend API calls

### 5. Migration Strategy
- [x] Script to migrate existing admin_list to user_roles
  ```sql
  -- Migrate existing admins to have the admin role
  INSERT INTO user_roles (user_id, role_id)
  SELECT au.id, r.id
  FROM auth.users au
  JOIN admin_list al ON au.email = al.email
  JOIN roles r ON r.name = 'admin'
  ON CONFLICT (user_id, role_id) DO NOTHING;
  ```

- [x] Update existing frontend code to use the new RBAC system
- [x] Create a testing plan to verify role assignments and permissions

### 6. Documentation
- [x] Document RBAC architecture in project wiki
- [x] Create "How to assign roles" guide for administrators
- [x] Document permission model and how to extend it
- [x] Update API documentation with permission requirements

## Testing Checklist
- [x] Verify admin users can access all protected routes
- [x] Verify users with editor role can only access/modify allowed resources
- [x] Verify users with viewer role have read-only access
- [x] Test role assignment and removal functionality
- [x] Verify RLS policies are correctly enforcing permissions
- [ ] Test edge cases (user with no roles, invalid permissions, etc.)

## Timeline
1. Database Schema Enhancement - COMPLETED
2. Backend RBAC Implementation - COMPLETED
3. Update RLS Policies - COMPLETED
4. Frontend Implementation - MOSTLY COMPLETED
5. Migration Strategy - COMPLETED
6. Documentation - COMPLETED
7. Testing - MOSTLY COMPLETED

**Implementation Status**: ~95% Complete 