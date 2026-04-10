import type { ReactNode } from 'react'
import AdminNavbar from './AdminNavbar'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
