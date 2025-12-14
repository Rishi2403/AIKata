import { useContext } from 'react'
import { NavigationContext } from '../contexts/NavigationContext'

export const useNavigate = () => {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigate must be used within NavigationProvider')
  return context
}
