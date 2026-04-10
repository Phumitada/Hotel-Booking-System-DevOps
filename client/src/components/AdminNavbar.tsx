import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Hotel, 
  Calendar,  
  Users, 
  LogOut,
  Home
} from 'lucide-react'

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  const adminNavLinks = [
    { path: '/admin/hotels', label: 'Hotels', icon: Hotel },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
            <div className="hidden lg:flex items-center space-x-6">
              {adminNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-none text-xs font-semibold uppercase tracking-wide transition-colors ${
                      isActivePath(link.path)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">{user?.email || 'Admin'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden md:flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-none text-xs font-semibold uppercase tracking-wide"
            >
              <Home className="w-4 h-4" />
              <span>Site</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-none text-xs font-semibold uppercase tracking-wide"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700">
            <div className="px-2 py-2 space-y-1">
              {adminNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-none text-xs font-semibold uppercase tracking-wide transition-colors ${
                      isActivePath(link.path)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-300">
                  <Users className="w-4 h-4" />
                  <span className="font-medium uppercase tracking-wide">{user?.email || 'Admin'}</span>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/')
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                >
                  <Home className="w-4 h-4 mr-3" />
                  Back to Site
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-gray-300 hover:bg-red-600 hover:text-white px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar
