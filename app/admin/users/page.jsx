'use client'

import { useState, useEffect } from 'react'
import { getAllUsersWithRoles, assignRole, removeRole } from '@/lib/rbac'
import { useHasRole } from '@/hooks/useRBAC'
import { useRouter } from 'next/navigation'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { hasRole: isAdmin, loading: checkingAdmin } = useHasRole('admin')
  const router = useRouter()

  // Fetch all users with their roles
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const usersWithRoles = await getAllUsersWithRoles()
      setUsers(usersWithRoles)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  // Redirect if not admin
  useEffect(() => {
    if (!checkingAdmin && !isAdmin) {
      router.push('/')
    }
  }, [checkingAdmin, isAdmin, router])

  // Handle role assignment
  const handleRoleChange = async (userId, role, hasRole) => {
    if (hasRole) {
      // Remove role
      await removeRole(userId, role)
    } else {
      // Add role
      await assignRole(userId, role)
    }

    // Refresh user list
    const updatedUsers = await getAllUsersWithRoles()
    setUsers(updatedUsers)
  }

  if (checkingAdmin || loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Role Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-center">Admin</th>
              <th className="py-2 px-4 border-b text-center">Editor</th>
              <th className="py-2 px-4 border-b text-center">Viewer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={user.roles.includes('admin')}
                    onChange={() => handleRoleChange(user.id, 'admin', user.roles.includes('admin'))}
                    className="h-4 w-4"
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={user.roles.includes('editor')}
                    onChange={() => handleRoleChange(user.id, 'editor', user.roles.includes('editor'))}
                    className="h-4 w-4"
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={user.roles.includes('viewer')}
                    onChange={() => handleRoleChange(user.id, 'viewer', user.roles.includes('viewer'))}
                    className="h-4 w-4"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 