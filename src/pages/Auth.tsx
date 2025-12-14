import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from '../hooks/useNavigate'
import { Mail, Lock, AlertCircle } from 'lucide-react'

type AuthMode = 'login' | 'register'

export const Auth: React.FC = () => {
  const { register: registerUser, login } = useAuth()
  const { setPage } = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await registerUser(email, password)
        setMode('login')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      } else {
        await login(email, password)
        setPage('dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            AIKata
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Sweet Shop Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              gap: '8px',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
            />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Lock size={18} />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #8B5CF6 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#8B5CF6',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
