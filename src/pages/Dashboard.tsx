import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from '../hooks/useNavigate'
import { sweetsApi, inventoryApi } from '../lib/api'
import { LogOut, ShoppingCart, Settings, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react'

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  created_at: string
  updated_at: string
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { setPage } = useNavigate()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [purchaseModal, setPurchaseModal] = useState<{ sweetId: string; sweetName: string } | null>(null)
  const [purchaseQty, setPurchaseQty] = useState('1')

  useEffect(() => {
    loadSweets()
  }, [])

  useEffect(() => {
    filterSweets()
  }, [sweets, searchName, searchCategory, minPrice, maxPrice])

  const loadSweets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await sweetsApi.getAll()
      setSweets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const filterSweets = async () => {
    if (!searchName && !searchCategory && !minPrice && !maxPrice) {
      setFilteredSweets(sweets)
      return
    }

    try {
      const data = await sweetsApi.search(
        searchName || undefined,
        searchCategory || undefined,
        minPrice ? parseFloat(minPrice) : undefined,
        maxPrice ? parseFloat(maxPrice) : undefined
      )
      setFilteredSweets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    }
  }

  const handlePurchase = async () => {
    if (!purchaseModal) return

    try {
      setError('')
      const qty = parseInt(purchaseQty)
      if (isNaN(qty) || qty <= 0) {
        throw new Error('Please enter a valid quantity')
      }

      const result = await inventoryApi.purchase(purchaseModal.sweetId, qty)
      setMessage(`Successfully purchased ${result.quantity} ${result.sweetName} for $${result.totalPrice}`)
      setPurchaseModal(null)
      setPurchaseQty('1')
      await loadSweets()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed')
    }
  }

  const handleLogout = async () => {
    await logout()
    setPage('auth')
  }

  return (
    <div>
      <nav style={{
        background: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '16px 0',
        marginBottom: '40px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AIKata
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ color: '#6B7280' }}>
              {user?.email}
            </span>
            {user?.isAdmin && (
              <button
                onClick={() => setPage('admin')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8B5CF6',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Settings size={20} />
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>Sweet Shop</h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Browse and purchase your favorite sweets</p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            background: '#DBEAFE',
            color: '#0369A1',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px'
          }}>
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
          marginBottom: '32px',
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              <Search size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Sweet Name
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              <Filter size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Category
            </label>
            <input
              type="text"
              placeholder="Search by category..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: '#6B7280' }}>
            Loading sweets...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {filteredSweets.map((sweet) => (
              <div key={sweet.id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                  color: 'white',
                  padding: '20px'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
                    {sweet.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {sweet.category}
                  </p>
                </div>

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {sweet.description && (
                    <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '0.9rem', flexGrow: 1 }}>
                      {sweet.description}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#F3F4F6',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ color: '#6B7280', fontWeight: '600' }}>Stock:</span>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: sweet.quantity === 0 ? '#EF4444' : (sweet.quantity < 5 ? '#F59E0B' : '#8B5CF6')
                    }}>
                      {sweet.quantity}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #E5E7EB'
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#8B5CF6'
                    }}>
                      ${sweet.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setPurchaseModal({ sweetId: sweet.id, sweetName: sweet.name })}
                      disabled={sweet.quantity === 0}
                      style={{
                        background: sweet.quantity === 0 ? '#D1D5DB' : '#8B5CF6',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: sweet.quantity === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {purchaseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '24px'
            }}>
              Purchase {purchaseModal.sweetName}
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={purchaseQty}
                onChange={(e) => setPurchaseQty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setPurchaseModal(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#E5E7EB',
                  color: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
