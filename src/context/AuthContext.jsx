import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import SessionExpiredDialog from '../components/SessionExpiredDialog'
import { getPaymentsEnabled } from '../services/GlobalSettingsService'
import { isAdmin } from '../services/AuthService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [paymentsEnabled, setPaymentsEnabled] = useState(true)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [loadingAuthContext, setLoadingAuthContext] = useState(true)
  const navigate = useNavigate()

  const isTokenExpired = () => {
    const token = sessionStorage.getItem('auth_token')
    if (!token) return true

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      console.error('Error decodificando token:', error)
      return true
    }
  }

  const logout = async () => {
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('userId')
    setIsAuthenticated(false)
    const path = location.pathname

    try {
      const paymentsStatus = await getPaymentsEnabled()
      const adminStatus = await isAdmin()
      setPaymentsEnabled(paymentsStatus) // Update context state
      setIsUserAdmin(adminStatus) // Update context state

      const currentIsMaintenanceMode = !paymentsStatus && !adminStatus

      if (
        path !== '/login' &&
        path !== '/register' &&
        !currentIsMaintenanceMode
      ) {
        setShowDialog(true)
      }
    } catch (error) {
      console.error('Error checking maintenance status during logout:', error)
      // If there's an error checking maintenance, default to showing dialog if not login/register
      if (path !== '/login' && path !== '/register') {
        setShowDialog(true)
      }
    }
  }

  const checkAuth = async () => {
    setLoadingAuthContext(true) // Start loading
    const expired = isTokenExpired()
    setIsAuthenticated(!expired)

    try {
      const paymentsStatus = await getPaymentsEnabled()
      const adminStatus = await isAdmin()
      setPaymentsEnabled(paymentsStatus)
      setIsUserAdmin(adminStatus)
    } catch (error) {
      console.error('Error fetching global settings or admin status:', error)
      // Default to enabled and not admin if API fails to avoid blocking
      setPaymentsEnabled(true)
      setIsUserAdmin(false)
    } finally {
      setLoadingAuthContext(false) // End loading
    }
  }

  const handleDialogLogin = () => {
    setShowDialog(false)
    navigate('/login')
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  useEffect(() => {
    checkAuth()
    const interval = setInterval(checkAuth, 60 * 1000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleForceLogout = () => {
      logout()
    }

    window.addEventListener('forceLogout', handleForceLogout)
    return () => window.removeEventListener('forceLogout', handleForceLogout)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        checkAuth,
        paymentsEnabled,
        isUserAdmin,
        loadingAuthContext
      }}
    >
      {children}
      <SessionExpiredDialog
        open={showDialog}
        onClose={handleDialogClose}
        onLogin={handleDialogLogin}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
