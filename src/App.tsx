import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NavigationProvider, NavigationContext } from './contexts/NavigationContext'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Admin } from './pages/Admin'
import './index.css'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const navContext = React.useContext(NavigationContext)

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.1rem',
        color: '#6B7280'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  const currentPage = navContext?.currentPage

  if (currentPage === 'admin' && user.isAdmin) {
    return <Admin />
  }

  return <Dashboard />
}

function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NavigationProvider>
  )
}

export default App
